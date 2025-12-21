import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { admissionApplications, notifications, users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { sendEmail } from "@/lib/email";
import {
  applicationApprovedTemplate,
  applicationRejectedTemplate,
} from "@/lib/email-templates";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { status, rejectionReason, roomNumber, allotmentDate } =
      await req.json();

    if (!["approved", "rejected"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    // Update application
    const updateData: any = {
      status,
      reviewedBy: session.user.id,
      reviewedAt: new Date(),
    };

    if (status === "rejected" && rejectionReason) {
      updateData.rejectionReason = rejectionReason;
    }

    if (status === "approved") {
      updateData.roomNumber = roomNumber;
      updateData.allotmentDate = allotmentDate || new Date();
    }

    const [updated] = await db
      .update(admissionApplications)
      .set(updateData)
      .where(eq(admissionApplications.id, params.id))
      .returning();

    // Fetch user details for email
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, updated.userId!))
      .limit(1);

    if (user && user.email) {
      // Send email notification
      if (status === "approved") {
        await sendEmail({
          to: user.email,
          subject: "Application Approved - KP Vidhyarthi Bhavan",
          html: applicationApprovedTemplate(
            user.name || "Student",
            updated.applicationNumber,
            roomNumber || "TBA"
          ),
        });
      } else {
        await sendEmail({
          to: user.email,
          subject: "Application Update - KP Vidhyarthi Bhavan",
          html: applicationRejectedTemplate(
            user.name || "Student",
            updated.applicationNumber,
            rejectionReason || "Application did not meet requirements"
          ),
        });
      }

      // Create in-app notification
      await db.insert(notifications).values({
        userId: updated.userId!,
        title:
          status === "approved"
            ? "Application Approved!"
            : "Application Update",
        message:
          status === "approved"
            ? `Your application ${updated.applicationNumber} has been approved. Room ${roomNumber} has been allotted.`
            : `Your application ${updated.applicationNumber} has been reviewed. ${rejectionReason || "Please contact office for details."}`,
        type: status === "approved" ? "success" : "info",
      });
    }

    return NextResponse.json({ success: true, application: updated });
  } catch (error) {
    console.error("Error updating application:", error);
    return NextResponse.json(
      { error: "Failed to update application" },
      { status: 500 }
    );
  }
}

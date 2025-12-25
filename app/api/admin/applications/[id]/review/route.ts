import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { admissionApplications, notifications, users, hostelBlocks } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { sendEmail } from "@/lib/email";
import {
  applicationApprovedTemplate,
  applicationRejectedTemplate,
} from "@/lib/email-templates";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { action, comments, assignedBlock, roomNumber, admissionStartDate, admissionEndDate } = await req.json();

    if (!action || !["approve", "reject"].includes(action)) {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    const status = action === "approve" ? "approved" : "rejected";

    // Update application
    const updateData: any = {
      status,
      reviewedBy: session.user.id,
      reviewedAt: new Date(),
      adminNotes: comments,
    };

    if (status === "rejected") {
      updateData.rejectionReason = comments || "Application did not meet requirements";
    }

    if (status === "approved") {
      // For approval, we don't require block/room assignment anymore
      // This will be done during activation after offline admission
      updateData.status = "approved";
    }

    const [updated] = await db
      .update(admissionApplications)
      .set(updateData)
      .where(eq(admissionApplications.id, id))
      .returning();

    if (!updated) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    // Block occupancy update is now handled during activation, not approval
    // if (status === "approved" && updated.assignedBlock) {
    //   const [currentBlock] = await db
    //     .select({ currentOccupancy: hostelBlocks.currentOccupancy })
    //     .from(hostelBlocks)
    //     .where(eq(hostelBlocks.name, updated.assignedBlock))
    //     .limit(1);

    //   if (currentBlock) {
    //     await db
    //       .update(hostelBlocks)
    //       .set({
    //         currentOccupancy: (currentBlock.currentOccupancy || 0) + 1,
    //         updatedAt: new Date()
    //       })
    //       .where(eq(hostelBlocks.name, updated.assignedBlock));
    //   }
    // }

    // Fetch user details for email
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, updated.userId!))
      .limit(1);

    if (user && user.email) {
      // Send email notification
      if (status === "approved") {
        const emailTemplate = applicationApprovedTemplate(
          user.name || "Student",
          updated.applicationNumber,
          updated.assignedBlock ?? undefined,
          updated.roomNumber ?? undefined,
          updated.admissionStartDate?.toISOString(),
          updated.admissionEndDate?.toISOString()
        );
        await sendEmail({
          to: user.email,
          subject: emailTemplate.subject,
          html: emailTemplate.html,
          text: emailTemplate.text,
        });
      } else {
        const emailTemplate = applicationRejectedTemplate(
          user.name || "Student",
          updated.applicationNumber,
          updated.rejectionReason || "Application did not meet requirements"
        );
        await sendEmail({
          to: user.email,
          subject: emailTemplate.subject,
          html: emailTemplate.html,
          text: emailTemplate.text,
        });
      }

      // Create in-app notification
      await db.insert(notifications).values({
        userId: updated.userId!,
        title: status === "approved" ? "Application Approved!" : "Application Update",
        message: status === "approved"
          ? `Your application ${updated.applicationNumber} has been approved. Room ${updated.roomNumber} has been allotted.`
          : `Your application ${updated.applicationNumber} has been reviewed. ${updated.rejectionReason || "Please contact office for details."}`,
        type: status === "approved" ? "application_approved" : "application_rejected",
      });
    }

    return NextResponse.json({ success: true, application: updated });
  } catch (error) {
    console.error("Error reviewing application:", error);
    return NextResponse.json(
      { error: "Failed to review application" },
      { status: 500 }
    );
  }
}
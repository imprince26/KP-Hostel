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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();

    // Support both old format (status, rejectionReason) and new format (action, comments)
    const action = body.action;
    const status = body.status || (action === "approve" ? "approved" : action === "reject" ? "rejected" : null);

    if (!status || !["approved", "rejected"].includes(status)) {
      return NextResponse.json({ error: "Invalid status or action" }, { status: 400 });
    }

    // Update application
    const updateData: any = {
      status,
      reviewedBy: session.user.id,
      reviewedAt: new Date(),
    };

    // Handle admin notes/comments
    if (body.comments || body.adminNotes) {
      updateData.adminNotes = body.comments || body.adminNotes;
    }

    if (status === "rejected") {
      updateData.rejectionReason = body.rejectionReason || body.comments || "Application did not meet requirements";
    }

    if (status === "approved") {
      if (body.assignedBlock) updateData.assignedBlock = body.assignedBlock;
      if (body.roomNumber) updateData.roomNumber = body.roomNumber;
      if (body.admissionStartDate) updateData.admissionStartDate = new Date(body.admissionStartDate);
      if (body.admissionEndDate) updateData.admissionEndDate = new Date(body.admissionEndDate);
      // Keep allotmentDate for backward compatibility if provided
      if (body.allotmentDate) updateData.admissionStartDate = new Date(body.allotmentDate);
    }

    const [updated] = await db
      .update(admissionApplications)
      .set(updateData)
      .where(eq(admissionApplications.id, id))
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
        title:
          status === "approved"
            ? "Application Approved!"
            : "Application Update",
        message:
          status === "approved"
            ? `Your application ${updated.applicationNumber} has been approved. Room ${updated.roomNumber} has been allotted.`
            : `Your application ${updated.applicationNumber} has been reviewed. ${updated.rejectionReason || "Please contact office for details."}`,
        type: status === "approved" ? "application_approved" : "application_rejected",
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

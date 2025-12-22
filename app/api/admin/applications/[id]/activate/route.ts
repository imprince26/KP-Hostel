import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { admissionApplications, users, notifications } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { sendEmail } from "@/lib/email";
import { admissionActivatedTemplate } from "@/lib/email-templates";

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

    // Check if application exists and is approved
    const [application] = await db
      .select()
      .from(admissionApplications)
      .where(eq(admissionApplications.id, id))
      .limit(1);

    if (!application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    if (application.status !== "approved") {
      return NextResponse.json({ error: "Only approved applications can be activated" }, { status: 400 });
    }

    // Update user role to student if not already
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, application.userId!))
      .limit(1);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Update user role to student
    await db
      .update(users)
      .set({
        role: "student",
        updatedAt: new Date()
      })
      .where(eq(users.id, application.userId!));

    // Update application status to admitted
    await db
      .update(admissionApplications)
      .set({
        status: "admitted",
        updatedAt: new Date()
      })
      .where(eq(admissionApplications.id, id));

    // Send activation email and notification
    if (user.email && application.assignedBlock && application.roomNumber && application.admissionStartDate && application.admissionEndDate) {
      try {
        const emailTemplate = admissionActivatedTemplate(
          user.name || "Student",
          application.assignedBlock,
          application.roomNumber,
          application.admissionStartDate.toISOString(),
          application.admissionEndDate.toISOString()
        );

        await sendEmail({
          to: user.email,
          subject: emailTemplate.subject,
          html: emailTemplate.html,
          text: emailTemplate.text,
        });

        // Create in-app notification
        await db.insert(notifications).values({
          userId: application.userId!,
          title: "Admission Activated!",
          message: `Welcome to K.P. Vidhyarthi Bhavan! Your admission has been activated. Room ${application.roomNumber} in Block ${application.assignedBlock} is now assigned to you.`,
          type: "admission_activated",
        });
      } catch (emailError) {
        console.error("Error sending activation email:", emailError);
        // Don't fail the activation if email fails
      }
    }

    return NextResponse.json({ success: true, message: "Admission activated successfully" });
  } catch (error) {
    console.error("Error activating admission:", error);
    return NextResponse.json(
      { error: "Failed to activate admission" },
      { status: 500 }
    );
  }
}
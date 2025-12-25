import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { admissionApplications, users, notifications, hostelBlocks } from "@/lib/db/schema";
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
    const { assignedBlock, roomNumber, admissionStartDate, admissionEndDate } = await req.json();

    // Validate required fields for activation
    if (!assignedBlock || !roomNumber || !admissionStartDate || !admissionEndDate) {
      return NextResponse.json({ error: "Block, room, and admission dates are required for activation" }, { status: 400 });
    }

    // Check if application exists and is approved
    const [application] = await db
      .select()
      .from(admissionApplications)
      .where(eq(admissionApplications.id, id))
      .limit(1);

    if (!application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    if (application.status !== "approved" && application.status !== "admitted") {
      return NextResponse.json({ error: "Only approved or admitted applications can be activated" }, { status: 400 });
    }

    // Check if block exists and has capacity
    const [block] = await db
      .select()
      .from(hostelBlocks)
      .where(eq(hostelBlocks.name, assignedBlock))
      .limit(1);

    if (!block) {
      return NextResponse.json({ error: "Selected block does not exist" }, { status: 400 });
    }

    if (!block.isActive) {
      return NextResponse.json({ error: "Selected block is not active" }, { status: 400 });
    }

    if (block.capacity && block.currentOccupancy >= block.capacity) {
      return NextResponse.json({ error: "Selected block is at full capacity" }, { status: 400 });
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

    // Update application status to active and assign block/room
    await db
      .update(admissionApplications)
      .set({
        status: "active",
        assignedBlock,
        roomNumber,
        admissionStartDate: new Date(admissionStartDate),
        admissionEndDate: new Date(admissionEndDate),
        updatedAt: new Date()
      })
      .where(eq(admissionApplications.id, id));

    // Update block occupancy
    await db
      .update(hostelBlocks)
      .set({
        currentOccupancy: (block.currentOccupancy || 0) + 1,
        updatedAt: new Date()
      })
      .where(eq(hostelBlocks.name, assignedBlock));

    // Send activation email and notification
    if (user.email) {
      try {
        const emailTemplate = admissionActivatedTemplate(
          user.name || "Student",
          assignedBlock,
          roomNumber,
          admissionStartDate,
          admissionEndDate
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
          message: `Welcome to K.P. Vidhyarthi Bhavan! Your admission has been activated. Room ${roomNumber} in Block ${assignedBlock} is now assigned to you.`,
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
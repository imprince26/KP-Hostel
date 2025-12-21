import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { users, admissionApplications } from "@/lib/db/schema";
import { eq, and, inArray } from "drizzle-orm";
import { sendEmail } from "@/lib/email";
import { adminMessageTemplate } from "@/lib/email-templates";

// POST - Send bulk emails/SMS
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      messageType, // "email" | "sms" | "both"
      recipientType, // "all" | "block" | "gender" | "custom"
      recipientFilter, // For block/gender filtering
      customRecipients, // Array of user IDs for custom recipients
      emailSubject,
      emailContent,
      smsContent,
    } = body;

    // Validate required fields
    if (!messageType || !recipientType) {
      return NextResponse.json(
        { error: "Message type and recipient type are required" },
        { status: 400 }
      );
    }

    if (messageType === "email" || messageType === "both") {
      if (!emailSubject || !emailContent) {
        return NextResponse.json(
          { error: "Email subject and content are required" },
          { status: 400 }
        );
      }
    }

    if (messageType === "sms" || messageType === "both") {
      if (!smsContent) {
        return NextResponse.json(
          { error: "SMS content is required" },
          { status: 400 }
        );
      }
    }

    // Build recipient query
    let recipients: any[] = [];

    if (recipientType === "all") {
      // Get all students
      recipients = await db
        .select({
          user: users,
          application: admissionApplications,
        })
        .from(users)
        .leftJoin(admissionApplications, eq(users.id, admissionApplications.userId))
        .where(eq(users.role, "student"));
    } else if (recipientType === "block" && recipientFilter) {
      // Get students by block
      const applications = await db
        .select()
        .from(admissionApplications)
        .where(eq(admissionApplications.assignedBlock, recipientFilter));

      const userIds = applications.map((app) => app.userId).filter((id): id is string => id !== null);

      if (userIds.length > 0) {
        const usersData = await db
          .select()
          .from(users)
          .where(inArray(users.id, userIds));

        recipients = usersData.map((user) => ({
          user,
          application: applications.find((app) => app.userId === user.id),
        }));
      }
    } else if (recipientType === "gender" && recipientFilter) {
      // Get students by gender
      const applications = await db
        .select()
        .from(admissionApplications)
        .where(eq(admissionApplications.gender, recipientFilter));

      const userIds = applications.map((app) => app.userId).filter((id): id is string => id !== null);

      if (userIds.length > 0) {
        const usersData = await db
          .select()
          .from(users)
          .where(inArray(users.id, userIds));

        recipients = usersData.map((user) => ({
          user,
          application: applications.find((app) => app.userId === user.id),
        }));
      }
    } else if (recipientType === "custom" && customRecipients && customRecipients.length > 0) {
      // Get custom recipients
      const usersData = await db
        .select()
        .from(users)
        .where(inArray(users.id, customRecipients));

      recipients = usersData.map((user) => ({ user, application: null }));
    }

    if (recipients.length === 0) {
      return NextResponse.json(
        { error: "No recipients found matching the criteria" },
        { status: 400 }
      );
    }

    // Send messages
    const results = {
      total: recipients.length,
      emailsSent: 0,
      smsSent: 0,
      failed: 0,
    };

    for (const recipient of recipients) {
      try {
        // Send email
        if ((messageType === "email" || messageType === "both") && recipient.user.email) {
          const template = adminMessageTemplate(
            recipient.user.name || "Student",
            emailSubject,
            emailContent,
            session.user.name || "K.P. Vidhyarthi Bhavan Administration"
          );

          await sendEmail({
            to: recipient.user.email,
            subject: template.subject,
            html: template.html,
            text: template.text,
          });
          results.emailsSent++;
        }

        // Send SMS (placeholder - requires SMS service integration)
        if ((messageType === "sms" || messageType === "both") && recipient.user.phone) {
          // TODO: Integrate SMS service (Twilio, AWS SNS, etc.)
          // await sendSMS(recipient.user.phone, smsContent);
          results.smsSent++;
        }
      } catch (error) {
        console.error(`Failed to send message to ${recipient.user.email}:`, error);
        results.failed++;
      }
    }

    return NextResponse.json({
      message: "Bulk messaging completed",
      results,
    });
  } catch (error) {
    console.error("Error sending bulk messages:", error);
    return NextResponse.json({ error: "Failed to send messages" }, { status: 500 });
  }
}

// Helper function to strip HTML tags
function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "");
}

// GET - Get recipient counts for preview
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const recipientType = searchParams.get("recipientType") || "";
    const recipientFilter = searchParams.get("recipientFilter") || "";

    let count = 0;

    if (recipientType === "all") {
      const students = await db.select().from(users).where(eq(users.role, "student"));
      count = students.length;
    } else if (recipientType === "block" && recipientFilter) {
      const applications = await db
        .select()
        .from(admissionApplications)
        .where(eq(admissionApplications.assignedBlock, recipientFilter as any));
      count = applications.length;
    } else if (recipientType === "gender" && recipientFilter) {
      const applications = await db
        .select()
        .from(admissionApplications)
        .where(eq(admissionApplications.gender, recipientFilter as any));
      count = applications.length;
    }

    return NextResponse.json({ count });
  } catch (error) {
    console.error("Error getting recipient count:", error);
    return NextResponse.json({ error: "Failed to get recipient count" }, { status: 500 });
  }
}

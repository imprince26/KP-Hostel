import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { admissionApplications, notifications, users } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { sendEmail } from "@/lib/email";
import { sendSMS } from "@/lib/sms";
import { applicationSubmittedTemplate } from "@/lib/email-templates";
import { generateApplicationNumber } from "@/lib/utils/applicationNumber";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();

    // Validate required fields
    const requiredFields = [
      "fullName", "email", "phone", "dateOfBirth", "gender", "caste", "subCaste",
      "passportPhoto", "address", "city", "state", "pincode",
      "collegeName", "course", "year", "guardianName",
      "guardianPhone", "guardianRelation"
    ];

    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // Generate application number with new format: KPB-YYYY-XXXXX
    const applicationNumber = await generateApplicationNumber();

    // Check if user already has a pending application
    const existingApp = await db
      .select()
      .from(admissionApplications)
      .where(
        and(
          eq(admissionApplications.userId, session.user.id),
          eq(admissionApplications.status, "submitted")
        )
      )
      .limit(1);

    if (existingApp.length > 0) {
      return NextResponse.json(
        { error: "You already have a pending application" },
        { status: 400 }
      );
    }

    // Create application
    const [application] = await db
      .insert(admissionApplications)
      .values({
        userId: session.user.id,
        applicationNumber,
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        dateOfBirth: data.dateOfBirth,
        gender: data.gender,
        caste: data.caste,
        subCaste: data.subCaste,
        passportPhoto: data.passportPhoto,
        address: data.address,
        city: data.city,
        state: data.state,
        pincode: data.pincode,
        collegeName: data.collegeName,
        course: data.course,
        year: data.year,
        studentId: data.studentId,
        guardianName: data.guardianName,
        guardianPhone: data.guardianPhone,
        guardianRelation: data.guardianRelation,
        blockPreference: data.blockPreference,
        status: "submitted",
      })
      .returning();

    // Send email notification
    try {
      await sendEmail({
        to: data.email,
        subject: "Application Submitted - KP Vidhyarthi Bhavan",
        html: applicationSubmittedTemplate(data.fullName, applicationNumber),
      });
    } catch (emailError) {
      console.error("Failed to send email:", emailError);
    }

    // Send SMS notification (if enabled)
    try {
      const { getApplicationSubmittedSMS } = await import("@/lib/sms");
      await sendSMS({
        to: data.phone,
        message: getApplicationSubmittedSMS(data.fullName, applicationNumber),
      });
    } catch (smsError) {
      console.error("Failed to send SMS:", smsError);
    }

    // Create notification
    await db.insert(notifications).values({
      userId: session.user.id,
      type: "application_submitted",
      title: "Application Submitted",
      message: `Your application ${applicationNumber} has been submitted successfully.`,
      actionUrl: `/student/applications`,
    });

    return NextResponse.json({
      success: true,
      applicationNumber,
      applicationId: application.id,
    });
  } catch (error) {
    console.error("Application error:", error);
    return NextResponse.json(
      { error: "Failed to submit application" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const applications = await db
      .select()
      .from(admissionApplications)
      .where(eq(admissionApplications.userId, session.user.id))
      .orderBy(admissionApplications.createdAt);

    return NextResponse.json({ applications });
  } catch (error) {
    console.error("Error fetching applications:", error);
    return NextResponse.json(
      { error: "Failed to fetch applications" },
      { status: 500 }
    );
  }
}

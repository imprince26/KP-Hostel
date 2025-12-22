import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";
import { contactFormSubmissionTemplate } from "@/lib/email-templates";

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, subject, message } = await req.json();

    // Validate required fields
    if (!name || !email || !phone || !subject || !message) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Validate phone format (basic validation)
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (!phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ""))) {
      return NextResponse.json(
        { error: "Invalid phone format" },
        { status: 400 }
      );
    }

    // Get the contact form submission email from environment variables
    const contactEmail = process.env.CONTACTFORM_SUBMISSION_EMAIL;
    if (!contactEmail) {
      console.error("CONTACTFORM_SUBMISSION_EMAIL environment variable not set");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    // Send email notification
    const template = contactFormSubmissionTemplate(name, email, phone, subject, message);
    await sendEmail({
      to: contactEmail,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });

    return NextResponse.json({
      message: "Contact form submitted successfully",
    });
  } catch (error) {
    console.error("Error processing contact form:", error);
    return NextResponse.json(
      { error: "Failed to process contact form" },
      { status: 500 }
    );
  }
}
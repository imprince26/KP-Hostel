import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { generateOTP, getOTPExpiry } from "@/lib/otp";
import { sendMail } from "@/lib/mail";
import { getOTPEmailTemplate } from "@/lib/email-templates";

const schema = z.object({
  email: z.string().email("Invalid email address"),
  name: z.string().min(2, "Name is required"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, name } = schema.parse(body);

    // Check if user exists
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser && existingUser.emailVerified) {
      return NextResponse.json(
        { error: "Email already registered and verified" },
        { status: 400 }
      );
    }

    // Generate OTP
    const otp = generateOTP();
    const otpExpiry = getOTPExpiry();

    // Store OTP
    if (existingUser) {
      await db
        .update(users)
        .set({
          emailVerificationOtp: otp,
          emailVerificationOtpExpiry: otpExpiry,
          updatedAt: new Date(),
        })
        .where(eq(users.id, existingUser.id));
    }

    // Send OTP email
    const emailTemplate = getOTPEmailTemplate(name, otp);
    await sendMail({
      to: email,
      subject: emailTemplate.subject,
      html: emailTemplate.html,
      text: emailTemplate.text,
    });

    return NextResponse.json({
      message: "OTP sent successfully. Please check your email.",
      otpSent: true,
    });
  } catch (error) {
    console.error("Send OTP error:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to send OTP" },
      { status: 500 }
    );
  }
}

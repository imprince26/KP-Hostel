import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { sendMail } from "@/lib/mail";
import { getWelcomeEmailTemplate, getOTPEmailTemplate } from "@/lib/email-templates";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { generateOTP, getOTPExpiry } from "@/lib/otp";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  phone: z.string().min(10, "Invalid phone number"),
  role: z.enum(["student", "admin"]).default("student"),
  otp: z.string().length(6, "OTP must be 6 digits").optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validate input
    const validatedData = registerSchema.parse(body);
    
    // Check if user already exists
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, validatedData.email))
      .limit(1);

    if (existingUser && existingUser.emailVerified) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    // If no OTP provided, this is step 1 - send OTP
    if (!validatedData.otp) {
      const otp = generateOTP();
      const otpExpiry = getOTPExpiry();

      // Store temporary user data with OTP
      if (existingUser) {
        // Update existing unverified user
        await db
          .update(users)
          .set({
            emailVerificationOtp: otp,
            emailVerificationOtpExpiry: otpExpiry,
            updatedAt: new Date(),
          })
          .where(eq(users.id, existingUser.id));
      } else {
        // Create new unverified user
        const passwordHash = await bcrypt.hash(validatedData.password, 12);
        
        await db
          .insert(users)
          .values({
            id: crypto.randomUUID(),
            name: validatedData.name,
            email: validatedData.email,
            passwordHash,
            phone: validatedData.phone,
            role: validatedData.role,
            emailVerificationOtp: otp,
            emailVerificationOtpExpiry: otpExpiry,
            emailVerified: null, // Not verified yet
            createdAt: new Date(),
            updatedAt: new Date(),
          });
      }

      // Send OTP email
      try {
        const emailTemplate = getOTPEmailTemplate(validatedData.name, otp);
        await sendMail({
          to: validatedData.email,
          subject: "Email Verification - KP Vidhyarthi Bhavan",
          html: emailTemplate,
        });
      } catch (emailError) {
        console.error("Failed to send OTP email:", emailError);
        return NextResponse.json(
          { error: "Failed to send verification email. Please try again." },
          { status: 500 }
        );
      }

      return NextResponse.json({
        message: "OTP sent to your email. Please verify to complete registration.",
        otpSent: true,
      });
    }

    // Step 2 - verify OTP and complete registration
    if (!existingUser) {
      return NextResponse.json(
        { error: "User not found. Please start registration again." },
        { status: 404 }
      );
    }

    // Verify OTP
    if (existingUser.emailVerificationOtp !== validatedData.otp) {
      return NextResponse.json(
        { error: "Invalid OTP" },
        { status: 400 }
      );
    }

    // Check OTP expiry
    if (!existingUser.emailVerificationOtpExpiry || 
        new Date() > new Date(existingUser.emailVerificationOtpExpiry)) {
      return NextResponse.json(
        { error: "OTP has expired. Please request a new one." },
        { status: 400 }
      );
    }

    // Mark email as verified
    await db
      .update(users)
      .set({
        emailVerified: new Date(),
        emailVerificationOtp: null,
        emailVerificationOtpExpiry: null,
        updatedAt: new Date(),
      })
      .where(eq(users.id, existingUser.id));

    // Send welcome email
    try {
      const emailTemplate = getWelcomeEmailTemplate(
        existingUser.name || "User"
      );
      
      await sendMail({
        to: existingUser.email!,
        subject: "Welcome to KP Vidhyarthi Bhavan",
        html: emailTemplate,
      });
    } catch (emailError) {
      console.error("Failed to send welcome email:", emailError);
      // Don't fail registration if welcome email fails
    }

    return NextResponse.json({
        message: "Registration completed successfully!",
        user: {
          id: existingUser.id,
          name: existingUser.name,
          email: existingUser.email,
          role: existingUser.role,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "An error occurred during registration" },
      { status: 500 }
    );
  }
}

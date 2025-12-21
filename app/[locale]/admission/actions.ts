"use server";

import { db } from "@/lib/db";
import { admissionApplications } from "@/lib/db/schema";
import { admissionFormSchema } from "@/lib/validations/admission";
import {
  generateApplicationNumber,
  generateOTPCode,
} from "@/lib/utils/admission";
import { and, gte, sql } from "drizzle-orm";

// Rate limiting map (in production, use Redis or similar)
const submissionAttempts = new Map<string, { count: number; timestamp: number }>();

const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour
const MAX_ATTEMPTS = 3;

function checkRateLimit(identifier: string): boolean {
  const now = Date.now();
  const attempts = submissionAttempts.get(identifier);

  if (!attempts || now - attempts.timestamp > RATE_LIMIT_WINDOW) {
    submissionAttempts.set(identifier, { count: 1, timestamp: now });
    return true;
  }

  if (attempts.count >= MAX_ATTEMPTS) {
    return false;
  }

  attempts.count += 1;
  return true;
}

export async function submitAdmissionApplication(formData: unknown) {
  try {
    // Validate input
    const validated = admissionFormSchema.parse(formData);

    // Rate limiting by phone number
    if (!checkRateLimit(validated.phone)) {
      return {
        success: false,
        error:
          "Too many submission attempts. Please try again after an hour.",
      };
    }

    // Check for duplicate phone number in last 24 hours
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const existingApplication = await db
      .select({ id: admissionApplications.id })
      .from(admissionApplications)
      .where(
        and(
          sql`${admissionApplications.phone} = ${validated.phone}`,
          gte(admissionApplications.createdAt, oneDayAgo)
        )
      )
      .limit(1);

    if (existingApplication.length > 0) {
      return {
        success: false,
        error:
          "An application with this phone number was already submitted today. Please contact the office if you need assistance.",
      };
    }

    // Generate application number and OTP
    const applicationNumber = generateApplicationNumber();
    const otpCode = generateOTPCode();

    // Validate block preference based on gender
    let blockPreference = validated.blockPreference;
    if (blockPreference) {
      const isMale = validated.gender === "male";
      const isValidBlock =
        (isMale && (blockPreference === "A" || blockPreference === "D")) ||
        (!isMale && (blockPreference === "B" || blockPreference === "C"));

      if (!isValidBlock) {
        blockPreference = undefined; // Reset invalid preference
      }
    }

    // Insert application
    await db.insert(admissionApplications).values({
      applicationNumber,
      status: "submitted",
      fullName: validated.fullName.trim(),
      dateOfBirth: validated.dateOfBirth,
      gender: validated.gender,
      caste: validated.caste.trim(),
      subCaste: validated.subCaste.trim(),
      phone: validated.phone,
      email: validated.email,
      address: validated.address.trim(),
      city: validated.city.trim(),
      state: validated.state.trim(),
      pincode: validated.pincode,
      collegeName: validated.collegeName.trim(),
      course: validated.course.trim(),
      year: validated.year,
      studentId: validated.studentId?.trim(),
      guardianName: validated.guardianName.trim(),
      guardianPhone: validated.guardianPhone,
      guardianRelation: validated.guardianRelation.trim(),
      passportPhoto: validated.passportPhoto,
      blockPreference: blockPreference || null,
    });

    return {
      success: true,
      data: {
        applicationNumber,
      },
    };
  } catch (error) {
    console.error("Admission submission error:", error);

    if (error instanceof Error && error.message.includes("parse")) {
      return {
        success: false,
        error: "Invalid form data. Please check all fields and try again.",
      };
    }

    return {
      success: false,
      error: "An error occurred while submitting your application. Please try again.",
    };
  }
}

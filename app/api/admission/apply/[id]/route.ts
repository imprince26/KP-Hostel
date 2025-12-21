import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { admissionApplications, users } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const applicationId = params.id;

    // Fetch the application with user information
    const [application] = await db
      .select({
        id: admissionApplications.id,
        applicationNumber: admissionApplications.applicationNumber,
        status: admissionApplications.status,
        fullName: admissionApplications.fullName,
        dateOfBirth: admissionApplications.dateOfBirth,
        gender: admissionApplications.gender,
        caste: admissionApplications.caste,
        subCaste: admissionApplications.subCaste,
        email: admissionApplications.email,
        phone: admissionApplications.phone,
        address: admissionApplications.address,
        city: admissionApplications.city,
        state: admissionApplications.state,
        pincode: admissionApplications.pincode,
        collegeName: admissionApplications.collegeName,
        course: admissionApplications.course,
        year: admissionApplications.year,
        studentId: admissionApplications.studentId,
        guardianName: admissionApplications.guardianName,
        guardianPhone: admissionApplications.guardianPhone,
        guardianRelation: admissionApplications.guardianRelation,
        passportPhoto: admissionApplications.passportPhoto,
        blockPreference: admissionApplications.blockPreference,
        assignedBlock: admissionApplications.assignedBlock,
        roomNumber: admissionApplications.roomNumber,
        admissionStartDate: admissionApplications.admissionStartDate,
        admissionEndDate: admissionApplications.admissionEndDate,
        adminNotes: admissionApplications.adminNotes,
        reviewComments: admissionApplications.reviewComments,
        reviewedBy: admissionApplications.reviewedBy,
        reviewedAt: admissionApplications.reviewedAt,
        rejectionReason: admissionApplications.rejectionReason,
        createdAt: admissionApplications.createdAt,
        updatedAt: admissionApplications.updatedAt,
      })
      .from(admissionApplications)
      .where(
        and(
          eq(admissionApplications.id, applicationId),
          eq(admissionApplications.userId, session.user.id)
        )
      )
      .limit(1);

    if (!application) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ application });
  } catch (error) {
    console.error("Error fetching application:", error);
    return NextResponse.json(
      { error: "Failed to fetch application" },
      { status: 500 }
    );
  }
}
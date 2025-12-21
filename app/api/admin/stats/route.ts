import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { admissionApplications, users } from "@/lib/db/schema";
import { eq, count, sql } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get total students (users with student role)
    const [totalStudentsResult] = await db
      .select({ count: count() })
      .from(users)
      .where(eq(users.role, "student"));

    // Get active admissions (approved applications)
    const [activeAdmissionsResult] = await db
      .select({ count: count() })
      .from(admissionApplications)
      .where(eq(admissionApplications.status, "approved"));

    // Get pending applications (submitted status)
    const [pendingApplicationsResult] = await db
      .select({ count: count() })
      .from(admissionApplications)
      .where(eq(admissionApplications.status, "submitted"));

    // Get total revenue (this would need a payments table, for now return 0)
    const totalRevenue = 0;

    // Calculate occupancy rate (this would need room/block data, for now return 0)
    const occupancyRate = 0;
    const totalCapacity = 0;
    const occupiedRooms = 0;

    const stats = {
      totalStudents: totalStudentsResult.count,
      activeAdmissions: activeAdmissionsResult.count,
      pendingApplications: pendingApplicationsResult.count,
      totalRevenue,
      occupancyRate,
      totalCapacity,
      occupiedRooms,
    };

    return NextResponse.json({ stats });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}

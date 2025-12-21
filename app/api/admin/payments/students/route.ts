import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { users, admissionApplications } from "@/lib/db/schema";
import { eq, and, ilike } from "drizzle-orm";

// GET - Search for students to add payment records
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";

    // Fetch students with role "student" and their admission details
    const query = db
      .select({
        user: users,
        application: admissionApplications,
      })
      .from(users)
      .leftJoin(admissionApplications, eq(users.id, admissionApplications.userId))
      .where(eq(users.role, "student"));

    const students = await query;

    // Filter by search term
    let filteredStudents = students;
    if (search) {
      const searchLower = search.toLowerCase();
      filteredStudents = students.filter((s) => {
        return (
          s.user.name?.toLowerCase().includes(searchLower) ||
          s.user.email?.toLowerCase().includes(searchLower) ||
          s.user.phone?.includes(search) ||
          s.application?.applicationNumber?.toLowerCase().includes(searchLower)
        );
      });
    }

    // Return only students with approved/admitted applications or at least registered students
    const eligibleStudents = filteredStudents.filter(
      (s) => s.application?.status === "admitted" || s.application?.status === "active" || !s.application
    );

    return NextResponse.json({ students: eligibleStudents });
  } catch (error) {
    console.error("Error fetching students:", error);
    return NextResponse.json({ error: "Failed to fetch students" }, { status: 500 });
  }
}

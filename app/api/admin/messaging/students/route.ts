import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq, ilike } from "drizzle-orm";

// GET - Search for students
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";

    let students = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        phone: users.phone,
      })
      .from(users)
      .where(eq(users.role, "student"));

    // Filter by search term
    if (search) {
      const searchLower = search.toLowerCase();
      students = students.filter(
        (s) =>
          s.name?.toLowerCase().includes(searchLower) ||
          s.email?.toLowerCase().includes(searchLower) ||
          s.phone?.includes(search)
      );
    }

    return NextResponse.json({ students });
  } catch (error) {
    console.error("Error searching students:", error);
    return NextResponse.json({ error: "Failed to search students" }, { status: 500 });
  }
}

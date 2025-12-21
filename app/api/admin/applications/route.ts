import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { admissionApplications, users } from "@/lib/db/schema";
import { eq, desc, or, ilike } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const limit = searchParams.get("limit");

    let query = db
      .select({
        application: admissionApplications,
        user: {
          id: users.id,
          name: users.name,
          email: users.email,
          phone: users.phone,
        },
      })
      .from(admissionApplications)
      .leftJoin(users, eq(admissionApplications.userId, users.id))
      .orderBy(desc(admissionApplications.createdAt))
      .$dynamic();

    if (status && status !== "all") {
      query = query.where(eq(admissionApplications.status, status as any));
    }

    if (limit) {
      query = query.limit(parseInt(limit));
    }

    const applications = await query;

    return NextResponse.json({ applications });
  } catch (error) {
    console.error("Error fetching applications:", error);
    return NextResponse.json(
      { error: "Failed to fetch applications" },
      { status: 500 }
    );
  }
}

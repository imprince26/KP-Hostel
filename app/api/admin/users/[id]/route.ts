import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { users, admissionApplications, semesterPayments } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: Params) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userRole = (session.user as { role?: string }).role;
    if (userRole !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get user applications and payments
    const userApplications = await db
      .select()
      .from(admissionApplications)
      .where(eq(admissionApplications.userId, id));

    const userPayments = await db
      .select()
      .from(semesterPayments)
      .where(eq(semesterPayments.studentId, id));

    return NextResponse.json({
      user,
      applications: userApplications,
      payments: userPayments,
    });
  } catch (error) {
    console.error("Error fetching single user:", error);
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userRole = (session.user as { role?: string }).role;
    if (userRole !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const body = await req.json();

    const updateData: Partial<typeof users.$inferInsert> = {
      updatedAt: new Date(),
    };

    if (body.role !== undefined) {
      if (!["student", "admin"].includes(body.role)) {
        return NextResponse.json({ error: "Invalid role value" }, { status: 400 });
      }
      // Safety: Prevent self role demotion if only admin
      if (id === (session.user as { id?: string }).id && body.role !== "admin") {
        return NextResponse.json(
          { error: "You cannot revoke your own admin permissions" },
          { status: 400 }
        );
      }
      updateData.role = body.role;
    }

    if (body.emailVerified !== undefined) {
      updateData.emailVerified = body.emailVerified ? new Date() : null;
    }

    if (body.phone !== undefined) updateData.phone = body.phone;
    if (body.name !== undefined) updateData.name = body.name;
    if (body.collegeName !== undefined) updateData.collegeName = body.collegeName;
    if (body.course !== undefined) updateData.course = body.course;
    if (body.year !== undefined) updateData.year = body.year;
    if (body.guardianName !== undefined) updateData.guardianName = body.guardianName;
    if (body.guardianPhone !== undefined) updateData.guardianPhone = body.guardianPhone;
    if (body.city !== undefined) updateData.city = body.city;
    if (body.state !== undefined) updateData.state = body.state;

    const [updatedUser] = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, id))
      .returning();

    return NextResponse.json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userRole = (session.user as { role?: string }).role;
    if (userRole !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const currentUserId = (session.user as { id?: string }).id;

    if (id === currentUserId) {
      return NextResponse.json(
        { error: "You cannot delete your own admin account" },
        { status: 400 }
      );
    }

    await db.delete(users).where(eq(users.id, id));

    return NextResponse.json({
      message: "User account deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}

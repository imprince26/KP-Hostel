import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { users, admissionApplications, semesterPayments, hostelBlocks, auditLogs } from "@/lib/db/schema";
import { eq, or, and, isNull } from "drizzle-orm";

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

    // 1. Fetch user to be deleted
    const [userToDelete] = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    if (!userToDelete) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 2. Fetch linked admission applications (linked by userId or matching email)
    const linkedApplications = await db
      .select()
      .from(admissionApplications)
      .where(
        userToDelete.email
          ? or(eq(admissionApplications.userId, id), eq(admissionApplications.email, userToDelete.email))
          : eq(admissionApplications.userId, id)
      );

    // 3. For any application with an active room allotment, release room and decrement occupancy
    let releasedRoomsCount = 0;
    const releasedBlocks: string[] = [];

    for (const app of linkedApplications) {
      if (
        app.assignedBlock &&
        (app.status === "active" || app.status === "admitted")
      ) {
        const [currentBlock] = await db
          .select({
            id: hostelBlocks.id,
            name: hostelBlocks.name,
            currentOccupancy: hostelBlocks.currentOccupancy,
          })
          .from(hostelBlocks)
          .where(eq(hostelBlocks.name, app.assignedBlock))
          .limit(1);

        if (currentBlock && currentBlock.currentOccupancy > 0) {
          await db
            .update(hostelBlocks)
            .set({
              currentOccupancy: Math.max(0, currentBlock.currentOccupancy - 1),
              updatedAt: new Date(),
            })
            .where(eq(hostelBlocks.id, currentBlock.id));

          releasedRoomsCount++;
          releasedBlocks.push(`Block ${app.assignedBlock} Room ${app.roomNumber || "N/A"}`);
        }
      }
    }

    // 4. Nullify foreign keys where this user was a reviewer or payment creator (prevents foreign key constraint errors)
    await db
      .update(admissionApplications)
      .set({ reviewedBy: null })
      .where(eq(admissionApplications.reviewedBy, id));

    await db
      .update(semesterPayments)
      .set({ addedBy: null })
      .where(eq(semesterPayments.addedBy, id));

    // 5. Clean up any applications where email matches but userId was null (orphaned applications)
    if (userToDelete.email) {
      await db
        .delete(admissionApplications)
        .where(
          and(
            eq(admissionApplications.email, userToDelete.email),
            isNull(admissionApplications.userId)
          )
        );
    }

    // 6. Delete user account from users table (cascades linked applications, payments, preferences, sessions)
    await db.delete(users).where(eq(users.id, id));

    // 7. Record in auditLogs
    if (currentUserId) {
      try {
        await db.insert(auditLogs).values({
          actorUserId: currentUserId,
          action: "delete_user",
          entityType: "user",
          entityId: id,
          metadata: JSON.stringify({
            deletedUserEmail: userToDelete.email,
            deletedUserName: userToDelete.name,
            deletedUserRole: userToDelete.role,
            applicationsRemoved: linkedApplications.length,
            releasedRoomsCount,
            releasedBlocks,
          }),
        });
      } catch (auditErr) {
        console.error("Failed to write audit log for user deletion:", auditErr);
      }
    }

    return NextResponse.json({
      message: releasedRoomsCount > 0
        ? `User account deleted and ${releasedRoomsCount} hostel room allocation(s) released successfully`
        : "User account deleted successfully",
      releasedRoomsCount,
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}

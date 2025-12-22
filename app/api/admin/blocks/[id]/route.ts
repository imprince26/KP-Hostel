import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { hostelBlocks } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userRole = (session.user as any).role;
    if (userRole !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { name, capacity, semester1Fee, semester2Fee } = await req.json();

    // Validation
    if (name && !["A", "B", "C", "D"].includes(name)) {
      return NextResponse.json(
        { error: "Invalid block name. Must be A, B, C, or D" },
        { status: 400 }
      );
    }

    if (capacity !== undefined && (capacity <= 0)) {
      return NextResponse.json(
        { error: "Capacity must be a positive number" },
        { status: 400 }
      );
    }

    if (semester1Fee !== undefined && semester1Fee <= 0) {
      return NextResponse.json(
        { error: "Semester 1 fee must be a positive number" },
        { status: 400 }
      );
    }

    if (semester2Fee !== undefined && semester2Fee <= 0) {
      return NextResponse.json(
        { error: "Semester 2 fee must be a positive number" },
        { status: 400 }
      );
    }

    // Check if block exists
    const [existingBlock] = await db
      .select()
      .from(hostelBlocks)
      .where(eq(hostelBlocks.id, id))
      .limit(1);

    if (!existingBlock) {
      return NextResponse.json(
        { error: "Block not found" },
        { status: 404 }
      );
    }

    // If name is being changed, check for conflicts
    if (name && name !== existingBlock.name) {
      const [nameConflict] = await db
        .select()
        .from(hostelBlocks)
        .where(eq(hostelBlocks.name, name))
        .limit(1);

      if (nameConflict) {
        return NextResponse.json(
          { error: "Block with this name already exists" },
          { status: 400 }
        );
      }
    }

    // Update block
    const updateData: any = { updatedAt: new Date() };
    if (name !== undefined) updateData.name = name;
    if (capacity !== undefined) updateData.capacity = capacity;
    if (semester1Fee !== undefined) updateData.sem1Fees = semester1Fee;
    if (semester2Fee !== undefined) updateData.sem2Fees = semester2Fee;

    const [updatedBlock] = await db
      .update(hostelBlocks)
      .set(updateData)
      .where(eq(hostelBlocks.id, id))
      .returning();

    return NextResponse.json({
      success: true,
      block: updatedBlock,
      message: "Block updated successfully"
    });
  } catch (error) {
    console.error("Error updating block:", error);
    return NextResponse.json(
      { error: "Failed to update block" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userRole = (session.user as any).role;
    if (userRole !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Check if block exists
    const [existingBlock] = await db
      .select()
      .from(hostelBlocks)
      .where(eq(hostelBlocks.id, id))
      .limit(1);

    if (!existingBlock) {
      return NextResponse.json(
        { error: "Block not found" },
        { status: 404 }
      );
    }

    // Check if block has current occupancy
    if (existingBlock.currentOccupancy && existingBlock.currentOccupancy > 0) {
      return NextResponse.json(
        { error: "Cannot delete block with current occupancy. Please move students first." },
        { status: 400 }
      );
    }

    // Delete block (blockDetails will be deleted automatically due to CASCADE)
    await db
      .delete(hostelBlocks)
      .where(eq(hostelBlocks.id, id));

    return NextResponse.json({
      success: true,
      message: "Block deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting block:", error);
    return NextResponse.json(
      { error: "Failed to delete block" },
      { status: 500 }
    );
  }
}
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { hostelBlocks, blockDetails } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userRole = (session.user as any).role;
    if (userRole !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Fetch all blocks with their details
    const blocks = await db
      .select({
        id: hostelBlocks.id,
        name: hostelBlocks.name,
        capacity: hostelBlocks.capacity,
        currentOccupancy: hostelBlocks.currentOccupancy,
        semester1Fee: hostelBlocks.sem1Fees,
        semester2Fee: hostelBlocks.sem2Fees,
        isActive: hostelBlocks.isActive,
        createdAt: hostelBlocks.createdAt,
        updatedAt: hostelBlocks.updatedAt,
        // Include block details if available
        description: blockDetails.description,
        amenities: blockDetails.amenities,
        features: blockDetails.features,
        images: blockDetails.images,
        floorCount: blockDetails.floorCount,
        roomsPerFloor: blockDetails.roomsPerFloor,
      })
      .from(hostelBlocks)
      .leftJoin(blockDetails, eq(hostelBlocks.name, blockDetails.blockName))
      .orderBy(desc(hostelBlocks.createdAt));

    return NextResponse.json({ blocks });
  } catch (error) {
    console.error("Error fetching blocks:", error);
    return NextResponse.json(
      { error: "Failed to fetch blocks" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
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
    if (!name || !["A", "B", "C", "D"].includes(name)) {
      return NextResponse.json(
        { error: "Invalid block name. Must be A, B, C, or D" },
        { status: 400 }
      );
    }

    if (!capacity || capacity <= 0) {
      return NextResponse.json(
        { error: "Capacity must be a positive number" },
        { status: 400 }
      );
    }

    if (!semester1Fee || semester1Fee <= 0) {
      return NextResponse.json(
        { error: "Semester 1 fee must be a positive number" },
        { status: 400 }
      );
    }

    if (!semester2Fee || semester2Fee <= 0) {
      return NextResponse.json(
        { error: "Semester 2 fee must be a positive number" },
        { status: 400 }
      );
    }

    // Check if block already exists
    const [existingBlock] = await db
      .select()
      .from(hostelBlocks)
      .where(eq(hostelBlocks.name, name))
      .limit(1);

    if (existingBlock) {
      return NextResponse.json(
        { error: "Block with this name already exists" },
        { status: 400 }
      );
    }

    // Create new block
    const [newBlock] = await db
      .insert(hostelBlocks)
      .values({
        name,
        capacity,
        sem1Fees: semester1Fee,
        sem2Fees: semester2Fee,
      })
      .returning();

    return NextResponse.json({
      success: true,
      block: newBlock,
      message: "Block created successfully"
    });
  } catch (error) {
    console.error("Error creating block:", error);
    return NextResponse.json(
      { error: "Failed to create block" },
      { status: 500 }
    );
  }
}
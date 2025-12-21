import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();

    const updateData: any = { updatedAt: new Date() };

    // Only update fields that are provided
    if (data.name) updateData.name = data.name;
    if (data.phone) updateData.phone = data.phone;
    if (data.avatar) updateData.avatar = data.avatar;
    if (data.bio) updateData.bio = data.bio;
    if (data.dateOfBirth) updateData.dateOfBirth = data.dateOfBirth;
    if (data.address) updateData.address = data.address;
    if (data.city) updateData.city = data.city;
    if (data.state) updateData.state = data.state;
    if (data.pincode) updateData.pincode = data.pincode;
    if (data.guardianName) updateData.guardianName = data.guardianName;
    if (data.guardianPhone) updateData.guardianPhone = data.guardianPhone;
    if (data.collegeName) updateData.collegeName = data.collegeName;
    if (data.course) updateData.course = data.course;
    if (data.year) updateData.year = data.year;

    const [updated] = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, session.user.id))
      .returning();

    return NextResponse.json({ success: true, user: updated });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}

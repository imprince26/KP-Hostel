import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

const schema = z.object({
  phone: z.string().min(10, "Invalid phone number"),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { phone } = schema.parse(body);

    // Update user phone
    await db
      .update(users)
      .set({
        phone,
        updatedAt: new Date(),
      })
      .where(eq(users.email, session.user.email!));

    return NextResponse.json({
      message: "Phone number updated successfully",
      success: true,
    });
  } catch (error) {
    console.error("Update phone error:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to update phone number" },
      { status: 500 }
    );
  }
}

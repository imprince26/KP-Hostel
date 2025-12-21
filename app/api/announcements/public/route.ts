import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { announcements, users } from "@/lib/db/schema";
import { eq, desc, and } from "drizzle-orm";

// GET - Fetch public announcements
export async function GET(req: NextRequest) {
  try {
    // Fetch only public announcements that haven't expired
    const now = new Date();

    const query = db
      .select({
        announcement: announcements,
        author: {
          id: users.id,
          name: users.name,
          email: users.email,
        },
      })
      .from(announcements)
      .leftJoin(users, eq(announcements.authorId, users.id))
      .where(
        and(
          eq(announcements.isPublic, true),
          // Either no expiration date or not expired yet
          // Note: Drizzle doesn't support OR with NULL checks easily, so we'll filter in JS
        )
      )
      .orderBy(desc(announcements.isPinned), desc(announcements.createdAt));

    const results = await query;

    // Filter out expired announcements
    const validAnnouncements = results.filter(
      (item) => !item.announcement.expiresAt || new Date(item.announcement.expiresAt) > now
    );

    return NextResponse.json({ announcements: validAnnouncements });
  } catch (error) {
    console.error("Error fetching public announcements:", error);
    return NextResponse.json(
      { error: "Failed to fetch announcements" },
      { status: 500 }
    );
  }
}
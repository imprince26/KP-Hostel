import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { announcements, users, notifications } from "@/lib/db/schema";
import { eq, desc, and, or, ilike } from "drizzle-orm";
import { createExcerpt } from "@/lib/announcement-utils";

// GET - Fetch all announcements
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";

    // Fetch announcements with author details
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
      .orderBy(desc(announcements.isPinned), desc(announcements.createdAt));

    let results = await query;

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      results = results.filter(
        (r) =>
          r.announcement.title.toLowerCase().includes(searchLower) ||
          r.announcement.content.toLowerCase().includes(searchLower)
      );
    }

    return NextResponse.json({ announcements: results });
  } catch (error) {
    console.error("Error fetching announcements:", error);
    return NextResponse.json({ error: "Failed to fetch announcements" }, { status: 500 });
  }
}

// POST - Create new announcement
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      title,
      content,
      isPublic,
      targetAudience,
      isPinned,
      expiresAt,
      sendNotification,
    } = body;

    // Validate required fields
    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      );
    }

    const [announcement] = await db
      .insert(announcements)
      .values({
        title,
        content,
        authorId: session.user.id,
        isPublic: isPublic ?? true,
        targetAudience: targetAudience || "all",
        isPinned: isPinned ?? false,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      })
      .returning();

    // Send notifications to students if enabled
    if (sendNotification) {
      // Fetch all students
      const students = await db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.role, "student"));

      // Create notifications for all students with clean plain text message (no raw HTML tags)
      if (students.length > 0) {
        const plainSummary = createExcerpt(content, 220);
        await db.insert(notifications).values(
          students.map((student) => ({
            userId: student.id,
            type: "announcement" as const,
            title: `New Announcement: ${title}`,
            message: plainSummary || title,
            actionUrl: "/student/dashboard",
          }))
        );
      }
    }

    return NextResponse.json({
      announcement,
      message: "Announcement created successfully",
    });
  } catch (error) {
    console.error("Error creating announcement:", error);
    return NextResponse.json({ error: "Failed to create announcement" }, { status: 500 });
  }
}

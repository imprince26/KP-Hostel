import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { notifications } from "@/lib/db/schema";
import { and, eq, desc } from "drizzle-orm";

const LIST_LIMIT = 100;

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userNotifications = await db
      .select()
      .from(notifications)
      .where(eq(notifications.userId, session.user.id))
      .orderBy(desc(notifications.createdAt))
      .limit(LIST_LIMIT);

    return NextResponse.json({
      notifications: userNotifications,
      unreadCount: userNotifications.filter((n) => !n.read).length,
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      { error: "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}

/**
 * Marks one notification as read/unread, or every notification as read.
 *
 * The row is always matched on the session user as well as the id: the previous
 * version filtered on the id alone, so any signed-in user could mark somebody
 * else's notification as read.
 */
export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await req.json()) as {
      notificationId?: string;
      read?: boolean;
      markAllRead?: boolean;
    };

    if (body.markAllRead) {
      await db
        .update(notifications)
        .set({ read: true })
        .where(
          and(
            eq(notifications.userId, session.user.id),
            eq(notifications.read, false)
          )
        );

      return NextResponse.json({ success: true });
    }

    if (!body.notificationId) {
      return NextResponse.json(
        { error: "notificationId is required" },
        { status: 400 }
      );
    }

    const [updated] = await db
      .update(notifications)
      .set({ read: body.read ?? true })
      .where(
        and(
          eq(notifications.id, body.notificationId),
          eq(notifications.userId, session.user.id)
        )
      )
      .returning({ id: notifications.id });

    if (!updated) {
      return NextResponse.json(
        { error: "Notification not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating notification:", error);
    return NextResponse.json(
      { error: "Failed to update notification" },
      { status: 500 }
    );
  }
}

/**
 * Deletion is intentionally not supported: notifications are a record of what
 * the hostel office sent, so students cannot remove them. `DELETE` therefore
 * has no handler and Next.js answers 405 Method Not Allowed.
 */

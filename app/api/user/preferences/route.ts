import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { userPreferences } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [prefs] = await db
      .select()
      .from(userPreferences)
      .where(eq(userPreferences.userId, session.user.id))
      .limit(1);

    if (!prefs) {
      // Create default preferences
      const [newPrefs] = await db
        .insert(userPreferences)
        .values({
          userId: session.user.id,
          emailNotifications: true,
          applicationUpdates: true,
          announcementNotifications: true,
        })
        .returning();

      return NextResponse.json(newPrefs);
    }

    return NextResponse.json(prefs);
  } catch (error) {
    console.error("Error fetching preferences:", error);
    return NextResponse.json(
      { error: "Failed to fetch preferences" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();

    const [updated] = await db
      .update(userPreferences)
      .set({
        emailNotifications: data.emailNotifications,
        applicationUpdates: data.applicationUpdates,
        announcementNotifications: data.announcementNotifications,
        updatedAt: new Date(),
      })
      .where(eq(userPreferences.userId, session.user.id))
      .returning();

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating preferences:", error);
    return NextResponse.json(
      { error: "Failed to update preferences" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { TERMS_VERSION } from "@/lib/legal";

/**
 * Records the user's acceptance of the privacy policy and the terms of use.
 *
 * Used by the consent screen, which is shown to accounts that signed up
 * without going through the registration form (for example Google OAuth).
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await req.json().catch(() => ({}))) as {
      acceptedTerms?: boolean;
      acceptedPrivacy?: boolean;
    };

    if (!body.acceptedTerms || !body.acceptedPrivacy) {
      return NextResponse.json(
        {
          error:
            "You must accept the Privacy Policy and the Terms of Use to continue",
        },
        { status: 400 }
      );
    }

    const acceptedAt = new Date();

    await db
      .update(users)
      .set({
        acceptedTermsAt: acceptedAt,
        acceptedPrivacyAt: acceptedAt,
        termsVersion: TERMS_VERSION,
        updatedAt: acceptedAt,
      })
      .where(eq(users.id, session.user.id));

    return NextResponse.json({
      success: true,
      acceptedTermsAt: acceptedAt.toISOString(),
      termsVersion: TERMS_VERSION,
    });
  } catch (error) {
    console.error("Error recording legal consent:", error);
    return NextResponse.json(
      { error: "Failed to record your acceptance" },
      { status: 500 }
    );
  }
}

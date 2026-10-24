import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

/**
 * Columns that are safe to send to the browser.
 *
 * The route used to return the whole row, which included the password hash and
 * the password-reset token. Selecting the fields explicitly keeps those on the
 * server; the client only needs to know whether a password exists.
 */
const PROFILE_COLUMNS = {
  id: users.id,
  name: users.name,
  email: users.email,
  emailVerified: users.emailVerified,
  image: users.image,
  avatar: users.avatar,
  role: users.role,
  phone: users.phone,
  bio: users.bio,
  dateOfBirth: users.dateOfBirth,
  address: users.address,
  city: users.city,
  state: users.state,
  pincode: users.pincode,
  guardianName: users.guardianName,
  guardianPhone: users.guardianPhone,
  collegeName: users.collegeName,
  course: users.course,
  year: users.year,
  acceptedTermsAt: users.acceptedTermsAt,
  acceptedPrivacyAt: users.acceptedPrivacyAt,
  termsVersion: users.termsVersion,
  lastLoginAt: users.lastLoginAt,
  createdAt: users.createdAt,
  updatedAt: users.updatedAt,
};

const optionalText = (max: number) =>
  z.string().trim().max(max, `Must be ${max} characters or fewer`).optional();

/**
 * Every field is optional so the form can send a partial patch. An empty string
 * is meaningful: it clears the column, which is why the route no longer ignores
 * falsy values (clearing a bio or a guardian phone used to be impossible).
 */
const profileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(80, "Name must be 80 characters or fewer")
    .optional(),
  phone: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number")
    .or(z.literal(""))
    .optional(),
  dateOfBirth: z
    .string()
    .trim()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date of birth must be a valid date")
    .or(z.literal(""))
    .optional(),
  avatar: z.string().trim().url("Avatar must be a valid URL").or(z.literal("")).optional(),
  bio: optionalText(500),
  address: optionalText(160),
  city: optionalText(80),
  state: optionalText(80),
  pincode: z
    .string()
    .trim()
    .regex(/^\d{6}$/, "Enter a valid 6-digit PIN code")
    .or(z.literal(""))
    .optional(),
  guardianName: optionalText(80),
  guardianPhone: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number")
    .or(z.literal(""))
    .optional(),
  collegeName: optionalText(120),
  course: optionalText(120),
  year: optionalText(40),
});

type ProfileInput = z.infer<typeof profileSchema>;

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [user] = await db
      .select({ ...PROFILE_COLUMNS, passwordHash: users.passwordHash })
      .from(users)
      .where(eq(users.id, session.user.id))
      .limit(1);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { passwordHash, ...profile } = user;

    return NextResponse.json({
      user: { ...profile, hasPassword: Boolean(passwordHash) },
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
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

    const parsed = profileSchema.safeParse(await req.json());

    if (!parsed.success) {
      const firstIssue = parsed.error.issues[0];
      return NextResponse.json(
        { error: firstIssue?.message ?? "Invalid profile data" },
        { status: 400 }
      );
    }

    const input: ProfileInput = parsed.data;
    const updateData: Partial<typeof users.$inferInsert> = { updatedAt: new Date() };

    // An empty string clears the column; `undefined` leaves it untouched, so a
    // partial patch from one section of the form cannot wipe another.
    const clearable = (value: string | undefined) =>
      value === undefined ? undefined : value === "" ? null : value;

    if (input.name !== undefined) updateData.name = input.name;
    if (input.phone !== undefined) updateData.phone = clearable(input.phone);
    if (input.dateOfBirth !== undefined) updateData.dateOfBirth = clearable(input.dateOfBirth);
    if (input.avatar !== undefined) updateData.avatar = clearable(input.avatar);
    if (input.bio !== undefined) updateData.bio = clearable(input.bio);
    if (input.address !== undefined) updateData.address = clearable(input.address);
    if (input.city !== undefined) updateData.city = clearable(input.city);
    if (input.state !== undefined) updateData.state = clearable(input.state);
    if (input.pincode !== undefined) updateData.pincode = clearable(input.pincode);
    if (input.guardianName !== undefined) updateData.guardianName = clearable(input.guardianName);
    if (input.guardianPhone !== undefined) updateData.guardianPhone = clearable(input.guardianPhone);
    if (input.collegeName !== undefined) updateData.collegeName = clearable(input.collegeName);
    if (input.course !== undefined) updateData.course = clearable(input.course);
    if (input.year !== undefined) updateData.year = clearable(input.year);

    const [updated] = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, session.user.id))
      .returning(PROFILE_COLUMNS);

    return NextResponse.json({ success: true, user: updated });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}

/**
 * Domain types shared by the database layer, the API routes and the UI.
 *
 * These live outside `lib/db/schema.ts` on purpose: they are safe to import
 * from client components, which lets a page and its API route agree on the
 * same union instead of casting strings to `any`.
 */

export const GENDERS = ["male", "female", "other"] as const;
export type Gender = (typeof GENDERS)[number];

export const BLOCK_CODES = ["A", "B", "C", "D"] as const;
export type BlockCode = (typeof BLOCK_CODES)[number];

export const ADMISSION_STATUSES = [
  "submitted",
  "under_review",
  "approved",
  "rejected",
  "admitted",
  "active",
  "completed",
] as const;
export type AdmissionStatus = (typeof ADMISSION_STATUSES)[number];

export const SEMESTERS = ["sem1", "sem2"] as const;
export type Semester = (typeof SEMESTERS)[number];

export const PAYMENT_STATUSES = ["pending", "paid", "partial"] as const;
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

export const USER_ROLES = ["student", "admin"] as const;
export type UserRole = (typeof USER_ROLES)[number];

export const NOTIFICATION_TYPES = [
  "application_submitted",
  "application_approved",
  "application_rejected",
  "admission_activated",
  "announcement",
  "payment_due",
  "message",
  "system",
] as const;
export type NotificationType = (typeof NOTIFICATION_TYPES)[number];

/** Narrows an untrusted string to a known enum value. */
export function isOneOf<T extends string>(
  values: readonly T[],
  value: unknown
): value is T {
  return typeof value === "string" && (values as readonly string[]).includes(value);
}

import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

// ============================================
// Auth Tables (NextAuth + Drizzle Adapter)
// ============================================

export const users = pgTable(
  "users",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    name: text("name"),
    email: text("email"),
    emailVerified: timestamp("emailVerified", { mode: "date" }),
    image: text("image"),
    passwordHash: text("passwordHash"),
    role: text("role").notNull().default("student"), // student | admin
    phone: text("phone"),
    resetToken: text("resetToken"),
    resetTokenExpiry: timestamp("resetTokenExpiry", { mode: "date" }),
    emailVerificationOtp: text("emailVerificationOtp"),
    emailVerificationOtpExpiry: timestamp("emailVerificationOtpExpiry", { mode: "date" }),
    createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
    updatedAt: timestamp("updatedAt", { mode: "date" }).notNull().defaultNow(),
  },
  (t) => [
    uniqueIndex("users_email_unique").on(t.email),
    index("users_role_idx").on(t.role),
    index("users_resetToken_idx").on(t.resetToken),
  ]
);

export const accounts = pgTable(
  "accounts",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (t) => [
    primaryKey({ columns: [t.provider, t.providerAccountId] }),
    index("accounts_userId_idx").on(t.userId),
  ]
);

export const sessions = pgTable(
  "sessions",
  {
    sessionToken: text("sessionToken").primaryKey(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (t) => [
    index("sessions_userId_idx").on(t.userId),
  ]
);

export const verificationTokens = pgTable(
  "verificationTokens",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (t) => [
    primaryKey({ columns: [t.identifier, t.token] }),
  ]
);

export const authenticators = pgTable(
  "authenticators",
  {
    credentialID: text("credentialID").notNull().unique(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    providerAccountId: text("providerAccountId").notNull(),
    credentialPublicKey: text("credentialPublicKey").notNull(),
    counter: integer("counter").notNull(),
    credentialDeviceType: text("credentialDeviceType").notNull(),
    credentialBackedUp: boolean("credentialBackedUp").notNull(),
    transports: text("transports"),
  },
  (t) => [
    primaryKey({ columns: [t.userId, t.credentialID] }),
  ]
);

// ============================================
// Admission & Hostel Tables
// ============================================

export const genderEnum = pgEnum("gender", ["male", "female", "other"]);
export const blockEnum = pgEnum("hostel_block", ["A", "B", "C", "D"]);
export const admissionStatusEnum = pgEnum("admission_status", [
  "submitted",
  "under_review",
  "approved",
  "rejected",
  "admitted",
]);

export const admissionApplications = pgTable(
  "admissionApplications",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    applicationNumber: text("applicationNumber").notNull().unique(),
    otpCode: text("otpCode"),
    status: admissionStatusEnum("status").notNull().default("submitted"),
    blockPreference: blockEnum("blockPreference"),
    gender: genderEnum("gender").notNull(),
    
    // Personal Details
    fullName: text("fullName").notNull(),
    dob: text("dob"),
    phone: text("phone").notNull(),
    email: text("email"),
    address: text("address"),
    passportPhoto: text("passportPhoto"), // Cloudinary URL
    
    // Educational Details
    collegeName: text("collegeName"),
    course: text("course"),
    year: text("year"),
    
    // Guardian Details
    guardianName: text("guardianName"),
    guardianPhone: text("guardianPhone"),
    
    // Admin Notes
    adminNotes: text("adminNotes"),
    reviewedBy: text("reviewedBy").references(() => users.id),
    reviewedAt: timestamp("reviewedAt", { mode: "date" }),
    
    createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
    updatedAt: timestamp("updatedAt", { mode: "date" }).notNull().defaultNow(),
  },
  (t) => [
    index("admissionApplications_status_idx").on(t.status),
    index("admissionApplications_applicationNumber_idx").on(
      t.applicationNumber
    ),
    index("admissionApplications_email_idx").on(t.email),
]
);

// ============================================
// Audit Log
// ============================================

export const auditLogs = pgTable(
  "auditLogs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    actorUserId: text("actorUserId").notNull(),
    action: text("action").notNull(),
    entityType: text("entityType").notNull(),
    entityId: text("entityId").notNull(),
    metadata: text("metadata"), // JSON string
    createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
  },
  (t) => [
    index("auditLogs_actorUserId_idx").on(t.actorUserId),
    index("auditLogs_entity_idx").on(t.entityType, t.entityId),
    index("auditLogs_createdAt_idx").on(t.createdAt),
  ]
);

// ============================================
// Relations
// ============================================

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
  reviewedApplications: many(admissionApplications),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

export const admissionApplicationsRelations = relations(
  admissionApplications,
  ({ one }) => ({
    reviewer: one(users, {
      fields: [admissionApplications.reviewedBy],
      references: [users.id],
    }),
  })
);

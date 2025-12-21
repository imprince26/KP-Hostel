import { sub } from "date-fns";
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
    avatar: text("avatar"),
    passwordHash: text("passwordHash"),
    role: text("role").notNull().default("student"), // student | admin
    phone: text("phone"),
    bio: text("bio"),
    dateOfBirth: text("dateOfBirth"),
    address: text("address"),
    city: text("city"),
    state: text("state"),
    pincode: text("pincode"),
    guardianName: text("guardianName"),
    guardianPhone: text("guardianPhone"),
    collegeName: text("collegeName"),
    course: text("course"),
    year: text("year"),
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
  "active",
  "completed",
]);
export const semesterEnum = pgEnum("semester", ["sem1", "sem2"]);
export const paymentStatusEnum = pgEnum("payment_status", ["pending", "paid", "partial"]);

export const admissionApplications = pgTable(
  "admissionApplications",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("userId").references(() => users.id, { onDelete: "cascade" }),
    applicationNumber: text("applicationNumber").notNull().unique(),
    status: admissionStatusEnum("status").notNull().default("submitted"),
    
    // Personal Details
    fullName: text("fullName").notNull(),
    email: text("email").notNull(),
    phone: text("phone").notNull(),
    dateOfBirth: text("dateOfBirth").notNull(),
    gender: genderEnum("gender").notNull(),
    caste: text("caste").notNull(),
    subCaste: text("subCaste").notNull(),
    passportPhoto: text("passportPhoto").notNull(), // Cloudinary URL
    
    // Address
    address: text("address").notNull(),
    city: text("city").notNull(),
    state: text("state").notNull(),
    pincode: text("pincode").notNull(),
    
    // Educational Details
    collegeName: text("collegeName").notNull(),
    course: text("course").notNull(),
    year: text("year").notNull(),
    studentId: text("studentId"),
    
    // Guardian Details
    guardianName: text("guardianName").notNull(),
    guardianPhone: text("guardianPhone").notNull(),
    guardianRelation: text("guardianRelation").notNull(),
    
    // Hostel Preferences
    blockPreference: blockEnum("blockPreference"),
    
    // Admin Actions (after offline admission)
    assignedBlock: blockEnum("assignedBlock"),
    roomNumber: text("roomNumber"),
    admissionStartDate: timestamp("admissionStartDate", { mode: "date" }),
    admissionEndDate: timestamp("admissionEndDate", { mode: "date" }),
    adminNotes: text("adminNotes"),
    reviewedBy: text("reviewedBy").references(() => users.id),
    reviewedAt: timestamp("reviewedAt", { mode: "date" }),
    rejectionReason: text("rejectionReason"),
    
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
// User Preferences & Settings
// ============================================

export const userPreferences = pgTable("userPreferences", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" })
    .unique(),
  emailNotifications: boolean("emailNotifications").notNull().default(true),
  applicationUpdates: boolean("applicationUpdates").notNull().default(true),
  announcementNotifications: boolean("announcementNotifications").notNull().default(true),
  createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).notNull().defaultNow(),
});

// ============================================
// Notifications System
// ============================================

export const notificationTypeEnum = pgEnum("notification_type", [
  "application_submitted",
  "application_approved",
  "application_rejected",
  "payment_due",
  "announcement",
  "system",
]);

export const notifications = pgTable(
  "notifications",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: notificationTypeEnum("type").notNull(),
    title: text("title").notNull(),
    message: text("message").notNull(),
    read: boolean("read").notNull().default(false),
    actionUrl: text("actionUrl"),
    createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
  },
  (t) => [
    index("notifications_userId_idx").on(t.userId),
    index("notifications_read_idx").on(t.read),
    index("notifications_createdAt_idx").on(t.createdAt),
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
// Hostel Blocks Management
// ============================================

export const hostelBlocks = pgTable("hostelBlocks", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: blockEnum("name").notNull().unique(),
  capacity: integer("capacity"),
  currentOccupancy: integer("currentOccupancy").notNull().default(0),
  sem1Fees: integer("sem1Fees").notNull(),
  sem2Fees: integer("sem2Fees").notNull(),
  isActive: boolean("isActive").notNull().default(true),
  createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).notNull().defaultNow(),
});

export const blockDetails = pgTable("blockDetails", {
  id: uuid("id").primaryKey().defaultRandom(),
  blockName: blockEnum("blockName")
    .notNull()
    .references(() => hostelBlocks.name, { onDelete: "cascade" })
    .unique(),
  description: text("description"),
  amenities: text("amenities"), // JSON array string
  features: text("features"), // JSON array string
  images: text("images"), // JSON array of Cloudinary URLs
  floorCount: integer("floorCount"),
  roomsPerFloor: integer("roomsPerFloor"),
  createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).notNull().defaultNow(),
});

// ============================================
// Semester Payments (DD Tracking)
// ============================================

export const semesterPayments = pgTable(
  "semesterPayments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    studentId: text("studentId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    applicationId: uuid("applicationId").references(() => admissionApplications.id, { onDelete: "cascade" }),
    semester: semesterEnum("semester").notNull(),
    academicYear: text("academicYear").notNull(), // e.g., "2024-2025"
    ddNumber: text("ddNumber"),
    bankName: text("bankName"),
    amountPaid: integer("amountPaid"),
    paymentStatus: paymentStatusEnum("paymentStatus").notNull().default("pending"),
    paidDate: timestamp("paidDate", { mode: "date" }),
    addedBy: text("addedBy").references(() => users.id), // Admin who added this
    notes: text("notes"),
    createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
    updatedAt: timestamp("updatedAt", { mode: "date" }).notNull().defaultNow(),
  },
  (t) => [
    index("semesterPayments_studentId_idx").on(t.studentId),
    index("semesterPayments_semester_idx").on(t.semester),
    index("semesterPayments_status_idx").on(t.paymentStatus),
  ]
);

// ============================================
// Announcements
// ============================================

export const announcements = pgTable(
  "announcements",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    title: text("title").notNull(),
    content: text("content").notNull(),
    authorId: text("authorId")
      .notNull()
      .references(() => users.id),
    isPublic: boolean("isPublic").notNull().default(true), // Show on public website
    targetAudience: text("targetAudience"), // "all", "students", "block_A", "male", "female"
    isPinned: boolean("isPinned").notNull().default(false),
    expiresAt: timestamp("expiresAt", { mode: "date" }),
    createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
    updatedAt: timestamp("updatedAt", { mode: "date" }).notNull().defaultNow(),
  },
  (t) => [
    index("announcements_authorId_idx").on(t.authorId),
    index("announcements_isPublic_idx").on(t.isPublic),
    index("announcements_createdAt_idx").on(t.createdAt),
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

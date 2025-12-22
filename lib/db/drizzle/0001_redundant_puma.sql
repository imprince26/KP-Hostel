CREATE TYPE "public"."notification_type" AS ENUM('application_submitted', 'application_approved', 'application_rejected', 'admission_activated', 'payment_due', 'announcement', 'system');--> statement-breakpoint
CREATE TYPE "public"."payment_status" AS ENUM('pending', 'paid', 'partial');--> statement-breakpoint
CREATE TYPE "public"."semester" AS ENUM('sem1', 'sem2');--> statement-breakpoint
ALTER TYPE "public"."admission_status" ADD VALUE 'active';--> statement-breakpoint
ALTER TYPE "public"."admission_status" ADD VALUE 'completed';--> statement-breakpoint
CREATE TABLE "announcements" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"content" text NOT NULL,
	"authorId" text NOT NULL,
	"isPublic" boolean DEFAULT true NOT NULL,
	"targetAudience" text,
	"isPinned" boolean DEFAULT false NOT NULL,
	"expiresAt" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "blockDetails" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"blockName" "hostel_block" NOT NULL,
	"description" text,
	"amenities" text,
	"features" text,
	"images" text,
	"floorCount" integer,
	"roomsPerFloor" integer,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "blockDetails_blockName_unique" UNIQUE("blockName")
);
--> statement-breakpoint
CREATE TABLE "hostelBlocks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" "hostel_block" NOT NULL,
	"capacity" integer,
	"currentOccupancy" integer DEFAULT 0 NOT NULL,
	"sem1Fees" integer NOT NULL,
	"sem2Fees" integer NOT NULL,
	"isActive" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "hostelBlocks_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" text NOT NULL,
	"type" "notification_type" NOT NULL,
	"title" text NOT NULL,
	"message" text NOT NULL,
	"read" boolean DEFAULT false NOT NULL,
	"actionUrl" text,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "semesterPayments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"studentId" text NOT NULL,
	"applicationId" uuid,
	"semester" "semester" NOT NULL,
	"academicYear" text NOT NULL,
	"ddNumber" text,
	"bankName" text,
	"amountPaid" integer,
	"paymentStatus" "payment_status" DEFAULT 'pending' NOT NULL,
	"paidDate" timestamp,
	"addedBy" text,
	"notes" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "userPreferences" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" text NOT NULL,
	"emailNotifications" boolean DEFAULT true NOT NULL,
	"applicationUpdates" boolean DEFAULT true NOT NULL,
	"announcementNotifications" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "userPreferences_userId_unique" UNIQUE("userId")
);
--> statement-breakpoint
ALTER TABLE "admissionApplications" ALTER COLUMN "email" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "admissionApplications" ALTER COLUMN "address" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "admissionApplications" ALTER COLUMN "passportPhoto" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "admissionApplications" ALTER COLUMN "collegeName" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "admissionApplications" ALTER COLUMN "course" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "admissionApplications" ALTER COLUMN "year" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "admissionApplications" ALTER COLUMN "guardianName" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "admissionApplications" ALTER COLUMN "guardianPhone" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "admissionApplications" ADD COLUMN "userId" text;--> statement-breakpoint
ALTER TABLE "admissionApplications" ADD COLUMN "dateOfBirth" text NOT NULL;--> statement-breakpoint
ALTER TABLE "admissionApplications" ADD COLUMN "caste" text NOT NULL;--> statement-breakpoint
ALTER TABLE "admissionApplications" ADD COLUMN "subCaste" text NOT NULL;--> statement-breakpoint
ALTER TABLE "admissionApplications" ADD COLUMN "city" text NOT NULL;--> statement-breakpoint
ALTER TABLE "admissionApplications" ADD COLUMN "state" text NOT NULL;--> statement-breakpoint
ALTER TABLE "admissionApplications" ADD COLUMN "pincode" text NOT NULL;--> statement-breakpoint
ALTER TABLE "admissionApplications" ADD COLUMN "studentId" text;--> statement-breakpoint
ALTER TABLE "admissionApplications" ADD COLUMN "guardianRelation" text NOT NULL;--> statement-breakpoint
ALTER TABLE "admissionApplications" ADD COLUMN "assignedBlock" "hostel_block";--> statement-breakpoint
ALTER TABLE "admissionApplications" ADD COLUMN "roomNumber" text;--> statement-breakpoint
ALTER TABLE "admissionApplications" ADD COLUMN "admissionStartDate" timestamp;--> statement-breakpoint
ALTER TABLE "admissionApplications" ADD COLUMN "admissionEndDate" timestamp;--> statement-breakpoint
ALTER TABLE "admissionApplications" ADD COLUMN "rejectionReason" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "avatar" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "bio" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "dateOfBirth" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "address" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "city" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "state" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "pincode" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "guardianName" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "guardianPhone" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "collegeName" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "course" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "year" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "emailVerificationOtp" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "emailVerificationOtpExpiry" timestamp;--> statement-breakpoint
ALTER TABLE "announcements" ADD CONSTRAINT "announcements_authorId_users_id_fk" FOREIGN KEY ("authorId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blockDetails" ADD CONSTRAINT "blockDetails_blockName_hostelBlocks_name_fk" FOREIGN KEY ("blockName") REFERENCES "public"."hostelBlocks"("name") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "semesterPayments" ADD CONSTRAINT "semesterPayments_studentId_users_id_fk" FOREIGN KEY ("studentId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "semesterPayments" ADD CONSTRAINT "semesterPayments_applicationId_admissionApplications_id_fk" FOREIGN KEY ("applicationId") REFERENCES "public"."admissionApplications"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "semesterPayments" ADD CONSTRAINT "semesterPayments_addedBy_users_id_fk" FOREIGN KEY ("addedBy") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "userPreferences" ADD CONSTRAINT "userPreferences_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "announcements_authorId_idx" ON "announcements" USING btree ("authorId");--> statement-breakpoint
CREATE INDEX "announcements_isPublic_idx" ON "announcements" USING btree ("isPublic");--> statement-breakpoint
CREATE INDEX "announcements_createdAt_idx" ON "announcements" USING btree ("createdAt");--> statement-breakpoint
CREATE INDEX "notifications_userId_idx" ON "notifications" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "notifications_read_idx" ON "notifications" USING btree ("read");--> statement-breakpoint
CREATE INDEX "notifications_createdAt_idx" ON "notifications" USING btree ("createdAt");--> statement-breakpoint
CREATE INDEX "semesterPayments_studentId_idx" ON "semesterPayments" USING btree ("studentId");--> statement-breakpoint
CREATE INDEX "semesterPayments_semester_idx" ON "semesterPayments" USING btree ("semester");--> statement-breakpoint
CREATE INDEX "semesterPayments_status_idx" ON "semesterPayments" USING btree ("paymentStatus");--> statement-breakpoint
ALTER TABLE "admissionApplications" ADD CONSTRAINT "admissionApplications_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "admissionApplications" DROP COLUMN "otpCode";--> statement-breakpoint
ALTER TABLE "admissionApplications" DROP COLUMN "dob";
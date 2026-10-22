ALTER TABLE "users" ADD COLUMN "acceptedTermsAt" timestamp;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "acceptedPrivacyAt" timestamp;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "termsVersion" text;
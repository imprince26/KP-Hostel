"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BadgeCheck,
  CalendarDays,
  Clock,
  FileCheck2,
  Mail,
  ShieldAlert,
  ShieldCheck,
  Trash2,
  UserRound,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SettingsSection } from "@/components/student/settings/settings-section";
import { DeleteAccountDialog } from "@/components/student/settings/delete-account-dialog";
import type { ProfileRecord } from "@/lib/api-types";

function formatDateTime(value: string | null) {
  if (!value) return "Not recorded";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not recorded";

  return date.toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function formatDate(value: string | null) {
  if (!value) return "Not recorded";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not recorded";

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function Detail({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: React.ReactNode;
  icon?: typeof Mail;
}) {
  return (
    <div>
      <dt className="text-xs font-medium text-muted-foreground">{label}</dt>
      <dd className="mt-1 flex items-center gap-1.5 text-sm font-medium text-foreground">
        {Icon && <Icon className="size-4 shrink-0 text-muted-foreground" />}
        <span className="min-w-0 break-words">{value}</span>
      </dd>
    </div>
  );
}

/** Account information, legal consent and the deletion flow. */
export function AccountTab({ profile }: { profile: ProfileRecord }) {
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <div className="space-y-5">
      <SettingsSection
        icon={UserRound}
        title="Account overview"
        description="The identity behind your portal sign-in."
      >
        <dl className="grid gap-5 sm:grid-cols-2">
          <Detail
            label="Email address"
            icon={Mail}
            value={
              <span className="flex flex-wrap items-center gap-2">
                {profile.email}
                {profile.emailVerified ? (
                  <Badge
                    variant="outline"
                    className="border-primary/20 bg-primary/10 text-primary"
                  >
                    <BadgeCheck className="size-3" />
                    Verified
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-muted-foreground">
                    Not verified
                  </Badge>
                )}
              </span>
            }
          />

          <Detail
            label="Account type"
            icon={ShieldCheck}
            value={profile.role === "admin" ? "Administrator" : "Student"}
          />

          <Detail
            label="Member since"
            icon={CalendarDays}
            value={formatDate(profile.createdAt)}
          />

          <Detail
            label="Last sign-in"
            icon={Clock}
            value={formatDateTime(profile.lastLoginAt)}
          />

          <Detail
            label="Sign-in method"
            icon={ShieldCheck}
            value={
              profile.hasPassword
                ? "Email and password"
                : "Google account"
            }
          />
        </dl>
      </SettingsSection>

      <SettingsSection
        icon={FileCheck2}
        title="Legal consent"
        description="What you accepted when you created the account."
      >
        <dl className="grid gap-5 sm:grid-cols-2">
          <Detail
            label="Terms of service accepted"
            value={formatDateTime(profile.acceptedTermsAt)}
          />
          <Detail
            label="Privacy policy accepted"
            value={formatDateTime(profile.acceptedPrivacyAt)}
          />
          <Detail
            label="Consent version"
            value={profile.termsVersion ?? "Not recorded"}
          />
        </dl>

        <div className="mt-4 flex flex-wrap gap-3 border-t border-border pt-4 text-sm">
          <Link
            href="/terms"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            Terms of service
          </Link>
          <Link
            href="/privacy"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            Privacy policy
          </Link>
          <Link
            href="/credits"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            Credits
          </Link>
        </div>
      </SettingsSection>

      <SettingsSection
        icon={ShieldAlert}
        title="Delete account"
        description="Permanently remove your account and every record attached to it."
        tone="destructive"
        footer={
          <p className="text-xs text-muted-foreground">
            Applications and payment records are deleted with the account. The
            hostel office cannot recover them afterwards.
          </p>
        }
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-muted-foreground">
            <p className="font-medium text-foreground">
              This action cannot be undone.
            </p>
            <p>
              If you only want to cancel an application, contact the hostel
              office instead.
            </p>
          </div>

          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={() => setDeleteOpen(true)}
            className="shrink-0"
          >
            <Trash2 className="size-4" />
            Delete my account
          </Button>
        </div>
      </SettingsSection>

      <DeleteAccountDialog open={deleteOpen} onOpenChange={setDeleteOpen} />
    </div>
  );
}

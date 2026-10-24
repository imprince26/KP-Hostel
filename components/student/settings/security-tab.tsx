"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Check,
  Circle,
  Clock,
  KeyRound,
  Loader2,
  Lock,
  MailCheck,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { SettingsSection } from "@/components/student/settings/settings-section";
import { ApiError, apiSend } from "@/lib/api-client";
import { cn } from "@/lib/utils";

const PASSWORD_RULES = [
  { label: "At least 8 characters", test: (value: string) => value.length >= 8 },
  {
    label: "Upper and lower case letters",
    test: (value: string) => /[a-z]/.test(value) && /[A-Z]/.test(value),
  },
  { label: "At least one number", test: (value: string) => /\d/.test(value) },
  {
    label: "At least one symbol",
    test: (value: string) => /[^A-Za-z0-9]/.test(value),
  },
];

function formatDateTime(value: string | null) {
  if (!value) return "Not recorded yet";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not recorded yet";

  return date.toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function PasswordStrength({ password }: { password: string }) {
  const passed = PASSWORD_RULES.filter((rule) => rule.test(password)).length;

  return (
    <div className="space-y-2">
      <div className="flex gap-1.5" aria-hidden>
        {PASSWORD_RULES.map((rule, index) => (
          <span
            key={rule.label}
            className={cn(
              "h-1.5 flex-1 rounded-full",
              index < passed
                ? passed <= 2
                  ? "bg-destructive"
                  : passed === 3
                    ? "bg-secondary-foreground/50"
                    : "bg-primary"
                : "bg-muted"
            )}
          />
        ))}
      </div>

      <ul className="grid gap-1 sm:grid-cols-2">
        {PASSWORD_RULES.map((rule) => {
          const done = rule.test(password);
          const Icon = done ? Check : Circle;

          return (
            <li
              key={rule.label}
              className={cn(
                "flex items-center gap-1.5 text-xs",
                done ? "text-primary" : "text-muted-foreground"
              )}
            >
              <Icon className="size-3" />
              {rule.label}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/**
 * Password and sign-in controls.
 *
 * The reset link is deliberately sent to the signed-in address rather than
 * asking for an email again: the student is already authenticated, and the
 * server never reveals whether an address exists.
 */
export function SecurityTab({
  hasPassword,
  email,
  emailVerified,
  lastLoginAt,
}: {
  hasPassword: boolean;
  email: string | null;
  emailVerified: string | null;
  lastLoginAt: string | null;
}) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetSent, setResetSent] = useState(false);

  const rulesPassed = PASSWORD_RULES.every((rule) => rule.test(newPassword));
  const matches = newPassword.length > 0 && newPassword === confirmPassword;
  const canSubmit =
    hasPassword && currentPassword.length > 0 && rulesPassed && matches;

  const changePassword = useMutation({
    mutationFn: () =>
      apiSend("/api/auth/change-password", "POST", {
        currentPassword,
        newPassword,
      }),
    onSuccess: () => {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      toast.success("Password changed. Use it the next time you sign in.");
    },
    onError: (error) => {
      toast.error(
        error instanceof ApiError
          ? error.message
          : "Could not change your password. Please try again."
      );
    },
  });

  const sendResetLink = useMutation({
    mutationFn: () =>
      apiSend("/api/auth/forgot-password", "POST", { email: email ?? "" }),
    onSuccess: () => {
      setResetSent(true);
      toast.success("Reset link sent to your email address.");
    },
    onError: (error) => {
      toast.error(
        error instanceof ApiError
          ? error.message
          : "Could not send the reset link. Please try again."
      );
    },
  });

  return (
    <div className="space-y-5">
      <SettingsSection
        icon={KeyRound}
        title={hasPassword ? "Change password" : "Set a password"}
        description={
          hasPassword
            ? "Use a password you do not use anywhere else."
            : "Your account signs in with Google. Send yourself a reset link to create a password."
        }
      >
        {hasPassword ? (
          <form
            className="space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              if (!canSubmit) return;
              changePassword.mutate();
            }}
            noValidate
          >
            <div className="space-y-1.5">
              <Label htmlFor="currentPassword">Current password</Label>
              <PasswordInput
                id="currentPassword"
                value={currentPassword}
                onChange={setCurrentPassword}
                placeholder="Enter your current password"
                autoComplete="current-password"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="newPassword">New password</Label>
                <PasswordInput
                  id="newPassword"
                  value={newPassword}
                  onChange={setNewPassword}
                  placeholder="Create a new password"
                  autoComplete="new-password"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="confirmPassword">Confirm new password</Label>
                <PasswordInput
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={setConfirmPassword}
                  placeholder="Repeat the new password"
                  autoComplete="new-password"
                  invalid={confirmPassword.length > 0 && !matches}
                />
                {confirmPassword.length > 0 && !matches && (
                  <p className="text-xs text-destructive">
                    The passwords do not match.
                  </p>
                )}
              </div>
            </div>

            <PasswordStrength password={newPassword} />

            <div className="flex flex-col gap-2 pt-1 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-muted-foreground">
                You stay signed in on this device after changing it.
              </p>
              <Button
                type="submit"
                size="sm"
                disabled={!canSubmit || changePassword.isPending}
              >
                {changePassword.isPending && (
                  <Loader2 className="size-4 animate-spin" />
                )}
                Update password
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              A reset link lets you set a password for this account. Your Google
              sign-in keeps working as well.
            </p>
            <Button
              type="button"
              size="sm"
              onClick={() => sendResetLink.mutate()}
              disabled={!email || sendResetLink.isPending}
            >
              {sendResetLink.isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <MailCheck className="size-4" />
              )}
              Email me a reset link
            </Button>
          </div>
        )}
      </SettingsSection>

      <SettingsSection
        icon={Lock}
        title="Forgot your password?"
        description="Send a single-use reset link to the email address on this account."
        footer={
          <p className="text-xs text-muted-foreground">
            The link expires one hour after it is sent. Check your spam folder if
            it does not arrive within a few minutes.
          </p>
        }
      >
        <div className="space-y-3">
          {resetSent ? (
            <div className="flex items-start gap-3 rounded-lg border border-primary/20 bg-primary/5 p-4">
              <MailCheck className="mt-0.5 size-5 shrink-0 text-primary" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">
                  Reset link sent
                </p>
                <p className="text-sm text-muted-foreground">
                  If an account exists for {email ?? "your address"}, a link is on
                  its way. Open it to choose a new password.
                </p>
                <Button
                  type="button"
                  variant="link"
                  size="sm"
                  className="h-auto px-0"
                  onClick={() => setResetSent(false)}
                >
                  Send another link
                </Button>
              </div>
            </div>
          ) : (
            <>
              <p className="text-sm text-muted-foreground">
                We will email a reset link to{" "}
                <span className="font-medium text-foreground">
                  {email ?? "your registered address"}
                </span>
                . You can then choose a new password without signing out here.
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => sendResetLink.mutate()}
                disabled={!email || sendResetLink.isPending}
              >
                {sendResetLink.isPending ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <MailCheck className="size-4" />
                )}
                Send reset link
              </Button>
            </>
          )}
        </div>
      </SettingsSection>

      <SettingsSection
        icon={ShieldCheck}
        title="Sign-in details"
        description="Where and when this account was last used."
      >
        <dl className="grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-medium text-muted-foreground">
              Last sign-in
            </dt>
            <dd className="mt-1 flex items-center gap-1.5 text-sm font-medium text-foreground">
              <Clock className="size-4 text-muted-foreground" />
              {formatDateTime(lastLoginAt)}
            </dd>
          </div>

          <div>
            <dt className="text-xs font-medium text-muted-foreground">
              Sign-in method
            </dt>
            <dd className="mt-1 text-sm font-medium text-foreground">
              {hasPassword ? "Email and password" : "Google"}
            </dd>
          </div>

          <div>
            <dt className="text-xs font-medium text-muted-foreground">
              Email status
            </dt>
            <dd className="mt-1 text-sm font-medium text-foreground">
              {emailVerified
                ? `Verified on ${new Date(emailVerified).toLocaleDateString(
                    "en-IN",
                    { day: "numeric", month: "short", year: "numeric" }
                  )}`
                : "Not verified"}
            </dd>
          </div>
        </dl>
      </SettingsSection>
    </div>
  );
}

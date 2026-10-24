"use client";

import { useState } from "react";
import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Bell,
  BellRing,
  Loader2,
  Mail,
  Megaphone,
  Save,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { SettingsSection } from "@/components/student/settings/settings-section";
import { ApiError, apiSend } from "@/lib/api-client";
import type { NotificationPreferences } from "@/lib/api-types";
import { queryKeys, useApiQuery } from "@/hooks/use-data";
import { cn } from "@/lib/utils";

type PreferenceKey =
  | "emailNotifications"
  | "applicationUpdates"
  | "announcementNotifications";

const PREFERENCE_ROWS: {
  key: PreferenceKey;
  title: string;
  description: string;
  icon: typeof Mail;
}[] = [
  {
    key: "emailNotifications",
    title: "Email notifications",
    description:
      "Send an email to your registered address whenever something changes on your account.",
    icon: Mail,
  },
  {
    key: "applicationUpdates",
    title: "Application updates",
    description:
      "Approvals, rejections, admission activation and room allotment.",
    icon: FileText,
  },
  {
    key: "announcementNotifications",
    title: "Announcements",
    description:
      "Hostel notices, fee reminders and public announcements from the office.",
    icon: Megaphone,
  },
];

function PreferencesForm({
  preferences,
}: {
  preferences: NotificationPreferences;
}) {
  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    emailNotifications: preferences.emailNotifications,
    applicationUpdates: preferences.applicationUpdates,
    announcementNotifications: preferences.announcementNotifications,
  });

  const dirty =
    form.emailNotifications !== preferences.emailNotifications ||
    form.applicationUpdates !== preferences.applicationUpdates ||
    form.announcementNotifications !== preferences.announcementNotifications;

  const save = useMutation({
    mutationFn: () => apiSend("/api/user/preferences", "PATCH", form),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.student.preferences,
      });
      toast.success("Notification preferences saved");
    },
    onError: (error) => {
      toast.error(
        error instanceof ApiError
          ? error.message
          : "Could not save your preferences. Please try again."
      );
    },
  });

  return (
    <div className="space-y-5">
      <SettingsSection
        icon={BellRing}
        title="Email preferences"
        description="Choose which updates reach your inbox. In-app notifications are always available."
      >
        <ul className="divide-y divide-border">
          {PREFERENCE_ROWS.map((row) => {
            const Icon = row.icon;

            return (
              <li
                key={row.key}
                className="flex items-start justify-between gap-4 py-4 first:pt-0 last:pb-0"
              >
                <div className="flex min-w-0 items-start gap-3">
                  <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                    <Icon className="size-4" />
                  </span>
                  <div className="min-w-0">
                    <Label
                      htmlFor={row.key}
                      className="text-sm font-medium text-foreground"
                    >
                      {row.title}
                    </Label>
                    <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                      {row.description}
                    </p>
                  </div>
                </div>

                <Switch
                  id={row.key}
                  checked={form[row.key]}
                  onCheckedChange={(checked) =>
                    setForm((current) => ({ ...current, [row.key]: checked }))
                  }
                  aria-label={row.title}
                />
              </li>
            );
          })}
        </ul>

        <div className="mt-4 flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">
            {dirty ? "You have unsaved changes." : "Preferences are up to date."}
          </p>
          <div className="flex gap-2">
            {dirty && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  setForm({
                    emailNotifications: preferences.emailNotifications,
                    applicationUpdates: preferences.applicationUpdates,
                    announcementNotifications:
                      preferences.announcementNotifications,
                  })
                }
                disabled={save.isPending}
              >
                Discard
              </Button>
            )}
            <Button
              type="button"
              size="sm"
              onClick={() => save.mutate()}
              disabled={!dirty || save.isPending}
            >
              {save.isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Save className="size-4" />
              )}
              Save preferences
            </Button>
          </div>
        </div>
      </SettingsSection>

      <SettingsSection
        icon={Bell}
        title="In-app notifications"
        description="Everything sent to your account is kept in the notification centre."
      >
        <Button asChild variant="outline" size="sm">
          <Link href="/student/notifications">
            Open notification centre
          </Link>
        </Button>
      </SettingsSection>
    </div>
  );
}

/** Notification preference switches, loaded from the shared query cache. */
export function NotificationsTab() {
  const preferencesQuery = useApiQuery<NotificationPreferences>(
    queryKeys.student.preferences,
    "/api/user/preferences"
  );

  if (preferencesQuery.isPending) {
    return (
      <div className={cn("space-y-5")}>
        <Skeleton className="h-72 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (!preferencesQuery.data) {
    return (
      <SettingsSection
        icon={Bell}
        title="Email preferences"
        description="We could not load your preferences."
      >
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => preferencesQuery.refetch()}
        >
          Try again
        </Button>
      </SettingsSection>
    );
  }

  return (
    <PreferencesForm
      key={preferencesQuery.data.updatedAt}
      preferences={preferencesQuery.data}
    />
  );
}

"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Bell, ShieldCheck, UserCog, UserRound } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileTab } from "@/components/student/settings/profile-tab";
import { SecurityTab } from "@/components/student/settings/security-tab";
import { NotificationsTab } from "@/components/student/settings/notifications-tab";
import { AccountTab } from "@/components/student/settings/account-tab";
import { queryKeys, useApiQuery } from "@/hooks/use-data";
import type { ProfileRecord } from "@/lib/api-types";

const TABS = [
  { value: "profile", label: "Profile", icon: UserRound },
  { value: "security", label: "Security", icon: ShieldCheck },
  { value: "notifications", label: "Notifications", icon: Bell },
  { value: "account", label: "Account", icon: UserCog },
] as const;

type TabValue = (typeof TABS)[number]["value"];

function isTabValue(value: string | null): value is TabValue {
  return TABS.some((tab) => tab.value === value);
}

function SettingsSkeleton() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:py-8">
      <Skeleton className="h-10 w-48" />
      <div className="grid gap-6 lg:grid-cols-[14rem_1fr]">
        <Skeleton className="h-48 w-full" />
        <div className="space-y-5">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    </div>
  );
}

function SettingsContent() {
  const { status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  const requestedTab = searchParams.get("tab");
  const [tab, setTab] = useState<TabValue>(
    isTabValue(requestedTab) ? requestedTab : "profile"
  );

  const isStudent = status === "authenticated";

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status, router]);

  const profileQuery = useApiQuery<{ user: ProfileRecord }>(
    queryKeys.student.profile,
    "/api/user/profile",
    isStudent
  );

  if (status === "loading" || (isStudent && profileQuery.isPending)) {
    return <SettingsSkeleton />;
  }

  const profile = profileQuery.data?.user;

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:py-8">
      <PageHeader
        title="Settings"
        description="Manage your profile, sign-in security, notification preferences and account."
      />

      {!profile ? (
        <Card className="mt-6 border-dashed">
          <CardContent className="flex flex-col items-center gap-3 py-14 text-center">
            <p className="text-base font-semibold text-foreground">
              We could not load your profile
            </p>
            <p className="max-w-sm text-sm text-muted-foreground">
              Check your connection and try again. Nothing has been changed.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => profileQuery.refetch()}
            >
              Try again
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Tabs
          value={tab}
          onValueChange={(value) => setTab(value as TabValue)}
          orientation="vertical"
          className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-start"
        >
          <TabsList className="h-auto w-full justify-start gap-1 overflow-x-auto rounded-xl bg-card p-1.5 shadow-xs lg:sticky lg:top-6 lg:w-56 lg:flex-col lg:items-stretch lg:overflow-visible">
            {TABS.map((item) => (
              <TabsTrigger
                key={item.value}
                value={item.value}
                className="h-10 flex-1 justify-start gap-2.5 rounded-lg px-3 text-sm font-medium text-muted-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground lg:h-11 lg:flex-none"
              >
                <item.icon className="size-4 shrink-0" />
                {item.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="min-w-0 flex-1">
            <TabsContent value="profile" className="mt-0">
              <ProfileTab key={profile.updatedAt} profile={profile} />
            </TabsContent>

            <TabsContent value="security" className="mt-0">
              <SecurityTab
                hasPassword={profile.hasPassword}
                email={profile.email}
                emailVerified={profile.emailVerified}
                lastLoginAt={profile.lastLoginAt}
              />
            </TabsContent>

            <TabsContent value="notifications" className="mt-0">
              <NotificationsTab />
            </TabsContent>

            <TabsContent value="account" className="mt-0">
              <AccountTab profile={profile} />
            </TabsContent>
          </div>
        </Tabs>
      )}
    </div>
  );
}

/**
 * The settings screen.
 *
 * `useSearchParams` needs a Suspense boundary so the route can still be
 * prerendered; the tabs themselves are client state, and `?tab=` only picks the
 * one that is open first.
 */
export default function StudentSettingsPage() {
  return (
    <Suspense fallback={<SettingsSkeleton />}>
      <SettingsContent />
    </Suspense>
  );
}

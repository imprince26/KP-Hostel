"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  CheckCircle2,
  Clock,
  FileText,
  Files,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatCard, StatCardGrid } from "@/components/ui/stat-card";
import { Skeleton } from "@/components/ui/skeleton";
import { NotificationDetailDialog } from "@/components/notifications/notification-detail-dialog";
import { RoomCard, type ActiveStay } from "@/components/student/dashboard/room-card";
import { FeesCard } from "@/components/student/dashboard/fees-card";
import { ProfileCompletionCard } from "@/components/student/dashboard/profile-completion-card";
import { NotificationsPanel } from "@/components/student/dashboard/notifications-panel";
import { AnnouncementsPanel } from "@/components/student/dashboard/announcements-panel";
import { apiSend } from "@/lib/api-client";
import type {
  Announcement,
  NotificationRecord,
  StudentApplication,
  StudentPaymentsResponse,
} from "@/lib/api-types";
import { queryKeys, useApiQuery } from "@/hooks/use-data";

const NOTIFICATION_PREVIEW = 4;

function greetingForHour(hour: number) {
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function DashboardSkeleton() {
  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:py-8">
      <Skeleton className="h-8 w-64" />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-24 w-full" />
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <Skeleton className="h-72 w-full lg:col-span-2" />
        <Skeleton className="h-72 w-full" />
      </div>
    </div>
  );
}

export default function StudentDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [selectedNotification, setSelectedNotification] =
    useState<NotificationRecord | null>(null);

  const isStudent = status === "authenticated";

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status, router]);

  const applicationsQuery = useApiQuery<{ applications: StudentApplication[] }>(
    queryKeys.student.applications,
    "/api/admission/apply",
    isStudent
  );

  const notificationsQuery = useApiQuery<{ notifications: NotificationRecord[] }>(
    queryKeys.notifications,
    "/api/notifications",
    isStudent
  );

  const paymentsQuery = useApiQuery<StudentPaymentsResponse>(
    queryKeys.student.payments,
    "/api/user/payments",
    isStudent
  );

  const announcementsQuery = useApiQuery<{ announcements: Announcement[] }>(
    queryKeys.public.announcements,
    "/api/announcements/public",
    isStudent
  );

  const applications = applicationsQuery.data?.applications;

  const stats = useMemo(() => {
    if (!applications) return null;

    const countByStatus = (value: StudentApplication["status"]) =>
      applications.filter((application) => application.status === value).length;

    return {
      total: applications.length,
      inProgress: countByStatus("submitted") + countByStatus("under_review"),
      approved: countByStatus("approved") + countByStatus("admitted") + countByStatus("active"),
      rejected: countByStatus("rejected"),
    };
  }, [applications]);

  const activeStay = useMemo<ActiveStay | null>(() => {
    const active = applications?.find(
      (application) =>
        (application.status === "active" || application.status === "admitted") &&
        application.assignedBlock &&
        application.roomNumber
    );

    if (!active || !active.assignedBlock || !active.roomNumber) return null;

    return {
      applicationId: active.id,
      block: active.assignedBlock,
      roomNumber: active.roomNumber,
      admissionStart: active.admissionStartDate,
      admissionEnd: active.admissionEndDate,
    };
  }, [applications]);

  const notifications = useMemo(
    () =>
      (notificationsQuery.data?.notifications ?? []).slice(
        0,
        NOTIFICATION_PREVIEW
      ),
    [notificationsQuery.data]
  );

  const unreadCount = (notificationsQuery.data?.notifications ?? []).filter(
    (notification) => !notification.read
  ).length;

  const markAsRead = useMutation({
    mutationFn: (notificationId: string) =>
      apiSend("/api/notifications", "PATCH", { notificationId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications });
    },
  });

  const handleNotificationClick = (notification: NotificationRecord) => {
    setSelectedNotification(notification);
    if (!notification.read) {
      markAsRead.mutate(notification.id);
    }
  };

  if (status === "loading" || (isStudent && applicationsQuery.isPending)) {
    return <DashboardSkeleton />;
  }

  const firstName = session?.user?.name?.split(" ")[0];
  const today = new Date();

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:py-8">
      {/* Greeting */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {today.toLocaleDateString("en-IN", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {greetingForHour(today.getHours())}
            {firstName ? `, ${firstName}` : ""}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Here is the current state of your hostel admission.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button asChild>
            <Link href="/en/admission">
              <FileText className="size-4" />
              Apply for admission
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/student/applications">
              <Files className="size-4" />
              My applications
            </Link>
          </Button>
        </div>
      </div>

      {session?.user && <ProfileCompletionCard user={session.user} />}

      <StatCardGrid columns={4}>
        <StatCard
          label="Applications"
          value={stats?.total ?? 0}
          icon={Files}
          hint="All time"
        />
        <StatCard
          label="In progress"
          value={stats?.inProgress ?? 0}
          icon={Clock}
          hint="Submitted or under review"
        />
        <StatCard
          label="Approved"
          value={stats?.approved ?? 0}
          icon={CheckCircle2}
          hint="Approved or active"
        />
        <StatCard
          label="Not approved"
          value={stats?.rejected ?? 0}
          icon={XCircle}
          hint="Read the review comments"
        />
      </StatCardGrid>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <RoomCard stay={activeStay} />

          <NotificationsPanel
            notifications={notifications}
            unreadCount={unreadCount}
            isLoading={notificationsQuery.isPending}
            onSelect={handleNotificationClick}
          />
        </div>

        <div className="space-y-6">
          <FeesCard
            payments={paymentsQuery.data?.payments ?? []}
            totalPaid={paymentsQuery.data?.totalPaid ?? 0}
            pendingPayments={paymentsQuery.data?.pendingPayments ?? 0}
            isLoading={paymentsQuery.isPending}
          />

          <AnnouncementsPanel
            announcements={announcementsQuery.data?.announcements ?? []}
            isLoading={announcementsQuery.isPending}
          />
        </div>
      </div>

      <NotificationDetailDialog
        notification={selectedNotification}
        onClose={() => setSelectedNotification(null)}
      />
    </div>
  );
}

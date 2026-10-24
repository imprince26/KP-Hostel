"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Bell,
  BellOff,
  CheckCheck,
  Mail,
  MailOpen,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { NotificationDetailDialog } from "@/components/notifications/notification-detail-dialog";
import { NotificationListItem } from "@/components/notifications/notification-list-item";
import { apiSend } from "@/lib/api-client";
import type { NotificationRecord } from "@/lib/api-types";
import { queryKeys, useApiQuery } from "@/hooks/use-data";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { cn } from "@/lib/utils";

type ReadFilter = "all" | "unread" | "read";

const FILTERS: { key: ReadFilter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "unread", label: "Unread" },
  { key: "read", label: "Read" },
];

export default function StudentNotificationsPage() {
  const { status } = useSession();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [filter, setFilter] = useState<ReadFilter>("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<NotificationRecord | null>(null);

  const isStudent = status === "authenticated";

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status, router]);

  const notificationsQuery = useApiQuery<{
    notifications: NotificationRecord[];
    unreadCount: number;
  }>(queryKeys.notifications, "/api/notifications", isStudent);

  const notifications = useMemo(
    () => notificationsQuery.data?.notifications ?? [],
    [notificationsQuery.data]
  );
  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;
  const debouncedSearch = useDebouncedValue(search.trim().toLowerCase());

  const counts = useMemo(
    () => ({
      all: notifications.length,
      unread: unreadCount,
      read: notifications.length - unreadCount,
    }),
    [notifications.length, unreadCount]
  );

  const visible = useMemo(() => {
    const byRead = notifications.filter((notification) => {
      if (filter === "unread") return !notification.read;
      if (filter === "read") return notification.read;
      return true;
    });

    if (!debouncedSearch) return byRead;

    return byRead.filter((notification) =>
      `${notification.title} ${notification.message}`
        .toLowerCase()
        .includes(debouncedSearch)
    );
  }, [notifications, filter, debouncedSearch]);

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: queryKeys.notifications });

  const setRead = useMutation({
    mutationFn: ({
      notificationId,
      read,
    }: {
      notificationId: string;
      read: boolean;
    }) => apiSend("/api/notifications", "PATCH", { notificationId, read }),
    onSuccess: invalidate,
  });

  const markAllRead = useMutation({
    mutationFn: () =>
      apiSend("/api/notifications", "PATCH", { markAllRead: true }),
    onSuccess: invalidate,
  });

  const openNotification = (notification: NotificationRecord) => {
    setSelected(notification);
    if (!notification.read) {
      setRead.mutate({ notificationId: notification.id, read: true });
    }
  };

  if (status === "loading" || (isStudent && notificationsQuery.isPending)) {
    return (
      <div className="mx-auto max-w-5xl space-y-6 px-4 py-6 sm:py-8">
        <Skeleton className="h-10 w-56" />
        <Skeleton className="h-12 w-full" />
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-24 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-6 sm:py-8">
      <PageHeader
        title="Notifications"
        description="Approval updates, payment reminders and notices from the hostel office."
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={() => markAllRead.mutate()}
            disabled={unreadCount === 0 || markAllRead.isPending}
          >
            <CheckCheck className="size-4" />
            <span className="hidden sm:inline">Mark all read</span>
          </Button>
        }
      />

      {/* Summary strip */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Total", value: counts.all },
          { label: "Unread", value: counts.unread },
          { label: "Read", value: counts.read },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-lg border border-border bg-card px-4 py-3"
          >
            <p className="text-xs font-medium text-muted-foreground">
              {item.label}
            </p>
            <p className="text-xl font-bold tabular-nums text-foreground">
              {item.value}
            </p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div
          className="flex gap-1 overflow-x-auto rounded-lg bg-muted p-1"
          role="tablist"
          aria-label="Filter notifications"
        >
          {FILTERS.map((item) => {
            const active = filter === item.key;

            return (
              <button
                key={item.key}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setFilter(item.key)}
                className={cn(
                  "inline-flex shrink-0 items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-background text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {item.label}
                <span
                  className={cn(
                    "rounded-full px-1.5 text-[11px] font-semibold",
                    active
                      ? "bg-primary/10 text-primary"
                      : "bg-background/60 text-muted-foreground"
                  )}
                >
                  {counts[item.key]}
                </span>
              </button>
            );
          })}
        </div>

        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search notifications"
            aria-label="Search notifications"
            className="pl-9"
          />
        </div>
      </div>

      {/* List */}
      <Card className="overflow-hidden border-border/70 bg-card shadow-xs">
        <CardContent className="p-0">
          {notifications.length === 0 ? (
            <EmptyState
              icon={BellOff}
              title="No notifications yet"
              description="When the hostel office reviews your application or records a payment, the update appears here."
            />
          ) : visible.length === 0 ? (
            <EmptyState
              icon={Search}
              title="Nothing matches that filter"
              description="Try another filter or clear the search to see every notification."
              action={
                <Button
                  variant="outline"
                  onClick={() => {
                    setFilter("all");
                    setSearch("");
                  }}
                >
                  Clear filters
                </Button>
              }
            />
          ) : (
            <ul className="divide-y divide-border">
              {visible.map((notification) => (
                <li key={notification.id}>
                  <NotificationListItem
                    notification={notification}
                    onSelect={openNotification}
                    actions={
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={
                          notification.read
                            ? "Mark as unread"
                            : "Mark as read"
                        }
                        title={
                          notification.read ? "Mark as unread" : "Mark as read"
                        }
                        disabled={setRead.isPending}
                        onClick={() =>
                          setRead.mutate({
                            notificationId: notification.id,
                            read: !notification.read,
                          })
                        }
                        className="size-8 text-muted-foreground hover:text-foreground"
                      >
                        {notification.read ? (
                          <Mail className="size-4" />
                        ) : (
                          <MailOpen className="size-4" />
                        )}
                      </Button>
                    }
                  />
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {visible.length > 0 && (
        <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
          <Bell className="size-3.5" />
          Showing {visible.length} of {notifications.length} notification
          {notifications.length === 1 ? "" : "s"}
        </p>
      )}

      <NotificationDetailDialog
        notification={selected}
        onClose={() => setSelected(null)}
      />
    </div>
  );
}

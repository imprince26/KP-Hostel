"use client";

import Link from "next/link";
import { ArrowRight, Bell, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { NotificationListItem } from "@/components/notifications/notification-list-item";
import type { NotificationRecord } from "@/lib/api-types";

/**
 * The newest notifications on the dashboard.
 *
 * The full history lives on /student/notifications; this panel only shows the
 * first few so the dashboard stays scannable.
 */
export function NotificationsPanel({
  notifications,
  unreadCount,
  isLoading,
  onSelect,
}: {
  notifications: NotificationRecord[];
  unreadCount: number;
  isLoading: boolean;
  onSelect: (notification: NotificationRecord) => void;
}) {
  return (
    <Card className="border-0 bg-card shadow-xs">
      <CardHeader className="flex flex-row items-center justify-between gap-3 border-b border-border pb-4">
        <CardTitle className="flex items-center gap-2 text-base">
          <Bell className="size-4 text-primary" />
          Notifications
          {unreadCount > 0 && (
            <span className="rounded-full bg-primary px-2 py-0.5 text-[11px] font-semibold text-primary-foreground">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </CardTitle>

        <Button asChild variant="ghost" size="sm" className="text-primary">
          <Link href="/student/notifications">
            View all
            <ArrowRight className="size-3.5" />
          </Link>
        </Button>
      </CardHeader>

      <CardContent className="p-0">
        {isLoading ? (
          <div className="flex items-center justify-center gap-2 py-12 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" />
            Loading notifications
          </div>
        ) : notifications.length === 0 ? (
          <EmptyState
            icon={Bell}
            title="No notifications yet"
            description="Approval updates, payment reminders and hostel notices will appear here."
          />
        ) : (
          <div className="divide-y divide-border">
            {notifications.map((notification) => (
              <NotificationListItem
                key={notification.id}
                notification={notification}
                onSelect={onSelect}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

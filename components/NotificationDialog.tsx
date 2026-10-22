"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Bell, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DialogScrollArea, ScrollableDialog } from "@/components/ui/scrollable-dialog";
import { apiSend } from "@/lib/api-client";
import type { NotificationRecord } from "@/lib/api-types";
import { queryKeys, useApiQuery } from "@/hooks/use-data";
import { NotificationDetailDialog } from "@/components/notifications/notification-detail-dialog";
import { NotificationListItem } from "@/components/notifications/notification-list-item";

/**
 * Bell button with the notification centre.
 *
 * The list is served from the shared query cache, so opening the dialog after
 * a mutation elsewhere shows fresh data without an extra round trip, and the
 * body scrolls when there are more notifications than fit on screen.
 */
export function NotificationDialog() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<NotificationRecord | null>(null);

  const isSignedIn = session?.user?.id;

  const notificationsQuery = useApiQuery<{ notifications: NotificationRecord[] }>(
    queryKeys.notifications,
    "/api/notifications",
    Boolean(isSignedIn)
  );

  const notifications = notificationsQuery.data?.notifications ?? [];
  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = useMutation({
    mutationFn: (notificationId: string) =>
      apiSend("/api/notifications", "PATCH", { notificationId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications });
    },
  });

  const markAllAsRead = useMutation({
    mutationFn: async (notificationIds: string[]) => {
      await Promise.all(
        notificationIds.map((id) => apiSend("/api/notifications", "PATCH", { notificationId: id }))
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications });
    },
  });

  const handleSelectNotification = (notification: NotificationRecord) => {
    setSelectedNotification(notification);
    if (!notification.read) {
      markAsRead.mutate(notification.id);
    }
  };

  if (!session) return null;

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(true)}
        className="relative hover:bg-muted"
        aria-label="Open notifications"
      >
        <Bell className="size-5" />
        {unreadCount > 0 && (
          <Badge
            variant="destructive"
            className="absolute -top-1 -right-1 size-5 flex items-center justify-center p-0 text-xs font-semibold"
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </Badge>
        )}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <ScrollableDialog className="max-w-2xl">
          <DialogHeader className="px-6 py-4 border-b border-border bg-muted/40 shrink-0">
            <div className="flex items-center justify-between">
              <DialogTitle className="flex items-center gap-2 text-xl font-bold">
                <Bell className="size-5 text-primary" />
                Notifications
                {unreadCount > 0 && (
                  <Badge
                    variant="secondary"
                    className="bg-primary/10 text-primary border-primary/20"
                  >
                    {unreadCount} unread
                  </Badge>
                )}
              </DialogTitle>
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    markAllAsRead.mutate(
                      notifications.filter((n) => !n.read).map((n) => n.id)
                    )
                  }
                  className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
                >
                  <CheckCheck className="size-3.5" />
                  Mark all as read
                </Button>
              )}
            </div>
            <DialogDescription className="text-xs text-muted-foreground">
              Select any notification to view full details
            </DialogDescription>
          </DialogHeader>

          <DialogScrollArea>
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
                <div className="size-16 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Bell className="size-8 text-muted-foreground/60" />
                </div>
                <h3 className="text-base font-semibold text-foreground mb-1">
                  No notifications
                </h3>
                <p className="text-xs text-muted-foreground">
                  Updates, notices, and portal announcements will appear here.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {notifications.map((notification) => (
                  <NotificationListItem
                    key={notification.id}
                    notification={notification}
                    onSelect={handleSelectNotification}
                  />
                ))}
              </div>
            )}
          </DialogScrollArea>

          {notifications.length > 0 && (
            <div className="px-6 py-3 border-t border-border bg-muted/20 text-xs text-muted-foreground text-center shrink-0">
              Total {notifications.length} notification
              {notifications.length !== 1 ? "s" : ""}
            </div>
          )}
        </ScrollableDialog>
      </Dialog>

      <NotificationDetailDialog
        notification={selectedNotification}
        onClose={() => setSelectedNotification(null)}
      />
    </>
  );
}

export default NotificationDialog;

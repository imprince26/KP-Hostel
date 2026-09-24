"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { Bell, CheckCheck, ExternalLink, Calendar, Info, CheckCircle2, AlertTriangle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { createExcerpt, containsHtml } from "@/lib/announcement-utils";
import Link from "next/link";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  actionUrl?: string | null;
  createdAt: string;
}

export default function NotificationDialog() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch("/api/notifications");
      const data = await res.json();
      setNotifications(data.notifications || []);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  }, []);

  useEffect(() => {
    if (session) {
      fetchNotifications();
    }
  }, [session, fetchNotifications]);

  const markAsRead = async (notificationId: string) => {
    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationId }),
      });

      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
      );
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  };

  const handleSelectNotification = (notification: Notification) => {
    setSelectedNotification(notification);
    if (!notification.read) {
      markAsRead(notification.id);
    }
  };

  const markAllAsRead = async () => {
    try {
      const unreadIds = notifications.filter((n) => !n.read).map((n) => n.id);

      await Promise.all(
        unreadIds.map((id) =>
          fetch("/api/notifications", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ notificationId: id }),
          })
        )
      );

      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "success":
      case "application_approved":
      case "admission_activated":
        return <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />;
      case "warning":
      case "payment_due":
        return <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />;
      case "error":
      case "application_rejected":
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      default:
        return <Info className="h-4 w-4 text-primary" />;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "success":
      case "application_approved":
      case "admission_activated":
        return (
          <Badge variant="outline" className="text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200">
            Approved
          </Badge>
        );
      case "warning":
      case "payment_due":
        return (
          <Badge variant="outline" className="text-amber-700 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200">
            Important
          </Badge>
        );
      case "error":
      case "application_rejected":
        return (
          <Badge variant="outline" className="text-destructive bg-destructive/10 border-destructive/20">
            Action Needed
          </Badge>
        );
      case "announcement":
        return (
          <Badge variant="outline" className="text-primary bg-primary/10 border-primary/20">
            Announcement
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-foreground bg-muted border-border">
            Notification
          </Badge>
        );
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
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <Badge
            variant="destructive"
            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs font-semibold"
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </Badge>
        )}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] p-0 flex flex-col overflow-hidden">
          <DialogHeader className="px-6 py-4 border-b border-border bg-muted/40 shrink-0">
            <div className="flex items-center justify-between">
              <DialogTitle className="flex items-center gap-2 text-xl font-bold">
                <Bell className="h-5 w-5 text-primary" />
                Notifications
                {unreadCount > 0 && (
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                    {unreadCount} unread
                  </Badge>
                )}
              </DialogTitle>
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAllAsRead}
                  className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
                >
                  <CheckCheck className="h-3.5 w-3.5" />
                  Mark all as read
                </Button>
              )}
            </div>
            <DialogDescription className="text-xs text-muted-foreground">
              Select any notification to view full details
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="flex-1 max-h-[calc(85vh-8rem)]">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Bell className="h-8 w-8 text-muted-foreground/60" />
                </div>
                <h3 className="text-base font-semibold text-foreground mb-1">No notifications</h3>
                <p className="text-xs text-muted-foreground">
                  Updates, notices, and portal announcements will appear here.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {notifications.map((notification) => {
                  const plainSnippet = createExcerpt(notification.message, 140);
                  return (
                    <div
                      key={notification.id}
                      onClick={() => handleSelectNotification(notification)}
                      className={cn(
                        "p-4 sm:p-5 hover:bg-muted/40 cursor-pointer transition-colors text-left group",
                        !notification.read && "bg-primary/3 border-l-4 border-l-primary"
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-1 shrink-0">{getTypeIcon(notification.type)}</div>
                        <div className="flex-1 min-w-0 space-y-1.5">
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              {getTypeBadge(notification.type)}
                              {!notification.read && (
                                <span className="inline-block w-2 h-2 rounded-full bg-primary" />
                              )}
                            </div>
                            <span className="text-xs text-muted-foreground whitespace-nowrap">
                              {new Date(notification.createdAt).toLocaleDateString("en-IN", {
                                month: "short",
                                day: "numeric",
                              })}
                            </span>
                          </div>
                          <h4 className="font-semibold text-foreground text-sm group-hover:text-primary transition-colors">
                            {notification.title}
                          </h4>
                          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                            {plainSnippet}
                          </p>
                          <div className="pt-1 flex items-center justify-between">
                            <span className="text-[11px] font-medium text-primary hover:underline flex items-center gap-1">
                              View full notification
                            </span>
                            <span className="text-[11px] text-muted-foreground">
                              {new Date(notification.createdAt).toLocaleTimeString("en-IN", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </ScrollArea>

          {notifications.length > 0 && (
            <div className="px-6 py-3 border-t border-border bg-muted/20 text-xs text-muted-foreground text-center shrink-0">
              Total {notifications.length} notification{notifications.length !== 1 ? "s" : ""}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Full Notification Detail Modal */}
      <Dialog
        open={!!selectedNotification}
        onOpenChange={(isOpen) => !isOpen && setSelectedNotification(null)}
      >
        <DialogContent className="max-w-xl max-h-[85vh] p-0 flex flex-col overflow-hidden">
          {selectedNotification && (
            <>
              <DialogHeader className="px-6 py-5 border-b border-border bg-muted/30 shrink-0">
                <div className="flex items-center gap-2 mb-2">
                  {getTypeBadge(selectedNotification.type)}
                  <span className="text-xs text-muted-foreground flex items-center gap-1 ml-auto">
                    <Calendar className="h-3.5 w-3.5" />
                    {new Date(selectedNotification.createdAt).toLocaleString("en-IN", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </span>
                </div>
                <DialogTitle className="text-lg font-bold text-foreground leading-snug">
                  {selectedNotification.title}
                </DialogTitle>
              </DialogHeader>

              <ScrollArea className="flex-1 p-6 max-h-[calc(85vh-10rem)]">
                {containsHtml(selectedNotification.message) ? (
                  <div
                    className="prose prose-sm dark:prose-invert max-w-none text-foreground leading-relaxed wrap-break-word"
                    dangerouslySetInnerHTML={{ __html: selectedNotification.message }}
                  />
                ) : (
                  <p className="text-sm text-foreground/90 whitespace-pre-line leading-relaxed">
                    {selectedNotification.message}
                  </p>
                )}
              </ScrollArea>

              <DialogFooter className="px-6 py-3 border-t border-border bg-muted/20 flex flex-row items-center justify-between sm:justify-between shrink-0">
                {selectedNotification.actionUrl ? (
                  <Button asChild size="sm" className="gap-1.5">
                    <Link
                      href={selectedNotification.actionUrl}
                      onClick={() => {
                        setSelectedNotification(null);
                        setOpen(false);
                      }}
                    >
                      <span>Take Action</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </Link>
                  </Button>
                ) : (
                  <div />
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedNotification(null)}
                >
                  Close
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

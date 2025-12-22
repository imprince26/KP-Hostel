"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { Bell, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  read: boolean;
  createdAt: string;
}

export default function NotificationDialog() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

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

  const markAllAsRead = async () => {
    try {
      const unreadIds = notifications.filter(n => !n.read).map(n => n.id);
      
      await Promise.all(
        unreadIds.map(id =>
          fetch("/api/notifications", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ notificationId: id }),
          })
        )
      );

      setNotifications((prev) =>
        prev.map((n) => ({ ...n, read: true }))
      );
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getTypeStyles = (type: string) => {
    switch (type) {
      case "success":
        return "bg-accent/10 text-accent-foreground border-accent/20";
      case "warning":
        return "bg-accent/10 text-accent-foreground border-accent/20";
      case "error":
        return "bg-destructive/10 text-destructive border-destructive/20";
      default:
        return "bg-primary/10 text-primary border-primary/20";
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
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <Badge 
            variant="destructive" 
            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </Badge>
        )}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] p-0">
          <DialogHeader className="px-6 py-4 border-b border-border bg-muted/30">
            <div className="flex items-center justify-between">
              <DialogTitle className="flex items-center gap-2 text-xl">
                <Bell className="h-5 w-5 text-primary" />
                Notifications
                {unreadCount > 0 && (
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                    {unreadCount} new
                  </Badge>
                )}
              </DialogTitle>
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAllAsRead}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  Mark all as read
                </Button>
              )}
            </div>
          </DialogHeader>

          <ScrollArea className="max-h-[calc(80vh-8rem)]">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
                <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Bell className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">No notifications yet</h3>
                <p className="text-sm text-muted-foreground">
                  When you receive notifications, they will appear here
                </p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() => markAsRead(notification.id)}
                    className={cn(
                      "p-6 hover:bg-muted/50 cursor-pointer transition-colors",
                      !notification.read && "bg-primary/5 border-l-4 border-l-primary"
                    )}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className={cn("text-xs font-semibold", getTypeStyles(notification.type))}
                          >
                            {notification.type.toUpperCase()}
                          </Badge>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                          )}
                        </div>
                        <h4 className="font-semibold text-foreground text-base">
                          {notification.title}
                        </h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(notification.createdAt).toLocaleString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>

          {notifications.length > 0 && (
            <div className="px-6 py-4 border-t border-border bg-muted/30">
              <p className="text-xs text-center text-muted-foreground">
                {notifications.length} total notification{notifications.length !== 1 ? 's' : ''}
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

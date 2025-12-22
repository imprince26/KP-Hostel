"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { FiBell } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  read: boolean;
  createdAt: string;
}

export default function NotificationDropdown() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);

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

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getTypeColor = (type: string) => {
    switch (type) {
      case "success":
        return "bg-accent text-accent-foreground border-accent";
      case "warning":
        return "bg-accent text-accent-foreground border-accent";
      case "error":
        return "bg-destructive text-destructive-foreground border-destructive";
      default:
        return "bg-accent text-accent-foreground border-accent";
    }
  };

  if (!session) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 text-muted-foreground hover:text-primary hover:bg-accent rounded-lg transition"
      >
        <FiBell size={24} />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-destructive text-destructive-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-0 mt-2 w-96 bg-background rounded-xl shadow-2xl border border-border z-50 max-h-[500px] overflow-hidden"
            >
              <div className="p-4 border-b border-border bg-gradient-to-r from-primary to-primary">
                <h3 className="text-lg font-semibold text-primary-foreground flex items-center gap-2">
                  <FiBell />
                  Notifications
                  {unreadCount > 0 && (
                    <span className="text-sm bg-background text-primary px-2 py-0.5 rounded-full">
                      {unreadCount} new
                    </span>
                  )}
                </h3>
              </div>

              <div className="overflow-y-auto max-h-[400px]">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">
                    <FiBell size={48} className="mx-auto mb-4 text-muted" />
                    <p>No notifications yet</p>
                  </div>
                ) : (
                  <div className="divide-y divide-border">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        onClick={() => markAsRead(notification.id)}
                        className={`p-4 hover:bg-muted cursor-pointer transition ${
                          !notification.read ? "bg-accent" : ""
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`px-2 py-1 rounded text-xs font-semibold ${getTypeColor(
                              notification.type
                            )}`}
                          >
                            {notification.type.toUpperCase()}
                          </div>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-primary rounded-full mt-1" />
                          )}
                        </div>
                        <h4 className="font-semibold text-foreground mt-2">
                          {notification.title}
                        </h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted mt-2">
                          {new Date(notification.createdAt).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

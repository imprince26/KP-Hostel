"use client";

import { cn } from "@/lib/utils";
import { createExcerpt } from "@/lib/announcement-utils";
import type { NotificationRecord } from "@/lib/api-types";
import { NotificationTypeBadge, NotificationTypeIcon } from "./notification-type";

/**
 * A single row in a notification list.
 *
 * Shared by the bell dialog and the student dashboard so the unread marker,
 * badge, excerpt and timestamp stay consistent between them.
 */
export function NotificationListItem({
  notification,
  onSelect,
  className,
}: {
  notification: NotificationRecord;
  onSelect?: (notification: NotificationRecord) => void;
  className?: string;
}) {
  const snippet = createExcerpt(notification.message, 140);

  return (
    <div
      onClick={() => onSelect?.(notification)}
      className={cn(
        "p-4 sm:p-5 hover:bg-muted/40 transition-colors text-left group cursor-pointer",
        !notification.read && "bg-primary/5 border-l-4 border-l-primary",
        className
      )}
    >
      <div className="flex items-start gap-3">
        <div className="mt-1 shrink-0">
          <NotificationTypeIcon type={notification.type} />
        </div>
        <div className="flex-1 min-w-0 space-y-1.5">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <NotificationTypeBadge type={notification.type} />
              {!notification.read && (
                <span className="inline-block size-2 rounded-full bg-primary" />
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
            {snippet}
          </p>
          <div className="pt-1 flex items-center justify-between">
            <span className="text-[11px] font-medium text-primary">
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
}

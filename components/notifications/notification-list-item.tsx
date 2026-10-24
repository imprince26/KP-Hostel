"use client";

import { cn } from "@/lib/utils";
import { createExcerpt } from "@/lib/announcement-utils";
import type { NotificationRecord } from "@/lib/api-types";
import { NotificationTypeBadge, NotificationTypeIcon } from "./notification-type";

/**
 * A single row in a notification list.
 *
 * Shared by the bell dialog, the dashboard and the notifications page so the
 * unread marker, badge, excerpt and timestamp stay consistent. The row is a
 * real button so it can be opened with the keyboard, and optional trailing
 * actions sit beside it rather than inside it.
 */
export function NotificationListItem({
  notification,
  onSelect,
  actions,
  className,
}: {
  notification: NotificationRecord;
  onSelect?: (notification: NotificationRecord) => void;
  actions?: React.ReactNode;
  className?: string;
}) {
  const snippet = createExcerpt(notification.message, 140);
  const createdAt = new Date(notification.createdAt);

  return (
    <div
      className={cn(
        "group flex items-start transition-colors",
        !notification.read && "bg-primary/5",
        className
      )}
    >
      <button
        type="button"
        onClick={() => onSelect?.(notification)}
        aria-label={`${notification.title}${notification.read ? "" : " (unread)"}`}
        className={cn(
          "flex min-w-0 flex-1 items-start gap-3 p-4 text-left transition-colors hover:bg-muted/40 focus-visible:bg-muted/40 focus-visible:outline-hidden sm:p-5",
          !notification.read && "border-l-4 border-l-primary"
        )}
      >
        <span className="mt-0.5 shrink-0">
          <NotificationTypeIcon type={notification.type} />
        </span>

        <span className="min-w-0 flex-1 space-y-1.5">
          <span className="flex items-center justify-between gap-2">
            <span className="flex flex-wrap items-center gap-2">
              <NotificationTypeBadge type={notification.type} />
              {!notification.read && (
                <span
                  className="inline-block size-2 rounded-full bg-primary"
                  aria-hidden
                />
              )}
            </span>
            <span className="shrink-0 whitespace-nowrap text-xs text-muted-foreground">
              {createdAt.toLocaleDateString("en-IN", {
                month: "short",
                day: "numeric",
              })}
            </span>
          </span>

          <span className="block text-sm font-semibold text-foreground transition-colors group-hover:text-primary">
            {notification.title}
          </span>

          <span className="block text-xs leading-relaxed text-muted-foreground line-clamp-2">
            {snippet}
          </span>

          <span className="flex items-center justify-between pt-1">
            <span className="text-[11px] font-medium text-primary">
              View full notification
            </span>
            <span className="text-[11px] text-muted-foreground">
              {createdAt.toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </span>
        </span>
      </button>

      {actions && (
        <div className="flex shrink-0 items-center gap-1 p-2">{actions}</div>
      )}
    </div>
  );
}

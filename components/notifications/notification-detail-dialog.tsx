"use client";

import Link from "next/link";
import { Calendar, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DialogScrollArea, ScrollableDialog } from "@/components/ui/scrollable-dialog";
import { containsHtml } from "@/lib/announcement-utils";
import type { NotificationRecord } from "@/lib/api-types";
import { NotificationTypeBadge } from "./notification-type";

/**
 * Full view of a single notification.
 *
 * The message scrolls inside a bounded flex column, so a long email or
 * announcement is readable instead of being clipped by the dialog.
 */
export function NotificationDetailDialog({
  notification,
  onClose,
}: {
  notification: NotificationRecord | null;
  onClose: () => void;
}) {
  return (
    <Dialog open={!!notification} onOpenChange={(open) => !open && onClose()}>
      <ScrollableDialog className="max-w-xl">
        {notification && (
          <>
            <DialogHeader className="px-6 py-5 border-b border-border bg-muted/30 shrink-0">
              <div className="flex items-center gap-2 mb-2">
                <NotificationTypeBadge type={notification.type} />
                <span className="text-xs text-muted-foreground flex items-center gap-1 ml-auto">
                  <Calendar className="size-3.5" />
                  {new Date(notification.createdAt).toLocaleString("en-IN", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </span>
              </div>
              <DialogTitle className="text-lg font-bold text-foreground leading-snug">
                {notification.title}
              </DialogTitle>
            </DialogHeader>

            <DialogScrollArea className="px-6 py-5">
              {containsHtml(notification.message) ? (
                <div
                  className="prose prose-sm dark:prose-invert max-w-none text-foreground leading-relaxed wrap-break-word"
                  dangerouslySetInnerHTML={{ __html: notification.message }}
                />
              ) : (
                <p className="text-sm text-foreground/90 whitespace-pre-line leading-relaxed">
                  {notification.message}
                </p>
              )}
            </DialogScrollArea>

            <DialogFooter className="px-6 py-3 border-t border-border bg-muted/20 flex flex-row items-center justify-between shrink-0">
              {notification.actionUrl ? (
                <Button asChild size="sm" className="gap-1.5">
                  <Link href={notification.actionUrl} onClick={onClose}>
                    <span>Take Action</span>
                    <ExternalLink className="size-3.5" />
                  </Link>
                </Button>
              ) : (
                <div />
              )}
              <Button variant="outline" size="sm" onClick={onClose}>
                Close
              </Button>
            </DialogFooter>
          </>
        )}
      </ScrollableDialog>
    </Dialog>
  );
}

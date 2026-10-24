"use client";

import { CalendarDays, Pin, UserRound } from "lucide-react";
import {
  Dialog,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  DialogScrollArea,
  ScrollableDialog,
} from "@/components/ui/scrollable-dialog";
import { containsHtml } from "@/lib/announcement-utils";
import type { Announcement } from "@/lib/api-types";

/**
 * Read-only view of a public announcement.
 *
 * The body scrolls inside a bounded column, so a long notice is readable on a
 * phone instead of being clipped by the dialog.
 */
export function AnnouncementDetailDialog({
  announcement,
  onClose,
}: {
  announcement: Announcement | null;
  onClose: () => void;
}) {
  const item = announcement?.announcement;
  const author = announcement?.author;

  return (
    <Dialog open={!!item} onOpenChange={(open) => !open && onClose()}>
      <ScrollableDialog className="max-w-2xl">
        {item && (
          <>
            <DialogHeader className="shrink-0 border-b border-border bg-muted/30 px-6 py-5">
              <div className="mb-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                {item.isPinned && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 font-medium text-primary">
                    <Pin className="size-3" />
                    Pinned
                  </span>
                )}
                <span className="inline-flex items-center gap-1">
                  <CalendarDays className="size-3.5" />
                  {new Date(item.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
                {author?.name && (
                  <span className="inline-flex items-center gap-1">
                    <UserRound className="size-3.5" />
                    {author.name}
                  </span>
                )}
              </div>

              <DialogTitle className="text-lg font-bold leading-snug text-foreground">
                {item.title}
              </DialogTitle>
            </DialogHeader>

            <DialogScrollArea className="px-6 py-5">
              {containsHtml(item.content) ? (
                <div
                  className="prose prose-sm dark:prose-invert max-w-none wrap-break-word leading-relaxed text-foreground"
                  dangerouslySetInnerHTML={{ __html: item.content }}
                />
              ) : (
                <p className="whitespace-pre-line text-sm leading-relaxed text-foreground/90">
                  {item.content}
                </p>
              )}
            </DialogScrollArea>

            <DialogFooter className="shrink-0 border-t border-border bg-muted/20 px-6 py-3">
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

"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Megaphone, Pin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { createExcerpt } from "@/lib/announcement-utils";
import type { Announcement } from "@/lib/api-types";
import { AnnouncementDetailDialog } from "@/components/announcement-detail-dialog";

/**
 * Hostel announcements on the dashboard.
 *
 * These are the public notices from the website, which is different from the
 * personal notifications: one is a broadcast, the other is about this student.
 */
export function AnnouncementsPanel({
  announcements,
  isLoading,
  limit = 4,
}: {
  announcements: Announcement[];
  isLoading: boolean;
  limit?: number;
}) {
  const [selected, setSelected] = useState<Announcement | null>(null);
  const visible = announcements.slice(0, limit);

  return (
    <>
      <Card className="border-0 bg-card shadow-xs">
        <CardHeader className="flex flex-row items-center justify-between gap-3 border-b border-border pb-4">
          <CardTitle className="flex items-center gap-2 text-base">
            <Megaphone className="size-4 text-primary" />
            Announcements
          </CardTitle>
        </CardHeader>

        <CardContent className="p-0">
          {isLoading ? (
            <div className="space-y-3 p-5">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-5/6" />
            </div>
          ) : visible.length === 0 ? (
            <EmptyState
              icon={Megaphone}
              title="No announcements"
              description="Notices from the hostel office will appear here."
            />
          ) : (
            <ul className="divide-y divide-border">
              {visible.map((entry) => (
                <li key={entry.announcement.id}>
                  <button
                    type="button"
                    onClick={() => setSelected(entry)}
                    className="w-full px-5 py-4 text-left transition-colors hover:bg-muted/40 focus-visible:bg-muted/40 focus-visible:outline-hidden"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="flex min-w-0 items-center gap-1.5 text-sm font-semibold text-foreground">
                        {entry.announcement.isPinned && (
                          <Pin className="size-3 shrink-0 text-primary" />
                        )}
                        <span className="truncate">{entry.announcement.title}</span>
                      </h4>
                      <span className="shrink-0 text-[11px] text-muted-foreground">
                        {new Date(entry.announcement.createdAt).toLocaleDateString(
                          "en-IN",
                          { day: "numeric", month: "short" }
                        )}
                      </span>
                    </div>
                    <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                      {createExcerpt(entry.announcement.content, 140)}
                    </p>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </CardContent>

        {visible.length > 0 && (
          <div className="border-t border-border p-3">
            <Button asChild variant="ghost" size="sm" className="w-full text-primary">
              <Link href="/en/announcements">
                All announcements
                <ArrowRight className="size-3.5" />
              </Link>
            </Button>
          </div>
        )}
      </Card>

      <AnnouncementDetailDialog
        announcement={selected}
        onClose={() => setSelected(null)}
      />
    </>
  );
}

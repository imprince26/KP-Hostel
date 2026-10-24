"use client";

import Link from "next/link";
import { ArrowRight, BedDouble, Building2, CalendarDays, Home } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export type ActiveStay = {
  applicationId: string;
  block: string;
  roomNumber: string;
  admissionStart: string | null;
  admissionEnd: string | null;
};

function formatDate(value: string | null) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/** Days left until the admission ends, or null when the end date is unknown. */
function daysRemaining(end: string | null) {
  if (!end) return null;
  const date = new Date(end);
  if (Number.isNaN(date.getTime())) return null;

  return Math.ceil((date.getTime() - Date.now()) / 86_400_000);
}

/**
 * The student's current room.
 *
 * When there is an active admission this is the most important thing on the
 * dashboard, so it gets a solid primary surface; otherwise it explains what to
 * do next instead of disappearing.
 */
export function RoomCard({ stay }: { stay: ActiveStay | null }) {
  if (!stay) {
    return (
      <Card className="border-dashed border-border bg-card">
        <CardContent className="flex flex-col items-center gap-4 p-6 text-center sm:p-8">
          <span className="flex size-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <BedDouble className="size-6" />
          </span>
          <div className="space-y-1">
            <h3 className="text-base font-semibold text-foreground">
              No room allotted yet
            </h3>
            <p className="mx-auto max-w-sm text-sm text-muted-foreground">
              Once your application is approved and the office completes the
              admission, your block and room number appear here.
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button asChild size="sm">
              <Link href="/en/admission">
                Apply for admission
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link href="/student/applications">View applications</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const start = formatDate(stay.admissionStart);
  const end = formatDate(stay.admissionEnd);
  const remaining = daysRemaining(stay.admissionEnd);

  return (
    <Card className="overflow-hidden border-0 bg-primary text-primary-foreground shadow-sm">
      <CardContent className="space-y-5 p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2 text-sm font-medium text-primary-foreground/80">
            <Home className="size-4" />
            Your stay
          </div>

          {remaining !== null && (
            <span className="rounded-full bg-primary-foreground/15 px-2.5 py-1 text-xs font-medium">
              {remaining > 0
                ? `${remaining} day${remaining === 1 ? "" : "s"} left`
                : "Stay ended"}
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-xl bg-primary-foreground/15">
              <Building2 className="size-5" />
            </span>
            <div>
              <p className="text-xs text-primary-foreground/70">Block</p>
              <p className="text-xl font-bold leading-tight">{stay.block}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-xl bg-primary-foreground/15">
              <BedDouble className="size-5" />
            </span>
            <div>
              <p className="text-xs text-primary-foreground/70">Room</p>
              <p className="text-xl font-bold leading-tight">
                {stay.roomNumber}
              </p>
            </div>
          </div>
        </div>

        {(start || end) && (
          <div className="flex items-center gap-2 rounded-lg bg-primary-foreground/10 px-3 py-2 text-sm">
            <CalendarDays className="size-4 shrink-0" />
            <span className="truncate">
              {start ?? "—"} <span className="opacity-70">to</span> {end ?? "—"}
            </span>
          </div>
        )}

        <Button
          asChild
          variant="secondary"
          size="sm"
          className="w-full bg-primary-foreground text-primary hover:bg-primary-foreground/90"
        >
          <Link href={`/student/applications/${stay.applicationId}`}>
            View application
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

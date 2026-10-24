"use client";

import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Check,
  Circle,
  MapPin,
  Phone,
  UserRound,
  Users,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

type ProfileFields = {
  phone?: string | null;
  dateOfBirth?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  pincode?: string | null;
  collegeName?: string | null;
  course?: string | null;
  guardianName?: string | null;
  guardianPhone?: string | null;
};

/**
 * Nudges the student to finish the details the hostel needs.
 *
 * Only the fields the office actually uses are counted, so the bar can reach
 * 100% and disappear instead of nagging forever about optional text.
 */
export function ProfileCompletionCard({ user }: { user: ProfileFields }) {
  const checks = [
    {
      label: "Mobile number",
      icon: Phone,
      done: Boolean(user.phone),
      href: "/student/settings?tab=profile",
    },
    {
      label: "Date of birth",
      icon: UserRound,
      done: Boolean(user.dateOfBirth),
      href: "/student/settings?tab=profile",
    },
    {
      label: "Address",
      icon: MapPin,
      done: Boolean(
        user.address && user.city && user.state && user.pincode
      ),
      href: "/student/settings?tab=profile",
    },
    {
      label: "College & course",
      icon: BookOpen,
      done: Boolean(user.collegeName && user.course),
      href: "/student/settings?tab=profile",
    },
    {
      label: "Guardian details",
      icon: Users,
      done: Boolean(user.guardianName && user.guardianPhone),
      href: "/student/settings?tab=profile",
    },
  ];

  const completed = checks.filter((check) => check.done).length;
  const percent = Math.round((completed / checks.length) * 100);
  const missing = checks.filter((check) => !check.done);

  if (missing.length === 0) return null;

  return (
    <Card className="border-primary/20 bg-primary/5 shadow-xs">
      <CardContent className="space-y-4 p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold text-foreground">
              Finish your profile
            </h3>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {missing.length} detail{missing.length === 1 ? "" : "s"} still
              missing. The hostel office uses these for records and contact.
            </p>
          </div>
          <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
            {percent}% complete
          </span>
        </div>

        <Progress value={percent} className="h-2" />

        <ul className="flex flex-wrap gap-2">
          {checks.map((check) => {
            const Icon = check.done ? Check : Circle;

            return (
              <li
                key={check.label}
                className={
                  check.done
                    ? "inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary"
                    : "inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-2.5 py-1 text-xs font-medium text-muted-foreground"
                }
              >
                <Icon className="size-3" />
                {check.label}
              </li>
            );
          })}
        </ul>

        <Button asChild size="sm">
          <Link href="/student/settings?tab=profile">
            Complete profile
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

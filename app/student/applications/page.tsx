"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  ArrowRight,
  BookOpen,
  Building2,
  CalendarDays,
  CheckCircle2,
  Clock,
  FileText,
  Files,
  Plus,
  Search,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { StatCard, StatCardGrid } from "@/components/ui/stat-card";
import {
  ApplicationProgress,
  ApplicationStatusBadge,
} from "@/components/application-status";
import { queryKeys, useApiQuery } from "@/hooks/use-data";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import type { StudentApplication } from "@/lib/api-types";

type FilterKey = "all" | "in_progress" | "approved" | "rejected";

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "in_progress", label: "In progress" },
  { key: "approved", label: "Approved" },
  { key: "rejected", label: "Not approved" },
];

const APPROVED_STATUSES = new Set(["approved", "admitted", "active"]);
const IN_PROGRESS_STATUSES = new Set(["submitted", "under_review"]);

function matchesFilter(application: StudentApplication, filter: FilterKey) {
  switch (filter) {
    case "in_progress":
      return IN_PROGRESS_STATUSES.has(application.status);
    case "approved":
      return APPROVED_STATUSES.has(application.status);
    case "rejected":
      return application.status === "rejected";
    default:
      return true;
  }
}

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

function ApplicationCard({ application }: { application: StudentApplication }) {
  const submitted = formatDate(application.createdAt);
  const hasRoom = Boolean(application.assignedBlock && application.roomNumber);

  return (
    <Card className="border-border/70 bg-card shadow-xs transition-shadow hover:shadow-md">
      <CardContent className="space-y-4 p-5">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="font-mono text-sm font-semibold text-foreground">
              {application.applicationNumber}
            </p>
            <p className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
              <CalendarDays className="size-3.5" />
              Submitted {submitted ?? "—"}
            </p>
          </div>
          <ApplicationStatusBadge status={application.status} />
        </div>

        <ApplicationProgress status={application.status} />

        <div className="grid gap-3 rounded-lg bg-muted/40 p-3 text-sm sm:grid-cols-2">
          <div className="flex items-start gap-2">
            <BookOpen className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">College</p>
              <p className="truncate font-medium text-foreground">
                {application.collegeName}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <FileText className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">Course</p>
              <p className="truncate font-medium text-foreground">
                {application.course} · {application.year}
              </p>
            </div>
          </div>

          {hasRoom && (
            <div className="flex items-start gap-2 sm:col-span-2">
              <Building2 className="mt-0.5 size-4 shrink-0 text-primary" />
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">Room allotted</p>
                <p className="font-medium text-foreground">
                  Block {application.assignedBlock}, Room{" "}
                  {application.roomNumber}
                </p>
              </div>
            </div>
          )}
        </div>

        <Button asChild variant="outline" size="sm" className="w-full">
          <Link href={`/student/applications/${application.id}`}>
            View details
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

function ApplicationsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-24 w-full" />
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {Array.from({ length: 2 }).map((_, index) => (
          <Skeleton key={index} className="h-64 w-full" />
        ))}
      </div>
    </div>
  );
}

export default function StudentApplications() {
  const { status } = useSession();
  const router = useRouter();
  const [filter, setFilter] = useState<FilterKey>("all");
  const [search, setSearch] = useState("");

  const isStudent = status === "authenticated";

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status, router]);

  const applicationsQuery = useApiQuery<{ applications: StudentApplication[] }>(
    queryKeys.student.applications,
    "/api/admission/apply",
    isStudent
  );

  const applications = useMemo(
    () => applicationsQuery.data?.applications ?? [],
    [applicationsQuery.data]
  );
  const debouncedSearch = useDebouncedValue(search.trim().toLowerCase());

  const counts = useMemo(
    () => ({
      all: applications.length,
      in_progress: applications.filter((application) =>
        IN_PROGRESS_STATUSES.has(application.status)
      ).length,
      approved: applications.filter((application) =>
        APPROVED_STATUSES.has(application.status)
      ).length,
      rejected: applications.filter(
        (application) => application.status === "rejected"
      ).length,
    }),
    [applications]
  );

  const visible = useMemo(() => {
    const filtered = applications.filter((application) =>
      matchesFilter(application, filter)
    );

    if (!debouncedSearch) return filtered;

    return filtered.filter((application) =>
      [
        application.applicationNumber,
        application.collegeName,
        application.course,
        application.year,
        application.assignedBlock ?? "",
        application.roomNumber ?? "",
      ]
        .join(" ")
        .toLowerCase()
        .includes(debouncedSearch)
    );
  }, [applications, filter, debouncedSearch]);

  if (status === "loading" || (isStudent && applicationsQuery.isPending)) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-6 sm:py-8">
        <ApplicationsSkeleton />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:py-8">
      <PageHeader
        title="My applications"
        description="Track every hostel application, its review status and your room allotment."
        actions={
          <Button asChild>
            <Link href="/en/admission">
              <Plus className="size-4" />
              New application
            </Link>
          </Button>
        }
      />

      <StatCardGrid columns={4}>
        <StatCard
          label="Applications"
          value={counts.all}
          icon={Files}
          hint="All time"
        />
        <StatCard
          label="In progress"
          value={counts.in_progress}
          icon={Clock}
          hint="Waiting on the office"
        />
        <StatCard
          label="Approved"
          value={counts.approved}
          icon={CheckCircle2}
          hint="Ready for admission"
        />
        <StatCard
          label="Not approved"
          value={counts.rejected}
          icon={XCircle}
          hint="See review comments"
        />
      </StatCardGrid>

      {/* Filters and search */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div
          className="flex gap-1 overflow-x-auto rounded-lg bg-muted p-1"
          role="tablist"
          aria-label="Filter applications by status"
        >
          {FILTERS.map((item) => {
            const active = filter === item.key;

            return (
              <button
                key={item.key}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setFilter(item.key)}
                className={
                  active
                    ? "inline-flex shrink-0 items-center gap-1.5 rounded-md bg-background px-3 py-1.5 text-sm font-medium text-foreground shadow-xs"
                    : "inline-flex shrink-0 items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                }
              >
                {item.label}
                <span
                  className={
                    active
                      ? "rounded-full bg-primary/10 px-1.5 text-[11px] font-semibold text-primary"
                      : "rounded-full bg-background/60 px-1.5 text-[11px] font-semibold text-muted-foreground"
                  }
                >
                  {counts[item.key]}
                </span>
              </button>
            );
          })}
        </div>

        <div className="relative w-full lg:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search application, college or room"
            aria-label="Search applications"
            className="pl-9"
          />
        </div>
      </div>

      {applications.length === 0 ? (
        <Card className="border-dashed bg-card">
          <CardContent className="p-0">
            <EmptyState
              icon={FileText}
              title="No applications yet"
              description="Submit an application to be considered for a room at K.P. Vidhyarthi Bhavan."
              action={
                <Button asChild>
                  <Link href="/en/admission">Apply for admission</Link>
                </Button>
              }
            />
          </CardContent>
        </Card>
      ) : visible.length === 0 ? (
        <Card className="border-dashed bg-card">
          <CardContent className="p-0">
            <EmptyState
              icon={Search}
              title="Nothing matches that filter"
              description="Try a different status or clear the search to see all of your applications."
              action={
                <Button
                  variant="outline"
                  onClick={() => {
                    setFilter("all");
                    setSearch("");
                  }}
                >
                  Clear filters
                </Button>
              }
            />
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {visible.map((application) => (
            <ApplicationCard key={application.id} application={application} />
          ))}
        </div>
      )}
    </div>
  );
}

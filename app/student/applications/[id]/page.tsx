"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  ArrowLeft,
  BedDouble,
  Building2,
  CalendarDays,
  FileText,
  GraduationCap,
  Home,
  Mail,
  MapPin,
  Phone,
  UserRound,
  Users,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  ApplicationProgress,
  ApplicationStatusBadge,
  getApplicationStatusMeta,
} from "@/components/application-status";
import { queryKeys, useApiQuery } from "@/hooks/use-data";
import type { StudentApplicationDetail } from "@/lib/api-types";
import { cn } from "@/lib/utils";

function formatDate(value: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatDateTime(value: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function DetailItem({
  label,
  value,
  className,
}: {
  label: string;
  value: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </dt>
      <dd className="mt-1 text-sm font-medium text-foreground">{value}</dd>
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-6 sm:py-8">
      <Skeleton className="h-6 w-40" />
      <Skeleton className="h-12 w-72" />
      <Skeleton className="h-28 w-full" />
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Skeleton className="h-56 w-full" />
          <Skeleton className="h-56 w-full" />
        </div>
        <Skeleton className="h-80 w-full" />
      </div>
    </div>
  );
}

export default function ApplicationDetailPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const applicationId = params?.id;

  const isStudent = status === "authenticated";

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status, router]);

  const applicationQuery = useApiQuery<{
    application: StudentApplicationDetail;
  }>(
    queryKeys.student.application(applicationId ?? ""),
    applicationId ? `/api/admission/apply/${applicationId}` : null,
    isStudent && Boolean(applicationId)
  );

  const application = applicationQuery.data?.application;

  if (status === "loading" || (isStudent && applicationQuery.isPending)) {
    return <DetailSkeleton />;
  }

  if (!application) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <span className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <FileText className="size-6" />
        </span>
        <h1 className="text-xl font-semibold text-foreground">
          Application not found
        </h1>
        <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">
          This application does not exist, or it belongs to a different account.
        </p>
        <Button asChild variant="outline" className="mt-5">
          <Link href="/student/applications">
            <ArrowLeft className="size-4" />
            Back to applications
          </Link>
        </Button>
      </div>
    );
  }

  const meta = getApplicationStatusMeta(application.status);
  const StatusIcon = meta.icon;
  const hasRoom = Boolean(application.assignedBlock && application.roomNumber);

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-6 sm:py-8">
      <div className="flex flex-col gap-3">
        <Link
          href="/student/applications"
          className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to applications
        </Link>

        <div className="min-w-0">
          <p className="font-mono text-xs uppercase tracking-wide text-muted-foreground">
            {application.applicationNumber}
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Application details
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Submitted {formatDate(application.createdAt)}
          </p>
        </div>
      </div>

      {/* Status banner */}
      <Card className="border-0 bg-card shadow-xs">
        <CardContent className="space-y-5 p-5 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex min-w-0 items-start gap-3">
              <span
                className={cn(
                  "flex size-11 shrink-0 items-center justify-center rounded-xl",
                  meta.tone === "danger"
                    ? "bg-destructive/10 text-destructive"
                    : "bg-primary/10 text-primary"
                )}
              >
                <StatusIcon className="size-5" />
              </span>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-lg font-semibold text-foreground">
                    {meta.studentLabel}
                  </h2>
                  <ApplicationStatusBadge status={application.status} />
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {meta.description}
                </p>
              </div>
            </div>
          </div>

          <ApplicationProgress status={application.status} />
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card className="border-0 bg-card shadow-xs">
            <CardHeader className="border-b border-border pb-4">
              <CardTitle className="flex items-center gap-2 text-base">
                <UserRound className="size-4 text-primary" />
                Personal information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5">
              <dl className="grid gap-4 sm:grid-cols-2">
                <DetailItem label="Full name" value={application.fullName} />
                <DetailItem
                  label="Date of birth"
                  value={formatDate(application.dateOfBirth)}
                />
                <DetailItem
                  label="Gender"
                  value={
                    <span className="capitalize">{application.gender}</span>
                  }
                />
                <DetailItem
                  label="Caste & sub-caste"
                  value={`${application.caste} · ${application.subCaste}`}
                />
              </dl>
            </CardContent>
          </Card>

          <Card className="border-0 bg-card shadow-xs">
            <CardHeader className="border-b border-border pb-4">
              <CardTitle className="flex items-center gap-2 text-base">
                <Mail className="size-4 text-primary" />
                Contact information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5">
              <dl className="grid gap-4 sm:grid-cols-2">
                <DetailItem
                  label="Email address"
                  value={
                    <span className="flex items-center gap-1.5 break-all">
                      <Mail className="size-3.5 shrink-0 text-muted-foreground" />
                      {application.email}
                    </span>
                  }
                />
                <DetailItem
                  label="Phone number"
                  value={
                    <span className="flex items-center gap-1.5">
                      <Phone className="size-3.5 text-muted-foreground" />
                      {application.phone}
                    </span>
                  }
                />
                <DetailItem
                  label="Address"
                  className="sm:col-span-2"
                  value={
                    <span className="flex items-start gap-1.5 font-normal text-muted-foreground">
                      <MapPin className="mt-0.5 size-3.5 shrink-0" />
                      <span>
                        {application.address}
                        <br />
                        {application.city}, {application.state} —{" "}
                        {application.pincode}
                      </span>
                    </span>
                  }
                />
              </dl>
            </CardContent>
          </Card>

          <Card className="border-0 bg-card shadow-xs">
            <CardHeader className="border-b border-border pb-4">
              <CardTitle className="flex items-center gap-2 text-base">
                <GraduationCap className="size-4 text-primary" />
                Education
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5">
              <dl className="grid gap-4 sm:grid-cols-2">
                <DetailItem
                  label="College / university"
                  className="sm:col-span-2"
                  value={application.collegeName}
                />
                <DetailItem label="Course" value={application.course} />
                <DetailItem label="Year of study" value={application.year} />
                {application.studentId && (
                  <DetailItem
                    label="Student ID"
                    value={
                      <span className="font-mono">{application.studentId}</span>
                    }
                  />
                )}
              </dl>
            </CardContent>
          </Card>

          <Card className="border-0 bg-card shadow-xs">
            <CardHeader className="border-b border-border pb-4">
              <CardTitle className="flex items-center gap-2 text-base">
                <Users className="size-4 text-primary" />
                Guardian information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5">
              <dl className="grid gap-4 sm:grid-cols-3">
                <DetailItem
                  label="Guardian name"
                  value={application.guardianName}
                />
                <DetailItem
                  label="Phone number"
                  value={application.guardianPhone}
                />
                <DetailItem
                  label="Relationship"
                  value={
                    <span className="capitalize">
                      {application.guardianRelation}
                    </span>
                  }
                />
              </dl>
            </CardContent>
          </Card>

          {hasRoom && (
            <Card className="border-0 bg-primary text-primary-foreground shadow-sm">
              <CardHeader className="border-b border-primary-foreground/15 pb-4">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Home className="size-4" />
                  Room assignment
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex items-center gap-3">
                    <span className="flex size-10 items-center justify-center rounded-xl bg-primary-foreground/15">
                      <Building2 className="size-5" />
                    </span>
                    <div>
                      <p className="text-xs text-primary-foreground/70">Block</p>
                      <p className="text-xl font-bold">
                        {application.assignedBlock}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="flex size-10 items-center justify-center rounded-xl bg-primary-foreground/15">
                      <BedDouble className="size-5" />
                    </span>
                    <div>
                      <p className="text-xs text-primary-foreground/70">Room</p>
                      <p className="text-xl font-bold">
                        {application.roomNumber}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 rounded-lg bg-primary-foreground/10 px-3 py-2 text-sm sm:col-span-2">
                    <CalendarDays className="size-4 shrink-0" />
                    <span>
                      {formatDate(application.admissionStartDate)}{" "}
                      <span className="opacity-70">to</span>{" "}
                      {formatDate(application.admissionEndDate)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {application.rejectionReason && (
            <Card className="border border-destructive/25 bg-destructive/5 shadow-xs">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base text-destructive">
                  <XCircle className="size-4" />
                  Why this application was not approved
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 p-5 pt-0">
                <p className="text-sm leading-relaxed text-foreground">
                  {application.rejectionReason}
                </p>
                {application.reviewedAt && (
                  <p className="text-xs text-muted-foreground">
                    Reviewed on {formatDateTime(application.reviewedAt)}
                  </p>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card className="border-0 bg-card shadow-xs">
            <CardHeader className="border-b border-border pb-4">
              <CardTitle className="text-base">Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 p-5">
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm text-muted-foreground">
                  Application no.
                </span>
                <span className="font-mono text-sm font-medium text-foreground">
                  {application.applicationNumber}
                </span>
              </div>
              <Separator />
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm text-muted-foreground">
                  Block preference
                </span>
                <span className="text-sm font-medium text-foreground">
                  {application.blockPreference
                    ? `Block ${application.blockPreference}`
                    : "Not specified"}
                </span>
              </div>
              <Separator />
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm text-muted-foreground">Submitted</span>
                <span className="text-sm font-medium text-foreground">
                  {formatDate(application.createdAt)}
                </span>
              </div>
              <Separator />
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm text-muted-foreground">
                  Last updated
                </span>
                <span className="text-sm font-medium text-foreground">
                  {formatDate(application.updatedAt)}
                </span>
              </div>
            </CardContent>
          </Card>

          {application.passportPhoto && (
            <Card className="border-0 bg-card shadow-xs">
              <CardHeader className="border-b border-border pb-4">
                <CardTitle className="text-base">Passport photo</CardTitle>
              </CardHeader>
              <CardContent className="p-5">
                <div className="relative aspect-square overflow-hidden rounded-xl border border-border bg-muted">
                  <Image
                    src={application.passportPhoto}
                    alt={`Passport photo of ${application.fullName}`}
                    fill
                    sizes="(min-width: 1024px) 320px, 100vw"
                    className="object-cover"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="border-0 bg-card shadow-xs">
            <CardHeader className="border-b border-border pb-4">
              <CardTitle className="text-base">Need help?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 p-5 text-sm text-muted-foreground">
              <p>
                Contact the hostel office if a detail here is wrong or your
                application is taking longer than expected.
              </p>
              <Badge variant="outline" className="border-border">
                Office hours: Mon–Sat, 9:00 AM – 5:00 PM
              </Badge>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

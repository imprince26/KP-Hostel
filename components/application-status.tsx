import type { ComponentType } from "react";
import {
  BadgeCheck,
  CheckCircle2,
  Clock,
  FileText,
  Home,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

type Tone = "neutral" | "progress" | "success" | "active" | "danger";

type StatusMeta = {
  /** Label used on the admin side, where a new application is "New". */
  adminLabel: string;
  /** Label used for the student who submitted it. */
  studentLabel: string;
  description: string;
  tone: Tone;
  icon: ComponentType<{ className?: string }>;
};

/**
 * One place for everything the UI needs to know about an admission status.
 *
 * Both portals used to carry their own copy of the label, colour and icon map,
 * so the same status could read "New" on one page and "Submitted" on another.
 */
const STATUS_META: Record<string, StatusMeta> = {
  submitted: {
    adminLabel: "New",
    studentLabel: "Submitted",
    description:
      "Your application has been received and is waiting to be reviewed.",
    tone: "neutral",
    icon: FileText,
  },
  under_review: {
    adminLabel: "Under Review",
    studentLabel: "Under Review",
    description:
      "The admissions team is reviewing your application and documents.",
    tone: "progress",
    icon: Clock,
  },
  approved: {
    adminLabel: "Approved",
    studentLabel: "Approved",
    description:
      "Your application has been approved. Visit the hostel office to complete the admission.",
    tone: "success",
    icon: CheckCircle2,
  },
  rejected: {
    adminLabel: "Rejected",
    studentLabel: "Rejected",
    description:
      "This application was not approved. Read the review comments for the reason.",
    tone: "danger",
    icon: XCircle,
  },
  admitted: {
    adminLabel: "Admitted",
    studentLabel: "Admitted",
    description:
      "Your admission is confirmed. Your room allocation is listed on this application.",
    tone: "active",
    icon: BadgeCheck,
  },
  active: {
    adminLabel: "Active",
    studentLabel: "Active",
    description: "Your admission is active for the current term.",
    tone: "active",
    icon: Home,
  },
  completed: {
    adminLabel: "Completed",
    studentLabel: "Completed",
    description: "This admission has been completed and the room is released.",
    tone: "neutral",
    icon: BadgeCheck,
  },
};

const FALLBACK_META: StatusMeta = {
  adminLabel: "Unknown",
  studentLabel: "Unknown",
  description: "The status of this application is not recognised.",
  tone: "neutral",
  icon: FileText,
};

const TONE_CLASSES: Record<Tone, string> = {
  neutral: "bg-muted text-muted-foreground border-border",
  progress: "bg-primary/10 text-primary border-primary/20",
  success: "bg-primary/10 text-primary border-primary/20",
  active: "bg-primary text-primary-foreground border-primary",
  danger: "bg-destructive/10 text-destructive border-destructive/20",
};

export function getApplicationStatusMeta(status: string): StatusMeta {
  return STATUS_META[status] ?? FALLBACK_META;
}

/** Badge for an admission status, labelled for the viewer's perspective. */
export function ApplicationStatusBadge({
  status,
  perspective = "student",
  className,
}: {
  status: string;
  perspective?: "admin" | "student";
  className?: string;
}) {
  const meta = getApplicationStatusMeta(status);
  const label =
    perspective === "admin" ? meta.adminLabel : meta.studentLabel;

  return (
    <Badge
      variant="outline"
      className={cn("font-medium", TONE_CLASSES[meta.tone], className)}
    >
      {label}
    </Badge>
  );
}

const STEPS = [
  { key: "submitted", label: "Submitted" },
  { key: "review", label: "Review" },
  { key: "decision", label: "Decision" },
  { key: "stay", label: "Stay" },
] as const;

type StepState = "done" | "current" | "failed" | "pending";

/** Where each status sits on the four-step application timeline. */
function getStepStates(status: string): StepState[] {
  switch (status) {
    case "submitted":
      return ["current", "pending", "pending", "pending"];
    case "under_review":
      return ["done", "current", "pending", "pending"];
    case "approved":
      return ["done", "done", "done", "pending"];
    case "rejected":
      return ["done", "done", "failed", "pending"];
    case "admitted":
    case "active":
      return ["done", "done", "done", "current"];
    case "completed":
      return ["done", "done", "done", "done"];
    default:
      return ["current", "pending", "pending", "pending"];
  }
}

/**
 * Horizontal progress track for an application.
 *
 * Gives the student an immediate sense of where the application is, instead of
 * making them infer it from a single badge.
 */
export function ApplicationProgress({
  status,
  className,
}: {
  status: string;
  className?: string;
}) {
  const states = getStepStates(status);

  return (
    <ol
      className={cn("flex w-full items-start gap-1", className)}
      aria-label="Application progress"
    >
      {STEPS.map((step, index) => {
        const state = states[index];
        const isLast = index === STEPS.length - 1;

        return (
          <li key={step.key} className="flex flex-1 flex-col items-center gap-2">
            <div className="flex w-full items-center">
              <span
                aria-hidden
                className={cn(
                  "size-2.5 shrink-0 rounded-full ring-4",
                  state === "done" && "bg-primary ring-primary/15",
                  state === "current" && "bg-primary ring-primary/25",
                  state === "failed" && "bg-destructive ring-destructive/15",
                  state === "pending" && "bg-muted-foreground/30 ring-transparent"
                )}
              />
              {!isLast && (
                <span
                  aria-hidden
                  className={cn(
                    "h-0.5 flex-1",
                    state === "done" || state === "current"
                      ? "bg-primary/40"
                      : "bg-border"
                  )}
                />
              )}
            </div>
            <span
              className={cn(
                "text-[11px] font-medium",
                state === "current" && "text-primary",
                state === "done" && "text-foreground",
                state === "failed" && "text-destructive",
                state === "pending" && "text-muted-foreground"
              )}
            >
              {step.label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

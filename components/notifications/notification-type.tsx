"use client";

import { AlertCircle, AlertTriangle, CheckCircle2, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type NotificationTreatment = {
  icon: typeof Info;
  label: string;
  badgeClassName: string;
  iconClassName: string;
};

/**
 * Visual treatment per notification type.
 *
 * Both the bell dialog and the student dashboard need the same icon and
 * label for a notification, so the mapping lives in one place.
 */
const TYPE_TREATMENT: Record<string, NotificationTreatment> = {
  success: {
    icon: CheckCircle2,
    label: "Approved",
    badgeClassName:
      "text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200",
    iconClassName: "text-emerald-600 dark:text-emerald-400",
  },
  application_approved: {
    icon: CheckCircle2,
    label: "Approved",
    badgeClassName:
      "text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200",
    iconClassName: "text-emerald-600 dark:text-emerald-400",
  },
  admission_activated: {
    icon: CheckCircle2,
    label: "Approved",
    badgeClassName:
      "text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200",
    iconClassName: "text-emerald-600 dark:text-emerald-400",
  },
  warning: {
    icon: AlertTriangle,
    label: "Important",
    badgeClassName:
      "text-amber-700 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200",
    iconClassName: "text-amber-600 dark:text-amber-400",
  },
  payment_due: {
    icon: AlertTriangle,
    label: "Important",
    badgeClassName:
      "text-amber-700 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200",
    iconClassName: "text-amber-600 dark:text-amber-400",
  },
  error: {
    icon: AlertCircle,
    label: "Action Needed",
    badgeClassName: "text-destructive bg-destructive/10 border-destructive/20",
    iconClassName: "text-destructive",
  },
  application_rejected: {
    icon: AlertCircle,
    label: "Action Needed",
    badgeClassName: "text-destructive bg-destructive/10 border-destructive/20",
    iconClassName: "text-destructive",
  },
  announcement: {
    icon: Info,
    label: "Announcement",
    badgeClassName: "text-primary bg-primary/10 border-primary/20",
    iconClassName: "text-primary",
  },
};

const DEFAULT_TREATMENT: NotificationTreatment = {
  icon: Info,
  label: "Notification",
  badgeClassName: "text-foreground bg-muted border-border",
  iconClassName: "text-primary",
};

export function getNotificationTreatment(type: string): NotificationTreatment {
  return TYPE_TREATMENT[type] ?? DEFAULT_TREATMENT;
}

export function NotificationTypeIcon({
  type,
  className,
}: {
  type: string;
  className?: string;
}) {
  const { icon: Icon, iconClassName } = getNotificationTreatment(type);

  return <Icon className={cn("size-4", iconClassName, className)} />;
}

export function NotificationTypeBadge({ type }: { type: string }) {
  const { label, badgeClassName } = getNotificationTreatment(type);

  return (
    <Badge variant="outline" className={badgeClassName}>
      {label}
    </Badge>
  );
}

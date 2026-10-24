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

const SUCCESS_CLASSES = {
  badgeClassName: "text-primary bg-primary/10 border-primary/20",
  iconClassName: "text-primary",
};

const WARNING_CLASSES = {
  badgeClassName: "text-secondary-foreground bg-secondary border-border",
  iconClassName: "text-secondary-foreground",
};

const ERROR_CLASSES = {
  badgeClassName: "text-destructive bg-destructive/10 border-destructive/20",
  iconClassName: "text-destructive",
};

/**
 * Visual treatment per notification type.
 *
 * Both the bell dialog, the dashboard and the notifications page need the same
 * icon and label for a notification, so the mapping lives in one place. The
 * colours are theme tokens only, so the badges follow the light and dark
 * palettes instead of hard-coding a hue.
 */
const TYPE_TREATMENT: Record<string, NotificationTreatment> = {
  success: { icon: CheckCircle2, label: "Approved", ...SUCCESS_CLASSES },
  application_approved: {
    icon: CheckCircle2,
    label: "Approved",
    ...SUCCESS_CLASSES,
  },
  admission_activated: {
    icon: CheckCircle2,
    label: "Active",
    ...SUCCESS_CLASSES,
  },
  warning: { icon: AlertTriangle, label: "Important", ...WARNING_CLASSES },
  payment_due: {
    icon: AlertTriangle,
    label: "Payment due",
    ...WARNING_CLASSES,
  },
  error: { icon: AlertCircle, label: "Action needed", ...ERROR_CLASSES },
  application_rejected: {
    icon: AlertCircle,
    label: "Not approved",
    ...ERROR_CLASSES,
  },
  announcement: { icon: Info, label: "Announcement", ...SUCCESS_CLASSES },
  application_submitted: {
    icon: Info,
    label: "Submitted",
    ...SUCCESS_CLASSES,
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

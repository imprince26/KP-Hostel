import { cn } from "@/lib/utils";
import type { AdmissionStatus, PaymentStatus } from "@/lib/domain";
import { Badge } from "@/components/ui/badge";

const ADMISSION_STATUS_LABELS: Record<AdmissionStatus, string> = {
  submitted: "New",
  under_review: "Under Review",
  approved: "Approved",
  rejected: "Rejected",
  admitted: "Admitted",
  active: "Active",
  completed: "Completed",
};

/**
 * Badge for an admission status.
 *
 * The mapping lived inside two separate pages, which meant the same status
 * could be rendered with two different labels.
 */
export function AdmissionStatusBadge({
  status,
  className,
}: {
  status: string;
  className?: string;
}) {
  const label =
    ADMISSION_STATUS_LABELS[status as AdmissionStatus] ??
    status.replace(/_/g, " ");

  return (
    <Badge
      variant="outline"
      className={cn(
        "bg-primary/10 text-primary border-primary/20 capitalize",
        status === "rejected" &&
          "bg-destructive/10 text-destructive border-destructive/20",
        className
      )}
    >
      {label}
    </Badge>
  );
}

const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  pending: "Pending",
  paid: "Paid",
  partial: "Partial",
};

export function PaymentStatusBadge({
  status,
  className,
}: {
  status: string;
  className?: string;
}) {
  const label =
    PAYMENT_STATUS_LABELS[status as PaymentStatus] ?? status.replace(/_/g, " ");

  return (
    <Badge
      variant="outline"
      className={cn(
        "capitalize",
        status === "paid" &&
          "bg-primary/10 text-primary border-primary/20",
        status === "pending" &&
          "bg-muted text-muted-foreground border-border",
        status === "partial" &&
          "bg-secondary text-secondary-foreground border-border",
        className
      )}
    >
      {label}
    </Badge>
  );
}

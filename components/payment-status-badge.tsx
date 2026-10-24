import { cn } from "@/lib/utils";
import type { PaymentStatus } from "@/lib/domain";
import { Badge } from "@/components/ui/badge";

const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  pending: "Pending",
  paid: "Paid",
  partial: "Partial",
};

/** Badge for a semester payment status, shared by the admin and student sides. */
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
        status === "paid" && "bg-primary/10 text-primary border-primary/20",
        status === "pending" && "bg-muted text-muted-foreground border-border",
        status === "partial" &&
          "bg-secondary text-secondary-foreground border-border",
        className
      )}
    >
      {label}
    </Badge>
  );
}

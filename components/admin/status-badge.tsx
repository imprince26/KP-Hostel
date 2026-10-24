import { ApplicationStatusBadge } from "@/components/application-status";

/**
 * Admin-facing admission status badge.
 *
 * The label, icon and tone live in `components/application-status.tsx`, so the
 * admin table and the student portal cannot disagree about a status.
 */
export function AdmissionStatusBadge({
  status,
  className,
}: {
  status: string;
  className?: string;
}) {
  return (
    <ApplicationStatusBadge
      status={status}
      perspective="admin"
      className={className}
    />
  );
}

export { PaymentStatusBadge } from "@/components/payment-status-badge";

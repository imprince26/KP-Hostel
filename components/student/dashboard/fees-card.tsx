"use client";

import Link from "next/link";
import { ArrowRight, IndianRupee, Receipt } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PaymentStatusBadge } from "@/components/payment-status-badge";
import type { StudentPayment } from "@/lib/api-types";

const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

function semesterLabel(semester: string) {
  if (semester === "sem1") return "Semester 1";
  if (semester === "sem2") return "Semester 2";
  return semester;
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

/**
 * Fee summary for the student.
 *
 * Amounts are shown in rupees with the Indian grouping, and nothing here can
 * change the data: payments are recorded by the hostel office.
 */
export function FeesCard({
  payments,
  totalPaid,
  pendingPayments,
  isLoading,
}: {
  payments: StudentPayment[];
  totalPaid: number;
  pendingPayments: number;
  isLoading: boolean;
}) {
  const recent = payments.slice(0, 3);

  return (
    <Card className="border-0 bg-card shadow-xs">
      <CardHeader className="flex flex-row items-start justify-between gap-3 border-b border-border pb-4">
        <div>
          <CardTitle className="flex items-center gap-2 text-base">
            <IndianRupee className="size-4 text-primary" />
            Fees &amp; payments
          </CardTitle>
          <p className="mt-1 text-xs text-muted-foreground">
            Recorded by the hostel office
          </p>
        </div>

        {!isLoading && pendingPayments > 0 && (
          <span className="rounded-full bg-destructive/10 px-2.5 py-1 text-xs font-medium text-destructive">
            {pendingPayments} pending
          </span>
        )}
      </CardHeader>

      <CardContent className="space-y-4 p-5">
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : (
          <>
            <div className="rounded-xl bg-muted/50 p-4">
              <p className="text-xs font-medium text-muted-foreground">
                Total paid
              </p>
              <p className="mt-1 text-2xl font-bold tabular-nums text-foreground">
                {inr.format(totalPaid)}
              </p>
            </div>

            {recent.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-4 text-center">
                <span className="flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
                  <Receipt className="size-4" />
                </span>
                <p className="text-sm font-medium text-foreground">
                  No fee records yet
                </p>
                <p className="text-xs text-muted-foreground">
                  Payments appear here once the office records your demand
                  draft.
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-border">
                {recent.map((payment) => {
                  const paidOn = formatDate(payment.paidDate);

                  return (
                    <li
                      key={payment.id}
                      className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-foreground">
                          {semesterLabel(payment.semester)}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {payment.academicYear}
                          {paidOn ? ` · Paid ${paidOn}` : ""}
                        </p>
                      </div>
                      <div className="flex shrink-0 flex-col items-end gap-1">
                        <span className="text-sm font-semibold tabular-nums text-foreground">
                          {payment.amountPaid
                            ? inr.format(payment.amountPaid)
                            : "—"}
                        </span>
                        <PaymentStatusBadge status={payment.paymentStatus} />
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}

            <Button asChild variant="ghost" size="sm" className="w-full">
              <Link href="/student/applications">
                View admission details
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}

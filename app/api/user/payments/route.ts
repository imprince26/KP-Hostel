import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { semesterPayments } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";

/**
 * Read-only fee history for the signed-in student.
 *
 * The admin payments page already owns writes; this endpoint only exposes the
 * student's own rows so the dashboard can show what is paid and what is still
 * outstanding.
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payments = await db
      .select({
        id: semesterPayments.id,
        applicationId: semesterPayments.applicationId,
        semester: semesterPayments.semester,
        academicYear: semesterPayments.academicYear,
        ddNumber: semesterPayments.ddNumber,
        bankName: semesterPayments.bankName,
        amountPaid: semesterPayments.amountPaid,
        paymentStatus: semesterPayments.paymentStatus,
        paidDate: semesterPayments.paidDate,
        notes: semesterPayments.notes,
        createdAt: semesterPayments.createdAt,
      })
      .from(semesterPayments)
      .where(eq(semesterPayments.studentId, session.user.id))
      .orderBy(desc(semesterPayments.createdAt));

    const totalPaid = payments.reduce(
      (sum, payment) =>
        payment.paymentStatus === "paid" ? sum + (payment.amountPaid ?? 0) : sum,
      0
    );
    const pendingPayments = payments.filter(
      (payment) => payment.paymentStatus !== "paid"
    ).length;

    return NextResponse.json({ payments, totalPaid, pendingPayments });
  } catch (error) {
    console.error("Error fetching student payments:", error);
    return NextResponse.json(
      { error: "Failed to fetch payments" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { semesterPayments } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

// PATCH - Update payment record
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const {
      ddNumber,
      bankName,
      amountPaid,
      paymentStatus,
      paidDate,
      notes,
    } = body;

    // Check if payment exists
    const [existing] = await db
      .select()
      .from(semesterPayments)
      .where(eq(semesterPayments.id, id))
      .limit(1);

    if (!existing) {
      return NextResponse.json({ error: "Payment record not found" }, { status: 404 });
    }

    const [payment] = await db
      .update(semesterPayments)
      .set({
        ddNumber: ddNumber !== undefined ? ddNumber : existing.ddNumber,
        bankName: bankName !== undefined ? bankName : existing.bankName,
        amountPaid: amountPaid !== undefined ? parseInt(amountPaid) : existing.amountPaid,
        paymentStatus: paymentStatus !== undefined ? paymentStatus : existing.paymentStatus,
        paidDate: paidDate !== undefined ? (paidDate ? new Date(paidDate) : null) : existing.paidDate,
        notes: notes !== undefined ? notes : existing.notes,
        updatedAt: new Date(),
      })
      .where(eq(semesterPayments.id, id))
      .returning();

    return NextResponse.json({ payment, message: "Payment updated successfully" });
  } catch (error) {
    console.error("Error updating payment:", error);
    return NextResponse.json({ error: "Failed to update payment" }, { status: 500 });
  }
}

// DELETE - Remove payment record
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const [existing] = await db
      .select()
      .from(semesterPayments)
      .where(eq(semesterPayments.id, id))
      .limit(1);

    if (!existing) {
      return NextResponse.json({ error: "Payment record not found" }, { status: 404 });
    }

    await db.delete(semesterPayments).where(eq(semesterPayments.id, id));

    return NextResponse.json({ message: "Payment record deleted successfully" });
  } catch (error) {
    console.error("Error deleting payment:", error);
    return NextResponse.json({ error: "Failed to delete payment" }, { status: 500 });
  }
}

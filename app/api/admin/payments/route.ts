import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { semesterPayments, admissionApplications, users } from "@/lib/db/schema";
import { eq, desc, and, sql, ilike, or } from "drizzle-orm";

// GET - Fetch all semester payments with student details
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const semester = searchParams.get("semester") || "";
    const status = searchParams.get("status") || "";
    const academicYear = searchParams.get("academicYear") || "";

    // Build query conditions
    const conditions = [];
    
    if (semester) {
      conditions.push(eq(semesterPayments.semester, semester as any));
    }
    if (status) {
      conditions.push(eq(semesterPayments.paymentStatus, status as any));
    }
    if (academicYear) {
      conditions.push(eq(semesterPayments.academicYear, academicYear));
    }

    // Fetch payments with user details
    let query = db
      .select({
        payment: semesterPayments,
        student: {
          id: users.id,
          name: users.name,
          email: users.email,
          phone: users.phone,
        },
        application: {
          id: admissionApplications.id,
          applicationNumber: admissionApplications.applicationNumber,
          assignedBlock: admissionApplications.assignedBlock,
          roomNumber: admissionApplications.roomNumber,
        },
      })
      .from(semesterPayments)
      .leftJoin(users, eq(semesterPayments.studentId, users.id))
      .leftJoin(admissionApplications, eq(semesterPayments.applicationId, admissionApplications.id))
      .orderBy(desc(semesterPayments.createdAt));

    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }

    let payments = await query;

    // Apply search filter on results (name, email, phone, DD number)
    if (search) {
      payments = payments.filter((p) => {
        const searchLower = search.toLowerCase();
        return (
          p.student?.name?.toLowerCase().includes(searchLower) ||
          p.student?.email?.toLowerCase().includes(searchLower) ||
          p.student?.phone?.includes(search) ||
          p.payment.ddNumber?.toLowerCase().includes(searchLower) ||
          p.application?.applicationNumber?.toLowerCase().includes(searchLower)
        );
      });
    }

    // Calculate statistics
    const stats = {
      total: payments.length,
      paid: payments.filter((p) => p.payment.paymentStatus === "paid").length,
      pending: payments.filter((p) => p.payment.paymentStatus === "pending").length,
      partial: payments.filter((p) => p.payment.paymentStatus === "partial").length,
      totalAmount: payments
        .filter((p) => p.payment.paymentStatus === "paid")
        .reduce((sum, p) => sum + (p.payment.amountPaid || 0), 0),
    };

    return NextResponse.json({ payments, stats });
  } catch (error) {
    console.error("Error fetching payments:", error);
    return NextResponse.json({ error: "Failed to fetch payments" }, { status: 500 });
  }
}

// POST - Add new payment record
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      studentId,
      applicationId,
      semester,
      academicYear,
      ddNumber,
      bankName,
      amountPaid,
      paymentStatus,
      paidDate,
      notes,
    } = body;

    // Validate required fields
    if (!studentId || !semester || !academicYear) {
      return NextResponse.json(
        { error: "Student, semester, and academic year are required" },
        { status: 400 }
      );
    }

    // Check if payment record already exists for this student and semester
    const [existing] = await db
      .select()
      .from(semesterPayments)
      .where(
        and(
          eq(semesterPayments.studentId, studentId),
          eq(semesterPayments.semester, semester),
          eq(semesterPayments.academicYear, academicYear)
        )
      )
      .limit(1);

    if (existing) {
      return NextResponse.json(
        { error: "Payment record already exists for this semester" },
        { status: 400 }
      );
    }

    const [payment] = await db
      .insert(semesterPayments)
      .values({
        studentId,
        applicationId: applicationId || null,
        semester,
        academicYear,
        ddNumber: ddNumber || null,
        bankName: bankName || null,
        amountPaid: amountPaid ? parseInt(amountPaid) : null,
        paymentStatus: paymentStatus || "pending",
        paidDate: paidDate ? new Date(paidDate) : null,
        addedBy: session.user.id,
        notes: notes || null,
      })
      .returning();

    return NextResponse.json({ payment, message: "Payment record added successfully" });
  } catch (error) {
    console.error("Error adding payment:", error);
    return NextResponse.json({ error: "Failed to add payment record" }, { status: 500 });
  }
}

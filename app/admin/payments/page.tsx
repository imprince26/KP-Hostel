"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  FiDollarSign,
  FiPlus,
  FiEdit,
  FiTrash2,
  FiSearch,
  FiFilter,
  FiCheckCircle,
  FiClock,
  FiAlertCircle,
  FiTrendingUp,
  FiX
} from "react-icons/fi";
import { FaRupeeSign } from "react-icons/fa";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface Student {
  user: {
    id: string;
    name: string | null;
    email: string | null;
    phone: string | null;
  };
  application: {
    id: string;
    applicationNumber: string;
    assignedBlock: string | null;
    roomNumber: string | null;
    status?: string;
  } | null;
}

interface Payment {
  payment: {
    id: string;
    studentId: string;
    applicationId: string | null;
    semester: string;
    academicYear: string;
    ddNumber: string | null;
    bankName: string | null;
    amountPaid: number | null;
    paymentStatus: string;
    paidDate: string | null;
    notes: string | null;
    createdAt: string;
    updatedAt: string;
  };
  student: {
    id: string;
    name: string | null;
    email: string | null;
    phone: string | null;
  };
  application: {
    id: string;
    applicationNumber: string;
    assignedBlock: string | null;
    roomNumber: string | null;
  } | null;
}

interface Stats {
  total: number;
  paid: number;
  pending: number;
  partial: number;
  totalAmount: number;
}

export default function AdminPaymentsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [payments, setPayments] = useState<Payment[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>([]);
  const [stats, setStats] = useState<Stats>({
    total: 0,
    paid: 0,
    pending: 0,
    partial: 0,
    totalAmount: 0,
  });
  
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSemester, setFilterSemester] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterYear, setFilterYear] = useState("");

  // Dialog states
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"add" | "edit">("add");
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [paymentToDelete, setPaymentToDelete] = useState<Payment | null>(null);

  // Form states
  const [studentSearch, setStudentSearch] = useState("");
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [formData, setFormData] = useState({
    semester: "",
    academicYear: "",
    ddNumber: "",
    bankName: "",
    amountPaid: "",
    paymentStatus: "pending",
    paidDate: "",
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
      return;
    }

    if (status === "authenticated") {
      const userRole = (session.user as any).role;
      if (userRole !== "admin") {
        router.push("/student/dashboard");
        return;
      }
      fetchPayments();
    }
  }, [status, session, router]);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, filterSemester, filterStatus, filterYear, payments]);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/payments");
      const data = await res.json();
      
      if (res.ok) {
        setPayments(data.payments);
        setFilteredPayments(data.payments);
        setStats(data.stats);
      } else {
        toast.error(data.error || "Failed to fetch payments");
      }
    } catch (error) {
      console.error("Error fetching payments:", error);
      toast.error("Failed to fetch payments");
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...payments];

    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.student?.name?.toLowerCase().includes(search) ||
          p.student?.email?.toLowerCase().includes(search) ||
          p.student?.phone?.includes(search) ||
          p.payment.ddNumber?.toLowerCase().includes(search) ||
          p.application?.applicationNumber?.toLowerCase().includes(search)
      );
    }

    if (filterSemester && filterSemester !== "all") {
      filtered = filtered.filter((p) => p.payment.semester === filterSemester);
    }

    if (filterStatus && filterStatus !== "all") {
      filtered = filtered.filter((p) => p.payment.paymentStatus === filterStatus);
    }

    if (filterYear) {
      filtered = filtered.filter((p) => p.payment.academicYear === filterYear);
    }

    setFilteredPayments(filtered);
  };

  const searchStudents = async (search: string) => {
    if (!search || search.length < 2) {
      setStudents([]);
      return;
    }

    try {
      const res = await fetch(`/api/admin/payments/students?search=${encodeURIComponent(search)}`);
      const data = await res.json();
      
      if (res.ok) {
        setStudents(data.students || []);
      }
    } catch (error) {
      console.error("Error searching students:", error);
    }
  };

  const handleAddPayment = () => {
    setDialogMode("add");
    setSelectedPayment(null);
    setSelectedStudent(null);
    setStudentSearch("");
    setStudents([]);
    setFormData({
      semester: "",
      academicYear: new Date().getFullYear().toString(),
      ddNumber: "",
      bankName: "",
      amountPaid: "",
      paymentStatus: "pending",
      paidDate: "",
      notes: "",
    });
    setDialogOpen(true);
  };

  const handleEditPayment = (payment: Payment) => {
    setDialogMode("edit");
    setSelectedPayment(payment);
    setSelectedStudent({
      user: payment.student,
      application: payment.application,
    });
    setFormData({
      semester: payment.payment.semester,
      academicYear: payment.payment.academicYear,
      ddNumber: payment.payment.ddNumber || "",
      bankName: payment.payment.bankName || "",
      amountPaid: payment.payment.amountPaid?.toString() || "",
      paymentStatus: payment.payment.paymentStatus,
      paidDate: payment.payment.paidDate ? new Date(payment.payment.paidDate).toISOString().split('T')[0] : "",
      notes: payment.payment.notes || "",
    });
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (dialogMode === "add") {
      if (!selectedStudent) {
        toast.error("Please select a student");
        return;
      }
      if (!formData.semester || !formData.academicYear) {
        toast.error("Please fill all required fields");
        return;
      }
    }

    try {
      setSubmitting(true);
      
      const url = dialogMode === "add" 
        ? "/api/admin/payments" 
        : `/api/admin/payments/${selectedPayment?.payment.id}`;
      
      const method = dialogMode === "add" ? "POST" : "PATCH";
      
      const payload = dialogMode === "add"
        ? {
            studentId: selectedStudent?.user.id,
            applicationId: selectedStudent?.application?.id || null,
            semester: formData.semester,
            academicYear: formData.academicYear,
            ddNumber: formData.ddNumber || null,
            bankName: formData.bankName || null,
            amountPaid: formData.amountPaid ? parseInt(formData.amountPaid) : null,
            paymentStatus: formData.paymentStatus,
            paidDate: formData.paidDate || null,
            notes: formData.notes || null,
          }
        : {
            ddNumber: formData.ddNumber || null,
            bankName: formData.bankName || null,
            amountPaid: formData.amountPaid ? parseInt(formData.amountPaid) : null,
            paymentStatus: formData.paymentStatus,
            paidDate: formData.paidDate || null,
            notes: formData.notes || null,
          };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message || `Payment ${dialogMode === "add" ? "added" : "updated"} successfully`);
        setDialogOpen(false);
        fetchPayments();
      } else {
        toast.error(data.error || `Failed to ${dialogMode} payment`);
      }
    } catch (error) {
      console.error(`Error ${dialogMode}ing payment:`, error);
      toast.error(`Failed to ${dialogMode} payment`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteClick = (payment: Payment) => {
    setPaymentToDelete(payment);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!paymentToDelete) return;

    try {
      const res = await fetch(`/api/admin/payments/${paymentToDelete.payment.id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Payment record deleted successfully");
        setDeleteDialogOpen(false);
        setPaymentToDelete(null);
        fetchPayments();
      } else {
        toast.error(data.error || "Failed to delete payment");
      }
    } catch (error) {
      console.error("Error deleting payment:", error);
      toast.error("Failed to delete payment");
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      paid: "bg-green-100 text-green-700 border-green-300",
      pending: "bg-yellow-100 text-yellow-700 border-yellow-300",
      partial: "bg-blue-100 text-blue-700 border-blue-300",
    };

    const labels = {
      paid: "Paid",
      pending: "Pending",
      partial: "Partial",
    };

    return (
      <Badge className={`${styles[status as keyof typeof styles] || styles.pending} border`}>
        {labels[status as keyof typeof labels] || status}
      </Badge>
    );
  };

  const getSemesterLabel = (semester: string) => {
    return semester === "sem1" ? "Semester 1" : "Semester 2";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading payments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 py-4 sm:py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">Payment Management</h1>
          <p className="text-muted-foreground">Track and manage student semester payments</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 mb-6">
          <Card className="border-0 shadow-sm bg-card">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground mb-1">Total Records</p>
                  <p className="text-2xl sm:text-3xl font-bold text-foreground">{stats.total}</p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                  <FiDollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-card">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground mb-1">Paid</p>
                  <p className="text-2xl sm:text-3xl font-bold text-green-600">{stats.paid}</p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-green-100 flex items-center justify-center">
                  <FiCheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-card">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground mb-1">Pending</p>
                  <p className="text-2xl sm:text-3xl font-bold text-yellow-600">{stats.pending}</p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-yellow-100 flex items-center justify-center">
                  <FiClock className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-card">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground mb-1">Partial</p>
                  <p className="text-2xl sm:text-3xl font-bold text-blue-600">{stats.partial}</p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                  <FiAlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-2 lg:col-span-1 border-0 shadow-sm bg-gradient-to-br from-primary/10 to-primary/5">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground mb-1">Total Amount</p>
                  <p className="text-xl sm:text-2xl font-bold text-primary flex items-center">
                    <FaRupeeSign className="w-4 h-4 sm:w-5 sm:h-5" />
                    {stats.totalAmount.toLocaleString('en-IN')}
                  </p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                  <FiTrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6 border-0 shadow-sm bg-card">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <FiFilter className="w-4 h-4 sm:w-5 sm:h-5" />
              Filters & Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="lg:col-span-2">
                <Label className="text-sm">Search</Label>
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, email, phone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <Label className="text-sm">Semester</Label>
                <Select value={filterSemester} onValueChange={setFilterSemester}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Semesters" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Semesters</SelectItem>
                    <SelectItem value="sem1">Semester 1</SelectItem>
                    <SelectItem value="sem2">Semester 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm">Status</Label>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="partial">Partial</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm">Academic Year</Label>
                <Input
                  placeholder="e.g., 2024-2025"
                  value={filterYear}
                  onChange={(e) => setFilterYear(e.target.value)}
                />
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchTerm("");
                  setFilterSemester("");
                  setFilterStatus("");
                  setFilterYear("");
                }}
              >
                <FiX className="w-4 h-4 mr-2" />
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <p className="text-sm text-muted-foreground">
              Showing {filteredPayments.length} of {payments.length} payment records
            </p>
          </div>
          <Button onClick={handleAddPayment} className="w-full sm:w-auto bg-primary hover:bg-primary/90">
            <FiPlus className="w-4 h-4 mr-2" />
            Add Payment Record
          </Button>
        </div>

        {/* Payments Table */}
        <Card className="border-0 shadow-sm bg-card">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50 border-b border-border">
                  <tr>
                    <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Student Details
                    </th>
                    <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider whitespace-nowrap">
                      Semester
                    </th>
                    <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider whitespace-nowrap hidden md:table-cell">
                      Academic Year
                    </th>
                    <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider hidden lg:table-cell">
                      DD Details
                    </th>
                    <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider whitespace-nowrap">
                      Amount
                    </th>
                    <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider whitespace-nowrap hidden xl:table-cell">
                      Paid Date
                    </th>
                    <th className="px-4 sm:px-6 py-3 sm:py-4 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredPayments.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center justify-center text-muted-foreground">
                          <FiDollarSign className="w-12 h-12 mb-3 opacity-50" />
                          <p className="text-lg font-medium">No payment records found</p>
                          <p className="text-sm mt-1">Try adjusting your filters or add a new payment record</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredPayments.map((payment) => (
                      <tr key={payment.payment.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-4 sm:px-6 py-4">
                          <div>
                            <p className="font-medium text-foreground">{payment.student?.name || "N/A"}</p>
                            <p className="text-xs sm:text-sm text-muted-foreground">{payment.student?.email || "N/A"}</p>
                            <p className="text-xs sm:text-sm text-muted-foreground">{payment.student?.phone || "N/A"}</p>
                            {payment.application && (
                              <p className="text-xs text-muted-foreground mt-1">
                                Room: {payment.application.roomNumber} - Block {payment.application.assignedBlock}
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                          <Badge variant="outline" className="text-xs">{getSemesterLabel(payment.payment.semester)}</Badge>
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap hidden md:table-cell">
                          <span className="text-sm text-foreground">{payment.payment.academicYear}</span>
                        </td>
                        <td className="px-4 sm:px-6 py-4 hidden lg:table-cell">
                          <div className="text-sm">
                            {payment.payment.ddNumber ? (
                              <>
                                <p className="font-medium text-foreground">DD: {payment.payment.ddNumber}</p>
                                <p className="text-muted-foreground">{payment.payment.bankName || "N/A"}</p>
                              </>
                            ) : (
                              <span className="text-muted-foreground">No DD info</span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                          {payment.payment.amountPaid ? (
                            <span className="font-semibold text-foreground flex items-center text-sm">
                              <FaRupeeSign className="w-3 h-3" />
                              {payment.payment.amountPaid.toLocaleString('en-IN')}
                            </span>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(payment.payment.paymentStatus)}
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap hidden xl:table-cell">
                          <span className="text-sm text-foreground">
                            {payment.payment.paidDate
                              ? new Date(payment.payment.paidDate).toLocaleDateString('en-IN')
                              : "-"}
                          </span>
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditPayment(payment)}
                              className="hover:bg-blue-50 hover:text-blue-600"
                            >
                              <FiEdit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteClick(payment)}
                              className="hover:bg-red-50 hover:text-red-600"
                            >
                              <FiTrash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Add/Edit Payment Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {dialogMode === "add" ? "Add Payment Record" : "Edit Payment Record"}
              </DialogTitle>
              <DialogDescription>
                {dialogMode === "add"
                  ? "Create a new payment record for a student"
                  : "Update the payment record details"}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              {dialogMode === "add" && (
                <div>
                  <Label>Select Student *</Label>
                  <div className="space-y-2">
                    <Input
                      placeholder="Search student by name, email, or phone..."
                      value={studentSearch}
                      onChange={(e) => {
                        setStudentSearch(e.target.value);
                        searchStudents(e.target.value);
                      }}
                    />
                    {selectedStudent ? (
                      <div className="p-3 bg-muted rounded-lg flex items-center justify-between">
                        <div>
                          <p className="font-medium">{selectedStudent.user.name}</p>
                          <p className="text-sm text-muted-foreground">{selectedStudent.user.email}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedStudent(null)}
                        >
                          <FiX className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : students.length > 0 ? (
                      <div className="border rounded-lg divide-y max-h-48 overflow-y-auto">
                        {students.map((student) => (
                          <div
                            key={student.user.id}
                            className="p-3 hover:bg-muted cursor-pointer transition-colors"
                            onClick={() => {
                              setSelectedStudent(student);
                              setStudentSearch("");
                              setStudents([]);
                            }}
                          >
                            <p className="font-medium">{student.user.name}</p>
                            <p className="text-sm text-muted-foreground">{student.user.email}</p>
                            <p className="text-sm text-muted-foreground">{student.user.phone}</p>
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </div>
              )}

              {dialogMode === "edit" && selectedStudent && (
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Student</p>
                  <p className="font-medium">{selectedStudent.user.name}</p>
                  <p className="text-sm text-muted-foreground">{selectedStudent.user.email}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Semester *</Label>
                  <Select
                    value={formData.semester}
                    onValueChange={(value) => setFormData({ ...formData, semester: value })}
                    disabled={dialogMode === "edit"}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select semester" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sem1">Semester 1</SelectItem>
                      <SelectItem value="sem2">Semester 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Academic Year *</Label>
                  <Input
                    placeholder="e.g., 2024-2025"
                    value={formData.academicYear}
                    onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                    disabled={dialogMode === "edit"}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>DD Number</Label>
                  <Input
                    placeholder="Enter DD number"
                    value={formData.ddNumber}
                    onChange={(e) => setFormData({ ...formData, ddNumber: e.target.value })}
                  />
                </div>

                <div>
                  <Label>Bank Name</Label>
                  <Input
                    placeholder="Enter bank name"
                    value={formData.bankName}
                    onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Amount Paid</Label>
                  <Input
                    type="number"
                    placeholder="Enter amount"
                    value={formData.amountPaid}
                    onChange={(e) => setFormData({ ...formData, amountPaid: e.target.value })}
                  />
                </div>

                <div>
                  <Label>Payment Status</Label>
                  <Select
                    value={formData.paymentStatus}
                    onValueChange={(value) => setFormData({ ...formData, paymentStatus: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="partial">Partial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Paid Date</Label>
                <Input
                  type="date"
                  value={formData.paidDate}
                  onChange={(e) => setFormData({ ...formData, paidDate: e.target.value })}
                />
              </div>

              <div>
                <Label>Notes</Label>
                <Textarea
                  placeholder="Add any additional notes..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={submitting}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={submitting}>
                {submitting ? "Saving..." : dialogMode === "add" ? "Add Payment" : "Update Payment"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Payment Record</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this payment record? This action cannot be undone.
                {paymentToDelete && (
                  <div className="mt-4 p-3 bg-muted rounded-lg">
                    <p className="font-medium">{paymentToDelete.student?.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {getSemesterLabel(paymentToDelete.payment.semester)} - {paymentToDelete.payment.academicYear}
                    </p>
                  </div>
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteConfirm}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Search,
  Plus,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
  Edit,
  Trash2,
  FileText,
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

interface Payment {
  payment: {
    id: string;
    semester: string;
    academicYear: string;
    ddNumber: string | null;
    bankName: string | null;
    amountPaid: number | null;
    paymentStatus: string;
    paidDate: Date | null;
    notes: string | null;
    createdAt: Date;
  };
  student: {
    id: string;
    name: string | null;
    email: string | null;
    phone: string | null;
  } | null;
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

export default function PaymentsPage() {
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
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  // Form states
  const [studentSearch, setStudentSearch] = useState("");
  const [students, setStudents] = useState<any[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
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

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    } else if (session?.user.role !== "admin") {
      router.push("/");
    } else {
      fetchPayments();
    }
  }, [session, status, router]);

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

    if (filterSemester) {
      filtered = filtered.filter((p) => p.payment.semester === filterSemester);
    }

    if (filterStatus) {
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
        setStudents(data.students);
      }
    } catch (error) {
      console.error("Error searching students:", error);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      searchStudents(studentSearch);
    }, 300);
    return () => clearTimeout(timer);
  }, [studentSearch]);

  const handleAddPayment = async () => {
    if (!selectedStudent || !formData.semester || !formData.academicYear) {
      toast.error("Please select student, semester, and academic year");
      return;
    }

    try {
      const res = await fetch("/api/admin/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: selectedStudent.user.id,
          applicationId: selectedStudent.application?.id || null,
          ...formData,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Payment record added successfully");
        setAddDialogOpen(false);
        resetForm();
        fetchPayments();
      } else {
        toast.error(data.error || "Failed to add payment");
      }
    } catch (error) {
      console.error("Error adding payment:", error);
      toast.error("Failed to add payment");
    }
  };

  const handleUpdatePayment = async () => {
    if (!selectedPayment) return;

    try {
      const res = await fetch(`/api/admin/payments/${selectedPayment.payment.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Payment updated successfully");
        setEditDialogOpen(false);
        resetForm();
        fetchPayments();
      } else {
        toast.error(data.error || "Failed to update payment");
      }
    } catch (error) {
      console.error("Error updating payment:", error);
      toast.error("Failed to update payment");
    }
  };

  const handleDeletePayment = async (id: string) => {
    if (!confirm("Are you sure you want to delete this payment record?")) return;

    try {
      const res = await fetch(`/api/admin/payments/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Payment deleted successfully");
        fetchPayments();
      } else {
        toast.error(data.error || "Failed to delete payment");
      }
    } catch (error) {
      console.error("Error deleting payment:", error);
      toast.error("Failed to delete payment");
    }
  };

  const openEditDialog = (payment: Payment) => {
    setSelectedPayment(payment);
    setFormData({
      semester: payment.payment.semester,
      academicYear: payment.payment.academicYear,
      ddNumber: payment.payment.ddNumber || "",
      bankName: payment.payment.bankName || "",
      amountPaid: payment.payment.amountPaid?.toString() || "",
      paymentStatus: payment.payment.paymentStatus,
      paidDate: payment.payment.paidDate
        ? new Date(payment.payment.paidDate).toISOString().split("T")[0]
        : "",
      notes: payment.payment.notes || "",
    });
    setEditDialogOpen(true);
  };

  const resetForm = () => {
    setSelectedStudent(null);
    setStudentSearch("");
    setStudents([]);
    setFormData({
      semester: "",
      academicYear: "",
      ddNumber: "",
      bankName: "",
      amountPaid: "",
      paymentStatus: "pending",
      paidDate: "",
      notes: "",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-500">Paid</Badge>;
      case "partial":
        return <Badge className="bg-yellow-500">Partial</Badge>;
      case "pending":
        return <Badge className="bg-red-500">Pending</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const formatCurrency = (amount: number | null) => {
    if (!amount) return "₹0";
    return `₹${amount.toLocaleString("en-IN")}`;
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-IN");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Payment Tracking</h1>
          <p className="text-muted-foreground">Manage semester fees and DD records</p>
        </div>
        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Payment
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add Payment Record</DialogTitle>
              <DialogDescription>Add a new semester payment record for a student</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Search Student</Label>
                <Input
                  placeholder="Search by name, email, or phone"
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                />
                {students.length > 0 && (
                  <div className="mt-2 border rounded-md max-h-48 overflow-y-auto">
                    {students.map((s) => (
                      <div
                        key={s.user.id}
                        onClick={() => {
                          setSelectedStudent(s);
                          setStudentSearch(s.user.name || s.user.email || "");
                          setStudents([]);
                        }}
                        className="p-2 hover:bg-gray-100 cursor-pointer border-b"
                      >
                        <div className="font-medium">{s.user.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {s.user.email} | {s.user.phone}
                        </div>
                        {s.application && (
                          <div className="text-xs text-muted-foreground">
                            App: {s.application.applicationNumber} | Block: {s.application.assignedBlock}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {selectedStudent && (
                <Card className="p-4 bg-blue-50">
                  <div className="font-medium">{selectedStudent.user.name}</div>
                  <div className="text-sm">{selectedStudent.user.email}</div>
                </Card>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Semester *</Label>
                  <Select value={formData.semester} onValueChange={(v) => setFormData({ ...formData, semester: v })}>
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
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>DD Number</Label>
                  <Input
                    placeholder="Demand Draft Number"
                    value={formData.ddNumber}
                    onChange={(e) => setFormData({ ...formData, ddNumber: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Bank Name</Label>
                  <Input
                    placeholder="Bank name"
                    value={formData.bankName}
                    onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Amount Paid (₹)</Label>
                  <Input
                    type="number"
                    placeholder="Amount"
                    value={formData.amountPaid}
                    onChange={(e) => setFormData({ ...formData, amountPaid: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Payment Status</Label>
                  <Select
                    value={formData.paymentStatus}
                    onValueChange={(v) => setFormData({ ...formData, paymentStatus: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="partial">Partial</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
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
                  placeholder="Additional notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => {
                  setAddDialogOpen(false);
                  resetForm();
                }}>
                  Cancel
                </Button>
                <Button onClick={handleAddPayment}>Add Payment</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Payments</p>
              <h3 className="text-2xl font-bold">{stats.total}</h3>
            </div>
            <FileText className="h-8 w-8 text-blue-500" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Paid</p>
              <h3 className="text-2xl font-bold text-green-600">{stats.paid}</h3>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Pending</p>
              <h3 className="text-2xl font-bold text-red-600">{stats.pending}</h3>
            </div>
            <Clock className="h-8 w-8 text-red-500" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Amount</p>
              <h3 className="text-2xl font-bold">{formatCurrency(stats.totalAmount)}</h3>
            </div>
            <TrendingUp className="h-8 w-8 text-purple-500" />
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, DD, or email..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={filterSemester} onValueChange={setFilterSemester}>
            <SelectTrigger>
              <SelectValue placeholder="All Semesters" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Semesters</SelectItem>
              <SelectItem value="sem1">Semester 1</SelectItem>
              <SelectItem value="sem2">Semester 2</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger>
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="partial">Partial</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
            </SelectContent>
          </Select>
          <Input
            placeholder="Academic Year (2024-2025)"
            value={filterYear}
            onChange={(e) => setFilterYear(e.target.value)}
          />
        </div>
      </Card>

      {/* Payments Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Block/Room</TableHead>
              <TableHead>Semester</TableHead>
              <TableHead>Year</TableHead>
              <TableHead>DD Number</TableHead>
              <TableHead>Bank</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Paid Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPayments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={11} className="text-center py-8 text-muted-foreground">
                  No payment records found
                </TableCell>
              </TableRow>
            ) : (
              filteredPayments.map((p) => (
                <TableRow key={p.payment.id}>
                  <TableCell className="font-medium">{p.student?.name || "N/A"}</TableCell>
                  <TableCell>
                    <div className="text-sm">{p.student?.email}</div>
                    <div className="text-xs text-muted-foreground">{p.student?.phone}</div>
                  </TableCell>
                  <TableCell>
                    {p.application?.assignedBlock || "N/A"} / {p.application?.roomNumber || "N/A"}
                  </TableCell>
                  <TableCell>
                    {p.payment.semester === "sem1" ? "Semester 1" : "Semester 2"}
                  </TableCell>
                  <TableCell>{p.payment.academicYear}</TableCell>
                  <TableCell>{p.payment.ddNumber || "N/A"}</TableCell>
                  <TableCell>{p.payment.bankName || "N/A"}</TableCell>
                  <TableCell className="font-medium">
                    {formatCurrency(p.payment.amountPaid)}
                  </TableCell>
                  <TableCell>{getStatusBadge(p.payment.paymentStatus)}</TableCell>
                  <TableCell>{formatDate(p.payment.paidDate)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => openEditDialog(p)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeletePayment(p.payment.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Payment Record</DialogTitle>
            <DialogDescription>Update payment details</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>DD Number</Label>
                <Input
                  placeholder="Demand Draft Number"
                  value={formData.ddNumber}
                  onChange={(e) => setFormData({ ...formData, ddNumber: e.target.value })}
                />
              </div>
              <div>
                <Label>Bank Name</Label>
                <Input
                  placeholder="Bank name"
                  value={formData.bankName}
                  onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Amount Paid (₹)</Label>
                <Input
                  type="number"
                  placeholder="Amount"
                  value={formData.amountPaid}
                  onChange={(e) => setFormData({ ...formData, amountPaid: e.target.value })}
                />
              </div>
              <div>
                <Label>Payment Status</Label>
                <Select
                  value={formData.paymentStatus}
                  onValueChange={(v) => setFormData({ ...formData, paymentStatus: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="partial">Partial</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
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
                placeholder="Additional notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setEditDialogOpen(false);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleUpdatePayment}>Update Payment</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

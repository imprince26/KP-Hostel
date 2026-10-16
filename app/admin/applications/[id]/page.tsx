"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  Building,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  User,
  XCircle,
  FileText,
  AlertCircle,
  ShieldAlert,
  Home,
  Check,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatIndianDate } from "@/lib/utils";

interface ApplicationDetail {
  id: string;
  userId: string | null;
  applicationNumber: string;
  status: "submitted" | "under_review" | "approved" | "rejected" | "admitted" | "active" | "completed";
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: "male" | "female" | "other";
  caste: string;
  subCaste: string;
  passportPhoto: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  collegeName: string;
  course: string;
  year: string;
  studentId: string | null;
  guardianName: string;
  guardianPhone: string;
  guardianRelation: string;
  blockPreference: string | null;
  assignedBlock: string | null;
  roomNumber: string | null;
  admissionStartDate: string | null;
  admissionEndDate: string | null;
  adminNotes: string | null;
  reviewedBy: string | null;
  reviewedAt: string | null;
  rejectionReason: string | null;
  createdAt: string;
  updatedAt: string;
}

interface LinkedUser {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  role: string;
  image: string | null;
}

interface Reviewer {
  id: string;
  name: string | null;
  email: string | null;
}

export default function ApplicationDetailPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const applicationId = params?.id as string;

  const [application, setApplication] = useState<ApplicationDetail | null>(null);
  const [user, setUser] = useState<LinkedUser | null>(null);
  const [reviewer, setReviewer] = useState<Reviewer | null>(null);
  const [loading, setLoading] = useState(true);

  // Review Dialog State
  const [reviewAction, setReviewAction] = useState<"approve" | "reject" | null>(null);
  const [selectedBlock, setSelectedBlock] = useState<string>("A");
  const [roomNumber, setRoomNumber] = useState<string>("");
  const [admissionStart, setAdmissionStart] = useState<string>("");
  const [admissionEnd, setAdmissionEnd] = useState<string>("");
  const [adminNotes, setAdminNotes] = useState<string>("");
  const [actionLoading, setActionLoading] = useState(false);

  // Authentication gate
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    } else if (
      status === "authenticated" &&
      session?.user &&
      "role" in session.user &&
      session.user.role !== "admin"
    ) {
      router.push("/");
    }
  }, [status, session, router]);

  const fetchApplication = async () => {
    if (!applicationId) return;
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/applications/${applicationId}`);
      if (!res.ok) {
        if (res.status === 404) {
          toast.error("Application not found");
          router.push("/admin/applications");
          return;
        }
        throw new Error("Failed to load application");
      }
      const data = await res.json();
      setApplication(data.application);
      setUser(data.user);
      setReviewer(data.reviewer);

      // Pre-fill allotment values if already set
      if (data.application?.assignedBlock) {
        setSelectedBlock(data.application.assignedBlock);
      }
      if (data.application?.roomNumber) {
        setRoomNumber(data.application.roomNumber);
      }
    } catch (error) {
      console.error("Error loading application:", error);
      toast.error("Failed to fetch application details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      fetchApplication();
    }
  }, [applicationId, status]);

  const handleReviewSubmit = async () => {
    if (!application) return;

    if (reviewAction === "reject" && !adminNotes.trim()) {
      toast.error("Please provide a rejection reason");
      return;
    }

    if (reviewAction === "approve" && !roomNumber.trim()) {
      toast.error("Please specify an assigned room number");
      return;
    }

    try {
      setActionLoading(true);
      const payload: Record<string, any> = {
        status: reviewAction === "approve" ? "approved" : "rejected",
        action: reviewAction,
        comments: adminNotes,
        rejectionReason: reviewAction === "reject" ? adminNotes : undefined,
      };

      if (reviewAction === "approve") {
        payload.assignedBlock = selectedBlock;
        payload.roomNumber = roomNumber;
        if (admissionStart) payload.admissionStartDate = admissionStart;
        if (admissionEnd) payload.admissionEndDate = admissionEnd;
      }

      const res = await fetch(`/api/admin/applications/${application.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update application review");
      }

      toast.success(
        reviewAction === "approve"
          ? "Application approved and room allotted successfully"
          : "Application rejected successfully"
      );
      setReviewAction(null);
      setAdminNotes("");
      fetchApplication();
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Review submission failed";
      toast.error(msg);
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium">Approved</Badge>;
      case "admitted":
      case "active":
        return <Badge className="bg-primary text-primary-foreground font-medium">Resident Active</Badge>;
      case "rejected":
        return <Badge variant="destructive" className="font-medium">Rejected</Badge>;
      case "under_review":
        return <Badge variant="secondary" className="bg-amber-100 text-amber-900 border-amber-300 font-medium">Under Review</Badge>;
      default:
        return <Badge variant="outline" className="font-medium capitalize">{status.replace("_", " ")}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-sm font-medium text-muted-foreground">Loading application details...</p>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="min-h-screen bg-muted/30 py-12 px-4 text-center">
        <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-3" />
        <h2 className="text-xl font-bold font-display text-foreground">Application Not Found</h2>
        <p className="text-sm text-muted-foreground mt-1">This application does not exist or has been removed.</p>
        <Button onClick={() => router.push("/admin/applications")} className="mt-4">
          Return to Applications
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 py-4 sm:py-8 px-3 sm:px-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Top Navigation */}
        <div className="flex items-center justify-between gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="gap-2 text-xs sm:text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>

        {/* Main Header Card */}
        <Card className="border-0 shadow-xs bg-card overflow-hidden">
          <div className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/80 bg-muted/20">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground">
                  Application ID
                </span>
                <span className="text-sm font-mono font-bold text-foreground">
                  #{application.applicationNumber}
                </span>
                {getStatusBadge(application.status)}
              </div>
              <h1 className="text-xl sm:text-2xl font-bold font-display text-foreground">
                {application.fullName}
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-2">
                <Clock className="h-3.5 w-3.5" />
                Submitted on {formatIndianDate(application.createdAt, "datetime")}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              {(application.status === "submitted" || application.status === "under_review") && (
                <>
                  <Button
                    size="sm"
                    onClick={() => setReviewAction("approve")}
                    className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    <Check className="h-4 w-4" />
                    Approve Application
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setReviewAction("reject")}
                    className="gap-1.5 text-destructive hover:bg-destructive/10 border-destructive/30"
                  >
                    <X className="h-4 w-4" />
                    Reject
                  </Button>
                </>
              )}

              {application.status === "approved" && (
                <Button
                  size="sm"
                  onClick={() => setReviewAction("approve")}
                  className="gap-1.5"
                >
                  <Home className="h-4 w-4" />
                  Edit Allotment
                </Button>
              )}
            </div>
          </div>

          <CardContent className="p-4 sm:p-6 space-y-6">
            {/* Rejection notice banner if rejected */}
            {application.status === "rejected" && (
              <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-start gap-3">
                <ShieldAlert className="h-5 w-5 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-sm">Application Rejected</h4>
                  <p className="text-xs mt-1 text-destructive/90">
                    {application.rejectionReason || "No specific rejection reason recorded."}
                  </p>
                </div>
              </div>
            )}

            {/* Hostel Allocation Highlight if Approved or Admitted */}
            {(application.assignedBlock || application.roomNumber) && (
              <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Building className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs uppercase font-semibold text-muted-foreground">Allotted Accommodation</p>
                    <p className="text-base sm:text-lg font-bold font-display text-foreground">
                      Hostel Block {application.assignedBlock} &bull; Room {application.roomNumber || "Pending"}
                    </p>
                  </div>
                </div>
                {(application.admissionStartDate || application.admissionEndDate) && (
                  <div className="text-xs text-muted-foreground sm:text-right">
                    <p>Period: {formatIndianDate(application.admissionStartDate)} &ndash; {formatIndianDate(application.admissionEndDate)}</p>
                  </div>
                )}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Photo & Identity */}
              <div className="md:col-span-1 space-y-4">
                <div className="p-4 bg-muted/20 rounded-xl border border-border/80 text-center space-y-3">
                  <div className="relative w-36 h-44 mx-auto rounded-lg overflow-hidden border-2 border-border shadow-xs bg-muted">
                    {application.passportPhoto ? (
                      <Image
                        src={application.passportPhoto}
                        alt={application.fullName}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 150px, 150px"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground p-2">
                        <User className="h-10 w-10 mb-1 opacity-50" />
                        <span className="text-[11px]">No Photo</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground text-sm">{application.fullName}</h3>
                    <p className="text-xs text-muted-foreground capitalize">
                      {application.gender} &bull; DOB: {formatIndianDate(application.dateOfBirth, "numeric")}
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      Caste: {application.caste} ({application.subCaste})
                    </p>
                  </div>
                </div>

                {/* Account Link Card */}
                {user && (
                  <div className="p-3 bg-muted/20 rounded-lg border border-border/80 text-xs space-y-1">
                    <p className="font-semibold text-foreground">Linked Portal Account</p>
                    <p className="text-muted-foreground truncate">{user.email}</p>
                    <p className="text-muted-foreground">Account Role: <span className="capitalize">{user.role}</span></p>
                  </div>
                )}
              </div>

              {/* Comprehensive Details Tabs */}
              <div className="md:col-span-2 space-y-5">
                {/* Academic Information */}
                <div className="space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-primary" />
                    Academic Profile
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-muted/20 rounded-xl border border-border/80 text-xs">
                    <div>
                      <p className="text-muted-foreground">College / University</p>
                      <p className="font-semibold text-foreground text-sm mt-0.5">{application.collegeName}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Course & Branch</p>
                      <p className="font-semibold text-foreground text-sm mt-0.5">{application.course}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Academic Year</p>
                      <p className="font-semibold text-foreground mt-0.5">{application.year}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Student ID / Roll No</p>
                      <p className="font-semibold text-foreground mt-0.5">{application.studentId || "Not specified"}</p>
                    </div>
                  </div>
                </div>

                {/* Contact & Address */}
                <div className="space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    Contact & Address
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-muted/20 rounded-xl border border-border/80 text-xs">
                    <div>
                      <p className="text-muted-foreground">Student Email</p>
                      <p className="font-semibold text-foreground mt-0.5">{application.email}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Student Phone</p>
                      <p className="font-semibold text-foreground mt-0.5">{application.phone}</p>
                    </div>
                    <div className="sm:col-span-2">
                      <p className="text-muted-foreground">Residential Address</p>
                      <p className="font-semibold text-foreground mt-0.5">
                        {application.address}, {application.city}, {application.state} - {application.pincode}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Guardian Details */}
                <div className="space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                    <User className="h-4 w-4 text-primary" />
                    Guardian Information
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-muted/20 rounded-xl border border-border/80 text-xs">
                    <div>
                      <p className="text-muted-foreground">Guardian Name</p>
                      <p className="font-semibold text-foreground mt-0.5">{application.guardianName}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Relation</p>
                      <p className="font-semibold text-foreground mt-0.5">{application.guardianRelation}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Guardian Phone</p>
                      <p className="font-semibold text-foreground mt-0.5">{application.guardianPhone}</p>
                    </div>
                  </div>
                </div>

                {/* Hostel Preferences & Audit */}
                <div className="space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                    <Building className="h-4 w-4 text-primary" />
                    Hostel Preferences & Admin Audit
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-muted/20 rounded-xl border border-border/80 text-xs">
                    <div>
                      <p className="text-muted-foreground">Block Preference</p>
                      <p className="font-semibold text-foreground mt-0.5">
                        {application.blockPreference ? `Block ${application.blockPreference}` : "No preference"}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Assigned Block & Room</p>
                      <p className="font-semibold text-foreground mt-0.5">
                        {application.assignedBlock
                          ? `Block ${application.assignedBlock} - Room ${application.roomNumber || "TBD"}`
                          : "Not allotted"}
                      </p>
                    </div>
                    {reviewer && (
                      <div className="sm:col-span-2">
                        <p className="text-muted-foreground">Reviewed By</p>
                        <p className="font-semibold text-foreground mt-0.5">
                          {reviewer.name} ({reviewer.email}) on {formatIndianDate(application.reviewedAt, "datetime")}
                        </p>
                      </div>
                    )}
                    {application.adminNotes && (
                      <div className="sm:col-span-2">
                        <p className="text-muted-foreground">Internal Admin Notes</p>
                        <p className="font-medium text-foreground mt-0.5 bg-background p-2.5 rounded border border-border">
                          {application.adminNotes}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Review Dialog */}
        <Dialog open={!!reviewAction} onOpenChange={() => setReviewAction(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-lg font-bold font-display">
                {reviewAction === "approve" ? (
                  <>
                    <Check className="h-5 w-5 text-emerald-600" />
                    Approve Application & Allot Room
                  </>
                ) : (
                  <>
                    <X className="h-5 w-5 text-destructive" />
                    Reject Application
                  </>
                )}
              </DialogTitle>
              <DialogDescription className="text-xs">
                #{application.applicationNumber} &bull; {application.fullName}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2">
              {reviewAction === "approve" && (
                <>
                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium block">Hostel Block *</Label>
                    <Select value={selectedBlock} onValueChange={setSelectedBlock}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select block" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A">Block A</SelectItem>
                        <SelectItem value="B">Block B</SelectItem>
                        <SelectItem value="C">Block C</SelectItem>
                        <SelectItem value="D">Block D</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="roomNumber" className="text-sm font-medium block">Room Number *</Label>
                    <Input
                      id="roomNumber"
                      value={roomNumber}
                      onChange={(e) => setRoomNumber(e.target.value)}
                      placeholder="e.g., 101, 204"
                      className="mt-1"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="admissionStart" className="text-sm font-medium block">Admission Start Date</Label>
                      <Input
                        id="admissionStart"
                        type="date"
                        value={admissionStart}
                        onChange={(e) => setAdmissionStart(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="admissionEnd" className="text-sm font-medium block">Admission End Date</Label>
                      <Input
                        id="admissionEnd"
                        type="date"
                        value={admissionEnd}
                        onChange={(e) => setAdmissionEnd(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="space-y-2 pt-1">
                <Label htmlFor="admin-notes" className="text-sm font-medium block">
                  {reviewAction === "approve" ? "Approval Message / Note" : "Rejection Reason *"}
                </Label>
                <Textarea
                  id="admin-notes"
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder={
                    reviewAction === "approve"
                      ? "Congratulations! Your admission has been approved..."
                      : "Please specify the reason for rejection (documentation incomplete, eligibility, etc.)..."
                  }
                  rows={4}
                  className="mt-1 min-h-27.5"
                />
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setReviewAction(null)}
                disabled={actionLoading}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleReviewSubmit}
                disabled={actionLoading}
                className={reviewAction === "approve" ? "bg-emerald-600 hover:bg-emerald-700 text-white" : "bg-destructive text-destructive-foreground"}
              >
                {actionLoading ? "Processing..." : reviewAction === "approve" ? "Confirm Approval" : "Confirm Rejection"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import {
  MdDescription,
  MdFilterList,
  MdVisibility,
  MdCheck,
  MdClose,
  MdSchedule,
  MdPerson,
  MdEmail,
  MdPhone,
  MdLocationOn,
  MdSchool,
  MdHome,
  MdCheckCircle,
  MdCamera,
} from "react-icons/md";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Application {
  id: string;
  applicationNumber: string;
  status: string;
  fullName: string;
  dateOfBirth: string;
  gender: string;
  caste: string;
  subCaste: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  collegeName: string;
  course: string;
  year: string;
  studentId?: string;
  guardianName: string;
  guardianPhone: string;
  guardianRelation: string;
  passportPhoto: string;
  blockPreference?: string;
  assignedBlock?: string;
  roomNumber?: string;
  admissionStartDate?: string;
  admissionEndDate?: string;
  adminNotes?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  rejectionReason?: string;
  fatherName?: string;
  motherName?: string;
  createdAt: string;
  updatedAt: string;
  // User info from join
  userName?: string;
  userEmail?: string;
  userPhone?: string;
}

interface HostelBlock {
  id: string;
  name: string;
  capacity: number;
  currentOccupancy: number;
  semester1Fee: number;
  semester2Fee: number;
}

export default function AdminApplications() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [applications, setApplications] = useState<Application[]>([]);
  const [filteredApps, setFilteredApps] = useState<Application[]>([]);
  const [blocks, setBlocks] = useState<HostelBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterBlock, setFilterBlock] = useState<string>("all");
  const [filterGender, setFilterGender] = useState<string>("all");
  const [filterCourse, setFilterCourse] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Pagination
  const totalPages = Math.ceil(filteredApps.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentApps = filteredApps.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [reviewAction, setReviewAction] = useState<"approve" | "reject" | null>(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [selectedBlock, setSelectedBlock] = useState("");
  const [roomNumber, setRoomNumber] = useState("");
  const [admissionStart, setAdmissionStart] = useState<Date>();
  const [admissionEnd, setAdmissionEnd] = useState<Date>();
  const [submitting, setSubmitting] = useState(false);
  const [showActivationDialog, setShowActivationDialog] = useState(false);

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
      fetchData();

      // Check if there's an app ID in URL params
      const appId = searchParams.get("id");
      if (appId) {
        // Will open modal after data is fetched
      }
    }
  }, [status, session, router, searchParams]);

  useEffect(() => {
    let filtered = applications;

    // Filter by status
    if (filterStatus !== "all") {
      filtered = filtered.filter(app => app.status === filterStatus);
    }

    // Filter by block
    if (filterBlock !== "all") {
      filtered = filtered.filter(app => app.assignedBlock === filterBlock || (filterBlock === "unassigned" && !app.assignedBlock));
    }

    // Filter by gender
    if (filterGender !== "all") {
      filtered = filtered.filter(app => app.gender === filterGender);
    }

    // Filter by course
    if (filterCourse !== "all") {
      filtered = filtered.filter(app => app.course === filterCourse);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(app =>
        app.applicationNumber.toLowerCase().includes(query) ||
        app.fullName.toLowerCase().includes(query) ||
        app.email.toLowerCase().includes(query) ||
        app.phone.includes(query) ||
        app.collegeName.toLowerCase().includes(query) ||
        app.course.toLowerCase().includes(query) ||
        app.guardianName.toLowerCase().includes(query)
      );
    }

    // Sort applications
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "oldest":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case "name":
          return a.fullName.localeCompare(b.fullName);
        case "applicationNumber":
          return a.applicationNumber.localeCompare(b.applicationNumber);
        default:
          return 0;
      }
    });

    setFilteredApps(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [filterStatus, filterBlock, filterGender, filterCourse, searchQuery, sortBy, applications]);

  const fetchData = async () => {
    try {
      // Fetch applications
      const appsRes = await fetch("/api/admin/applications");
      const appsData = await appsRes.json();

      console.log("API Response:", appsData);
      console.log("Applications:", appsData.applications);

      if (appsData.applications && appsData.applications.length > 0) {
        // Transform the data from API format to flat structure
        const transformedApps = appsData.applications.map((item: any) => ({
          ...item.application,
          userName: item.user?.name,
          userEmail: item.user?.email,
          userPhone: item.user?.phone,
        }));

        console.log("Transformed Applications:", transformedApps);
        setApplications(transformedApps);
        setFilteredApps(transformedApps);

        // Check if app ID in URL
        const appId = searchParams.get("id");
        if (appId) {
          const app = transformedApps.find((a: Application) => a.id === appId);
          if (app) setSelectedApp(app);
        }
      } else {
        console.log("No applications found in response");
        setApplications([]);
        setFilteredApps([]);
      }

      // Fetch blocks for assignment
      const blocksRes = await fetch("/api/admin/blocks");
      const blocksData = await blocksRes.json();
      if (blocksData.blocks) {
        setBlocks(blocksData.blocks);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const config = {
      submitted: { label: "New", class: "bg-primary/10 text-primary border-primary/20" },
      under_review: { label: "Under Review", class: "bg-primary/10 text-primary border-primary/20" },
      approved: { label: "Approved", class: "bg-primary/10 text-primary border-primary/20" },
      rejected: { label: "Rejected", class: "bg-primary/10 text-primary border-primary/20" },
      active: { label: "Active", class: "bg-primary/10 text-primary border-primary/20" },
    };

    const { label, class: className } = config[status as keyof typeof config] ||
      { label: status, class: "bg-muted text-muted-foreground border-muted" };

    return <Badge variant="outline" className={className}>{label}</Badge>;
  };

  const handleReview = (app: Application, action: "approve" | "reject") => {
    setSelectedApp(app);
    setReviewAction(action);
    setAdminNotes(app.adminNotes || "");
    setSelectedBlock(app.assignedBlock || "");
    setRoomNumber(app.roomNumber || "");
    setAdmissionStart(app.admissionStartDate ? new Date(app.admissionStartDate) : undefined);
    setAdmissionEnd(app.admissionEndDate ? new Date(app.admissionEndDate) : undefined);
  };

  const handleSubmitReview = async () => {
    if (!selectedApp || !reviewAction) return;

    // Validation - only require admin notes, not block/room for approval
    if (!adminNotes.trim()) {
      toast.error("Please provide review notes");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`/api/admin/applications/${selectedApp.id}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: reviewAction,
          comments: adminNotes,
          // Block/room assignment removed from approval - will be done during activation
        }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(`Application ${reviewAction === "approve" ? "approved" : "rejected"} successfully!`);
        setSelectedApp(null);
        setReviewAction(null);
        fetchData(); // Refresh data
      } else {
        toast.error(data.error || "Failed to submit review");
      }
    } catch (error) {
      console.error("Review submission error:", error);
      toast.error("Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  const handleActivateAdmission = async (app: Application) => {
    setSelectedApp(app);
    setSelectedBlock(app.assignedBlock || "");
    setRoomNumber(app.roomNumber || "");
    setAdmissionStart(app.admissionStartDate ? new Date(app.admissionStartDate) : undefined);
    setAdmissionEnd(app.admissionEndDate ? new Date(app.admissionEndDate) : undefined);
    setShowActivationDialog(true);
  };

  const confirmActivateAdmission = async () => {
    if (!selectedApp) return;

    // Validation
    if (!selectedBlock || !roomNumber || !admissionStart || !admissionEnd) {
      toast.error("Please fill all fields for activation");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`/api/admin/applications/${selectedApp.id}/activate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assignedBlock: selectedBlock,
          roomNumber,
          admissionStartDate: admissionStart?.toISOString().split('T')[0],
          admissionEndDate: admissionEnd?.toISOString().split('T')[0],
        }),
      });

      if (res.ok) {
        toast.success("Admission activated successfully!");
        setSelectedApp(null);
        setShowActivationDialog(false);
        fetchData();
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to activate admission");
      }
    } catch (error) {
      console.error("Activation error:", error);
      toast.error("Failed to activate admission");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Application Review</h1>
          <p className="text-muted-foreground">Review and manage hostel admission applications</p>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6 border-0 shadow-sm bg-card">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <MdFilterList className="w-5 h-5 text-primary" />
              Filter & Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Search */}
              <div>
                <Label htmlFor="search">Search Applications</Label>
                <Input
                  id="search"
                  placeholder="Search by application #, name, email, phone, college, course, guardian..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="max-w-lg"
                />
              </div>

              {/* Filters Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Status Filter */}
                <div>
                  <Label>Status</Label>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses ({applications.length})</SelectItem>
                      <SelectItem value="submitted">New ({applications.filter(a => a.status === "submitted").length})</SelectItem>
                      <SelectItem value="under_review">Under Review ({applications.filter(a => a.status === "under_review").length})</SelectItem>
                      <SelectItem value="approved">Approved ({applications.filter(a => a.status === "approved").length})</SelectItem>
                      <SelectItem value="rejected">Rejected ({applications.filter(a => a.status === "rejected").length})</SelectItem>
                      <SelectItem value="active">Active ({applications.filter(a => a.status === "active").length})</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Block Filter */}
                <div>
                  <Label>Block Assignment</Label>
                  <Select value={filterBlock} onValueChange={setFilterBlock}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Blocks" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Blocks</SelectItem>
                      <SelectItem value="unassigned">Unassigned</SelectItem>
                      {blocks.map(block => (
                        <SelectItem key={block.id} value={block.name}>
                          Block {block.name} ({applications.filter(a => a.assignedBlock === block.name).length})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Gender Filter */}
                <div>
                  <Label>Gender</Label>
                  <Select value={filterGender} onValueChange={setFilterGender}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Genders" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Genders</SelectItem>
                      <SelectItem value="male">Male ({applications.filter(a => a.gender === "male").length})</SelectItem>
                      <SelectItem value="female">Female ({applications.filter(a => a.gender === "female").length})</SelectItem>
                      <SelectItem value="other">Other ({applications.filter(a => a.gender === "other").length})</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Sort By */}
                <div>
                  <Label>Sort By</Label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="oldest">Oldest First</SelectItem>
                      <SelectItem value="name">Name (A-Z)</SelectItem>
                      <SelectItem value="applicationNumber">Application #</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Clear Filters */}
              {(filterStatus !== "all" || filterBlock !== "all" || filterGender !== "all" || filterCourse !== "all" || searchQuery) && (
                <div className="flex justify-end">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setFilterStatus("all");
                      setFilterBlock("all");
                      setFilterGender("all");
                      setFilterCourse("all");
                      setSearchQuery("");
                      setSortBy("newest");
                    }}
                  >
                    Clear All Filters
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Applications Table */}
        <Card className="border-0 shadow-sm bg-card">
          <CardHeader className="border-b border-border">
            <CardTitle className="text-lg">Applications ({filteredApps.length})</CardTitle>
            <CardDescription>Manage student admission applications</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            {filteredApps.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <MdDescription className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-lg font-semibold">No applications found</p>
                <p className="text-sm">Try adjusting your filters or search query</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 font-semibold text-sm text-foreground">
                          Application #
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-sm text-foreground">
                          Student Details
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-sm text-foreground">
                          College/Course
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-sm text-foreground">
                          Status
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-sm text-foreground">
                          Submitted
                        </th>
                        <th className="text-right py-3 px-4 font-semibold text-sm text-foreground">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentApps.map((app) => (
                        <tr key={app.id} className="border-b border-border hover:bg-muted/50">
                          <td className="py-3 px-4">
                            <code className="text-xs font-mono bg-muted px-2 py-1 rounded">
                              {app.applicationNumber}
                            </code>
                          </td>
                          <td className="py-3 px-4">
                            <div>
                              <p className="font-semibold text-foreground">{app.fullName}</p>
                              <p className="text-xs text-muted-foreground">{app.email}</p>
                              <p className="text-xs text-muted-foreground">{app.phone}</p>
                              <p className="text-xs text-muted-foreground">{app.gender} • {app.caste}</p>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div>
                              <p className="text-sm font-medium">{app.collegeName}</p>
                              <p className="text-xs text-muted-foreground">{app.course} - {app.year}</p>
                            </div>
                          </td>
                          <td className="py-3 px-4">{getStatusBadge(app.status)}</td>
                          <td className="py-3 px-4 text-sm text-muted-foreground">
                            {new Date(app.createdAt).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex justify-end gap-2">
                              <Button
                                onClick={() => setSelectedApp(app)}
                                size="sm"
                                variant="outline"
                              >
                                <MdVisibility className="mr-1 text-primary" />
                                View
                              </Button>
                              {(app.status === "submitted" || app.status === "under_review") && (
                                <>
                                  <Button
                                    onClick={(e) => { e.stopPropagation(); handleReview(app, "approve"); }}
                                    size="sm"
                                    variant="default"
                                  >
                                    <MdCheck className="mr-1" />
                                    Approve
                                  </Button>
                                  <Button
                                    onClick={(e) => { e.stopPropagation(); handleReview(app, "reject"); }}
                                    size="sm"
                                    variant="destructive"
                                  >
                                    <MdClose className="mr-1" />
                                    Reject
                                  </Button>
                                </>
                              )}
                              {(app.status === "approved" || app.status === "admitted" || app.status === "active") && (
                                <Button
                                  onClick={(e) => { e.stopPropagation(); handleActivateAdmission(app); }}
                                  size="sm"
                                  variant="outline"
                                  disabled={app.status === "active"}
                                >
                                  {app.status === "active" ? "Active" : "Activate"}
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-6">
                    <div className="text-sm text-muted-foreground">
                      Showing {startIndex + 1} to {Math.min(endIndex, filteredApps.length)} of {filteredApps.length} applications
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        Previous
                      </Button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter(page => {
                          const distance = Math.abs(page - currentPage);
                          return distance === 0 || distance === 1 || page === 1 || page === totalPages;
                        })
                        .map((page, index, array) => (
                          <div key={page} className="flex items-center">
                            {index > 0 && array[index - 1] !== page - 1 && (
                              <span className="px-2 text-muted-foreground">...</span>
                            )}
                            <Button
                              variant={currentPage === page ? "default" : "outline"}
                              size="sm"
                              onClick={() => handlePageChange(page)}
                            >
                              {page}
                            </Button>
                          </div>
                        ))}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* View Application Dialog */}
      <Dialog open={!!selectedApp && !reviewAction && !showActivationDialog} onOpenChange={() => setSelectedApp(null)}>
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <MdDescription className="text-primary" />
              Application Details
            </DialogTitle>
            <DialogDescription>
              {selectedApp?.applicationNumber}
            </DialogDescription>
          </DialogHeader>

          {selectedApp && (
            <div className="space-y-6">
              {/* Status */}
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Status</h4>
                  {getStatusBadge(selectedApp.status)}
                </div>
                <div className="flex gap-2">
                  {(selectedApp.status === "submitted" || selectedApp.status === "under_review") && (
                    <>
                      <Button
                        onClick={() => handleReview(selectedApp, "approve")}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <MdCheck className="mr-2" />
                        Approve
                      </Button>
                      <Button
                        onClick={() => handleReview(selectedApp, "reject")}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        <MdClose className="mr-2" />
                        Reject
                      </Button>
                    </>
                  )}
                  {(selectedApp.status === "approved" || selectedApp.status === "admitted") && (
                    <Button
                      onClick={() => handleActivateAdmission(selectedApp)}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      Activate Admission
                    </Button>
                  )}
                </div>
              </div>

              {/* Personal Information */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 pb-2 border-b flex items-center gap-2">
                  <MdPerson className="text-primary" />
                  Personal Information
                </h4>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Full Name</p>
                    <p className="font-medium">{selectedApp.fullName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Father&apos;s Name</p>
                    <p className="font-medium">{selectedApp.fatherName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Mother&apos;s Name</p>
                    <p className="font-medium">{selectedApp.motherName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date of Birth</p>
                    <p className="font-medium">{new Date(selectedApp.dateOfBirth).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Gender</p>
                    <p className="font-medium capitalize">{selectedApp.gender}</p>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 pb-2 border-b flex items-center gap-2">
                  <MdEmail className="text-primary" />
                  Contact Information
                </h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{selectedApp.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium">{selectedApp.phone}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-500">Address</p>
                    <p className="font-medium">
                      {selectedApp.address}, {selectedApp.city}, {selectedApp.state} - {selectedApp.pincode}
                    </p>
                  </div>
                </div>
              </div>

              {/* Educational Information */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 pb-2 border-b flex items-center gap-2">
                  <MdSchool className="text-primary" />
                  Educational Information
                </h4>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">College/University</p>
                    <p className="font-medium">{selectedApp.collegeName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Course</p>
                    <p className="font-medium">{selectedApp.course}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Academic Year</p>
                    <p className="font-medium">{selectedApp.year}</p>
                  </div>
                </div>
              </div>

              {/* Guardian Information */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 pb-2 border-b flex items-center gap-2">
                  <MdPhone className="text-primary" />
                  Guardian Information
                </h4>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Guardian Name</p>
                    <p className="font-medium">{selectedApp.guardianName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Guardian Phone</p>
                    <p className="font-medium">{selectedApp.guardianPhone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Relation</p>
                    <p className="font-medium capitalize">{selectedApp.guardianRelation}</p>
                  </div>
                </div>
              </div>

              {/* Photo */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 pb-2 border-b flex items-center gap-2">
                  <MdCamera className="text-primary" />
                  Passport Photo
                </h4>
                <img
                  src={selectedApp.passportPhoto}
                  alt="Passport"
                  className="w-40 h-40 object-cover rounded-lg border-2 border-gray-200"
                />
              </div>

              {/* Room Assignment (if approved) */}
              {selectedApp.assignedBlock && (
                <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                  <h4 className="font-semibold text-primary mb-3 flex items-center gap-2">
                    <MdHome className="text-primary" />
                    Room Assignment
                  </h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-primary/70">Block</p>
                      <p className="font-medium text-primary">{selectedApp.assignedBlock}</p>
                    </div>
                    <div>
                      <p className="text-sm text-primary/70">Room Number</p>
                      <p className="font-medium text-primary">{selectedApp.roomNumber}</p>
                    </div>
                    {selectedApp.admissionStartDate && (
                      <>
                        <div>
                          <p className="text-sm text-primary/70">Start Date</p>
                          <p className="font-medium text-primary">
                            {new Date(selectedApp.admissionStartDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-primary/70">End Date</p>
                          <p className="font-medium text-primary">
                            {new Date(selectedApp.admissionEndDate!).toLocaleDateString()}
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Admin Notes */}
              {selectedApp.adminNotes && (
                <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                  <h4 className="font-semibold text-primary mb-2">Admin Notes</h4>
                  <p className="text-primary/80">{selectedApp.adminNotes}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Review Action Dialog */}
      <Dialog open={!!reviewAction} onOpenChange={() => setReviewAction(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {reviewAction === "approve" ? (
                <>
                  <MdCheck className="text-primary" />
                  Approve Application
                </>
              ) : (
                <>
                  <MdClose className="text-primary" />
                  Reject Application
                </>
              )}
            </DialogTitle>
            <DialogDescription>
              {selectedApp?.applicationNumber} - {selectedApp?.fullName}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {reviewAction === "approve" && (
              <>
                {/* Block Selection */}
                <div>
                  <Label>Hostel Block *</Label>
                  <Select value={selectedBlock} onValueChange={setSelectedBlock}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select block" />
                    </SelectTrigger>
                    <SelectContent>
                      {blocks.map((block) => (
                        <SelectItem key={block.id} value={block.name}>
                          Block {block.name} ({block.currentOccupancy}/{block.capacity} occupied)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Room Number */}
                <div>
                  <Label htmlFor="roomNumber">Room Number *</Label>
                  <Input
                    id="roomNumber"
                    value={roomNumber}
                    onChange={(e) => setRoomNumber(e.target.value)}
                    placeholder="e.g., 101"
                  />
                </div>

                {/* Admission Dates */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="admissionStart">Admission Start Date *</Label>
                    <Input
                      id="admissionStart"
                      type="date"
                      value={admissionStart?.toISOString().split('T')[0] || ''}
                      onChange={(e) => setAdmissionStart(e.target.value ? new Date(e.target.value) : undefined)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="admissionEnd">Admission End Date *</Label>
                    <Input
                      id="admissionEnd"
                      type="date"
                      value={admissionEnd?.toISOString().split('T')[0] || ''}
                      onChange={(e) => setAdmissionEnd(e.target.value ? new Date(e.target.value) : undefined)}
                    />
                  </div>
                </div>
              </>
            )}

            {/* Comments */}
            <div>
              <Label htmlFor="comments">
                {reviewAction === "approve" ? "Approval Message" : "Rejection Reason"} *
              </Label>
              <Textarea
                id="comments"
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder={
                  reviewAction === "approve"
                    ? "Congratulations! Your application has been approved..."
                    : "We regret to inform you that..."
                }
                rows={4}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setReviewAction(null)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmitReview}
              disabled={submitting}
              className={reviewAction === "approve" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}
            >
              {submitting ? "Processing..." : reviewAction === "approve" ? "Approve Application" : "Reject Application"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Activation Dialog */}
      <Dialog open={showActivationDialog} onOpenChange={setShowActivationDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MdCheckCircle className="text-primary" />
              Activate Admission
            </DialogTitle>
            <DialogDescription>
              Assign block, room, and admission dates to activate this student's admission.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="activate-block">Block *</Label>
              <Select value={selectedBlock} onValueChange={setSelectedBlock}>
                <SelectTrigger>
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

            <div className="space-y-2">
              <Label htmlFor="activate-room">Room Number *</Label>
              <Input
                id="activate-room"
                value={roomNumber}
                onChange={(e) => setRoomNumber(e.target.value)}
                placeholder="e.g., 101"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Admission Start *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !admissionStart && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {admissionStart ? format(admissionStart, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={admissionStart}
                      onSelect={setAdmissionStart}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label>Admission End *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !admissionEnd && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {admissionEnd ? format(admissionEnd, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={admissionEnd}
                      onSelect={setAdmissionEnd}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowActivationDialog(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              onClick={confirmActivateAdmission}
              disabled={submitting}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {submitting ? "Activating..." : "Activate Admission"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

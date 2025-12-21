"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  FiFileText, FiFilter, FiEye, FiCheck, FiX, FiClock,
  FiUser, FiMail, FiPhone, FiMapPin, FiBook, FiHome
} from "react-icons/fi";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Application {
  id: string;
  applicationNumber: string;
  status: string;
  fullName: string;
  fatherName: string;
  motherName: string;
  dateOfBirth: string;
  gender: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  collegeName: string;
  course: string;
  year: string;
  guardianName: string;
  guardianPhone: string;
  guardianRelation: string;
  passportPhoto: string;
  assignedBlock?: string;
  roomNumber?: string;
  admissionStartDate?: string;
  admissionEndDate?: string;
  reviewComments?: string;
  createdAt: string;
  updatedAt: string;
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
  const [searchQuery, setSearchQuery] = useState("");
  
  // Review modal state
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [reviewAction, setReviewAction] = useState<"approve" | "reject" | null>(null);
  const [reviewComments, setReviewComments] = useState("");
  const [selectedBlock, setSelectedBlock] = useState("");
  const [roomNumber, setRoomNumber] = useState("");
  const [admissionStart, setAdmissionStart] = useState("");
  const [admissionEnd, setAdmissionEnd] = useState("");
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
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(app => 
        app.applicationNumber.toLowerCase().includes(query) ||
        app.fullName.toLowerCase().includes(query) ||
        app.email.toLowerCase().includes(query) ||
        app.phone.includes(query)
      );
    }
    
    setFilteredApps(filtered);
  }, [filterStatus, searchQuery, applications]);

  const fetchData = async () => {
    try {
      // Fetch applications
      const appsRes = await fetch("/api/admin/applications");
      const appsData = await appsRes.json();
      
      // Fetch hostel blocks
      const blocksRes = await fetch("/api/admin/blocks");
      const blocksData = await blocksRes.json();

      if (appsData.applications) {
        setApplications(appsData.applications);
        setFilteredApps(appsData.applications);
        
        // Check if app ID in URL
        const appId = searchParams.get("id");
        if (appId) {
          const app = appsData.applications.find((a: Application) => a.id === appId);
          if (app) setSelectedApp(app);
        }
      }

      if (blocksData.blocks) {
        setBlocks(blocksData.blocks);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const config = {
      submitted: { label: "New", class: "bg-blue-100 text-blue-700 border-blue-300" },
      under_review: { label: "Under Review", class: "bg-yellow-100 text-yellow-700 border-yellow-300" },
      approved: { label: "Approved", class: "bg-green-100 text-green-700 border-green-300" },
      rejected: { label: "Rejected", class: "bg-red-100 text-red-700 border-red-300" },
      active: { label: "Active", class: "bg-purple-100 text-purple-700 border-purple-300" },
    };

    const { label, class: className } = config[status as keyof typeof config] || 
      { label: status, class: "bg-gray-100 text-gray-700 border-gray-300" };

    return <Badge variant="outline" className={className}>{label}</Badge>;
  };

  const handleReview = (app: Application, action: "approve" | "reject") => {
    setSelectedApp(app);
    setReviewAction(action);
    setReviewComments(app.reviewComments || "");
    setSelectedBlock(app.assignedBlock || "");
    setRoomNumber(app.roomNumber || "");
    setAdmissionStart(app.admissionStartDate || "");
    setAdmissionEnd(app.admissionEndDate || "");
  };

  const handleSubmitReview = async () => {
    if (!selectedApp || !reviewAction) return;

    // Validation
    if (reviewAction === "approve") {
      if (!selectedBlock || !roomNumber || !admissionStart || !admissionEnd) {
        alert("Please fill all fields for approval");
        return;
      }
    }

    if (!reviewComments.trim()) {
      alert("Please provide review comments");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`/api/admin/applications/${selectedApp.id}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: reviewAction,
          comments: reviewComments,
          assignedBlock: reviewAction === "approve" ? selectedBlock : null,
          roomNumber: reviewAction === "approve" ? roomNumber : null,
          admissionStartDate: reviewAction === "approve" ? admissionStart : null,
          admissionEndDate: reviewAction === "approve" ? admissionEnd : null,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        alert(`Application ${reviewAction === "approve" ? "approved" : "rejected"} successfully!`);
        setSelectedApp(null);
        setReviewAction(null);
        fetchData(); // Refresh data
      } else {
        alert(data.error || "Failed to submit review");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  const handleActivateAdmission = async (appId: string) => {
    if (!confirm("Activate this admission? Student will be marked as active resident.")) return;

    try {
      const res = await fetch(`/api/admin/applications/${appId}/activate`, {
        method: "POST",
      });

      if (res.ok) {
        alert("Admission activated successfully!");
        fetchData();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to activate admission");
      }
    } catch (error) {
      console.error("Error activating admission:", error);
      alert("Failed to activate admission");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Application Review</h1>
          <p className="text-gray-600">Review and manage hostel admission applications</p>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6 border-0 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <FiFilter className="w-5 h-5" />
              Filter & Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Search */}
              <div>
                <Label htmlFor="search">Search</Label>
                <Input
                  id="search"
                  placeholder="Search by application #, name, email, or phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="max-w-lg"
                />
              </div>

              {/* Status Filter */}
              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={() => setFilterStatus("all")}
                  variant={filterStatus === "all" ? "default" : "outline"}
                  className={filterStatus === "all" ? "bg-orange-600 hover:bg-orange-700" : ""}
                >
                  All ({applications.length})
                </Button>
                <Button
                  onClick={() => setFilterStatus("submitted")}
                  variant={filterStatus === "submitted" ? "default" : "outline"}
                  className={filterStatus === "submitted" ? "bg-blue-600 hover:bg-blue-700" : ""}
                >
                  New ({applications.filter(a => a.status === "submitted").length})
                </Button>
                <Button
                  onClick={() => setFilterStatus("under_review")}
                  variant={filterStatus === "under_review" ? "default" : "outline"}
                  className={filterStatus === "under_review" ? "bg-yellow-600 hover:bg-yellow-700" : ""}
                >
                  Under Review ({applications.filter(a => a.status === "under_review").length})
                </Button>
                <Button
                  onClick={() => setFilterStatus("approved")}
                  variant={filterStatus === "approved" ? "default" : "outline"}
                  className={filterStatus === "approved" ? "bg-green-600 hover:bg-green-700" : ""}
                >
                  Approved ({applications.filter(a => a.status === "approved").length})
                </Button>
                <Button
                  onClick={() => setFilterStatus("rejected")}
                  variant={filterStatus === "rejected" ? "default" : "outline"}
                  className={filterStatus === "rejected" ? "bg-red-600 hover:bg-red-700" : ""}
                >
                  Rejected ({applications.filter(a => a.status === "rejected").length})
                </Button>
                <Button
                  onClick={() => setFilterStatus("active")}
                  variant={filterStatus === "active" ? "default" : "outline"}
                  className={filterStatus === "active" ? "bg-purple-600 hover:bg-purple-700" : ""}
                >
                  Active ({applications.filter(a => a.status === "active").length})
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Applications Table */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-linear-to-r from-orange-600 to-orange-500 text-white">
            <CardTitle>📋 Applications ({filteredApps.length})</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {filteredApps.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <FiFileText className="w-16 h-16 mx-auto mb-4 opacity-30" />
                <p className="text-lg font-semibold">No applications found</p>
                <p className="text-sm">Try adjusting your filters or search query</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">
                        Application #
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">
                        Student Details
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">
                        College/Course
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">
                        Status
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">
                        Submitted
                      </th>
                      <th className="text-right py-3 px-4 font-semibold text-sm text-gray-700">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredApps.map((app) => (
                      <tr key={app.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <code className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">
                            {app.applicationNumber}
                          </code>
                        </td>
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-semibold text-gray-900">{app.fullName}</p>
                            <p className="text-xs text-gray-600">{app.email}</p>
                            <p className="text-xs text-gray-600">{app.phone}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div>
                            <p className="text-sm font-medium">{app.collegeName}</p>
                            <p className="text-xs text-gray-600">{app.course} - {app.year}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4">{getStatusBadge(app.status)}</td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {new Date(app.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex justify-end gap-2">
                            <Button
                              onClick={() => setSelectedApp(app)}
                              size="sm"
                              variant="outline"
                            >
                              <FiEye className="mr-1" />
                              View
                            </Button>
                            {(app.status === "submitted" || app.status === "under_review") && (
                              <>
                                <Button
                                  onClick={() => handleReview(app, "approve")}
                                  size="sm"
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  <FiCheck className="mr-1" />
                                  Approve
                                </Button>
                                <Button
                                  onClick={() => handleReview(app, "reject")}
                                  size="sm"
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  <FiX className="mr-1" />
                                  Reject
                                </Button>
                              </>
                            )}
                            {app.status === "approved" && (
                              <Button
                                onClick={() => handleActivateAdmission(app.id)}
                                size="sm"
                                className="bg-purple-600 hover:bg-purple-700"
                              >
                                Activate
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* View Application Dialog */}
      <Dialog open={!!selectedApp && !reviewAction} onOpenChange={() => setSelectedApp(null)}>
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <FiFileText className="text-orange-600" />
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
                        <FiCheck className="mr-2" />
                        Approve
                      </Button>
                      <Button
                        onClick={() => handleReview(selectedApp, "reject")}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        <FiX className="mr-2" />
                        Reject
                      </Button>
                    </>
                  )}
                  {selectedApp.status === "approved" && (
                    <Button
                      onClick={() => handleActivateAdmission(selectedApp.id)}
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
                  <FiUser className="text-orange-600" />
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
                  <FiMail className="text-blue-600" />
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
                  <FiBook className="text-green-600" />
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
                  <FiPhone className="text-purple-600" />
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
                <h4 className="font-semibold text-gray-900 mb-3">Passport Photo</h4>
                <img
                  src={selectedApp.passportPhoto}
                  alt="Passport"
                  className="w-40 h-40 object-cover rounded-lg border-2 border-gray-200"
                />
              </div>

              {/* Room Assignment (if approved) */}
              {selectedApp.assignedBlock && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
                    <FiHome className="w-5 h-5" />
                    Room Assignment
                  </h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-green-700">Block</p>
                      <p className="font-medium text-green-900">{selectedApp.assignedBlock}</p>
                    </div>
                    <div>
                      <p className="text-sm text-green-700">Room Number</p>
                      <p className="font-medium text-green-900">{selectedApp.roomNumber}</p>
                    </div>
                    {selectedApp.admissionStartDate && (
                      <>
                        <div>
                          <p className="text-sm text-green-700">Start Date</p>
                          <p className="font-medium text-green-900">
                            {new Date(selectedApp.admissionStartDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-green-700">End Date</p>
                          <p className="font-medium text-green-900">
                            {new Date(selectedApp.admissionEndDate!).toLocaleDateString()}
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Review Comments */}
              {selectedApp.reviewComments && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">Review Comments</h4>
                  <p className="text-blue-800">{selectedApp.reviewComments}</p>
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
                  <FiCheck className="text-green-600" />
                  Approve Application
                </>
              ) : (
                <>
                  <FiX className="text-red-600" />
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
                      value={admissionStart}
                      onChange={(e) => setAdmissionStart(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="admissionEnd">Admission End Date *</Label>
                    <Input
                      id="admissionEnd"
                      type="date"
                      value={admissionEnd}
                      onChange={(e) => setAdmissionEnd(e.target.value)}
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
                value={reviewComments}
                onChange={(e) => setReviewComments(e.target.value)}
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
    </div>
  );
}

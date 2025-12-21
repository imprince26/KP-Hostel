"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FiFileText, FiClock, FiCheck, FiX, FiEye, FiFilter, FiAlertCircle } from "react-icons/fi";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Application {
  id: string;
  applicationNumber: string;
  status: string;
  fullName: string;
  email: string;
  phone: string;
  collegeName: string;
  course: string;
  year: string;
  assignedBlock?: string;
  roomNumber?: string;
  admissionStartDate?: string;
  admissionEndDate?: string;
  reviewComments?: string;
  createdAt: string;
  updatedAt: string;
}

export default function StudentApplications() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [applications, setApplications] = useState<Application[]>([]);
  const [filteredApps, setFilteredApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
      return;
    }

    if (status === "authenticated") {
      fetchApplications();
    }
  }, [status, router]);

  useEffect(() => {
    if (filterStatus === "all") {
      setFilteredApps(applications);
    } else {
      setFilteredApps(applications.filter(app => app.status === filterStatus));
    }
  }, [filterStatus, applications]);

  const fetchApplications = async () => {
    try {
      const res = await fetch("/api/admission/apply");
      const data = await res.json();
      
      if (data.applications) {
        setApplications(data.applications);
        setFilteredApps(data.applications);
      }
    } catch (error) {
      console.error("Error fetching applications:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      submitted: { label: "Submitted", class: "bg-blue-100 text-blue-700 border-blue-300" },
      under_review: { label: "Under Review", class: "bg-yellow-100 text-yellow-700 border-yellow-300" },
      approved: { label: "Approved", class: "bg-green-100 text-green-700 border-green-300" },
      rejected: { label: "Rejected", class: "bg-red-100 text-red-700 border-red-300" },
      active: { label: "Active", class: "bg-purple-100 text-purple-700 border-purple-300" },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || {
      label: status,
      class: "bg-gray-100 text-gray-700 border-gray-300",
    };

    return (
      <Badge variant="outline" className={`${config.class} font-medium`}>
        {config.label}
      </Badge>
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "submitted":
      case "under_review":
        return <FiClock className="w-5 h-5 text-yellow-600" />;
      case "approved":
      case "active":
        return <FiCheck className="w-5 h-5 text-green-600" />;
      case "rejected":
        return <FiX className="w-5 h-5 text-red-600" />;
      default:
        return <FiFileText className="w-5 h-5 text-gray-600" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-orange-50 to-orange-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-orange-50 to-orange-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Applications</h1>
          <p className="text-gray-600">Track and manage your hostel admission applications</p>
        </div>

        {/* Filter Controls */}
        <Card className="mb-6 border-0 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <FiFilter className="w-5 h-5" />
              Filter Applications
            </CardTitle>
          </CardHeader>
          <CardContent>
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
                Submitted ({applications.filter(a => a.status === "submitted").length})
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
          </CardContent>
        </Card>

        {/* Applications List */}
        {filteredApps.length === 0 ? (
          <Card className="border-0 shadow-lg">
            <CardContent className="py-16 text-center">
              <FiFileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No applications found</h3>
              <p className="text-gray-600 mb-6">
                {filterStatus === "all" 
                  ? "You haven't submitted any applications yet." 
                  : `No ${filterStatus} applications found.`}
              </p>
              <Button 
                onClick={() => router.push("/en/admission")}
                className="bg-orange-600 hover:bg-orange-700"
              >
                Submit New Application
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredApps.map((app) => (
              <Card key={app.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="mt-1">
                        {getStatusIcon(app.status)}
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <h3 className="text-xl font-semibold text-gray-900">
                            {app.applicationNumber}
                          </h3>
                          {getStatusBadge(app.status)}
                        </div>
                        <div className="space-y-1 text-sm text-gray-600">
                          <p><strong>Name:</strong> {app.fullName}</p>
                          <p><strong>College:</strong> {app.collegeName}</p>
                          <p><strong>Course:</strong> {app.course} - {app.year}</p>
                          <p><strong>Submitted:</strong> {new Date(app.createdAt).toLocaleDateString()}</p>
                          {app.assignedBlock && app.roomNumber && (
                            <p className="text-green-700">
                              <strong>Room:</strong> Block {app.assignedBlock}, Room {app.roomNumber}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button
                        onClick={() => setSelectedApp(app)}
                        className="bg-orange-600 hover:bg-orange-700"
                      >
                        <FiEye className="mr-2" />
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Application Details Dialog */}
      <Dialog open={!!selectedApp} onOpenChange={() => setSelectedApp(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <FiFileText className="text-orange-600" />
              Application Details
            </DialogTitle>
            <DialogDescription>
              Application Number: <strong>{selectedApp?.applicationNumber}</strong>
            </DialogDescription>
          </DialogHeader>

          {selectedApp && (
            <div className="space-y-6">
              {/* Status */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Status</h4>
                <div className="flex items-center gap-2">
                  {getStatusBadge(selectedApp.status)}
                  <span className="text-sm text-gray-600">
                    Last updated: {new Date(selectedApp.updatedAt).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Personal Information */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 pb-2 border-b">Personal Information</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Full Name</p>
                    <p className="font-medium">{selectedApp.fullName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{selectedApp.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium">{selectedApp.phone}</p>
                  </div>
                </div>
              </div>

              {/* Educational Information */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 pb-2 border-b">Educational Information</h4>
                <div className="grid md:grid-cols-2 gap-4">
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

              {/* Room Assignment (if approved) */}
              {selectedApp.assignedBlock && selectedApp.roomNumber && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
                    <FiCheck className="w-5 h-5" />
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
                          <p className="text-sm text-green-700">Admission Start Date</p>
                          <p className="font-medium text-green-900">
                            {new Date(selectedApp.admissionStartDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-green-700">Admission End Date</p>
                          <p className="font-medium text-green-900">
                            {new Date(selectedApp.admissionEndDate!).toLocaleDateString()}
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Review Comments (if any) */}
              {selectedApp.reviewComments && (
                <div className={`${
                  selectedApp.status === "rejected" 
                    ? "bg-red-50 border-red-200" 
                    : "bg-blue-50 border-blue-200"
                } border rounded-lg p-4`}>
                  <h4 className={`font-semibold mb-2 flex items-center gap-2 ${
                    selectedApp.status === "rejected" ? "text-red-900" : "text-blue-900"
                  }`}>
                    <FiAlertCircle className="w-5 h-5" />
                    Review Comments
                  </h4>
                  <p className={selectedApp.status === "rejected" ? "text-red-800" : "text-blue-800"}>
                    {selectedApp.reviewComments}
                  </p>
                </div>
              )}

              {/* Timeline */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 pb-2 border-b">Application Timeline</h4>
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <FiFileText className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">Application Submitted</p>
                      <p className="text-sm text-gray-600">
                        {new Date(selectedApp.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  
                  {selectedApp.status !== "submitted" && (
                    <div className="flex gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        selectedApp.status === "rejected" 
                          ? "bg-red-100" 
                          : "bg-green-100"
                      }`}>
                        {selectedApp.status === "rejected" ? (
                          <FiX className="w-4 h-4 text-red-600" />
                        ) : (
                          <FiCheck className="w-4 h-4 text-green-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">
                          Application {selectedApp.status === "rejected" ? "Rejected" : "Reviewed"}
                        </p>
                        <p className="text-sm text-gray-600">
                          {new Date(selectedApp.updatedAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Next Steps */}
              {selectedApp.status === "approved" && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <h4 className="font-semibold text-orange-900 mb-2">📋 Next Steps</h4>
                  <ul className="space-y-2 text-sm text-orange-800">
                    <li className="flex gap-2">
                      <span>1.</span>
                      <span>Visit hostel office during working hours (9 AM - 5 PM)</span>
                    </li>
                    <li className="flex gap-2">
                      <span>2.</span>
                      <span>Bring original documents for verification</span>
                    </li>
                    <li className="flex gap-2">
                      <span>3.</span>
                      <span>Complete payment via Demand Draft</span>
                    </li>
                    <li className="flex gap-2">
                      <span>4.</span>
                      <span>Receive room keys and allotment letter</span>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

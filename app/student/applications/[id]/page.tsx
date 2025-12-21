"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "motion/react";
import {
  FiUser, FiMail, FiPhone, FiMapPin, FiBook, FiHome, FiCalendar,
  FiCheckCircle, FiXCircle, FiClock, FiFileText, FiArrowLeft,
  FiDownload, FiPrinter, FiShare2, FiCamera
} from "react-icons/fi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";

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
  reviewComments?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

export default function ApplicationView() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
      return;
    }

    if (status === "authenticated" && params.id) {
      fetchApplication();
    }
  }, [status, params.id, router, fetchApplication]);

  const fetchApplication = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admission/apply/${params.id}`);
      const data = await res.json();

      if (res.ok && data.application) {
        setApplication(data.application);
      } else {
        setError(data.error || "Application not found");
      }
    } catch (error) {
      console.error("Error fetching application:", error);
      setError("Failed to load application");
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  const getStatusConfig = (status: string) => {
    const configs = {
      submitted: {
        label: "Application Submitted",
        description: "Your application has been received and is pending review",
        icon: FiFileText,
        color: "blue",
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200",
        textColor: "text-blue-900"
      },
      under_review: {
        label: "Under Review",
        description: "Your application is being reviewed by our admissions team",
        icon: FiClock,
        color: "yellow",
        bgColor: "bg-yellow-50",
        borderColor: "border-yellow-200",
        textColor: "text-yellow-900"
      },
      approved: {
        label: "Application Approved",
        description: "Congratulations! Your application has been approved",
        icon: FiCheckCircle,
        color: "green",
        bgColor: "bg-green-50",
        borderColor: "border-green-200",
        textColor: "text-green-900"
      },
      rejected: {
        label: "Application Rejected",
        description: "Unfortunately, your application was not approved at this time",
        icon: FiXCircle,
        color: "red",
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
        textColor: "text-red-900"
      },
      active: {
        label: "Admission Active",
        description: "Your admission is currently active",
        icon: FiCheckCircle,
        color: "purple",
        bgColor: "bg-purple-50",
        borderColor: "border-purple-200",
        textColor: "text-purple-900"
      }
    };

    return configs[status as keyof typeof configs] || configs.submitted;
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // In a real implementation, this would generate a PDF
    alert("Download functionality would be implemented here");
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="space-y-6">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-32 w-full" />
            <div className="grid md:grid-cols-2 gap-6">
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-64 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !application) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <Alert className="mb-6">
            <AlertDescription className="flex items-center justify-between">
              <span>{error || "Application not found"}</span>
              <Button variant="outline" onClick={() => router.back()}>
                <FiArrowLeft className="mr-2" />
                Go Back
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  const statusConfig = getStatusConfig(application.status);
  const StatusIcon = statusConfig.icon;

  return (
    <div className="min-h-screen bg-gray-50 py-8 print:bg-white print:py-0">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="print:hidden"
            >
              <FiArrowLeft className="mr-2" />
              Back to Applications
            </Button>
            <div className="flex gap-2 print:hidden">
              <Button variant="outline" size="sm" onClick={handlePrint}>
                <FiPrinter className="mr-2" />
                Print
              </Button>
              <Button variant="outline" size="sm" onClick={handleDownload}>
                <FiDownload className="mr-2" />
                Download
              </Button>
            </div>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Application Details
            </h1>
            <p className="text-lg text-gray-600">
              Application #{application.applicationNumber}
            </p>
          </div>
        </motion.div>

        {/* Status Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Alert className={`${statusConfig.bgColor} ${statusConfig.borderColor} border-2 mb-8`}>
            <StatusIcon className={`h-5 w-5 ${statusConfig.textColor}`} />
            <AlertDescription className={statusConfig.textColor}>
              <div className="font-semibold text-lg mb-1">{statusConfig.label}</div>
              <div>{statusConfig.description}</div>
            </AlertDescription>
          </Alert>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FiUser className="text-blue-600" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Full Name</label>
                      <p className="text-lg font-semibold text-gray-900">{application.fullName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Date of Birth</label>
                      <p className="text-lg text-gray-900">
                        {new Date(application.dateOfBirth).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Gender</label>
                      <p className="text-lg text-gray-900 capitalize">{application.gender}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Caste & Sub-caste</label>
                      <p className="text-lg text-gray-900">{application.caste} - {application.subCaste}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FiMail className="text-green-600" />
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Email Address</label>
                      <p className="text-lg text-gray-900 break-words">{application.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Phone Number</label>
                      <p className="text-lg text-gray-900">{application.phone}</p>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Address</label>
                    <p className="text-lg text-gray-900">
                      {application.address}<br />
                      {application.city}, {application.state} - {application.pincode}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Educational Information */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FiBook className="text-purple-600" />
                    Educational Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">College/University</label>
                      <p className="text-lg font-semibold text-gray-900">{application.collegeName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Course</label>
                      <p className="text-lg text-gray-900">{application.course}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Academic Year</label>
                      <p className="text-lg text-gray-900">{application.year}</p>
                    </div>
                    {application.studentId && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Student ID</label>
                        <p className="text-lg text-gray-900 font-mono">{application.studentId}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Guardian Information */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FiPhone className="text-indigo-600" />
                    Guardian Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Guardian Name</label>
                      <p className="text-lg font-semibold text-gray-900">{application.guardianName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Phone Number</label>
                      <p className="text-lg text-gray-900">{application.guardianPhone}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Relationship</label>
                      <p className="text-lg text-gray-900 capitalize">{application.guardianRelation}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Room Assignment (if approved) */}
            {application.assignedBlock && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Card className="border-green-200 bg-green-50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-green-900">
                      <FiHome className="text-green-600" />
                      Room Assignment
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-green-700">Block</label>
                        <p className="text-lg font-semibold text-green-900">{application.assignedBlock}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-green-700">Room Number</label>
                        <p className="text-lg font-semibold text-green-900">{application.roomNumber}</p>
                      </div>
                      {application.admissionStartDate && (
                        <div>
                          <label className="text-sm font-medium text-green-700">Admission Start</label>
                          <p className="text-lg text-green-900">
                            {new Date(application.admissionStartDate).toLocaleDateString('en-IN')}
                          </p>
                        </div>
                      )}
                      {application.admissionEndDate && (
                        <div>
                          <label className="text-sm font-medium text-green-700">Admission End</label>
                          <p className="text-lg text-green-900">
                            {new Date(application.admissionEndDate).toLocaleDateString('en-IN')}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Review Comments */}
            {application.reviewComments && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FiFileText className="text-orange-600" />
                      Review Comments
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 leading-relaxed">{application.reviewComments}</p>
                    {application.reviewedAt && (
                      <p className="text-sm text-gray-500 mt-2">
                        Reviewed on {new Date(application.reviewedAt).toLocaleDateString('en-IN', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Rejection Reason */}
            {application.rejectionReason && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
              >
                <Card className="border-red-200 bg-red-50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-red-900">
                      <FiXCircle className="text-red-600" />
                      Rejection Reason
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-red-800 leading-relaxed">{application.rejectionReason}</p>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Application Status */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-center">Application Status</CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${statusConfig.bgColor}`}>
                    <StatusIcon className={`h-8 w-8 ${statusConfig.textColor}`} />
                  </div>
                  <div>
                    <Badge variant="outline" className={`${statusConfig.bgColor} ${statusConfig.borderColor} ${statusConfig.textColor} font-medium text-sm px-3 py-1`}>
                      {statusConfig.label}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-500">
                    Submitted on {new Date(application.createdAt).toLocaleDateString('en-IN')}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Passport Photo */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FiCamera className="text-blue-600" />
                    Passport Photo
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-square rounded-lg overflow-hidden border-2 border-gray-200">
                    <img
                      src={application.passportPhoto}
                      alt="Passport Photo"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Application Summary */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Application Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Application #</span>
                    <span className="font-mono font-medium">{application.applicationNumber}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-gray-500">Block Preference</span>
                    <span className="font-medium">{application.blockPreference || 'Not specified'}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-gray-500">Last Updated</span>
                    <span className="font-medium">
                      {new Date(application.updatedAt).toLocaleDateString('en-IN')}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="print:hidden"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full justify-start" onClick={handlePrint}>
                    <FiPrinter className="mr-2" />
                    Print Application
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={handleDownload}>
                    <FiDownload className="mr-2" />
                    Download PDF
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => navigator.share?.({
                    title: 'My Hostel Application',
                    text: `Application #${application.applicationNumber}`,
                    url: window.location.href
                  })}>
                    <FiShare2 className="mr-2" />
                    Share
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="mt-12 text-center text-gray-500 print:hidden"
        >
          <p>KP Vidhyarthi Bhavan - Hostel Management System</p>
          <p className="text-sm mt-1">
            For any queries, please contact the admissions office
          </p>
        </motion.div>
      </div>
    </div>
  );
}
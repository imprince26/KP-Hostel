"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { 
  FiUser, FiFileText, FiBell, FiSettings, FiHome, 
  FiCalendar, FiDollarSign, FiCheck, FiClock, FiX 
} from "react-icons/fi";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface DashboardStats {
  totalApplications: number;
  approvedApplications: number;
  pendingApplications: number;
  rejectedApplications: number;
  roomDetails?: {
    block: string;
    roomNumber: string;
    admissionStart: string;
    admissionEnd: string;
  };
}

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export default function StudentDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
      return;
    }

    if (status === "authenticated") {
      fetchDashboardData();
    }
  }, [status, router]);

  const fetchDashboardData = async () => {
    try {
      // Fetch applications
      const appsRes = await fetch("/api/admission/apply");
      const appsData = await appsRes.json();
      
      // Fetch notifications
      const notifRes = await fetch("/api/notifications");
      const notifData = await notifRes.json();

      if (appsData.applications) {
        const applications = appsData.applications;
        const approved = applications.filter((app: any) => app.status === "approved").length;
        const pending = applications.filter((app: any) => app.status === "submitted").length;
        const rejected = applications.filter((app: any) => app.status === "rejected").length;
        
        // Find active admission details
        const activeApp = applications.find((app: any) => 
          app.status === "active" && app.assignedBlock && app.roomNumber
        );

        setStats({
          totalApplications: applications.length,
          approvedApplications: approved,
          pendingApplications: pending,
          rejectedApplications: rejected,
          roomDetails: activeApp ? {
            block: activeApp.assignedBlock,
            roomNumber: activeApp.roomNumber,
            admissionStart: activeApp.admissionStartDate,
            admissionEnd: activeApp.admissionEndDate,
          } : undefined,
        });
      }

      if (notifData.notifications) {
        setNotifications(notifData.notifications.slice(0, 5)); // Latest 5
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-orange-50 to-orange-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-orange-50 to-orange-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome back, {session?.user?.name || "Student"}!
          </h1>
          <p className="text-gray-600">Here&apos;s your hostel dashboard overview</p>
        </div>

        {/* Room Details Alert (if active) */}
        {stats?.roomDetails && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <FiHome className="h-5 w-5 text-green-600" />
            <AlertDescription className="text-green-800">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <strong className="block text-lg mb-1">Your Room Details</strong>
                  <div className="space-y-1">
                    <p>Block: <strong>{stats.roomDetails.block}</strong> | Room: <strong>{stats.roomDetails.roomNumber}</strong></p>
                    <p className="text-sm">
                      Valid from {new Date(stats.roomDetails.admissionStart).toLocaleDateString()} 
                      {" "}to {new Date(stats.roomDetails.admissionEnd).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <Button 
                  onClick={() => router.push("/student/applications")}
                  variant="outline"
                  className="border-green-600 text-green-700 hover:bg-green-100"
                >
                  View Details
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">Total Applications</CardTitle>
                <FiFileText className="w-5 h-5 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-gray-900">{stats?.totalApplications || 0}</p>
              <p className="text-sm text-gray-500 mt-1">All time</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">Pending</CardTitle>
                <FiClock className="w-5 h-5 text-yellow-600" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-yellow-600">{stats?.pendingApplications || 0}</p>
              <p className="text-sm text-gray-500 mt-1">Under review</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">Approved</CardTitle>
                <FiCheck className="w-5 h-5 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-600">{stats?.approvedApplications || 0}</p>
              <p className="text-sm text-gray-500 mt-1">Accepted</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">Rejected</CardTitle>
                <FiX className="w-5 h-5 text-red-600" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-red-600">{stats?.rejectedApplications || 0}</p>
              <p className="text-sm text-gray-500 mt-1">Not approved</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <Card className="lg:col-span-2 border-0 shadow-lg">
            <CardHeader className="bg-linear-to-r from-orange-600 to-orange-500 text-white">
              <CardTitle className="flex items-center gap-2">
                <FiCalendar className="w-5 h-5" />
                Quick Actions
              </CardTitle>
              <CardDescription className="text-orange-50">
                Common tasks and actions
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-2 gap-4">
                <Button
                  onClick={() => router.push("/en/admission")}
                  className="h-24 flex-col gap-2 bg-white border-2 border-orange-200 text-gray-900 hover:bg-orange-50 hover:border-orange-400"
                  variant="outline"
                >
                  <FiFileText className="w-6 h-6 text-orange-600" />
                  <span className="font-semibold">Apply for Admission</span>
                </Button>

                <Button
                  onClick={() => router.push("/student/applications")}
                  className="h-24 flex-col gap-2 bg-white border-2 border-blue-200 text-gray-900 hover:bg-blue-50 hover:border-blue-400"
                  variant="outline"
                >
                  <FiClock className="w-6 h-6 text-blue-600" />
                  <span className="font-semibold">View Applications</span>
                </Button>

                <Button
                  onClick={() => router.push("/student/settings")}
                  className="h-24 flex-col gap-2 bg-white border-2 border-purple-200 text-gray-900 hover:bg-purple-50 hover:border-purple-400"
                  variant="outline"
                >
                  <FiSettings className="w-6 h-6 text-purple-600" />
                  <span className="font-semibold">Settings</span>
                </Button>

                <Button
                  onClick={() => router.push("/")}
                  className="h-24 flex-col gap-2 bg-white border-2 border-green-200 text-gray-900 hover:bg-green-50 hover:border-green-400"
                  variant="outline"
                >
                  <FiHome className="w-6 h-6 text-green-600" />
                  <span className="font-semibold">Hostel Info</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Notifications */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-linear-to-r from-orange-600 to-orange-500 text-white">
              <CardTitle className="flex items-center gap-2">
                <FiBell className="w-5 h-5" />
                Recent Notifications
              </CardTitle>
              <CardDescription className="text-orange-50">
                Latest updates
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              {notifications.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <FiBell className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">No notifications yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`p-3 rounded-lg border ${
                        notif.read 
                          ? "bg-gray-50 border-gray-200" 
                          : "bg-blue-50 border-blue-200"
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        {!notif.read && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                        )}
                        <div className="flex-1">
                          <p className="font-semibold text-sm text-gray-900">{notif.title}</p>
                          <p className="text-xs text-gray-600 mt-1">{notif.message}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            {new Date(notif.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Important Information */}
        <Card className="mt-6 border-0 shadow-lg">
          <CardHeader className="bg-linear-to-r from-blue-600 to-blue-500 text-white">
            <CardTitle>📋 Important Information</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <FiFileText className="text-orange-600" />
                  Application Process
                </h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex gap-2">
                    <span className="text-orange-600">1.</span>
                    Submit online application with required documents
                  </li>
                  <li className="flex gap-2">
                    <span className="text-orange-600">2.</span>
                    Visit hostel office after approval notification
                  </li>
                  <li className="flex gap-2">
                    <span className="text-orange-600">3.</span>
                    Complete offline formalities and payment
                  </li>
                  <li className="flex gap-2">
                    <span className="text-orange-600">4.</span>
                    Receive room allocation confirmation
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <FiDollarSign className="text-green-600" />
                  Payment Information
                </h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex gap-2">
                    <span className="text-green-600">•</span>
                    Payment accepted via Demand Draft (DD) only
                  </li>
                  <li className="flex gap-2">
                    <span className="text-green-600">•</span>
                    Semester fees must be paid before deadline
                  </li>
                  <li className="flex gap-2">
                    <span className="text-green-600">•</span>
                    Bring DD to hostel office during working hours
                  </li>
                  <li className="flex gap-2">
                    <span className="text-green-600">•</span>
                    Receipt will be provided after payment verification
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { 
  FiUsers, FiHome, FiFileText, FiDollarSign, 
  FiClock, FiCheck, FiX, FiTrendingUp, FiAlertCircle 
} from "react-icons/fi";
import { LayoutDashboard, Users, FileText, CreditCard, Building2, TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/page-header";

interface DashboardStats {
  totalStudents: number;
  activeAdmissions: number;
  pendingApplications: number;
  totalRevenue: number;
  occupancyRate: number;
  totalCapacity: number;
  occupiedRooms: number;
}

interface RecentApplication {
  id: string;
  applicationNumber: string;
  fullName: string;
  status: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentApps, setRecentApps] = useState<RecentApplication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
      return;
    }

    if (status === "authenticated") {
      // Check if user is admin
      if ((session.user as any).role !== "admin") {
        router.push("/student/dashboard");
        return;
      }
      fetchDashboardData();
    }
  }, [status, session, router]);

  const fetchDashboardData = async () => {
    try {
      // Fetch stats
      const statsRes = await fetch("/api/admin/stats");
      const statsData = await statsRes.json();
      
      // Fetch recent applications
      const appsRes = await fetch("/api/admin/applications?limit=10");
      const appsData = await appsRes.json();

      if (statsData.stats) {
        setStats(statsData.stats);
      }

      if (appsData.applications) {
        setRecentApps(appsData.applications);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const config = {
      submitted: { label: "New", class: "bg-blue-100 text-blue-700" },
      under_review: { label: "Review", class: "bg-yellow-100 text-yellow-700" },
      approved: { label: "Approved", class: "bg-green-100 text-green-700" },
      rejected: { label: "Rejected", class: "bg-red-100 text-red-700" },
      active: { label: "Active", class: "bg-purple-100 text-purple-700" },
    };

    const { label, class: className } = config[status as keyof typeof config] || 
      { label: status, class: "bg-gray-100 text-gray-700" };

    return <Badge className={className}>{label}</Badge>;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <PageHeader
        title="Admin Dashboard"
        description="Manage hostel operations and monitor key metrics"
        icon={LayoutDashboard}
        gradient="indigo"
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        {/* Statistics Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden group border-t-4 border-t-blue-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-7 h-7 text-white" />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-slate-600">Total Students</p>
                <h3 className="text-3xl font-bold text-slate-900">{stats?.totalStudents || 0}</h3>
                <p className="text-xs text-slate-500">Registered users</p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden group border-t-4 border-t-green-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Building2 className="w-7 h-7 text-white" />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-slate-600">Active Admissions</p>
                <h3 className="text-3xl font-bold text-green-600">{stats?.activeAdmissions || 0}</h3>
                <p className="text-xs text-slate-500">Current residents</p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden group border-t-4 border-t-yellow-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <FileText className="w-7 h-7 text-white" />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-slate-600">Pending Applications</p>
                <h3 className="text-3xl font-bold text-yellow-600">{stats?.pendingApplications || 0}</h3>
                <p className="text-xs text-slate-500">Awaiting review</p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden group border-t-4 border-t-purple-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <CreditCard className="w-7 h-7 text-white" />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-slate-600">Total Revenue</p>
                <h3 className="text-3xl font-bold text-purple-600">₹{(stats?.totalRevenue || 0).toLocaleString("en-IN")}</h3>
                <p className="text-xs text-slate-500">Collected fees</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Quick Actions */}
          <Card className="lg:col-span-2 border-0 shadow-lg">
            <CardHeader className="bg-linear-to-r from-orange-600 to-orange-500 text-white">
              <CardTitle>⚡ Quick Actions</CardTitle>
              <CardDescription className="text-orange-50">
                Common administrative tasks
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-3 gap-4">
                <Button
                  onClick={() => router.push("/admin/applications")}
                  className="h-24 flex-col gap-2 bg-white border-2 border-blue-200 text-gray-900 hover:bg-blue-50 hover:border-blue-400"
                  variant="outline"
                >
                  <FiFileText className="w-6 h-6 text-blue-600" />
                  <span className="font-semibold">Review Applications</span>
                </Button>

                <Button
                  onClick={() => router.push("/admin/blocks")}
                  className="h-24 flex-col gap-2 bg-white border-2 border-green-200 text-gray-900 hover:bg-green-50 hover:border-green-400"
                  variant="outline"
                >
                  <FiHome className="w-6 h-6 text-green-600" />
                  <span className="font-semibold">Manage Blocks</span>
                </Button>

                <Button
                  onClick={() => router.push("/admin/payments")}
                  className="h-24 flex-col gap-2 bg-white border-2 border-purple-200 text-gray-900 hover:bg-purple-50 hover:border-purple-400"
                  variant="outline"
                >
                  <FiDollarSign className="w-6 h-6 text-purple-600" />
                  <span className="font-semibold">Track Payments</span>
                </Button>

                <Button
                  onClick={() => router.push("/admin/announcements")}
                  className="h-24 flex-col gap-2 bg-white border-2 border-yellow-200 text-gray-900 hover:bg-yellow-50 hover:border-yellow-400"
                  variant="outline"
                >
                  <FiAlertCircle className="w-6 h-6 text-yellow-600" />
                  <span className="font-semibold">Announcements</span>
                </Button>

                <Button
                  onClick={() => router.push("/admin/messaging")}
                  className="h-24 flex-col gap-2 bg-white border-2 border-red-200 text-gray-900 hover:bg-red-50 hover:border-red-400"
                  variant="outline"
                >
                  <FiUsers className="w-6 h-6 text-red-600" />
                  <span className="font-semibold">Bulk Messaging</span>
                </Button>

                <Button
                  onClick={() => router.push("/")}
                  className="h-24 flex-col gap-2 bg-white border-2 border-slate-200 text-gray-900 hover:bg-slate-50 hover:border-slate-400"
                  variant="outline"
                >
                  <FiHome className="w-6 h-6 text-slate-600" />
                  <span className="font-semibold">View Website</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Pending Actions */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-linear-to-r from-red-600 to-red-500 text-white">
              <CardTitle className="flex items-center gap-2">
                <FiAlertCircle className="w-5 h-5" />
                Pending Actions
              </CardTitle>
              <CardDescription className="text-red-50">
                Items requiring attention
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div>
                    <p className="font-semibold text-sm">New Applications</p>
                    <p className="text-xs text-gray-600">Awaiting review</p>
                  </div>
                  <Badge className="bg-yellow-600 text-white">
                    {stats?.pendingApplications || 0}
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div>
                    <p className="font-semibold text-sm">Today&apos;s Applications</p>
                    <p className="text-xs text-gray-600">Submitted today</p>
                  </div>
                  <Badge className="bg-blue-600 text-white">
                    {recentApps.filter(app => {
                      const today = new Date().toDateString();
                      return new Date(app.createdAt).toDateString() === today;
                    }).length}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Applications Table */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-linear-to-r from-blue-600 to-blue-500 text-white">
            <CardTitle>📋 Recent Applications</CardTitle>
            <CardDescription className="text-blue-50">
              Latest admission applications
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            {recentApps.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <FiFileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>No applications yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">
                        Application #
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">
                        Student Name
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
                    {recentApps.map((app) => (
                      <tr key={app.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                            {app.applicationNumber}
                          </code>
                        </td>
                        <td className="py-3 px-4 font-medium">{app.fullName}</td>
                        <td className="py-3 px-4">{getStatusBadge(app.status)}</td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {new Date(app.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <Button
                            onClick={() => router.push(`/admin/applications?id=${app.id}`)}
                            size="sm"
                            className="bg-orange-600 hover:bg-orange-700"
                          >
                            Review
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <div className="mt-4 text-center">
              <Button
                onClick={() => router.push("/admin/applications")}
                variant="outline"
                className="border-orange-600 text-orange-700 hover:bg-orange-50"
              >
                View All Applications →
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

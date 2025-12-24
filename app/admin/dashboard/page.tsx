"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { Users, FileText, Building2, TrendingUp, ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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
      if (session?.user && "role" in session.user && session.user.role !== "admin") {
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
      const appsRes = await fetch("/api/admin/applications?limit=5");
      const appsData = await appsRes.json();

      if (statsData.stats) {
        setStats(statsData.stats);
      }

      if (appsData.applications) {
        // Transform the data from API format to flat structure
        const transformedApps = appsData.applications.map((item: any) => ({
          ...item.application,
          userName: item.user?.name,
          userEmail: item.user?.email,
          userPhone: item.user?.phone,
        }));

        setRecentApps(transformedApps.slice(0, 5));
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const config = {
      submitted: { label: "New", variant: "secondary" as const },
      under_review: { label: "Review", variant: "outline" as const },
      approved: { label: "Approved", variant: "default" as const },
      rejected: { label: "Rejected", variant: "destructive" as const },
      active: { label: "Active", variant: "default" as const },
    };

    const { label, variant } = config[status as keyof typeof config] ||
      { label: status, variant: "secondary" as const };

    return <Badge variant={variant}>{label}</Badge>;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="relative">
        {/* Header */}
        <div className="border-b border-border bg-card/50 backdrop-blur-sm">
          <div className="container mx-auto px-6 py-8">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <h1 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
              <p className="text-muted-foreground">Manage hostel operations and monitor key metrics</p>
            </motion.div>
          </div>
        </div>

        <div className="container mx-auto px-6 py-8">
          {/* Statistics Cards */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="border-0 shadow-sm bg-card hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Total Students</p>
                  <h3 className="text-2xl font-bold text-foreground">{stats?.totalStudents || 0}</h3>
                  <p className="text-xs text-muted-foreground">Registered users</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm bg-card hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Active Admissions</p>
                  <h3 className="text-2xl font-bold text-foreground">{stats?.activeAdmissions || 0}</h3>
                  <p className="text-xs text-muted-foreground">Current residents</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm bg-card hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <FileText className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Pending Applications</p>
                  <h3 className="text-2xl font-bold text-foreground">{stats?.pendingApplications || 0}</h3>
                  <p className="text-xs text-muted-foreground">Awaiting review</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm bg-card hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Occupancy Rate</p>
                  <h3 className="text-2xl font-bold text-foreground">{stats?.occupancyRate || 0}%</h3>
                  <p className="text-xs text-muted-foreground">Room utilization</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Recent Applications */}
            <Card className="lg:col-span-2 border-0 shadow-sm bg-card">
              <CardHeader className="border-b border-border">
                <CardTitle className="text-lg">Recent Applications</CardTitle>
                <CardDescription>Latest student applications requiring attention</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                {recentApps.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">
                    <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No recent applications</p>
                  </div>
                ) : (
                  <div className="divide-y divide-border">
                    {recentApps.map((app, index) => (
                      <motion.div
                        key={app.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-4 hover:bg-muted/50 transition-colors cursor-pointer"
                        onClick={() => router.push("/admin/applications")}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-1">
                              <p className="font-medium text-foreground">{app.fullName}</p>
                              {getStatusBadge(app.status)}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {app.applicationNumber} • {new Date(app.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <ArrowRight className="w-4 h-4 text-muted-foreground" />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
                {recentApps.length > 0 && (
                  <div className="p-4 border-t border-border">
                    <Button
                      variant="ghost"
                      className="w-full"
                      onClick={() => router.push("/admin/applications")}
                    >
                      View All Applications
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-0 shadow-sm bg-card">
              <CardHeader className="border-b border-border">
                <CardTitle className="text-lg">Quick Actions</CardTitle>
                <CardDescription>Common administrative tasks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  onClick={() => router.push("/admin/applications")}
                  className="w-full justify-start h-auto p-4"
                  variant="outline"
                >
                  <FileText className="w-5 h-5 mr-3" />
                  <div className="text-left">
                    <div className="font-medium">Review Applications</div>
                    <div className="text-xs text-muted-foreground">Process pending requests</div>
                  </div>
                </Button>

                <Button
                  onClick={() => router.push("/admin/blocks")}
                  className="w-full justify-start h-auto p-4"
                  variant="outline"
                >
                  <Building2 className="w-5 h-5 mr-3" />
                  <div className="text-left">
                    <div className="font-medium">Manage Blocks</div>
                    <div className="text-xs text-muted-foreground">Room assignments</div>
                  </div>
                </Button>

                <Button
                  onClick={() => router.push("/admin/announcements")}
                  className="w-full justify-start h-auto p-4"
                  variant="outline"
                >
                  <TrendingUp className="w-5 h-5 mr-3" />
                  <div className="text-left">
                    <div className="font-medium">Announcements</div>
                    <div className="text-xs text-muted-foreground">Broadcast messages</div>
                  </div>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

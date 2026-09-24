"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
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
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-border/60">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Hostel operations, live occupancy, and admission metrics
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/admin/applications")}
          >
            Review Applications
          </Button>
          <Button
            size="sm"
            onClick={() => router.push("/admin/announcements")}
          >
            New Announcement
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border border-border/70 shadow-sm bg-card hover:border-primary/40 transition-colors">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Total Students
                </p>
                <h3 className="text-2xl font-bold tracking-tight text-foreground mt-1">
                  {stats?.totalStudents || 0}
                </h3>
                <p className="text-xs text-muted-foreground mt-1">Registered users</p>
              </div>
              <div className="size-11 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <Users className="size-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/70 shadow-sm bg-card hover:border-primary/40 transition-colors">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Active Admissions
                </p>
                <h3 className="text-2xl font-bold tracking-tight text-foreground mt-1">
                  {stats?.activeAdmissions || 0}
                </h3>
                <p className="text-xs text-muted-foreground mt-1">Current residents</p>
              </div>
              <div className="size-11 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <Building2 className="size-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/70 shadow-sm bg-card hover:border-primary/40 transition-colors">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Pending Applications
                </p>
                <h3 className="text-2xl font-bold tracking-tight text-foreground mt-1">
                  {stats?.pendingApplications || 0}
                </h3>
                <p className="text-xs text-muted-foreground mt-1">Awaiting review</p>
              </div>
              <div className="size-11 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center">
                <FileText className="size-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/70 shadow-sm bg-card hover:border-primary/40 transition-colors">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Occupancy Rate
                </p>
                <h3 className="text-2xl font-bold tracking-tight text-foreground mt-1">
                  {stats?.occupancyRate || 0}%
                </h3>
                <p className="text-xs text-muted-foreground mt-1">Room utilization</p>
              </div>
              <div className="size-11 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <TrendingUp className="size-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Applications */}
        <Card className="lg:col-span-2 border border-border/70 shadow-sm bg-card">
          <CardHeader className="border-b border-border/60 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold">Recent Applications</CardTitle>
                <CardDescription className="text-xs mt-0.5">
                  Latest student admission requests requiring attention
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs font-medium"
                onClick={() => router.push("/admin/applications")}
              >
                View all
                <ArrowRight className="size-3.5 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {recentApps.length === 0 ? (
              <div className="p-10 text-center text-muted-foreground">
                <FileText className="size-10 mx-auto mb-3 opacity-40" />
                <p className="text-sm">No recent applications submitted</p>
              </div>
            ) : (
              <div className="divide-y divide-border/60">
                {recentApps.map((app) => (
                  <div
                    key={app.id}
                    className="p-4 hover:bg-muted/40 transition-colors cursor-pointer flex items-center justify-between gap-4"
                    onClick={() => router.push("/admin/applications")}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2.5 mb-1">
                        <p className="font-medium text-sm text-foreground truncate">
                          {app.fullName}
                        </p>
                        {getStatusBadge(app.status)}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {app.applicationNumber} &bull; {new Date(app.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <ArrowRight className="size-4 text-muted-foreground/60 shrink-0" />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border border-border/70 shadow-sm bg-card h-fit">
          <CardHeader className="border-b border-border/60 pb-4">
            <CardTitle className="text-base font-semibold">Quick Actions</CardTitle>
            <CardDescription className="text-xs mt-0.5">Frequent administrative shortcuts</CardDescription>
          </CardHeader>
          <CardContent className="p-4 space-y-2.5">
            <Button
              onClick={() => router.push("/admin/applications")}
              className="w-full justify-start h-auto p-3 text-left border border-border/70 hover:border-primary/40 hover:bg-muted/50 transition-colors"
              variant="outline"
            >
              <div className="size-8 rounded-md bg-primary/10 flex items-center justify-center text-primary mr-3 shrink-0">
                <FileText className="size-4" />
              </div>
              <div className="min-w-0">
                <div className="font-medium text-sm">Review Applications</div>
                <div className="text-xs text-muted-foreground">Process pending student entries</div>
              </div>
            </Button>

            <Button
              onClick={() => router.push("/admin/blocks")}
              className="w-full justify-start h-auto p-3 text-left border border-border/70 hover:border-primary/40 hover:bg-muted/50 transition-colors"
              variant="outline"
            >
              <div className="size-8 rounded-md bg-primary/10 flex items-center justify-center text-primary mr-3 shrink-0">
                <Building2 className="size-4" />
              </div>
              <div className="min-w-0">
                <div className="font-medium text-sm">Manage Blocks & Rooms</div>
                <div className="text-xs text-muted-foreground">Room allocations and capacity</div>
              </div>
            </Button>

            <Button
              onClick={() => router.push("/admin/announcements")}
              className="w-full justify-start h-auto p-3 text-left border border-border/70 hover:border-primary/40 hover:bg-muted/50 transition-colors"
              variant="outline"
            >
              <div className="size-8 rounded-md bg-primary/10 flex items-center justify-center text-primary mr-3 shrink-0">
                <TrendingUp className="size-4" />
              </div>
              <div className="min-w-0">
                <div className="font-medium text-sm">Announcements</div>
                <div className="text-xs text-muted-foreground">Publish notices and updates</div>
              </div>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

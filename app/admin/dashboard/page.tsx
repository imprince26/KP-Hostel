"use client";

import { useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Users, FileText, Building2, TrendingUp, ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { StatCard, StatCardGrid } from "@/components/ui/stat-card";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { AdmissionStatusBadge } from "@/components/admin/status-badge";
import { queryKeys, useApiQuery } from "@/hooks/use-data";

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

  const isAdmin =
    status === "authenticated" &&
    (session?.user as { role?: string } | undefined)?.role === "admin";

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
      return;
    }

    if (status === "authenticated" && !isAdmin) {
      router.push("/student/dashboard");
    }
  }, [status, isAdmin, router]);

  const statsQuery = useApiQuery<{ stats: DashboardStats }>(
    queryKeys.admin.stats,
    "/api/admin/stats",
    isAdmin
  );

  const recentAppsQuery = useApiQuery<{
    applications: { application: RecentApplication }[];
  }>(
    queryKeys.admin.recentApplications,
    "/api/admin/applications?limit=5",
    isAdmin
  );

  const stats = statsQuery.data?.stats ?? null;

  const recentApps = useMemo<RecentApplication[]>(
    () =>
      (recentAppsQuery.data?.applications ?? []).map((item) => ({
        id: item.application.id,
        applicationNumber: item.application.applicationNumber,
        fullName: item.application.fullName,
        status: item.application.status,
        createdAt: item.application.createdAt,
      })),
    [recentAppsQuery.data]
  );

  const loading = status === "loading" || (isAdmin && statsQuery.isPending);

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
      <PageHeader
        title="Dashboard"
        description="Hostel operations, live occupancy, and admission metrics"
        actions={
          <>
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
          </>
        }
      />

      {/* Statistics Cards */}
      <StatCardGrid columns={4}>
        <StatCard
          label="Total Students"
          value={stats?.totalStudents || 0}
          icon={Users}
          hint="Registered users"
        />
        <StatCard
          label="Active Admissions"
          value={stats?.activeAdmissions || 0}
          icon={Building2}
          hint="Current residents"
        />
        <StatCard
          label="Pending Applications"
          value={stats?.pendingApplications || 0}
          icon={FileText}
          hint="Awaiting review"
        />
        <StatCard
          label="Occupancy Rate"
          value={`${stats?.occupancyRate || 0}%`}
          icon={TrendingUp}
          hint="Room utilization"
        />
      </StatCardGrid>

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
              <EmptyState
                icon={FileText}
                title="No recent applications submitted"
                description="New admission requests will appear here as soon as they are submitted."
              />
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
                        <AdmissionStatusBadge status={app.status} />
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

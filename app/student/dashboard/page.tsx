"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  FiFileText, FiBell, FiHome, FiSettings,
  FiCalendar, FiDollarSign, FiCheck, FiClock, FiX
} from "react-icons/fi";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { StatCard, StatCardGrid } from "@/components/ui/stat-card";
import { EmptyState } from "@/components/ui/empty-state";
import { NotificationDetailDialog } from "@/components/notifications/notification-detail-dialog";
import { createExcerpt } from "@/lib/announcement-utils";
import { apiSend } from "@/lib/api-client";
import type { NotificationRecord, StudentApplication } from "@/lib/api-types";
import { queryKeys, useApiQuery } from "@/hooks/use-data";

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

export default function StudentDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [selectedNotification, setSelectedNotification] = useState<NotificationRecord | null>(null);

  const isStudent = status === "authenticated";

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status, router]);

  const applicationsQuery = useApiQuery<{ applications: StudentApplication[] }>(
    queryKeys.student.applications,
    "/api/admission/apply",
    isStudent
  );

  const notificationsQuery = useApiQuery<{ notifications: NotificationRecord[] }>(
    queryKeys.notifications,
    "/api/notifications",
    isStudent
  );

  const stats = useMemo<DashboardStats | null>(() => {
    const applications = applicationsQuery.data?.applications;
    if (!applications) return null;

    const countByStatus = (status: StudentApplication["status"]) =>
      applications.filter((app) => app.status === status).length;

    const activeApp = applications.find(
      (app) =>
        app.status === "active" && app.assignedBlock && app.roomNumber
    );

    return {
      totalApplications: applications.length,
      approvedApplications: countByStatus("approved"),
      pendingApplications: countByStatus("submitted"),
      rejectedApplications: countByStatus("rejected"),
      roomDetails: activeApp
        ? {
            block: activeApp.assignedBlock as string,
            roomNumber: activeApp.roomNumber as string,
            admissionStart: activeApp.admissionStartDate as string,
            admissionEnd: activeApp.admissionEndDate as string,
          }
        : undefined,
    };
  }, [applicationsQuery.data]);

  const notifications = useMemo(
    () => (notificationsQuery.data?.notifications ?? []).slice(0, 5),
    [notificationsQuery.data]
  );

  const markAsRead = useMutation({
    mutationFn: (notificationId: string) =>
      apiSend("/api/notifications", "PATCH", { notificationId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications });
    },
  });

  const handleNotificationClick = (notif: NotificationRecord) => {
    setSelectedNotification(notif);
    if (!notif.read) {
      markAsRead.mutate(notif.id);
    }
  };

  if (status === "loading" || (isStudent && applicationsQuery.isPending)) {
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
    <div className="min-h-screen bg-muted/30 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Welcome back, {session?.user?.name || "Student"}!
          </h1>
          <p className="text-muted-foreground">Here&apos;s your hostel dashboard overview</p>
        </div>

        {/* Room Details Alert (if active) */}
        {stats?.roomDetails && (
          <Alert className="mb-6">
            <FiHome className="h-5 w-5" />
            <AlertDescription>
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
                >
                  View Details
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Statistics Cards */}
        <StatCardGrid columns={4} className="mb-8">
          <StatCard
            label="Total Applications"
            value={stats?.totalApplications || 0}
            icon={FiFileText}
            hint="All time"
          />
          <StatCard
            label="Pending"
            value={stats?.pendingApplications || 0}
            icon={FiClock}
            hint="Under review"
          />
          <StatCard
            label="Approved"
            value={stats?.approvedApplications || 0}
            icon={FiCheck}
            hint="Accepted"
          />
          <StatCard
            label="Rejected"
            value={stats?.rejectedApplications || 0}
            icon={FiX}
            hint="Not approved"
          />
        </StatCardGrid>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <Card className="lg:col-span-2 border-0 shadow-sm bg-card">
            <CardHeader className="border-b border-border">
              <CardTitle className="flex items-center gap-2">
                <FiCalendar className="w-5 h-5" />
                Quick Actions
              </CardTitle>
              <CardDescription>
                Common tasks and actions
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-2 gap-4">
                <Button
                  onClick={() => router.push("/en/admission")}
                  className="h-24 flex-col gap-2"
                  variant="outline"
                >
                  <FiFileText className="w-6 h-6" />
                  <span className="font-semibold">Apply for Admission</span>
                </Button>

                <Button
                  onClick={() => router.push("/student/applications")}
                  className="h-24 flex-col gap-2"
                  variant="outline"
                >
                  <FiClock className="w-6 h-6" />
                  <span className="font-semibold">View Applications</span>
                </Button>

                <Button
                  onClick={() => router.push("/student/settings")}
                  className="h-24 flex-col gap-2"
                  variant="outline"
                >
                  <FiSettings className="w-6 h-6" />
                  <span className="font-semibold">Settings</span>
                </Button>

                <Button
                  onClick={() => router.push("/")}
                  className="h-24 flex-col gap-2"
                  variant="outline"
                >
                  <FiHome className="w-6 h-6" />
                  <span className="font-semibold">Hostel Info</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Notifications */}
          <Card className="border-0 shadow-sm bg-card">
            <CardHeader className="border-b border-border">
              <CardTitle className="flex items-center gap-2">
                <FiBell className="w-5 h-5" />
                Recent Notifications
              </CardTitle>
              <CardDescription>
                Latest updates
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              {notifications.length === 0 ? (
                <EmptyState
                  icon={FiBell}
                  title="No notifications yet"
                  description="Updates and notices will appear here."
                />
              ) : (
                <div className="space-y-3">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => handleNotificationClick(notif)}
                      className={`p-3.5 rounded-lg border cursor-pointer hover:shadow-xs transition-all text-left ${
                        notif.read
                          ? "bg-muted/30 border-border hover:bg-muted/50"
                          : "bg-primary/5 border-primary/20 hover:bg-primary/10"
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        {!notif.read && (
                          <div className="w-2 h-2 bg-primary rounded-full mt-1.5 shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm text-foreground hover:text-primary transition-colors">
                            {notif.title}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                            {createExcerpt(notif.message, 110)}
                          </p>
                          <div className="flex items-center justify-between mt-2 pt-1 border-t border-border/50 text-[11px] text-muted-foreground">
                            <span className="text-primary font-medium">Click to view full notice</span>
                            <span>{new Date(notif.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Full Notification Modal */}
        <NotificationDetailDialog
          notification={selectedNotification}
          onClose={() => setSelectedNotification(null)}
        />

        {/* Important Information */}
        <Card className="mt-6 border-0 shadow-sm bg-card">
          <CardHeader className="border-b border-border">
            <CardTitle>Important Information</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <FiFileText className="text-primary" />
                  Application Process
                </h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex gap-2">
                    <span className="text-primary">1.</span>
                    Submit online application with required documents
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary">2.</span>
                    Visit hostel office after approval notification
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary">3.</span>
                    Complete offline formalities and payment
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary">4.</span>
                    Receive room allocation confirmation
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <FiDollarSign className="text-primary" />
                  Payment Information
                </h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex gap-2">
                    <span className="text-primary">•</span>
                    Payment accepted via Demand Draft (DD) only
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary">•</span>
                    Semester fees must be paid before deadline
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary">•</span>
                    Bring DD to hostel office during working hours
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary">•</span>
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

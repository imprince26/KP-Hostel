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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { createExcerpt, containsHtml } from "@/lib/announcement-utils";

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
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [loading, setLoading] = useState(true);

  const handleNotificationClick = async (notif: Notification) => {
    setSelectedNotification(notif);
    if (!notif.read) {
      try {
        await fetch("/api/notifications", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ notificationId: notif.id }),
        });
        setNotifications((prev) =>
          prev.map((n) => (n.id === notif.id ? { ...n, read: true } : n))
        );
      } catch (err) {
        console.error("Failed to mark notification as read:", err);
      }
    }
  };

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-sm bg-card hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Applications</CardTitle>
                <FiFileText className="w-5 h-5 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-foreground">{stats?.totalApplications || 0}</p>
              <p className="text-sm text-muted-foreground mt-1">All time</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-card hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
                <FiClock className="w-5 h-5 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-foreground">{stats?.pendingApplications || 0}</p>
              <p className="text-sm text-muted-foreground mt-1">Under review</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-card hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Approved</CardTitle>
                <FiCheck className="w-5 h-5 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-foreground">{stats?.approvedApplications || 0}</p>
              <p className="text-sm text-muted-foreground mt-1">Accepted</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-card hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Rejected</CardTitle>
                <FiX className="w-5 h-5 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-foreground">{stats?.rejectedApplications || 0}</p>
              <p className="text-sm text-muted-foreground mt-1">Not approved</p>
            </CardContent>
          </Card>
        </div>

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
                <div className="text-center py-8 text-muted-foreground">
                  <FiBell className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">No notifications yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {notifications.map((notif) => {
                    const plainSnippet = createExcerpt(notif.message, 110);
                    return (
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
                              {plainSnippet}
                            </p>
                            <div className="flex items-center justify-between mt-2 pt-1 border-t border-border/50 text-[11px] text-muted-foreground">
                              <span className="text-primary font-medium">Click to view full notice</span>
                              <span>{new Date(notif.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Full Notification Modal */}
        <Dialog
          open={!!selectedNotification}
          onOpenChange={(isOpen) => !isOpen && setSelectedNotification(null)}
        >
          <DialogContent className="max-w-lg max-h-[85vh] p-0 flex flex-col overflow-hidden">
            {selectedNotification && (
              <>
                <DialogHeader className="px-6 py-5 border-b border-border bg-muted/30 shrink-0">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <Badge variant="outline" className="text-xs capitalize bg-primary/10 text-primary border-primary/20">
                      {selectedNotification.type.replace("_", " ")}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(selectedNotification.createdAt).toLocaleString("en-IN", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </span>
                  </div>
                  <DialogTitle className="text-lg font-bold text-foreground">
                    {selectedNotification.title}
                  </DialogTitle>
                </DialogHeader>

                <ScrollArea className="flex-1 p-6 max-h-[calc(85vh-10rem)]">
                  {containsHtml(selectedNotification.message) ? (
                    <div
                      className="prose prose-sm dark:prose-invert max-w-none text-foreground leading-relaxed wrap-break-word"
                      dangerouslySetInnerHTML={{ __html: selectedNotification.message }}
                    />
                  ) : (
                    <p className="text-sm text-foreground/90 whitespace-pre-line leading-relaxed">
                      {selectedNotification.message}
                    </p>
                  )}
                </ScrollArea>

                <DialogFooter className="px-6 py-3 border-t border-border bg-muted/20 shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedNotification(null)}
                  >
                    Close
                  </Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>

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

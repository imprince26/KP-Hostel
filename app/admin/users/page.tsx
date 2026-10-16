"use client";

import { useEffect, useState, useMemo } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Users,
  Search,
  Shield,
  GraduationCap,
  Building,
  CheckCircle2,
  XCircle,
  MoreVertical,
  Mail,
  Phone,
  Calendar,
  MapPin,
  RefreshCw,
  ExternalLink,
  Trash2,
  UserCheck,
  UserX,
  UserCog,
  Eye,
} from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { MobileFilterDrawer } from "@/components/admin/mobile-filter-drawer";
import { formatIndianDate } from "@/lib/utils";

interface UserRecord {
  id: string;
  name: string | null;
  email: string | null;
  emailVerified: string | null;
  image: string | null;
  avatar: string | null;
  role: "student" | "admin";
  phone: string | null;
  bio: string | null;
  dateOfBirth: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  pincode: string | null;
  guardianName: string | null;
  guardianPhone: string | null;
  collegeName: string | null;
  course: string | null;
  year: string | null;
  createdAt: string;
  updatedAt: string;
  application: {
    id: string;
    applicationNumber: string;
    status: string;
    assignedBlock: string | null;
    roomNumber: string | null;
  } | null;
  isResident: boolean;
}

interface UserStats {
  total: number;
  students: number;
  admins: number;
  verified: number;
  residents: number;
}

export default function AdminUsersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [users, setUsers] = useState<UserRecord[]>([]);
  const [stats, setStats] = useState<UserStats>({
    total: 0,
    students: 0,
    admins: 0,
    verified: 0,
    residents: 0,
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [verificationFilter, setVerificationFilter] = useState<string>("all");
  const [residentFilter, setResidentFilter] = useState<string>("all");

  // Dialog states
  const [selectedUser, setSelectedUser] = useState<UserRecord | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [targetRole, setTargetRole] = useState<"student" | "admin">("student");
  const [actionLoading, setActionLoading] = useState(false);

  // Auth gate
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    } else if (
      status === "authenticated" &&
      session?.user &&
      "role" in session.user &&
      session.user.role !== "admin"
    ) {
      router.push("/");
    }
  }, [status, session, router]);

  const fetchUsers = async () => {
    try {
      setRefreshing(true);
      const res = await fetch("/api/admin/users");
      if (!res.ok) {
        throw new Error("Failed to load user directory");
      }
      const data = await res.json();
      setUsers(data.users || []);
      setStats(
        data.stats || {
          total: 0,
          students: 0,
          admins: 0,
          verified: 0,
          residents: 0,
        }
      );
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load user records");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      fetchUsers();
    }
  }, [status]);

  // Active filter count for mobile badge
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (roleFilter !== "all") count++;
    if (verificationFilter !== "all") count++;
    if (residentFilter !== "all") count++;
    return count;
  }, [roleFilter, verificationFilter, residentFilter]);

  const handleResetFilters = () => {
    setSearchQuery("");
    setRoleFilter("all");
    setVerificationFilter("all");
    setResidentFilter("all");
  };

  // Filtered users calculation
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      // Search matching
      const query = searchQuery.trim().toLowerCase();
      if (query) {
        const nameMatch = u.name?.toLowerCase().includes(query) ?? false;
        const emailMatch = u.email?.toLowerCase().includes(query) ?? false;
        const phoneMatch = u.phone?.toLowerCase().includes(query) ?? false;
        const collegeMatch = u.collegeName?.toLowerCase().includes(query) ?? false;
        const courseMatch = u.course?.toLowerCase().includes(query) ?? false;
        const appNumMatch = u.application?.applicationNumber?.toLowerCase().includes(query) ?? false;
        if (!nameMatch && !emailMatch && !phoneMatch && !collegeMatch && !courseMatch && !appNumMatch) {
          return false;
        }
      }

      // Role filter
      if (roleFilter !== "all" && u.role !== roleFilter) {
        return false;
      }

      // Verification filter
      if (verificationFilter === "verified" && !u.emailVerified) {
        return false;
      }
      if (verificationFilter === "unverified" && u.emailVerified) {
        return false;
      }

      // Resident filter
      if (residentFilter === "resident" && !u.isResident) {
        return false;
      }
      if (residentFilter === "non_resident" && u.isResident) {
        return false;
      }

      return true;
    });
  }, [users, searchQuery, roleFilter, verificationFilter, residentFilter]);

  const handleOpenRoleDialog = (user: UserRecord) => {
    setSelectedUser(user);
    setTargetRole(user.role === "admin" ? "student" : "admin");
    setRoleDialogOpen(true);
  };

  const handleUpdateRole = async () => {
    if (!selectedUser) return;
    try {
      setActionLoading(true);
      const res = await fetch(`/api/admin/users/${selectedUser.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: targetRole }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update role");
      }
      toast.success(`Role updated to ${targetRole} for ${selectedUser.name || "user"}`);
      setRoleDialogOpen(false);
      fetchUsers();
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Role update failed";
      toast.error(msg);
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleVerification = async (user: UserRecord) => {
    try {
      const nextStatus = !user.emailVerified;
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailVerified: nextStatus }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update verification");
      }
      toast.success(
        nextStatus
          ? `Marked ${user.name || "user"} as verified`
          : `Removed verification for ${user.name || "user"}`
      );
      fetchUsers();
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Verification update failed";
      toast.error(msg);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    try {
      setActionLoading(true);
      const res = await fetch(`/api/admin/users/${selectedUser.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to delete user");
      }
      toast.success("User account deleted successfully");
      setDeleteDialogOpen(false);
      fetchUsers();
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Deletion failed";
      toast.error(msg);
    } finally {
      setActionLoading(false);
    }
  };

  const getInitials = (name?: string | null) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-sm font-medium text-muted-foreground">Loading user directory...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 py-4 sm:py-8 px-3 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-foreground mb-1">
              User Management
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Manage student accounts, role permissions, and hostel resident profiles
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchUsers}
              disabled={refreshing}
              className="w-full sm:w-auto h-9 text-xs sm:text-sm gap-2"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          <Card className="border-0 shadow-xs bg-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Total Users</p>
                  <p className="text-xl sm:text-2xl font-bold font-display mt-0.5 text-foreground">
                    {stats.total}
                  </p>
                </div>
                <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Users className="w-4 h-4" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xs bg-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Students</p>
                  <p className="text-xl sm:text-2xl font-bold font-display mt-0.5 text-foreground">
                    {stats.students}
                  </p>
                </div>
                <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <GraduationCap className="w-4 h-4" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xs bg-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Hostel Residents</p>
                  <p className="text-xl sm:text-2xl font-bold font-display mt-0.5 text-foreground">
                    {stats.residents}
                  </p>
                </div>
                <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Building className="w-4 h-4" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xs bg-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Verified</p>
                  <p className="text-xl sm:text-2xl font-bold font-display mt-0.5 text-foreground">
                    {stats.verified}
                  </p>
                </div>
                <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xs bg-card col-span-2 sm:col-span-1">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Admins</p>
                  <p className="text-xl sm:text-2xl font-bold font-display mt-0.5 text-foreground">
                    {stats.admins}
                  </p>
                </div>
                <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Shield className="w-4 h-4" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search Container */}
        {/* Mobile Filter View (< md) */}
        <div className="md:hidden flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Search users by name, email, phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-10 text-sm bg-card"
            />
          </div>
          <MobileFilterDrawer
            title="Filter Users"
            description="Filter directory by role, verification, and residency"
            activeCount={activeFiltersCount}
            onReset={handleResetFilters}
          >
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground">Account Role</Label>
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="All Roles" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles ({users.length})</SelectItem>
                    <SelectItem value="student">Students ({users.filter((u) => u.role === "student").length})</SelectItem>
                    <SelectItem value="admin">Administrators ({users.filter((u) => u.role === "admin").length})</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground">Verification Status</Label>
                <Select value={verificationFilter} onValueChange={setVerificationFilter}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Verification</SelectItem>
                    <SelectItem value="verified">Verified Accounts</SelectItem>
                    <SelectItem value="unverified">Unverified Accounts</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground">Hostel Residency</Label>
                <Select value={residentFilter} onValueChange={setResidentFilter}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="All Users" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Users</SelectItem>
                    <SelectItem value="resident">Hostel Residents (Assigned Room)</SelectItem>
                    <SelectItem value="non_resident">Non-Residents</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </MobileFilterDrawer>
        </div>

        {/* Desktop Filter View (>= md) */}
        <Card className="hidden md:block border-0 shadow-xs bg-card">
          <CardContent className="p-4 sm:p-5">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-1">
                <Label htmlFor="desktop-search" className="text-xs font-medium text-muted-foreground mb-1.5 block">
                  Search Users
                </Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <Input
                    id="desktop-search"
                    placeholder="Search name, email, phone, college..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 h-9 text-sm"
                  />
                </div>
              </div>

              <div>
                <Label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                  Role
                </Label>
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="All Roles" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles ({users.length})</SelectItem>
                    <SelectItem value="student">Students ({users.filter((u) => u.role === "student").length})</SelectItem>
                    <SelectItem value="admin">Administrators ({users.filter((u) => u.role === "admin").length})</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                  Verification
                </Label>
                <Select value={verificationFilter} onValueChange={setVerificationFilter}>
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="All Verification" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Verification</SelectItem>
                    <SelectItem value="verified">Verified Accounts</SelectItem>
                    <SelectItem value="unverified">Unverified Accounts</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <Label className="text-xs font-medium text-muted-foreground">Hostel Residency</Label>
                  {activeFiltersCount > 0 && (
                    <button
                      onClick={handleResetFilters}
                      className="text-[11px] text-primary hover:underline cursor-pointer"
                    >
                      Clear filters
                    </button>
                  )}
                </div>
                <Select value={residentFilter} onValueChange={setResidentFilter}>
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="All Users" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Users</SelectItem>
                    <SelectItem value="resident">Hostel Residents</SelectItem>
                    <SelectItem value="non_resident">Non-Residents</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Count Banner */}
        <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
          <span>
            Showing <strong className="text-foreground">{filteredUsers.length}</strong> of{" "}
            {users.length} users
          </span>
          {activeFiltersCount > 0 && (
            <span className="hidden sm:inline-block">
              Filters applied ({activeFiltersCount})
            </span>
          )}
        </div>

        {/* Users Table / Mobile Cards */}
        {filteredUsers.length === 0 ? (
          <Card className="border-0 shadow-xs bg-card p-12 text-center">
            <Users className="h-10 w-10 text-muted-foreground/60 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-foreground">No users match your criteria</h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
              Try adjusting your search query or reset your filters to view more accounts.
            </p>
            {activeFiltersCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleResetFilters}
                className="mt-4 text-xs"
              >
                Reset All Filters
              </Button>
            )}
          </Card>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden lg:block bg-card rounded-xl shadow-xs border border-border/70 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-muted/40 text-xs uppercase text-muted-foreground border-b border-border font-medium">
                    <tr>
                      <th className="px-5 py-3.5">User</th>
                      <th className="px-4 py-3.5">Role</th>
                      <th className="px-4 py-3.5">Academic Profile</th>
                      <th className="px-4 py-3.5">Hostel Status</th>
                      <th className="px-4 py-3.5">Verification</th>
                      <th className="px-4 py-3.5">Joined</th>
                      <th className="px-5 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-muted/20 transition-colors">
                        {/* User Identity */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9 shrink-0">
                              <AvatarImage src={user.image || user.avatar || ""} alt={user.name || "User"} />
                              <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                                {getInitials(user.name)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0 max-w-[200px]">
                              <p className="font-semibold text-foreground truncate text-sm">
                                {user.name || "Unnamed User"}
                              </p>
                              <p className="text-xs text-muted-foreground truncate">{user.email || "No email"}</p>
                              {user.phone && (
                                <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                                  <Phone className="h-3 w-3" />
                                  {user.phone}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Role */}
                        <td className="px-4 py-4 whitespace-nowrap">
                          {user.role === "admin" ? (
                            <Badge
                              variant="default"
                              className="bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50 font-medium text-xs gap-1"
                            >
                              <Shield className="h-3 w-3" />
                              Admin
                            </Badge>
                          ) : (
                            <Badge
                              variant="secondary"
                              className="bg-muted text-muted-foreground font-medium text-xs gap-1"
                            >
                              <GraduationCap className="h-3 w-3" />
                              Student
                            </Badge>
                          )}
                        </td>

                        {/* Academic Info */}
                        <td className="px-4 py-4">
                          {user.collegeName || user.course ? (
                            <div className="max-w-[200px]">
                              <p className="font-medium text-foreground text-xs truncate">
                                {user.collegeName || "College not set"}
                              </p>
                              <p className="text-[11px] text-muted-foreground truncate">
                                {user.course ? `${user.course}` : ""}
                                {user.year ? ` • Year ${user.year}` : ""}
                              </p>
                            </div>
                          ) : (
                            <span className="text-xs text-muted-foreground">Not provided</span>
                          )}
                        </td>

                        {/* Hostel Status */}
                        <td className="px-4 py-4 whitespace-nowrap">
                          {user.isResident && user.application ? (
                            <div className="flex flex-col gap-0.5">
                              <Badge
                                variant="outline"
                                className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/50 text-[11px] font-semibold w-fit"
                              >
                                Block {user.application.assignedBlock} • Room {user.application.roomNumber}
                              </Badge>
                              <span className="text-[11px] text-muted-foreground">
                                App #{user.application.applicationNumber}
                              </span>
                            </div>
                          ) : user.application ? (
                            <Badge variant="outline" className="text-[11px] capitalize text-muted-foreground">
                              {user.application.status.replace("_", " ")}
                            </Badge>
                          ) : (
                            <span className="text-xs text-muted-foreground">No application</span>
                          )}
                        </td>

                        {/* Verification */}
                        <td className="px-4 py-4 whitespace-nowrap">
                          {user.emailVerified ? (
                            <span className="inline-flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                              <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                              Verified
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                              <XCircle className="h-3.5 w-3.5 shrink-0" />
                              Unverified
                            </span>
                          )}
                        </td>

                        {/* Joined Date */}
                        <td className="px-4 py-4 whitespace-nowrap text-xs text-muted-foreground font-mono-numbers">
                          {formatIndianDate(user.createdAt)}
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-4 whitespace-nowrap text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuLabel className="text-xs">User Actions</DropdownMenuLabel>
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedUser(user);
                                  setViewDialogOpen(true);
                                }}
                                className="text-xs gap-2 cursor-pointer"
                              >
                                <Eye className="h-3.5 w-3.5" />
                                View Profile
                              </DropdownMenuItem>

                              <DropdownMenuItem
                                onClick={() => handleOpenRoleDialog(user)}
                                className="text-xs gap-2 cursor-pointer"
                              >
                                <UserCog className="h-3.5 w-3.5" />
                                Change Role
                              </DropdownMenuItem>

                              <DropdownMenuItem
                                onClick={() => handleToggleVerification(user)}
                                className="text-xs gap-2 cursor-pointer"
                              >
                                {user.emailVerified ? (
                                  <>
                                    <UserX className="h-3.5 w-3.5 text-amber-600" />
                                    Mark Unverified
                                  </>
                                ) : (
                                  <>
                                    <UserCheck className="h-3.5 w-3.5 text-emerald-600" />
                                    Mark Verified
                                  </>
                                )}
                              </DropdownMenuItem>

                              {user.application && (
                                <DropdownMenuItem
                                  onClick={() => router.push(`/admin/applications/${user.application!.id}`)}
                                  className="text-xs gap-2 cursor-pointer"
                                >
                                  <ExternalLink className="h-3.5 w-3.5" />
                                  View Application
                                </DropdownMenuItem>
                              )}

                              <DropdownMenuSeparator />

                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedUser(user);
                                  setDeleteDialogOpen(true);
                                }}
                                className="text-xs text-destructive gap-2 cursor-pointer"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                                Delete Account
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile / Tablet Cards View (< lg) */}
            <div className="lg:hidden space-y-3">
              {filteredUsers.map((user) => (
                <Card key={user.id} className="border-0 shadow-xs bg-card p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <Avatar className="h-10 w-10 shrink-0">
                        <AvatarImage src={user.image || user.avatar || ""} alt={user.name || "User"} />
                        <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="font-semibold text-foreground text-sm truncate">
                          {user.name || "Unnamed User"}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">{user.email || "No email"}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {user.role === "admin" ? (
                        <Badge
                          variant="default"
                          className="bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50 text-[11px] font-medium"
                        >
                          Admin
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="text-[11px] font-medium">
                          Student
                        </Badge>
                      )}

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedUser(user);
                              setViewDialogOpen(true);
                            }}
                            className="text-xs gap-2 cursor-pointer"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            View Details
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onClick={() => handleOpenRoleDialog(user)}
                            className="text-xs gap-2 cursor-pointer"
                          >
                            <UserCog className="h-3.5 w-3.5" />
                            Change Role
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onClick={() => handleToggleVerification(user)}
                            className="text-xs gap-2 cursor-pointer"
                          >
                            {user.emailVerified ? (
                              <>
                                <UserX className="h-3.5 w-3.5 text-amber-600" />
                                Mark Unverified
                              </>
                            ) : (
                              <>
                                <UserCheck className="h-3.5 w-3.5 text-emerald-600" />
                                Mark Verified
                              </>
                            )}
                          </DropdownMenuItem>

                          {user.application && (
                            <DropdownMenuItem
                              onClick={() => router.push(`/admin/applications/${user.application!.id}`)}
                              className="text-xs gap-2 cursor-pointer"
                            >
                              <ExternalLink className="h-3.5 w-3.5" />
                              View Application
                            </DropdownMenuItem>
                          )}

                          <DropdownMenuSeparator />

                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedUser(user);
                              setDeleteDialogOpen(true);
                            }}
                            className="text-xs text-destructive gap-2 cursor-pointer"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Delete Account
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  {/* Details Strip */}
                  <div className="mt-3 pt-3 border-t border-border grid grid-cols-2 gap-2 text-xs">
                    {user.phone && (
                      <div className="text-muted-foreground flex items-center gap-1.5 truncate">
                        <Phone className="h-3 w-3 shrink-0" />
                        <span className="truncate">{user.phone}</span>
                      </div>
                    )}

                    {user.collegeName && (
                      <div className="text-muted-foreground flex items-center gap-1.5 truncate">
                        <GraduationCap className="h-3 w-3 shrink-0" />
                        <span className="truncate">{user.collegeName}</span>
                      </div>
                    )}

                    {user.isResident && user.application && (
                      <div className="col-span-2 mt-1">
                        <Badge
                          variant="outline"
                          className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 text-[11px] font-semibold"
                        >
                          Resident • Block {user.application.assignedBlock} (Room {user.application.roomNumber})
                        </Badge>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}

        {/* View Profile Dialog */}
        <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
          <DialogContent className="max-w-md sm:max-w-lg max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold font-display">User Profile Details</DialogTitle>
              <DialogDescription className="text-xs">
                Comprehensive account information and residency details
              </DialogDescription>
            </DialogHeader>

            {selectedUser && (
              <div className="space-y-4 py-2 text-sm">
                {/* Header profile info */}
                <div className="flex items-center gap-3 p-3 bg-muted/40 rounded-lg border border-border">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={selectedUser.image || selectedUser.avatar || ""} />
                    <AvatarFallback className="bg-primary/10 text-primary font-bold">
                      {getInitials(selectedUser.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-bold text-foreground text-base">
                      {selectedUser.name || "Unnamed User"}
                    </h3>
                    <p className="text-xs text-muted-foreground">{selectedUser.email}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant={selectedUser.role === "admin" ? "default" : "secondary"} className="text-[10px]">
                        {selectedUser.role.toUpperCase()}
                      </Badge>
                      {selectedUser.emailVerified ? (
                        <span className="text-[11px] text-emerald-600 font-medium">Verified Email</span>
                      ) : (
                        <span className="text-[11px] text-muted-foreground">Unverified Email</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Academic Information */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Academic Details
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-xs bg-muted/20 p-3 rounded-lg border border-border/60">
                    <div>
                      <p className="text-muted-foreground">College</p>
                      <p className="font-medium text-foreground">{selectedUser.collegeName || "Not set"}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Course & Year</p>
                      <p className="font-medium text-foreground">
                        {selectedUser.course ? `${selectedUser.course} ` : "Not set"}
                        {selectedUser.year ? `(${selectedUser.year})` : ""}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Contact and Address */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Contact & Guardian
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-xs bg-muted/20 p-3 rounded-lg border border-border/60">
                    <div>
                      <p className="text-muted-foreground">Phone</p>
                      <p className="font-medium text-foreground">{selectedUser.phone || "Not set"}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Location</p>
                      <p className="font-medium text-foreground">
                        {selectedUser.city ? `${selectedUser.city}, ${selectedUser.state || ""}` : "Not set"}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Guardian Name</p>
                      <p className="font-medium text-foreground">{selectedUser.guardianName || "Not set"}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Guardian Phone</p>
                      <p className="font-medium text-foreground">{selectedUser.guardianPhone || "Not set"}</p>
                    </div>
                  </div>
                </div>

                {/* Hostel Assignment */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Hostel Admission Status
                  </h4>
                  <div className="bg-muted/20 p-3 rounded-lg border border-border/60 text-xs">
                    {selectedUser.application ? (
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Application:</span>
                          <span className="font-semibold text-foreground">
                            #{selectedUser.application.applicationNumber}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Status:</span>
                          <span className="font-medium capitalize text-foreground">
                            {selectedUser.application.status.replace("_", " ")}
                          </span>
                        </div>
                        {selectedUser.application.assignedBlock && (
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Assigned Block & Room:</span>
                            <span className="font-bold text-primary">
                              Block {selectedUser.application.assignedBlock} - Room{" "}
                              {selectedUser.application.roomNumber || "TBD"}
                            </span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">No admission application submitted.</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            <DialogFooter className="gap-2 sm:justify-between flex flex-col sm:flex-row">
              {selectedUser?.application ? (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setViewDialogOpen(false);
                    router.push(`/admin/applications/${selectedUser.application!.id}`);
                  }}
                  className="gap-1.5 text-xs order-2 sm:order-1"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  Open Full Application
                </Button>
              ) : <div />}
              <Button size="sm" onClick={() => setViewDialogOpen(false)} className="order-1 sm:order-2">
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Change Role Dialog */}
        <Dialog open={roleDialogOpen} onOpenChange={setRoleDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold font-display">Change User Role</DialogTitle>
              <DialogDescription className="text-xs">
                Update account authorization and administrative privileges
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-2">
              <p className="text-xs text-muted-foreground">
                You are changing the role for{" "}
                <strong className="text-foreground">{selectedUser?.name || selectedUser?.email}</strong>.
              </p>
              <div className="space-y-1.5">
                <Label htmlFor="role-select" className="text-xs font-medium">New Role</Label>
                <Select
                  value={targetRole}
                  onValueChange={(val: "student" | "admin") => setTargetRole(val)}
                >
                  <SelectTrigger id="role-select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Student (Standard Access)</SelectItem>
                    <SelectItem value="admin">Administrator (Full Access)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setRoleDialogOpen(false)}
                disabled={actionLoading}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleUpdateRole}
                disabled={actionLoading}
              >
                {actionLoading ? "Updating..." : "Confirm Role Change"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="text-destructive flex items-center gap-2">
                <Trash2 className="h-5 w-5" />
                Delete User Account
              </AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to permanently delete the account for{" "}
                <strong>{selectedUser?.name || selectedUser?.email}</strong>? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={actionLoading}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteUser}
                disabled={actionLoading}
                className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
              >
                {actionLoading ? "Deleting..." : "Permanently Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}

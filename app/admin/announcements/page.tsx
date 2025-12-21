"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Megaphone,
  Pin,
  Eye,
  EyeOff,
  Bell,
  Calendar,
  Filter,
  SortAsc,
  SortDesc,
  MoreHorizontal,
  Copy,
  Globe,
  Users,
  Clock,
  AlertTriangle,
} from "lucide-react";
import RichTextEditor from "@/components/ui/rich-text-editor";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

interface Announcement {
  announcement: {
    id: string;
    title: string;
    content: string;
    isPublic: boolean;
    targetAudience: string | null;
    isPinned: boolean;
    expiresAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
  };
  author: {
    id: string;
    name: string | null;
    email: string | null;
  } | null;
}

export default function AnnouncementsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [filteredAnnouncements, setFilteredAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "public" | "private">("all");
  const [audienceFilter, setAudienceFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "pinned">("newest");
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    isPublic: true,
    targetAudience: "all",
    isPinned: false,
    expiresAt: "",
    sendNotification: true,
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    } else if (session?.user.role !== "admin") {
      router.push("/");
    } else {
      fetchAnnouncements();
    }
  }, [session, status, router]);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, statusFilter, audienceFilter, sortBy, announcements]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/announcements");
      const data = await res.json();

      if (res.ok) {
        setAnnouncements(data.announcements);
        setFilteredAnnouncements(data.announcements);
      } else {
        toast.error(data.error || "Failed to fetch announcements");
      }
    } catch (error) {
      console.error("Error fetching announcements:", error);
      toast.error("Failed to fetch announcements");
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...announcements];

    // Search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (a) =>
          a.announcement.title.toLowerCase().includes(search) ||
          a.announcement.content.toLowerCase().includes(search) ||
          a.author?.name?.toLowerCase().includes(search)
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((a) =>
        statusFilter === "public" ? a.announcement.isPublic : !a.announcement.isPublic
      );
    }

    // Audience filter
    if (audienceFilter !== "all") {
      filtered = filtered.filter((a) =>
        a.announcement.targetAudience === audienceFilter
      );
    }

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === "pinned") {
        if (a.announcement.isPinned && !b.announcement.isPinned) return -1;
        if (!a.announcement.isPinned && b.announcement.isPinned) return 1;
      }

      const dateA = new Date(a.announcement.createdAt).getTime();
      const dateB = new Date(b.announcement.createdAt).getTime();

      if (sortBy === "oldest") {
        return dateA - dateB;
      }
      return dateB - dateA; // newest
    });

    setFilteredAnnouncements(filtered);
  };

  const handleAddAnnouncement = async () => {
    if (!formData.title || !formData.content) {
      toast.error("Title and content are required");
      return;
    }

    try {
      const res = await fetch("/api/admin/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Announcement created successfully");
        setAddDialogOpen(false);
        resetForm();
        fetchAnnouncements();
      } else {
        toast.error(data.error || "Failed to create announcement");
      }
    } catch (error) {
      console.error("Error creating announcement:", error);
      toast.error("Failed to create announcement");
    }
  };

  const handleUpdateAnnouncement = async () => {
    if (!selectedAnnouncement || !formData.title || !formData.content) {
      toast.error("Title and content are required");
      return;
    }

    try {
      const res = await fetch(`/api/admin/announcements/${selectedAnnouncement.announcement.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title,
          content: formData.content,
          isPublic: formData.isPublic,
          targetAudience: formData.targetAudience,
          isPinned: formData.isPinned,
          expiresAt: formData.expiresAt,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Announcement updated successfully");
        setEditDialogOpen(false);
        resetForm();
        fetchAnnouncements();
      } else {
        toast.error(data.error || "Failed to update announcement");
      }
    } catch (error) {
      console.error("Error updating announcement:", error);
      toast.error("Failed to update announcement");
    }
  };

  const handleDeleteAnnouncement = async (id: string) => {
    if (!confirm("Are you sure you want to delete this announcement?")) return;

    try {
      const res = await fetch(`/api/admin/announcements/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Announcement deleted successfully");
        fetchAnnouncements();
      } else {
        toast.error(data.error || "Failed to delete announcement");
      }
    } catch (error) {
      console.error("Error deleting announcement:", error);
      toast.error("Failed to delete announcement");
    }
  };

  const openEditDialog = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement);
    setFormData({
      title: announcement.announcement.title,
      content: announcement.announcement.content,
      isPublic: announcement.announcement.isPublic,
      targetAudience: announcement.announcement.targetAudience || "all",
      isPinned: announcement.announcement.isPinned,
      expiresAt: announcement.announcement.expiresAt
        ? new Date(announcement.announcement.expiresAt).toISOString().split("T")[0]
        : "",
      sendNotification: false,
    });
    setEditDialogOpen(true);
  };

  const openViewDialog = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement);
    setViewDialogOpen(true);
  };

  const resetForm = () => {
    setSelectedAnnouncement(null);
    setFormData({
      title: "",
      content: "",
      isPublic: true,
      targetAudience: "all",
      isPinned: false,
      expiresAt: "",
      sendNotification: true,
    });
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const stripHtml = (html: string) => {
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Announcements</h1>
          <p className="text-muted-foreground">Create and manage hostel announcements</p>
        </div>
        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Announcement
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create Announcement</DialogTitle>
              <DialogDescription>
                Create a new announcement for students and hostel residents
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Title *</Label>
                <Input
                  placeholder="Announcement title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div>
                <Label>Content *</Label>
                <RichTextEditor
                  value={formData.content}
                  onChange={(content) => setFormData({ ...formData, content })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Target Audience</Label>
                  <Select
                    value={formData.targetAudience}
                    onValueChange={(v) => setFormData({ ...formData, targetAudience: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Students</SelectItem>
                      <SelectItem value="block_A">Block A</SelectItem>
                      <SelectItem value="block_B">Block B</SelectItem>
                      <SelectItem value="block_C">Block C</SelectItem>
                      <SelectItem value="block_D">Block D</SelectItem>
                      <SelectItem value="male">Male Students</SelectItem>
                      <SelectItem value="female">Female Students</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Expires At</Label>
                  <Input
                    type="datetime-local"
                    value={formData.expiresAt}
                    onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-md">
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  <Label>Show on Public Website</Label>
                </div>
                <Switch
                  checked={formData.isPublic}
                  onCheckedChange={(checked) => setFormData({ ...formData, isPublic: checked })}
                />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-md">
                <div className="flex items-center gap-2">
                  <Pin className="h-4 w-4" />
                  <Label>Pin Announcement</Label>
                </div>
                <Switch
                  checked={formData.isPinned}
                  onCheckedChange={(checked) => setFormData({ ...formData, isPinned: checked })}
                />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-md">
                <div className="flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  <Label>Send Push Notification to Students</Label>
                </div>
                <Switch
                  checked={formData.sendNotification}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, sendNotification: checked })
                  }
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setAddDialogOpen(false);
                    resetForm();
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={handleAddAnnouncement}>Create Announcement</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters and Search */}
      <Card className="p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search announcements, content, or author..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Status Filter */}
          <div className="w-full lg:w-48">
            <Select value={statusFilter} onValueChange={(value: "all" | "public" | "private") => setStatusFilter(value)}>
              <SelectTrigger>
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="public">Public Only</SelectItem>
                <SelectItem value="private">Private Only</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Audience Filter */}
          <div className="w-full lg:w-48">
            <Select value={audienceFilter} onValueChange={setAudienceFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Audience" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Audience</SelectItem>
                <SelectItem value="all">All Students</SelectItem>
                <SelectItem value="male">Male Students</SelectItem>
                <SelectItem value="female">Female Students</SelectItem>
                <SelectItem value="block_A">Block A</SelectItem>
                <SelectItem value="block_B">Block B</SelectItem>
                <SelectItem value="block_C">Block C</SelectItem>
                <SelectItem value="block_D">Block D</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sort By */}
          <div className="w-full lg:w-48">
            <Select value={sortBy} onValueChange={(value: "newest" | "oldest" | "pinned") => setSortBy(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="pinned">Pinned First</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Active Filters Display */}
        {(searchTerm || statusFilter !== "all" || audienceFilter !== "all") && (
          <div className="flex items-center gap-2 mt-4 pt-4 border-t">
            <span className="text-sm text-muted-foreground">Active filters:</span>
            {searchTerm && (
              <Badge variant="secondary" className="gap-1">
                Search: &quot;{searchTerm}&quot;
                <button
                  onClick={() => setSearchTerm("")}
                  className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
                >
                  ×
                </button>
              </Badge>
            )}
            {statusFilter !== "all" && (
              <Badge variant="secondary" className="gap-1">
                Status: {statusFilter}
                <button
                  onClick={() => setStatusFilter("all")}
                  className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
                >
                  ×
                </button>
              </Badge>
            )}
            {audienceFilter !== "all" && (
              <Badge variant="secondary" className="gap-1">
                Audience: {audienceFilter}
                <button
                  onClick={() => setAudienceFilter("all")}
                  className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
                >
                  ×
                </button>
              </Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("all");
                setAudienceFilter("all");
                setSortBy("newest");
              }}
              className="text-xs"
            >
              Clear all
            </Button>
          </div>
        )}
      </Card>

      {/* Announcements List */}
      <div className="space-y-4">
        {filteredAnnouncements.length === 0 ? (
          <Card className="p-12">
            <div className="text-center text-muted-foreground">
              <Megaphone className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">No announcements found</p>
              <p className="text-sm">Try adjusting your filters or create a new announcement</p>
            </div>
          </Card>
        ) : (
          filteredAnnouncements.map((a) => (
            <Card key={a.announcement.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    {/* Header */}
                    <div className="flex items-start gap-3 mb-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-semibold text-foreground truncate">
                            {a.announcement.title}
                          </h3>
                          {a.announcement.isPinned && (
                            <Badge className="bg-blue-500 hover:bg-blue-600 shrink-0">
                              <Pin className="h-3 w-3 mr-1" />
                              Pinned
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          {a.announcement.isPublic ? (
                            <Badge className="bg-green-500 hover:bg-green-600">
                              <Globe className="h-3 w-3 mr-1" />
                              Public
                            </Badge>
                          ) : (
                            <Badge variant="outline">
                              <EyeOff className="h-3 w-3 mr-1" />
                              Private
                            </Badge>
                          )}
                          {a.announcement.targetAudience && a.announcement.targetAudience !== "all" && (
                            <Badge variant="secondary">
                              <Users className="h-3 w-3 mr-1" />
                              {a.announcement.targetAudience.replace("_", " ").toUpperCase()}
                            </Badge>
                          )}
                          {a.announcement.expiresAt && (
                            <Badge variant="outline" className="text-orange-600 border-orange-200">
                              <Clock className="h-3 w-3 mr-1" />
                              Expires {formatDate(a.announcement.expiresAt)}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Content Preview */}
                    <div className="mb-4">
                      <p className="text-muted-foreground line-clamp-2 text-sm leading-relaxed">
                        {stripHtml(a.announcement.content)}
                      </p>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Bell className="h-3 w-3" />
                          By {a.author?.name || "Unknown"}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(a.announcement.createdAt)}
                        </span>
                      </div>

                      {/* Actions */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openViewDialog(a)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openEditDialog(a)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedAnnouncement(a);
                              setDeleteDialogOpen(true);
                            }}
                            className="text-red-600 focus:text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* View Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedAnnouncement?.announcement.title}</DialogTitle>
            <DialogDescription>
              By {selectedAnnouncement?.author?.name} •{" "}
              {selectedAnnouncement &&
                formatDate(selectedAnnouncement.announcement.createdAt)}
            </DialogDescription>
          </DialogHeader>
          {selectedAnnouncement && (
            <div
              className="prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{
                __html: selectedAnnouncement.announcement.content,
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Announcement</DialogTitle>
            <DialogDescription>Update announcement details</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Title *</Label>
              <Input
                placeholder="Announcement title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div>
              <Label>Content *</Label>
              <RichTextEditor
                value={formData.content}
                onChange={(content) => setFormData({ ...formData, content })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Target Audience</Label>
                <Select
                  value={formData.targetAudience}
                  onValueChange={(v) => setFormData({ ...formData, targetAudience: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Students</SelectItem>
                    <SelectItem value="block_A">Block A</SelectItem>
                    <SelectItem value="block_B">Block B</SelectItem>
                    <SelectItem value="block_C">Block C</SelectItem>
                    <SelectItem value="block_D">Block D</SelectItem>
                    <SelectItem value="male">Male Students</SelectItem>
                    <SelectItem value="female">Female Students</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Expires At</Label>
                <Input
                  type="datetime-local"
                  value={formData.expiresAt}
                  onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-md">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                <Label>Show on Public Website</Label>
              </div>
              <Switch
                checked={formData.isPublic}
                onCheckedChange={(checked) => setFormData({ ...formData, isPublic: checked })}
              />
            </div>

            <div className="flex items-center justify-between p-4 border rounded-md">
              <div className="flex items-center gap-2">
                <Pin className="h-4 w-4" />
                <Label>Pin Announcement</Label>
              </div>
              <Switch
                checked={formData.isPinned}
                onCheckedChange={(checked) => setFormData({ ...formData, isPinned: checked })}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setEditDialogOpen(false);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleUpdateAnnouncement}>Update Announcement</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Delete Announcement
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{selectedAnnouncement?.announcement.title}&quot;?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (selectedAnnouncement) {
                  handleDeleteAnnouncement(selectedAnnouncement.announcement.id);
                  setDeleteDialogOpen(false);
                }
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

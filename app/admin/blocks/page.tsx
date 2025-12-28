"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  FiHome,
  FiPlus,
  FiEdit,
  FiTrash2,
  FiUsers,
  FiCheckCircle,
  FiAlertTriangle
} from "react-icons/fi";
import { FaRupeeSign } from "react-icons/fa";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
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

interface HostelBlock {
  id: string;
  name: string;
  capacity: number | null;
  currentOccupancy: number;
  semester1Fee: number;
  semester2Fee: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  description?: string | null;
  amenities?: string | null;
  features?: string | null;
  images?: string | null;
  floorCount?: number | null;
  roomsPerFloor?: number | null;
}

export default function AdminBlocks() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [blocks, setBlocks] = useState<HostelBlock[]>([]);
  const [loading, setLoading] = useState(true);

  // Dialog states
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"add" | "edit">("add");
  const [selectedBlock, setSelectedBlock] = useState<HostelBlock | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [blockToDelete, setBlockToDelete] = useState<HostelBlock | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [capacity, setCapacity] = useState("");
  const [semester1Fee, setSemester1Fee] = useState("");
  const [semester2Fee, setSemester2Fee] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
      return;
    }

    if (status === "authenticated") {
      const userRole = (session.user as any).role;
      if (userRole !== "admin") {
        router.push("/student/dashboard");
        return;
      }
      fetchBlocks();
    }
  }, [status, session, router]);

  const fetchBlocks = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch("/api/admin/blocks");

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();

      if (data.blocks) {
        setBlocks(data.blocks);
      } else if (data.error) {
        setError(data.error);
      }
    } catch (error) {
      console.error("Error fetching blocks:", error);
      setError("Failed to load blocks. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddBlock = () => {
    setDialogMode("add");
    setSelectedBlock(null);
    setName("");
    setCapacity("");
    setSemester1Fee("");
    setSemester2Fee("");
    setDialogOpen(true);
  };

  const handleEditBlock = (block: HostelBlock) => {
    setDialogMode("edit");
    setSelectedBlock(block);
    setName(block.name);
    setCapacity(block.capacity?.toString() || "");
    setSemester1Fee(block.semester1Fee.toString());
    setSemester2Fee(block.semester2Fee.toString());
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    // Clear previous messages
    setError("");
    setSuccess("");

    // Validation
    if (!name.trim()) {
      setError("Block name is required");
      return;
    }
    if (!capacity || parseInt(capacity) <= 0) {
      setError("Valid capacity is required");
      return;
    }
    if (!semester1Fee || parseFloat(semester1Fee) <= 0) {
      setError("Valid semester 1 fee is required");
      return;
    }
    if (!semester2Fee || parseFloat(semester2Fee) <= 0) {
      setError("Valid semester 2 fee is required");
      return;
    }

    setSubmitting(true);
    try {
      const url = dialogMode === "add"
        ? "/api/admin/blocks"
        : `/api/admin/blocks/${selectedBlock?.id}`;

      const method = dialogMode === "add" ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          capacity: parseInt(capacity),
          semester1Fee: parseFloat(semester1Fee),
          semester2Fee: parseFloat(semester2Fee),
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccess(`Block ${dialogMode === "add" ? "created" : "updated"} successfully!`);
        setDialogOpen(false);
        fetchBlocks();
        // Clear form
        setName("");
        setCapacity("");
        setSemester1Fee("");
        setSemester2Fee("");
      } else {
        setError(data.error || `Failed to ${dialogMode} block`);
      }
    } catch (error) {
      console.error(`Error ${dialogMode}ing block:`, error);
      setError(`Failed to ${dialogMode} block. Please try again.`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteBlock = (block: HostelBlock) => {
    setBlockToDelete(block);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!blockToDelete) return;

    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch(`/api/admin/blocks/${blockToDelete.id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (res.ok) {
        setSuccess("Block deleted successfully!");
        fetchBlocks();
        setDeleteDialogOpen(false);
        setBlockToDelete(null);
      } else {
        setError(data.error || "Failed to delete block");
      }
    } catch (error) {
      console.error("Error deleting block:", error);
      setError("Failed to delete block. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const getOccupancyBadge = (block: HostelBlock) => {
    if (!block.capacity) {
      return <Badge variant="outline">Capacity Not Set</Badge>;
    }

    const percentage = (block.currentOccupancy / block.capacity) * 100;

    if (percentage >= 90) {
      return <Badge variant="destructive">Nearly Full</Badge>;
    } else if (percentage >= 70) {
      return <Badge variant="secondary">High Occupancy</Badge>;
    } else if (percentage >= 40) {
      return <Badge variant="outline">Good</Badge>;
    } else {
      return <Badge variant="default">Available</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading blocks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Hostel Block Management</h1>
            <p className="text-muted-foreground">Manage hostel blocks, capacity, and fees</p>
          </div>
          <Button onClick={handleAddBlock}>
            <FiPlus className="mr-2" />
            Add New Block
          </Button>
        </div>

        {/* Messages */}
        {error && (
          <Alert className="mb-6 border-destructive/20 bg-destructive/5">
            <FiAlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-destructive">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <FiCheckCircle className="h-4 w-4" />
            <AlertDescription className="text-green-800">
              {success}
            </AlertDescription>
          </Alert>
        )}

        {/* Summary Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-sm bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Blocks</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-foreground">{blocks.length}</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Capacity</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-foreground">
                {blocks.reduce((sum, b) => sum + (b.capacity || 0), 0)}
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Current Occupancy</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-foreground">
                {blocks.reduce((sum, b) => sum + b.currentOccupancy, 0)}
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Available Rooms</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-foreground">
                {blocks.reduce((sum, b) => sum + ((b.capacity || 0) - b.currentOccupancy), 0)}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Blocks Grid */}
        {blocks.length === 0 ? (
          <Card className="border-0 shadow-sm bg-card">
            <CardContent className="py-16 text-center">
              <FiHome className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No blocks yet</h3>
              <p className="text-muted-foreground mb-6">Get started by adding your first hostel block</p>
              <Button onClick={handleAddBlock}>
                <FiPlus className="mr-2" />
                Add First Block
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blocks.map((block) => (
              <Card key={block.id} className="border-0 shadow-sm bg-card hover:shadow-md transition-shadow">
                <CardHeader className="border-b border-border">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-2xl">Block {block.name}</CardTitle>
                    <FiHome className="w-6 h-6 text-muted-foreground" />
                  </div>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  {/* Occupancy */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <FiUsers className="text-muted-foreground" />
                        <span className="font-semibold">Occupancy</span>
                      </div>
                      {getOccupancyBadge(block)}
                    </div>
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                      <span>Occupied: {block.currentOccupancy}</span>
                      <span>Capacity: {block.capacity || "Not set"}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all"
                        style={{
                          width: `${block.capacity ? Math.min((block.currentOccupancy / block.capacity) * 100, 100) : 0}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Fees */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <FaRupeeSign className="text-muted-foreground" />
                      <span className="font-semibold">Semester Fees</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-muted/50 border border-border rounded p-2">
                        <p className="text-xs text-muted-foreground">Semester 1</p>
                        <p className="font-semibold text-foreground">₹{block.semester1Fee.toLocaleString()}</p>
                      </div>
                      <div className="bg-muted/50 border border-border rounded p-2">
                        <p className="text-xs text-muted-foreground">Semester 2</p>
                        <p className="font-semibold text-foreground">₹{block.semester2Fee.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button
                      onClick={() => handleEditBlock(block)}
                      className="flex-1"
                      size="sm"
                      variant="outline"
                    >
                      <FiEdit className="mr-2" />
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDeleteBlock(block)}
                      className="flex-1"
                      size="sm"
                      variant="destructive"
                      disabled={block.currentOccupancy > 0}
                    >
                      <FiTrash2 className="mr-2" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FiHome className="text-primary" />
              {dialogMode === "add" ? "Add New Block" : `Edit Block ${name}`}
            </DialogTitle>
            <DialogDescription>
              {dialogMode === "add"
                ? "Create a new hostel block with capacity and fee details"
                : "Update block information"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Block Name */}
            <div>
              <Label htmlFor="blockName">Block Name *</Label>
              <Input
                id="blockName"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., A, B, C, or North Wing"
                maxLength={10}
              />
            </div>

            {/* Capacity */}
            <div>
              <Label htmlFor="capacity">Total Capacity (Number of Rooms) *</Label>
              <Input
                id="capacity"
                type="number"
                min="1"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                placeholder="e.g., 50"
              />
            </div>

            {/* Fees */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="sem1Fee">Semester 1 Fee (₹) *</Label>
                <Input
                  id="sem1Fee"
                  type="number"
                  min="0"
                  step="100"
                  value={semester1Fee}
                  onChange={(e) => setSemester1Fee(e.target.value)}
                  placeholder="e.g., 25000"
                />
              </div>
              <div>
                <Label htmlFor="sem2Fee">Semester 2 Fee (₹) *</Label>
                <Input
                  id="sem2Fee"
                  type="number"
                  min="0"
                  step="100"
                  value={semester2Fee}
                  onChange={(e) => setSemester2Fee(e.target.value)}
                  placeholder="e.g., 25000"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting
                ? "Processing..."
                : dialogMode === "add"
                  ? "Add Block"
                  : "Update Block"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
              <FiAlertTriangle className="w-5 h-5" />
              Delete Block {blockToDelete?.name}
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the block and all its associated data.
              {blockToDelete && blockToDelete.currentOccupancy > 0 && (
                <span className="block mt-2 font-semibold text-destructive">
                  Warning: This block has {blockToDelete.currentOccupancy} students currently assigned.
                  Please reassign them before deleting.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={submitting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={submitting || (blockToDelete?.currentOccupancy ?? 0) > 0}
              className="bg-destructive hover:bg-destructive/90"
            >
              {submitting ? "Deleting..." : "Delete Block"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

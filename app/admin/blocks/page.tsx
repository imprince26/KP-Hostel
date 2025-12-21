"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FiHome, FiPlus, FiEdit, FiTrash2, FiUsers, FiDollarSign } from "react-icons/fi";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface HostelBlock {
  id: string;
  name: string;
  capacity: number;
  currentOccupancy: number;
  semester1Fee: number;
  semester2Fee: number;
  amenities?: Record<string, any>;
  features?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
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
  
  // Form states
  const [name, setName] = useState("");
  const [capacity, setCapacity] = useState("");
  const [semester1Fee, setSemester1Fee] = useState("");
  const [semester2Fee, setSemester2Fee] = useState("");
  const [submitting, setSubmitting] = useState(false);

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
      const res = await fetch("/api/admin/blocks");
      const data = await res.json();
      
      if (data.blocks) {
        setBlocks(data.blocks);
      }
    } catch (error) {
      console.error("Error fetching blocks:", error);
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
    setCapacity(block.capacity.toString());
    setSemester1Fee(block.semester1Fee.toString());
    setSemester2Fee(block.semester2Fee.toString());
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    // Validation
    if (!name.trim()) {
      alert("Block name is required");
      return;
    }
    if (!capacity || parseInt(capacity) <= 0) {
      alert("Valid capacity is required");
      return;
    }
    if (!semester1Fee || parseFloat(semester1Fee) <= 0) {
      alert("Valid semester 1 fee is required");
      return;
    }
    if (!semester2Fee || parseFloat(semester2Fee) <= 0) {
      alert("Valid semester 2 fee is required");
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
        alert(`Block ${dialogMode === "add" ? "added" : "updated"} successfully!`);
        setDialogOpen(false);
        fetchBlocks();
      } else {
        alert(data.error || `Failed to ${dialogMode} block`);
      }
    } catch (error) {
      console.error(`Error ${dialogMode}ing block:`, error);
      alert(`Failed to ${dialogMode} block`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteBlock = async (block: HostelBlock) => {
    if (block.currentOccupancy > 0) {
      alert("Cannot delete block with active students. Please move students first.");
      return;
    }

    if (!confirm(`Are you sure you want to delete Block ${block.name}?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/blocks/${block.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        alert("Block deleted successfully!");
        fetchBlocks();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete block");
      }
    } catch (error) {
      console.error("Error deleting block:", error);
      alert("Failed to delete block");
    }
  };

  const getOccupancyBadge = (block: HostelBlock) => {
    const percentage = (block.currentOccupancy / block.capacity) * 100;
    
    if (percentage >= 90) {
      return <Badge className="bg-red-100 text-red-700">Nearly Full</Badge>;
    } else if (percentage >= 70) {
      return <Badge className="bg-yellow-100 text-yellow-700">High Occupancy</Badge>;
    } else if (percentage >= 40) {
      return <Badge className="bg-green-100 text-green-700">Good</Badge>;
    } else {
      return <Badge className="bg-blue-100 text-blue-700">Available</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading blocks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Hostel Block Management</h1>
            <p className="text-gray-600">Manage hostel blocks, capacity, and fees</p>
          </div>
          <Button
            onClick={handleAddBlock}
            className="bg-orange-600 hover:bg-orange-700"
          >
            <FiPlus className="mr-2" />
            Add New Block
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Total Blocks</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-gray-900">{blocks.length}</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Total Capacity</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-blue-600">
                {blocks.reduce((sum, b) => sum + b.capacity, 0)}
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Current Occupancy</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-600">
                {blocks.reduce((sum, b) => sum + b.currentOccupancy, 0)}
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Available Rooms</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-purple-600">
                {blocks.reduce((sum, b) => sum + (b.capacity - b.currentOccupancy), 0)}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Blocks Grid */}
        {blocks.length === 0 ? (
          <Card className="border-0 shadow-lg">
            <CardContent className="py-16 text-center">
              <FiHome className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No blocks yet</h3>
              <p className="text-gray-600 mb-6">Get started by adding your first hostel block</p>
              <Button
                onClick={handleAddBlock}
                className="bg-orange-600 hover:bg-orange-700"
              >
                <FiPlus className="mr-2" />
                Add First Block
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blocks.map((block) => (
              <Card key={block.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="bg-linear-to-r from-orange-600 to-orange-500 text-white">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-2xl">Block {block.name}</CardTitle>
                    <FiHome className="w-6 h-6" />
                  </div>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  {/* Occupancy */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <FiUsers className="text-blue-600" />
                        <span className="font-semibold">Occupancy</span>
                      </div>
                      {getOccupancyBadge(block)}
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                      <span>Occupied: {block.currentOccupancy}</span>
                      <span>Capacity: {block.capacity}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          (block.currentOccupancy / block.capacity) * 100 >= 90
                            ? "bg-red-600"
                            : (block.currentOccupancy / block.capacity) * 100 >= 70
                            ? "bg-yellow-600"
                            : "bg-green-600"
                        }`}
                        style={{
                          width: `${Math.min((block.currentOccupancy / block.capacity) * 100, 100)}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Fees */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <FiDollarSign className="text-green-600" />
                      <span className="font-semibold">Semester Fees</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-green-50 border border-green-200 rounded p-2">
                        <p className="text-xs text-green-700">Semester 1</p>
                        <p className="font-semibold text-green-900">₹{block.semester1Fee.toLocaleString()}</p>
                      </div>
                      <div className="bg-blue-50 border border-blue-200 rounded p-2">
                        <p className="text-xs text-blue-700">Semester 2</p>
                        <p className="font-semibold text-blue-900">₹{block.semester2Fee.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button
                      onClick={() => handleEditBlock(block)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                      size="sm"
                    >
                      <FiEdit className="mr-2" />
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDeleteBlock(block)}
                      className="flex-1 bg-red-600 hover:bg-red-700"
                      size="sm"
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
              <FiHome className="text-orange-600" />
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
              className="bg-orange-600 hover:bg-orange-700"
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
    </div>
  );
}

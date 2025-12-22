"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { 
  FiUser, FiMail, FiPhone, FiMapPin, FiLock, 
  FiTrash2, FiBell, FiSave, FiCamera, FiAlertTriangle 
} from "react-icons/fi";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function StudentSettings() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  // Profile states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState("");
  
  // Address states
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  
  // Password states
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // Preferences states
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(true);
  
  // UI states
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
      return;
    }

    if (status === "authenticated") {
      fetchUserData();
    }
  }, [status, router]);

  const fetchUserData = async () => {
    try {
      const res = await fetch("/api/user/profile");
      const data = await res.json();
      
      if (data.user) {
        setName(data.user.name || "");
        setEmail(data.user.email || "");
        setPhone(data.user.phone || "");
        setDateOfBirth(data.user.dateOfBirth || "");
        setBio(data.user.bio || "");
        setAvatar(data.user.avatar || "");
        setAddress(data.user.address || "");
        setCity(data.user.city || "");
        setState(data.user.state || "");
        setPincode(data.user.pincode || "");
      }
      
      if (data.preferences) {
        setEmailNotifications(data.preferences.emailNotifications ?? true);
        setSmsNotifications(data.preferences.smsNotifications ?? true);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    if (file.size > 5 * 1024 * 1024) {
      setMessage("Avatar must be less than 5MB");
      return;
    }

    if (!file.type.startsWith("image/")) {
      setMessage("Please upload an image file");
      return;
    }

    setUploadingAvatar(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.url) {
        setAvatar(data.url);
        setMessage("Avatar uploaded successfully");
      }
    } catch (error) {
      console.error("Error uploading avatar:", error);
      setMessage("Failed to upload avatar");
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleProfileUpdate = async () => {
    setLoading(true);
    setMessage("");
    
    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          dateOfBirth,
          bio,
          avatar,
          address,
          city,
          state,
          pincode,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("Profile updated successfully!");
      } else {
        setMessage(data.error || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      setMessage("New passwords don't match");
      return;
    }

    if (newPassword.length < 6) {
      setMessage("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    setMessage("");
    
    try {
      const res = await fetch("/api/user/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("Password changed successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setMessage(data.error || "Failed to change password");
      }
    } catch (error) {
      console.error("Error changing password:", error);
      setMessage("Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  const handlePreferencesUpdate = async () => {
    setLoading(true);
    setMessage("");
    
    try {
      const res = await fetch("/api/user/preferences", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          emailNotifications,
          smsNotifications,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("Preferences updated successfully!");
      } else {
        setMessage(data.error || "Failed to update preferences");
      }
    } catch (error) {
      console.error("Error updating preferences:", error);
      setMessage("Failed to update preferences");
    } finally {
      setLoading(false);
    }
  };

  const handleAccountDelete = async () => {
    try {
      const res = await fetch("/api/user/delete", {
        method: "DELETE",
      });

      if (res.ok) {
        await signOut({ callbackUrl: "/" });
      } else {
        const data = await res.json();
        setMessage(data.error || "Failed to delete account");
        setDeleteDialogOpen(false);
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      setMessage("Failed to delete account");
      setDeleteDialogOpen(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-linear-to-br from-accent to-accent flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-accent to-accent py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Account Settings</h1>
          <p className="text-gray-600">Manage your profile and preferences</p>
        </div>

        {/* Message Alert */}
        {message && (
          <Alert className="mb-6">
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        {/* Profile Section */}
        <Card className="mb-6 border-0 shadow-lg">
          <CardHeader className="bg-linear-to-r from-orange-600 to-orange-500 text-white">
            <CardTitle className="flex items-center gap-2">
              <FiUser className="w-5 h-5" />
              Profile Information
            </CardTitle>
            <CardDescription className="text-orange-50">
              Update your personal details
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            {/* Avatar */}
            <div className="flex items-center gap-4">
              <div className="relative">
                {avatar ? (
                  <img
                    src={avatar}
                    alt="Avatar"
                    className="w-24 h-24 rounded-full object-cover border-4 border-accent"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-accent flex items-center justify-center">
                    <FiUser className="w-12 h-12 text-accent-foreground" />
                  </div>
                )}
                <label className="absolute bottom-0 right-0 bg-primary text-primary-foreground p-2 rounded-full cursor-pointer hover:bg-primary/90 transition-colors">
                  <FiCamera className="w-4 h-4" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                    disabled={uploadingAvatar}
                  />
                </label>
              </div>
              <div>
                <p className="font-semibold text-gray-900">Profile Picture</p>
                <p className="text-sm text-gray-600">
                  {uploadingAvatar ? "Uploading..." : "Click the camera icon to upload a new photo (Max 5MB)"}
                </p>
              </div>
            </div>

            {/* Name */}
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
              />
            </div>

            {/* Email (readonly) */}
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                disabled
                className="bg-gray-100"
              />
              <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
            </div>

            {/* Phone */}
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 XXXXXXXXXX"
              />
            </div>

            {/* Date of Birth */}
            <div>
              <Label htmlFor="dob">Date of Birth</Label>
              <Input
                id="dob"
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
              />
            </div>

            {/* Bio */}
            <div>
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell us about yourself..."
                rows={3}
              />
            </div>

            <Button 
              onClick={handleProfileUpdate} 
              disabled={loading}
              className="w-full bg-orange-600 hover:bg-orange-700"
            >
              <FiSave className="mr-2" />
              {loading ? "Saving..." : "Save Profile"}
            </Button>
          </CardContent>
        </Card>

        {/* Address Section */}
        <Card className="mb-6 border-0 shadow-lg">
          <CardHeader className="bg-linear-to-r from-blue-600 to-blue-500 text-white">
            <CardTitle className="flex items-center gap-2">
              <FiMapPin className="w-5 h-5" />
              Address Information
            </CardTitle>
            <CardDescription className="text-blue-50">
              Update your address details
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div>
              <Label htmlFor="address">Full Address</Label>
              <Textarea
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Street address, apartment, etc."
                rows={2}
              />
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="City"
                />
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="State"
                />
              </div>
              <div>
                <Label htmlFor="pincode">Pincode</Label>
                <Input
                  id="pincode"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="Pincode"
                />
              </div>
            </div>

            <Button 
              onClick={handleProfileUpdate} 
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              <FiSave className="mr-2" />
              {loading ? "Saving..." : "Save Address"}
            </Button>
          </CardContent>
        </Card>

        {/* Password Section */}
        <Card className="mb-6 border-0 shadow-lg">
          <CardHeader className="bg-linear-to-r from-purple-600 to-purple-500 text-white">
            <CardTitle className="flex items-center gap-2">
              <FiLock className="w-5 h-5" />
              Change Password
            </CardTitle>
            <CardDescription className="text-purple-50">
              Update your account password
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div>
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
              />
            </div>

            <div>
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password (min 6 characters)"
              />
            </div>

            <div>
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
              />
            </div>

            <Button 
              onClick={handlePasswordChange} 
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              <FiLock className="mr-2" />
              {loading ? "Changing..." : "Change Password"}
            </Button>
          </CardContent>
        </Card>

        {/* Notification Preferences */}
        <Card className="mb-6 border-0 shadow-lg">
          <CardHeader className="bg-linear-to-r from-green-600 to-green-500 text-white">
            <CardTitle className="flex items-center gap-2">
              <FiBell className="w-5 h-5" />
              Notification Preferences
            </CardTitle>
            <CardDescription className="text-green-50">
              Control how you receive notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="emailNotif" className="text-base">Email Notifications</Label>
                <p className="text-sm text-gray-600">Receive updates via email</p>
              </div>
              <Switch
                id="emailNotif"
                checked={emailNotifications}
                onCheckedChange={setEmailNotifications}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="smsNotif" className="text-base">SMS Notifications</Label>
                <p className="text-sm text-gray-600">Receive updates via SMS</p>
              </div>
              <Switch
                id="smsNotif"
                checked={smsNotifications}
                onCheckedChange={setSmsNotifications}
              />
            </div>

            <Button 
              onClick={handlePreferencesUpdate} 
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              <FiSave className="mr-2" />
              {loading ? "Saving..." : "Save Preferences"}
            </Button>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-destructive shadow-lg">
          <CardHeader className="bg-destructive/10">
            <CardTitle className="flex items-center gap-2 text-destructive">
              <FiAlertTriangle className="w-5 h-5" />
              Danger Zone
            </CardTitle>
            <CardDescription className="text-destructive">
              Irreversible actions - proceed with caution
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-foreground mb-2">Delete Account</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Once you delete your account, there is no going back. All your data will be permanently deleted.
                </p>
                <Button 
                  onClick={() => setDeleteDialogOpen(true)}
                  variant="destructive"
                  className="bg-destructive hover:bg-destructive/90"
                >
                  <FiTrash2 className="mr-2" />
                  Delete Account
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <FiAlertTriangle className="w-5 h-5" />
              Confirm Account Deletion
            </DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your account and remove all your data from our servers.
            </DialogDescription>
          </DialogHeader>
          <div className="bg-destructive/10 border border-destructive rounded p-4 my-4">
            <p className="text-sm text-destructive">
              <strong>Warning:</strong> All your applications, notifications, and profile data will be permanently deleted.
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleAccountDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              <FiTrash2 className="mr-2" />
              Delete My Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

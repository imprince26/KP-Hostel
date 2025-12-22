"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

export default function CompleteProfilePage() {
  const router = useRouter();
  const { data: session, status, update } = useSession();
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/complete-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Failed to update profile");
        return;
      }

      toast.success("Profile completed successfully!");
      
      // Update session to reflect the phone number
      await update({ phone });
      
      // Redirect to dashboard
      setTimeout(() => {
        router.push("/student/dashboard");
        router.refresh();
      }, 500);
    } catch (error) {
      console.error(error);
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-accent to-accent p-4">
      <div className="bg-background rounded-lg shadow-xl p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-foreground">Complete Your Profile</h1>
          <p className="text-muted-foreground mt-2">
            Please provide your phone number to continue
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter your 10-digit phone number"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              required
              minLength={10}
              maxLength={15}
            />
          </div>

          <button
            type="submit"
            disabled={loading || phone.length < 10}
            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? "Updating..." : "Continue"}
          </button>
        </form>
      </div>
    </div>
  );
}

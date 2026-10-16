"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { Phone, ArrowLeft, ShieldCheck, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "motion/react";
import { toast } from "sonner";

export default function CompleteProfilePage() {
  const router = useRouter();
  const { data: session, status, update } = useSession();
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const cleanPhone = phone.trim();
    if (!cleanPhone || cleanPhone.length < 10) {
      setError("Please enter a valid 10-digit phone number");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/complete-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: cleanPhone }),
      });

      const data = await res.json();

      if (!res.ok) {
        const errorMsg = data.error || "Failed to update profile";
        setError(errorMsg);
        toast.error(errorMsg);
        return;
      }

      toast.success("Profile completed successfully!");

      // Update session to reflect the phone number
      await update({ phone: cleanPhone });

      // Redirect to dashboard
      setTimeout(() => {
        router.push("/student/dashboard");
        router.refresh();
      }, 500);
    } catch {
      setError("An error occurred. Please check your connection and try again.");
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent mx-auto" />
          <p className="mt-3 text-xs text-muted-foreground font-medium">Loading session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-primary/10">
      {/* Top Header */}
      <header className="w-full border-b border-border/70 bg-card/60 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-1.5 px-2.5 rounded-lg hover:bg-muted/60"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Home</span>
          </Link>

          <Link href="/" className="flex items-center gap-2.5 group">
            <Image
              src="/logo.jpg"
              alt="KP Vidhyarthi Bhavan"
              width={32}
              height={32}
              className="rounded-lg border border-border/80 shadow-2xs group-hover:scale-105 transition-transform"
            />
            <div className="text-left">
              <span className="block text-xs sm:text-sm font-bold font-display text-foreground leading-tight">
                K. P. Vidhyarthi Bhavan
              </span>
            </div>
          </Link>

          <div className="w-16" />
        </div>
      </header>

      {/* Main Single-Column Form Area */}
      <main className="flex-1 flex flex-col justify-center items-center px-4 py-4 sm:py-6 relative overflow-hidden">
        <div className="w-full max-w-110 relative z-10 mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="bg-card rounded-2xl sm:rounded-3xl shadow-sm sm:shadow-lg border border-border/80 p-5 min-[400px]:p-6 sm:p-7"
          >
            {/* Header Badge & Title */}
            <div className="text-center mb-5 sm:mb-6">
              <div className="mx-auto w-11 h-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-3">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold font-display text-foreground tracking-tight">
                Complete Profile
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Please provide your contact phone number to finalize your hostel
                resident profile.
              </p>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="mb-4 p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label
                  htmlFor="phone"
                  className="block text-xs font-medium text-foreground"
                >
                  Mobile Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="9876543210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="pl-10 h-10.5 text-sm bg-background border-border rounded-xl focus-visible:ring-2 focus-visible:ring-primary/20"
                    required
                    minLength={10}
                    maxLength={15}
                    disabled={loading}
                    autoComplete="tel"
                    autoFocus
                  />
                </div>
                <p className="text-[11px] text-muted-foreground pl-1">
                  Used for urgent hostel notices and admission updates
                </p>
              </div>

              <Button
                type="submit"
                disabled={loading || phone.trim().length < 10}
                className="w-full h-11 text-sm font-semibold rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-xs cursor-pointer mt-1"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="animate-spin h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full" />
                    Updating profile...
                  </span>
                ) : (
                  "Continue to Dashboard"
                )}
              </Button>
            </form>
          </motion.div>
        </div>

        {/* Footer */}
        <footer className="mt-4 sm:mt-5 text-center text-xs text-muted-foreground relative z-10 space-y-1">
          <p>
            © {new Date().getFullYear()} K. P. Vidhyarthi Bhavan. All rights
            reserved.
          </p>
        </footer>
      </main>
    </div>
  );
}

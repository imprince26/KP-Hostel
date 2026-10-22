"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { FaGoogle } from "react-icons/fa";
import { Mail, Lock, User, Phone, Eye, EyeOff, ShieldCheck, ArrowLeft, AlertCircle } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";

export function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/student/dashboard";

  const [step, setStep] = useState<"form" | "otp">("form");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [acceptedLegal, setAcceptedLegal] = useState(false);
  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name || formData.name.trim().length < 2) {
      newErrors.name = "Full name must be at least 2 characters";
    }

    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.phone || formData.phone.trim().length < 10) {
      newErrors.phone = "Phone number must be at least 10 digits";
    }

    if (!formData.password || formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!acceptedLegal) {
      newErrors.legal = "You must accept the Privacy Policy and Terms of Use";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please complete all required fields correctly");
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          role: "student",
          acceptedTerms: acceptedLegal,
          acceptedPrivacy: acceptedLegal,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Registration failed");
        if (data.details) {
          const validationErrors: Record<string, string> = {};
          data.details.forEach((err: { path?: string[]; message: string }) => {
            if (err.path && err.path[0]) {
              validationErrors[err.path[0]] = err.message;
            }
          });
          setErrors(validationErrors);
        } else {
          setErrors({ general: data.error || "Registration failed. Please try again." });
        }
        return;
      }

      toast.success("Verification code sent to your email");
      setStep("otp");
    } catch {
      toast.error("An error occurred. Please try again.");
      setErrors({ general: "Network error occurred. Please check your connection." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    try {
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          otp,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Invalid OTP code");
        setErrors({ otp: data.error || "Invalid verification code" });
        return;
      }

      toast.success("Account verified and registered successfully!");

      // Auto sign in
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.ok) {
        router.push(callbackUrl);
        router.refresh();
      } else {
        router.push("/auth/login");
      }
    } catch {
      toast.error("An error occurred during verification.");
      setErrors({ general: "Verification failed. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setIsLoading(true);
    try {
      await signIn("google", { callbackUrl });
    } catch {
      toast.error("Failed to sign up with Google");
      setErrors({ general: "Google sign-up failed. Please try again." });
      setIsLoading(false);
    }
  };

  // OTP Step View
  if (step === "otp") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-card rounded-2xl sm:rounded-3xl shadow-sm sm:shadow-lg border border-border/80 p-5 min-[400px]:p-6 sm:p-8"
      >
        <div className="text-center mb-6">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-3">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-foreground tracking-tight">
            Verify Email
          </h2>
          <p className="mt-1.5 text-xs sm:text-sm text-muted-foreground">
            Enter the 6-digit code sent to
          </p>
          <p className="font-semibold text-xs text-foreground font-mono mt-0.5">
            {formData.email}
          </p>
        </div>

        {errors.otp && (
          <div className="mb-5 p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errors.otp}</span>
          </div>
        )}

        <form onSubmit={handleVerifyOtp} className="space-y-5">
          <div className="space-y-1.5">
            <label htmlFor="otp" className="block text-xs font-medium text-foreground text-center">
              Enter 6-Digit Code
            </label>
            <Input
              id="otp"
              type="text"
              placeholder="000000"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
              className="w-full text-center text-2xl font-mono tracking-[0.4em] h-13 rounded-xl bg-background border-border focus-visible:ring-2 focus-visible:ring-primary/20"
              maxLength={6}
              required
              disabled={isLoading}
              autoFocus
            />
          </div>

          <Button
            type="submit"
            className="w-full h-11 text-sm font-semibold rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-xs cursor-pointer"
            disabled={isLoading || otp.length !== 6}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full" />
                Verifying...
              </span>
            ) : (
              "Verify and Register"
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => setStep("form")}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            disabled={isLoading}
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to registration details</span>
          </button>
        </div>
      </motion.div>
    );
  }

  // Registration Form View
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="bg-card rounded-2xl sm:rounded-3xl shadow-sm sm:shadow-lg border border-border/80 p-4 min-[400px]:p-5 sm:p-6"
    >
      {/* Top Segment Tab Switcher */}
      <div className="grid grid-cols-2 p-1 bg-muted/60 rounded-xl mb-3.5 border border-border/60">
        <Link
          href="/auth/login"
          className="py-1.5 text-center text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          Sign In
        </Link>
        <div className="py-1.5 text-center text-xs font-semibold rounded-lg bg-card text-foreground shadow-2xs">
          Create Account
        </div>
      </div>

      {/* Header */}
      <div className="text-center mb-3 sm:mb-3.5">
        <h2 className="text-xl sm:text-2xl font-bold font-display text-foreground tracking-tight">
          Create Account
        </h2>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Register to apply for KP Bhavan hostel admissions
        </p>
      </div>

      {/* Error Banner */}
      {errors.general && (
        <div className="mb-3 p-2.5 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errors.general}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-2.5 sm:space-y-3">
        {/* Full Name & Phone - 2 cols on sm+ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
          <div className="space-y-1">
            <label htmlFor="name" className="block text-xs font-medium text-foreground">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                id="name"
                type="text"
                placeholder="Ramesh Patel"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="pl-9 h-10 text-sm bg-background border-border rounded-xl focus-visible:ring-2 focus-visible:ring-primary/20"
                required
                disabled={isLoading}
                autoComplete="name"
              />
            </div>
            {errors.name && <p className="text-[11px] text-destructive pl-1">{errors.name}</p>}
          </div>

          <div className="space-y-1">
            <label htmlFor="phone" className="block text-xs font-medium text-foreground">
              Mobile Number
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                id="phone"
                type="tel"
                placeholder="9876543210"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="pl-9 h-10 text-sm bg-background border-border rounded-xl focus-visible:ring-2 focus-visible:ring-primary/20"
                required
                disabled={isLoading}
                autoComplete="tel"
              />
            </div>
            {errors.phone && <p className="text-[11px] text-destructive pl-1">{errors.phone}</p>}
          </div>
        </div>

        {/* Email */}
        <div className="space-y-1">
          <label htmlFor="reg-email" className="block text-xs font-medium text-foreground">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              id="reg-email"
              type="email"
              placeholder="student@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="pl-9 h-10 text-sm bg-background border-border rounded-xl focus-visible:ring-2 focus-visible:ring-primary/20"
              required
              disabled={isLoading}
              autoComplete="email"
            />
          </div>
          {errors.email && <p className="text-[11px] text-destructive pl-1">{errors.email}</p>}
        </div>

        {/* Password and Confirm Password */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
          <div className="space-y-1">
            <label htmlFor="reg-password" className="block text-xs font-medium text-foreground">
              Password (Min. 8)
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                id="reg-password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="pl-9 pr-9 h-10 text-sm bg-background border-border rounded-xl focus-visible:ring-2 focus-visible:ring-primary/20"
                required
                disabled={isLoading}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
              </button>
            </div>
            {errors.password && <p className="text-[11px] text-destructive pl-1">{errors.password}</p>}
          </div>

          <div className="space-y-1">
            <label htmlFor="confirmPassword" className="block text-xs font-medium text-foreground">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="pl-9 pr-9 h-10 text-sm bg-background border-border rounded-xl focus-visible:ring-2 focus-visible:ring-primary/20"
                required
                disabled={isLoading}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-[11px] text-destructive pl-1">{errors.confirmPassword}</p>
            )}
          </div>
        </div>

        {/* Legal consent */}
        <div className="space-y-1.5 pt-0.5">
          <label className="flex items-start gap-2.5 cursor-pointer">
            <Checkbox
              checked={acceptedLegal}
              onCheckedChange={(value) => {
                setAcceptedLegal(value === true);
                if (value === true) setErrors((prev) => ({ ...prev, legal: "" }));
              }}
              disabled={isLoading}
              className="mt-0.5"
            />
            <span className="text-[11px] leading-relaxed text-muted-foreground">
              I have read and agree to the{" "}
              <Link
                href="/privacy"
                target="_blank"
                className="text-primary font-medium hover:underline"
              >
                Privacy Policy
              </Link>{" "}
              and the{" "}
              <Link
                href="/terms"
                target="_blank"
                className="text-primary font-medium hover:underline"
              >
                Terms of Use
              </Link>
              , and I consent to the processing of my personal data.
            </span>
          </label>
          {errors.legal && (
            <p className="text-[11px] text-destructive pl-1">{errors.legal}</p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full h-10 text-sm font-semibold rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-xs cursor-pointer mt-1"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="animate-spin h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full" />
              Sending verification code...
            </span>
          ) : (
            "Continue & Verify Email"
          )}
        </Button>
      </form>

      {/* Social Divider */}
      <div className="my-2.5 sm:my-3 flex items-center gap-3">
        <div className="flex-1 h-px bg-border" />
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-mono">
          Or continue with
        </span>
        <div className="flex-1 h-px bg-border" />
      </div>

      {/* Google Button */}
      <button
        type="button"
        onClick={handleGoogleSignUp}
        disabled={isLoading}
        className="w-full h-10 flex items-center justify-center gap-2.5 px-4 border border-border/80 bg-background hover:bg-muted/60 rounded-xl transition-all text-xs sm:text-sm font-semibold text-foreground active:scale-[0.99] disabled:opacity-50 cursor-pointer shadow-2xs"
      >
        <FaGoogle className="h-3.5 w-3.5 text-foreground/80 shrink-0" />
        <span>Continue with Google</span>
      </button>

      {/* Footer link */}
      <p className="mt-3 text-center text-xs text-muted-foreground">
        Already have an account?{" "}
        <Link href="/auth/login" className="font-semibold text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </motion.div>
  );
}

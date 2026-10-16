"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, Eye, EyeOff, AlertCircle, CheckCircle2, KeyRound, ArrowLeft } from "lucide-react";
import { motion } from "motion/react";

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Invalid Token State
  if (!token) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-card rounded-2xl sm:rounded-3xl shadow-sm sm:shadow-lg border border-border/80 p-5 min-[400px]:p-6 sm:p-7 text-center"
      >
        <div className="mx-auto w-12 h-12 rounded-2xl bg-destructive/10 text-destructive flex items-center justify-center mb-4">
          <AlertCircle className="h-6 w-6" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold font-display text-foreground tracking-tight mb-2">
          Invalid or Expired Link
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground mb-6 leading-relaxed">
          This password reset link is invalid or has expired. Please request a new link to reset your password.
        </p>
        <Link href="/auth/forgot-password">
          <Button className="w-full h-11 text-sm font-semibold rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-xs cursor-pointer">
            Request New Link
          </Button>
        </Link>
        <div className="mt-4">
          <Link
            href="/auth/login"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Login</span>
          </Link>
        </div>
      </motion.div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (formData.password.length < 8) {
      setErrors({ password: "Password must be at least 8 characters" });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrors({ confirmPassword: "Passwords do not match" });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrors({ general: data.error || "Failed to reset password" });
        return;
      }

      setIsSuccess(true);
    } catch {
      setErrors({ general: "An error occurred. Please check your connection and try again." });
    } finally {
      setIsLoading(false);
    }
  };

  // Success State
  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-card rounded-2xl sm:rounded-3xl shadow-sm sm:shadow-lg border border-border/80 p-5 min-[400px]:p-6 sm:p-7 text-center"
      >
        <div className="mx-auto w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4">
          <CheckCircle2 className="h-6 w-6" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold font-display text-foreground tracking-tight mb-2">
          Password Reset Successful
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground mb-6 leading-relaxed">
          Your password has been successfully updated. You can now use your new password to access your account.
        </p>
        <Link href="/auth/login">
          <Button className="w-full h-11 text-sm font-semibold rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-xs cursor-pointer">
            Sign In with New Password
          </Button>
        </Link>
      </motion.div>
    );
  }

  // Active Reset Form
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="bg-card rounded-2xl sm:rounded-3xl shadow-sm sm:shadow-lg border border-border/80 p-5 min-[400px]:p-6 sm:p-7"
    >
      <div className="text-center mb-5 sm:mb-6">
        <div className="mx-auto w-11 h-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-3">
          <KeyRound className="h-5 w-5" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold font-display text-foreground tracking-tight">
          Reset Password
        </h2>
        <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
          Enter a new secure password for your account
        </p>
      </div>

      {errors.general && (
        <div className="mb-4 p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errors.general}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* New Password */}
        <div className="space-y-1.5">
          <label htmlFor="new-password" className="block text-xs font-medium text-foreground">
            New Password (Min. 8 characters)
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              id="new-password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="pl-10 pr-10 h-10.5 text-sm bg-background border-border rounded-xl focus-visible:ring-2 focus-visible:ring-primary/20"
              required
              disabled={isLoading}
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && <p className="text-[11px] text-destructive pl-1">{errors.password}</p>}
        </div>

        {/* Confirm New Password */}
        <div className="space-y-1.5">
          <label htmlFor="confirm-new-password" className="block text-xs font-medium text-foreground">
            Confirm New Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              id="confirm-new-password"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              className="pl-10 pr-10 h-10.5 text-sm bg-background border-border rounded-xl focus-visible:ring-2 focus-visible:ring-primary/20"
              required
              disabled={isLoading}
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-[11px] text-destructive pl-1">{errors.confirmPassword}</p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full h-11 text-sm font-semibold rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-xs cursor-pointer mt-1"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="animate-spin h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full" />
              Resetting password...
            </span>
          ) : (
            "Reset Password"
          )}
        </Button>
      </form>

      <p className="mt-5 text-center text-xs text-muted-foreground">
        Remember your password?{" "}
        <Link href="/auth/login" className="font-semibold text-primary hover:underline">
          Back to sign in
        </Link>
      </p>
    </motion.div>
  );
}

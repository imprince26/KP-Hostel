"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FaEye, FaEyeSlash } from "react-icons/fa";
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

  if (!token) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="bg-card rounded-2xl shadow-xl p-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-card-foreground mb-4">Invalid Link</h2>
            <p className="text-muted-foreground mb-6">
              This password reset link is invalid or has expired.
            </p>
            <Link href="/auth/forgot-password">
              <Button className="w-full bg-linear-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground font-semibold py-6 rounded-lg">
                Request New Link
              </Button>
            </Link>
          </div>
        </div>
      </div>
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
    } catch (error) {
      setErrors({ general: "An error occurred. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="w-full max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-card rounded-2xl shadow-xl p-8"
        >
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-accent rounded-full flex items-center justify-center mb-6">
              <svg
                className="w-8 h-8 text-accent-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-card-foreground mb-4">
              Password Reset Successful
            </h2>
            <p className="text-muted-foreground mb-8">
              Your password has been successfully reset. You can now log in with your new password.
            </p>
            <Link href="/auth/login">
              <Button className="w-full bg-linear-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground font-semibold py-6 rounded-lg">
                Back to Login
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-card rounded-2xl shadow-xl p-8"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-card-foreground">Reset Password</h2>
          <p className="mt-2 text-muted-foreground">
            Enter your new password below
          </p>
        </div>

        {errors.general && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive rounded-lg text-destructive text-sm">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
              New Password
            </label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1.5 text-sm text-destructive">{errors.password}</p>
            )}
            <p className="mt-1.5 text-sm text-muted-foreground">
              Must be at least 8 characters
            </p>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground mb-2">
              Confirm New Password
            </label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-3 text-muted hover:text-foreground"
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1.5 text-sm text-destructive">{errors.confirmPassword}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-linear-to-r from-primary to-primary hover:from-primary/90 hover:to-primary/90 text-white font-semibold py-6 rounded-lg"
            disabled={isLoading}
          >
            {isLoading ? "Resetting..." : "Reset Password"}
          </Button>
        </form>
      </motion.div>
    </div>
  );
}

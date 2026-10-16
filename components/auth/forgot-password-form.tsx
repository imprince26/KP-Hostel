"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "motion/react";
import { ArrowLeft, Mail, CheckCircle2, AlertCircle, KeyRound } from "lucide-react";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to send reset email");
        return;
      }

      setIsSuccess(true);
    } catch {
      setError("An error occurred. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-card rounded-2xl sm:rounded-3xl shadow-sm sm:shadow-lg border border-border/80 p-5 min-[400px]:p-6 sm:p-8 text-center"
      >
        <div className="mx-auto w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4">
          <CheckCircle2 className="h-6 w-6" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold font-display text-foreground tracking-tight mb-2">
          Check Your Email
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground mb-2">
          If an account exists with this email, password reset instructions have been sent to:
        </p>
        <p className="font-semibold text-xs sm:text-sm text-foreground font-mono mb-6 bg-muted/40 py-1.5 px-3 rounded-lg">
          {email}
        </p>
        <Link href="/auth/login" className="block w-full">
          <Button className="w-full h-11 text-sm font-semibold rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-xs cursor-pointer">
            Return to Login
          </Button>
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="bg-card rounded-2xl sm:rounded-3xl shadow-sm sm:shadow-lg border border-border/80 p-5 min-[400px]:p-6 sm:p-8"
    >
      <Link
        href="/auth/login"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors mb-5"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        <span>Back to Login</span>
      </Link>

      <div className="mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold font-display text-foreground tracking-tight">
          Forgot Password?
        </h2>
        <p className="mt-1.5 text-xs sm:text-sm text-muted-foreground">
          Enter your registered email address to receive password reset instructions.
        </p>
      </div>

      {error && (
        <div className="mb-5 p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="email" className="block text-xs font-medium text-foreground">
            Registered Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              id="email"
              type="email"
              placeholder="student@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 h-11 text-sm bg-background border-border rounded-xl focus-visible:ring-2 focus-visible:ring-primary/20"
              required
              disabled={isLoading}
              autoComplete="email"
              autoFocus
            />
          </div>
        </div>

        <Button
          type="submit"
          className="w-full h-11 text-sm font-semibold rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-xs cursor-pointer"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="animate-spin h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full" />
              Sending instructions...
            </span>
          ) : (
            "Send Reset Instructions"
          )}
        </Button>
      </form>
    </motion.div>
  );
}

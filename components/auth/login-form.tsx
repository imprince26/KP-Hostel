"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FaGoogle } from "react-icons/fa";
import { Mail, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/student/dashboard";

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        toast.error("Invalid email or password");
        setErrors({ general: "Invalid email or password. Please verify your credentials." });
      } else {
        toast.success("Login successful!");
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      toast.error("An error occurred. Please try again.");
      setErrors({ general: "Unable to connect. Please check your network and try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signIn("google", { callbackUrl });
    } catch {
      toast.error("Failed to sign in with Google");
      setErrors({ general: "Google sign-in failed. Please try again." });
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="bg-card rounded-2xl sm:rounded-3xl shadow-sm sm:shadow-lg border border-border/80 p-5 min-[400px]:p-6 sm:p-7"
    >
      {/* Top Segment Tab Switcher */}
      <div className="grid grid-cols-2 p-1 bg-muted/60 rounded-xl mb-4 border border-border/60">
        <div className="py-2 text-center text-xs font-semibold rounded-lg bg-card text-foreground shadow-2xs">
          Sign In
        </div>
        <Link
          href="/auth/register"
          className="py-2 text-center text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          Create Account
        </Link>
      </div>

      {/* Header */}
      <div className="text-center mb-4 sm:mb-5">
        <h2 className="text-2xl sm:text-3xl font-bold font-display text-foreground tracking-tight">
          Sign In
        </h2>
        <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
          Welcome back! Access your student dashboard
        </p>
      </div>

      {/* Error Banner */}
      {errors.general && (
        <div className="mb-4 p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errors.general}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
        <div className="space-y-1.5">
          <label htmlFor="email" className="block text-xs font-medium text-foreground">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              id="email"
              type="email"
              placeholder="student@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="pl-10 h-11 text-sm bg-background border-border rounded-xl focus-visible:ring-2 focus-visible:ring-primary/20"
              required
              disabled={isLoading}
              autoComplete="email"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="block text-xs font-medium text-foreground">
              Password
            </label>
            <Link
              href="/auth/forgot-password"
              className="text-xs text-primary hover:underline font-medium"
            >
              Forgot Password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="pl-10 pr-10 h-11 text-sm bg-background border-border rounded-xl focus-visible:ring-2 focus-visible:ring-primary/20"
              required
              disabled={isLoading}
              autoComplete="current-password"
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
        </div>

        <Button
          type="submit"
          className="w-full h-11 text-sm font-semibold rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-xs cursor-pointer"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="animate-spin h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full" />
              Signing in...
            </span>
          ) : (
            "Sign In"
          )}
        </Button>
      </form>

      {/* Social Divider */}
      <div className="my-3 sm:my-3.5 flex items-center gap-3">
        <div className="flex-1 h-px bg-border" />
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-mono">
          Or continue with
        </span>
        <div className="flex-1 h-px bg-border" />
      </div>

      {/* Google Button */}
      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={isLoading}
        className="w-full h-10 flex items-center justify-center gap-2.5 px-4 border border-border/80 bg-background hover:bg-muted/60 rounded-xl transition-all text-xs sm:text-sm font-semibold text-foreground active:scale-[0.99] disabled:opacity-50 cursor-pointer shadow-2xs"
      >
        <FaGoogle className="h-3.5 w-3.5 text-foreground/80 shrink-0" />
        <span>Continue with Google</span>
      </button>

      {/* Footer link */}
      <p className="mt-3.5 text-center text-xs text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link href="/auth/register" className="font-semibold text-primary hover:underline">
          Sign up
        </Link>
      </p>
    </motion.div>
  );
}

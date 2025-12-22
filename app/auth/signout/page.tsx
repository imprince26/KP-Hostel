"use client";

import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { FaSignOutAlt, FaHome, FaCheckCircle, FaUserGraduate, FaUserShield } from "react-icons/fa";

export default function SignOutPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [isSigningOut, setIsSigningOut] = useState(true);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    // Start sign out process
    const signOutTimer = setTimeout(async () => {
      try {
        await signOut({ callbackUrl: "/", redirect: false });
        setIsSigningOut(false);
        setIsComplete(true);

        // Redirect to home page after showing success message
        setTimeout(() => {
          router.push("/");
        }, 3000);
      } catch (error) {
        console.error("Sign out error:", error);
        // Fallback redirect
        router.push("/");
      }
    }, 1500);

    return () => clearTimeout(signOutTimer);
  }, [router]);

  const getRoleIcon = () => {
    if (session?.user?.role === "admin") {
      return <FaUserShield className="h-5 w-5" />;
    }
    return <FaUserGraduate className="h-5 w-5" />;
  };

  const getRoleText = () => {
    if (session?.user?.role === "admin") {
      return "Admin Portal";
    }
    return "Student Portal";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-background via-muted/20 to-primary/5 relative overflow-hidden">
      {/* Enhanced Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.08),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,hsl(var(--accent)/0.08),transparent_50%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(45deg,hsl(var(--muted)/0.05)_25%,transparent_25%),linear-gradient(-45deg,hsl(var(--muted)/0.05)_25%,transparent_25%)] bg-size-[20px_20px]" />

      <div className="relative z-10 max-w-lg w-full mx-4">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="bg-card/95 backdrop-blur-md rounded-3xl shadow-2xl border border-border/50 p-8 text-center overflow-hidden relative"
        >
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-accent/5 rounded-3xl" />

          {/* Logo and Role Badge */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative flex justify-center mb-6"
          >
            <div className="relative">
              <div className="bg-primary/10 p-5 rounded-2xl shadow-lg">
                <Image
                  src="/logo.jpg"
                  alt="KP Vidhyarthi Bhavan"
                  width={72}
                  height={72}
                  className="rounded-xl shadow-sm"
                />
              </div>
              <div className="absolute -top-3 -right-3 bg-primary text-primary-foreground p-3 rounded-full shadow-xl">
                <FaSignOutAlt className="h-5 w-5" />
              </div>
              {/* Role indicator */}
              {session?.user?.role && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.5 }}
                  className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-muted text-muted-foreground px-3 py-1 rounded-full text-xs font-medium shadow-sm border border-border/50"
                >
                  <div className="flex items-center gap-1.5">
                    {getRoleIcon()}
                    {getRoleText()}
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-3xl font-bold text-foreground mb-3"
          >
            {isComplete ? "Signed Out Successfully" : "Signing You Out"}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="text-muted-foreground mb-2 leading-relaxed text-base"
          >
            {isComplete
              ? "Thank you for using KP Vidhyarthi Bhavan."
              : "Please wait while we securely sign you out of your account."
            }
          </motion.p>

          {/* User greeting */}
          {session?.user?.name && isComplete && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="text-sm text-primary font-medium mb-8"
            >
              Goodbye, {session.user.name.split(' ')[0]}! 👋
            </motion.p>
          )}

          {/* Animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="flex justify-center mb-8"
          >
            {isComplete ? (
              <div className="relative">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
                  className="bg-green-500 text-white p-5 rounded-full shadow-xl"
                >
                  <FaCheckCircle className="h-10 w-10" />
                </motion.div>
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="absolute inset-0 bg-green-500/20 rounded-full animate-ping"
                />
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="absolute inset-0 bg-green-500/10 rounded-full animate-pulse"
                />
              </div>
            ) : (
              <div className="relative">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="border-4 border-primary/20 border-t-primary rounded-full h-20 w-20 shadow-lg"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <FaSignOutAlt className="h-7 w-7 text-primary" />
                  </motion.div>
                </div>
              </div>
            )}
          </motion.div>

          {/* Status Message */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1 }}
            className="space-y-4"
          >
            <p className="text-sm text-muted-foreground font-medium">
              {isComplete
                ? "Redirecting you to the home page..."
                : "This will only take a moment..."
              }
            </p>

            {isComplete && (
              <motion.div
                initial={{ opacity: 0, y: 15, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, delay: 1.2, type: "spring" }}
              >
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-full font-semibold text-sm transition-all duration-300 hover:shadow-xl hover:scale-105 active:scale-95"
                >
                  <FaHome className="h-4 w-4" />
                  Return to Home Page
                </Link>
              </motion.div>
            )}
          </motion.div>
        </motion.div>

        {/* Enhanced Footer Branding */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.5 }}
          className="text-center mt-8"
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-primary rounded-full" />
            </div>
            <p className="text-xs text-muted-foreground font-medium">
              KP Vidhyarthi Bhavan • Est. 1930
            </p>
          </div>
          <p className="text-xs text-muted-foreground/70">
            Secure • Reliable • Trusted
          </p>
        </motion.div>
      </div>
    </div>
  );
}

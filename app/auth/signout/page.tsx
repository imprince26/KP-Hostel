"use client";

import { signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, Home, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SignOutPage() {
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function performSignOut() {
      try {
        await signOut({ redirect: false });
        if (isMounted) {
          setIsSigningOut(false);
        }

        const timer = setTimeout(() => {
          if (isMounted) {
            router.push("/");
          }
        }, 2500);

        return () => clearTimeout(timer);
      } catch (error) {
        console.error("Sign out error:", error);
        if (isMounted) {
          router.push("/");
        }
      }
    }

    performSignOut();

    return () => {
      isMounted = false;
    };
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col justify-between items-center bg-background px-4 py-8">
      {/* Top Brand Link */}
      <div className="pt-4">
        <Link href="/" className="inline-flex items-center gap-2.5 group">
          <Image
            src="/logo.jpg"
            alt="KP Vidhyarthi Bhavan"
            width={36}
            height={36}
            className="rounded-lg border border-border/80 shadow-2xs group-hover:scale-105 transition-transform"
          />
          <span className="text-sm font-bold font-display text-foreground">
            K. P. Vidhyarthi Bhavan
          </span>
        </Link>
      </div>

      {/* Centered Sign-Out Card */}
      <div className="w-full max-w-md my-auto">
        <div className="bg-card rounded-2xl border border-border/80 shadow-sm p-6 sm:p-8 text-center">
          {isSigningOut ? (
            <div className="py-4 space-y-4">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mx-auto">
                <span className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" />
              </div>
              <div className="space-y-1">
                <h1 className="text-xl font-bold font-display text-foreground tracking-tight">
                  Signing out...
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Safely concluding your session. Please wait.
                </p>
              </div>
            </div>
          ) : (
            <div className="py-2 space-y-5">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mx-auto">
                <CheckCircle2 className="h-6 w-6" />
              </div>

              <div className="space-y-1">
                <h1 className="text-xl font-bold font-display text-foreground tracking-tight">
                  Signed Out Successfully
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Your session has ended securely.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                <Link href="/auth/login" className="w-full">
                  <Button
                    variant="outline"
                    className="w-full h-10 text-xs font-semibold rounded-xl border-border/80 hover:bg-muted/60"
                  >
                    <LogIn className="h-3.5 w-3.5 mr-1.5" />
                    Sign In Again
                  </Button>
                </Link>
                <Link href="/" className="w-full">
                  <Button className="w-full h-10 text-xs font-semibold rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground">
                    <Home className="h-3.5 w-3.5 mr-1.5" />
                    Go to Home
                  </Button>
                </Link>
              </div>

              <p className="text-[11px] text-muted-foreground">
                Redirecting to home page automatically...
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center text-xs text-muted-foreground pb-2">
        <p>
          © {new Date().getFullYear()} K. P. Vidhyarthi Bhavan. All rights
          reserved.
        </p>
      </footer>
    </div>
  );
}

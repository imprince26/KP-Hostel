import { RegisterForm } from "@/components/auth/register-form";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, HelpCircle } from "lucide-react";

export const metadata = {
  title: "Register - KP Vidhyarthi Bhavan",
  description: "Create your KP Vidhyarthi Bhavan account",
};

export default async function RegisterPage() {
  const session = await getServerSession(authOptions);

  // Redirect if already logged in
  if (session) {
    const dashboardUrl = session.user.role === "admin" ? "/admin/dashboard" : "/student/dashboard";
    redirect(dashboardUrl);
  }

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-primary/10">
      {/* Top Navigation Bar */}
      <header className="w-full border-b border-border/70 bg-card/60 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-1.5 px-2.5 rounded-lg hover:bg-muted/60"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
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

          <Link
            href="/contact"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors py-1.5 px-2.5 rounded-lg hover:bg-muted/60"
          >
            <HelpCircle className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Need Help?</span>
            <span className="sm:hidden">Help</span>
          </Link>
        </div>
      </header>

      {/* Main Single-Column Form Area */}
      <main className="flex-1 flex flex-col justify-center items-center px-4 py-4 sm:py-6 relative overflow-hidden">
        {/* Subtle decorative background glow & grid */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-150 h-75 bg-primary/4 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(hsl(var(--foreground)/0.03)_1px,transparent_1px)] bg-size-[24px_24px] pointer-events-none" />

        {/* Centered Form Wrapper */}
        <div className="w-full max-w-122.5 relative z-10 mx-auto">
          <RegisterForm />
        </div>

        {/* Minimal Footer */}
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

import { RegisterForm } from "@/components/auth/register-form";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

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
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary to-primary/80 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logo.jpg"
              alt="KP Vidhyarthi Bhavan"
              width={48}
              height={48}
              className="rounded-lg"
            />
            <div>
              <h1 className="text-2xl font-bold">KP Vidhyarthi Bhavan</h1>
              <p className="text-sm opacity-90">Est. 1930</p>
            </div>
          </Link>

          <div>
            <h2 className="text-4xl font-bold mb-4">
              Join Our Community!
            </h2>
            <p className="text-lg opacity-90 max-w-md">
              Create your account and become part of the KP Vidhyarthi Bhavan family - A home away from home.
            </p>
            <div className="mt-8 space-y-4 max-w-md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  ✓
                </div>
                <span>Modern facilities and amenities</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  ✓
                </div>
                <span>24/7 security and support</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  ✓
                </div>
                <span>Vibrant student community</span>
              </div>
            </div>
          </div>

          <div className="text-sm opacity-75">
            © {new Date().getFullYear()} KP Vidhyarthi Bhavan. All rights reserved.
          </div>
        </div>
      </div>

      {/* Right Side - Register Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-muted">
        <RegisterForm />
      </div>
    </div>
  );
}

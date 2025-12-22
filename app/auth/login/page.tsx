import { LoginForm } from "@/components/auth/login-form";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "Login - KP Vidhyarthi Bhavan",
  description: "Sign in to your KP Vidhyarthi Bhavan account",
};

export default async function LoginPage() {
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
              Welcome Back!
            </h2>
            <p className="text-lg opacity-90 max-w-md">
              Sign in to access your dashboard and manage your hostel experience.
            </p>
            <div className="mt-8 grid grid-cols-3 gap-4 max-w-md">
              <div className="text-center">
                <div className="text-3xl font-bold">1000+</div>
                <div className="text-sm opacity-75">Students</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">500+</div>
                <div className="text-sm opacity-75">Rooms</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">90+</div>
                <div className="text-sm opacity-75">Years</div>
              </div>
            </div>
          </div>

          <div className="text-sm opacity-75">
            © {new Date().getFullYear()} KP Vidhyarthi Bhavan. All rights reserved.
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <LoginForm />
      </div>
    </div>
  );
}

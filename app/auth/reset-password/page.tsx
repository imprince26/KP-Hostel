import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";

export const metadata = {
  title: "Reset Password - KP Vidhyarthi Bhavan",
  description: "Set a new password for your KP Vidhyarthi Bhavan account",
};

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-linear-to-br from-primary to-orange-600 relative overflow-hidden">
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
              Create New Password
            </h2>
            <p className="text-lg opacity-90 max-w-md">
              Choose a strong password to keep your account secure.
            </p>
          </div>

          <div className="text-sm opacity-75">
            © {new Date().getFullYear()} KP Vidhyarthi Bhavan. All rights reserved.
          </div>
        </div>
      </div>

      {/* Right Side - Reset Password Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-gray-50">
        <Suspense fallback={<div>Loading...</div>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}

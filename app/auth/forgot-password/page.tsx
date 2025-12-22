import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "Forgot Password - KP Vidhyarthi Bhavan",
  description: "Reset your KP Vidhyarthi Bhavan account password",
};

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-linear-to-br from-primary to-primary/80 relative overflow-hidden">
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
              Need Help?
            </h2>
            <p className="text-lg opacity-90 max-w-md">
              Don't worry! We'll help you reset your password and get back to your account quickly.
            </p>
          </div>

          <div className="text-sm opacity-75">
            © {new Date().getFullYear()} KP Vidhyarthi Bhavan. All rights reserved.
          </div>
        </div>
      </div>

      {/* Right Side - Forgot Password Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-muted">
        <ForgotPasswordForm />
      </div>
    </div>
  );
}

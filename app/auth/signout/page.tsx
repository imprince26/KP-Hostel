"use client";

import { signOut } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function SignOutPage() {
  const router = useRouter();

  useEffect(() => {
    // Auto sign out after a short delay
    const timer = setTimeout(() => {
      signOut({ callbackUrl: "/auth/login", redirect: true });
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-orange-100">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="flex justify-center mb-6">
            <Image
              src="/logo.jpg"
              alt="KP Vidhyarthi Bhavan"
              width={80}
              height={80}
              className="rounded-lg"
            />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Signing You Out
          </h1>
          <p className="text-gray-600 mb-8">
            Thank you for using KP Vidhyarthi Bhavan
          </p>

          <div className="flex justify-center mb-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          </div>

          <div className="space-y-4">
            <p className="text-sm text-gray-500">
              You will be redirected to the login page shortly...
            </p>
            <Link
              href="/auth/login"
              className="inline-block text-orange-600 hover:text-orange-700 font-medium text-sm"
            >
              Return to Login →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

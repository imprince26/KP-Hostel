"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FaHome, FaRedo, FaExclamationTriangle } from "react-icons/fa";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Error boundary caught:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* Error Icon */}
        <div className="mb-8 flex justify-center">
          <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center">
            <FaExclamationTriangle className="text-5xl text-red-500" />
          </div>
        </div>

        {/* Message */}
        <div className="mb-8 space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            Something Went Wrong
          </h2>
          <p className="text-gray-600 text-lg max-w-md mx-auto">
            We encountered an unexpected error. Please try again or return to the homepage.
          </p>
        </div>

        {/* Error Details (Development only) */}
        {process.env.NODE_ENV === "development" && (
          <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-xl max-w-2xl mx-auto">
            <div className="text-left">
              <p className="text-sm font-semibold text-red-900 mb-2">
                Error Details:
              </p>
              <p className="text-sm text-red-700 font-mono break-all">
                {error.message}
              </p>
              {error.digest && (
                <p className="text-xs text-red-600 mt-2">
                  Error ID: {error.digest}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Help Box */}
        <div className="mb-12 p-6 bg-white rounded-2xl shadow-sm border border-gray-100 max-w-md mx-auto">
          <div className="text-left space-y-3">
            <h3 className="font-semibold text-gray-900">
              What you can do:
            </h3>
            <ul className="text-sm text-gray-600 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Try refreshing the page</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Check your internet connection</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Return to the homepage and try again</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Contact support if the problem persists</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            onClick={reset}
            variant="outline"
            size="lg"
            className="w-full sm:w-auto rounded-full border-gray-200 hover:bg-gray-50"
          >
            <FaRedo className="mr-2" />
            Try Again
          </Button>
          <Button
            asChild
            size="lg"
            className="w-full sm:w-auto rounded-full bg-primary hover:bg-primary/90 shadow-md"
          >
            <Link href="/en">
              <FaHome className="mr-2" />
              Back to Home
            </Link>
          </Button>
        </div>

        {/* Support Info */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Need help?{" "}
            <Link
              href="/en/contact"
              className="text-primary hover:underline font-medium"
            >
              Contact our support team
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

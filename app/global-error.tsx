"use client";

import Link from "next/link";
import { useEffect } from "react";
import { FaHome, FaRedo, FaExclamationTriangle } from "react-icons/fa";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Global error boundary caught:", error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <div className="min-h-screen bg-gradient-to-br from-muted via-background to-muted flex items-center justify-center px-4">
          <div className="max-w-2xl w-full text-center">
            {/* Error Icon */}
            <div className="mb-8 flex justify-center">
              <div className="w-24 h-24 bg-destructive/10 rounded-full flex items-center justify-center">
                <FaExclamationTriangle className="text-5xl text-destructive" />
              </div>
            </div>

            {/* Message */}
            <div className="mb-8 space-y-4">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                Critical Error
              </h2>
              <p className="text-muted-foreground text-lg max-w-md mx-auto">
                A critical error has occurred. Please refresh the page or try again later.
              </p>
            </div>

            {/* Error Details (Development only) */}
            {process.env.NODE_ENV === "development" && (
              <div className="mb-8 p-4 bg-destructive/10 border border-destructive rounded-xl max-w-2xl mx-auto">
                <div className="text-left">
                  <p className="text-sm font-semibold text-destructive mb-2">
                    Error Details:
                  </p>
                  <p className="text-sm text-destructive font-mono break-all">
                    {error.message}
                  </p>
                  {error.digest && (
                    <p className="text-xs text-destructive mt-2">
                      Error ID: {error.digest}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={reset}
                className="w-full sm:w-auto px-6 py-3 rounded-full border border-border hover:bg-muted transition-colors flex items-center justify-center gap-2 text-foreground"
              >
                <FaRedo />
                Try Again
              </button>
              <Link
                href="/en"
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground transition-colors flex items-center justify-center gap-2 shadow-md"
              >
                <FaHome />
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}

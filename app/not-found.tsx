"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { FaHome, FaArrowLeft, FaSearch } from "react-icons/fa";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* 404 Number */}
        <div className="mb-8">
          <h1 className="text-[150px] md:text-[200px] font-bold leading-none bg-gradient-to-br from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
            404
          </h1>
        </div>

        {/* Message */}
        <div className="mb-8 space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            Page Not Found
          </h2>
          <p className="text-muted-foreground text-lg max-w-md mx-auto">
            The page you are looking for doesn't exist or has been moved.
          </p>
        </div>

        {/* Search Suggestion */}
        <div className="mb-12 p-6 bg-background rounded-2xl shadow-sm border border-border max-w-md mx-auto">
          <div className="flex items-start gap-3 text-left">
            <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <FaSearch className="text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-1">
                Looking for something?
              </h3>
              <p className="text-sm text-muted-foreground">
                Try visiting our homepage or use the navigation menu to find what you need.
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            onClick={() => router.back()}
            variant="outline"
            size="lg"
            className="w-full sm:w-auto rounded-full border-border hover:bg-muted"
          >
            <FaArrowLeft className="mr-2" />
            Go Back
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

        {/* Quick Links */}
        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-sm text-muted mb-4">Quick Links</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/en/about"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              About Us
            </Link>
            <span className="text-muted">•</span>
            <Link
              href="/en/facilities"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Facilities
            </Link>
            <span className="text-muted">•</span>
            <Link
              href="/en/admission"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Admission
            </Link>
            <span className="text-muted">•</span>
            <Link
              href="/en/contact"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

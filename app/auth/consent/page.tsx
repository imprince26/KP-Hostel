import { Suspense } from "react";
import { ConsentForm } from "@/components/auth/consent-form";
import { Spinner } from "@/components/ui/spinner";

export default function ConsentPage() {
  return (
    /*
     * The form reads the return target from the query string, so it has to sit
     * behind a Suspense boundary for the route to stay statically prerendered.
     */
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <Spinner className="size-8 text-primary" />
        </div>
      }
    >
      <ConsentForm />
    </Suspense>
  );
}

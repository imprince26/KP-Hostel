"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { ShieldCheck, ArrowRight, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { apiSend } from "@/lib/api-client";

/**
 * Only internal paths are accepted as a return target, so the screen cannot
 * be used to bounce a visitor to an external site after they accept.
 */
function safeCallbackUrl(raw: string | null): string {
  if (!raw) return "/student/dashboard";
  if (!raw.startsWith("/") || raw.startsWith("//")) return "/student/dashboard";
  return raw;
}

/**
 * Consent screen for accounts that were created without ticking the
 * acceptance checkbox, for example through Google OAuth.
 *
 * Until the user accepts, the portal layouts redirect here.
 */
export function ConsentForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, update } = useSession();
  const [accepted, setAccepted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const callbackUrl = safeCallbackUrl(searchParams.get("callbackUrl"));
  const userFirstName = session?.user?.name?.split(" ")[0];
  const hasConsented = Boolean(session?.user?.acceptedTermsAt);

  // Someone who already accepted has no reason to see this screen.
  useEffect(() => {
    if (!hasConsented) return;

    router.replace(callbackUrl);
    router.refresh();
  }, [hasConsented, callbackUrl, router]);

  const handleAccept = async () => {
    if (!accepted) {
      setError("Please tick the box to confirm that you have read both documents.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await apiSend("/api/auth/accept-terms", "POST", {
        acceptedTerms: true,
        acceptedPrivacy: true,
      });

      /*
       * The acceptance is written to the database, but the session that the
       * client already holds still says "no consent", so the portal layouts
       * would bounce straight back to this screen. Refreshing the session
       * re-runs the session callback, which reads the consent back from the
       * database, and only then do we navigate.
       */
      const refreshed = await update();

      if (!refreshed?.user?.acceptedTermsAt) {
        // The cached session could not be refreshed, so fall back to a full
        // page load: that makes the server read the freshly written consent.
        window.location.replace(callbackUrl);
        return;
      }

      router.replace(callbackUrl);
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to record your acceptance."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (hasConsented) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg rounded-2xl border border-border bg-card shadow-sm p-6 sm:p-8">
        <div className="text-center mb-6">
          <div className="mx-auto size-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-3">
            <ShieldCheck className="size-6" />
          </div>
          <h1 className="text-2xl font-bold font-display text-foreground tracking-tight">
            Review and Accept
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Welcome{userFirstName ? `, ${userFirstName}` : ""}. Before you can use the
            portal, please read and accept the two documents below.
          </p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-5">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-3 mb-6">
          <Link
            href="/privacy"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between gap-3 rounded-xl border border-border bg-muted/40 px-4 py-3 transition-colors hover:bg-muted"
          >
            <span className="flex items-center gap-3">
              <FileText className="size-4 text-primary" />
              <span className="text-sm font-medium text-foreground">
                Privacy Policy
              </span>
            </span>
            <ArrowRight className="size-4 text-muted-foreground" />
          </Link>

          <Link
            href="/terms"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between gap-3 rounded-xl border border-border bg-muted/40 px-4 py-3 transition-colors hover:bg-muted"
          >
            <span className="flex items-center gap-3">
              <FileText className="size-4 text-primary" />
              <span className="text-sm font-medium text-foreground">
                Terms of Use
              </span>
            </span>
            <ArrowRight className="size-4 text-muted-foreground" />
          </Link>
        </div>

        <label className="flex items-start gap-3 cursor-pointer">
          <Checkbox
            checked={accepted}
            onCheckedChange={(value) => setAccepted(value === true)}
            disabled={submitting}
            className="mt-0.5"
          />
          <span className="text-sm text-muted-foreground leading-relaxed">
            I have read and agree to the{" "}
            <Link href="/privacy" className="text-primary font-medium hover:underline">
              Privacy Policy
            </Link>{" "}
            and the{" "}
            <Link href="/terms" className="text-primary font-medium hover:underline">
              Terms of Use
            </Link>
            , and I consent to the collection and processing of my personal data as
            described in the Privacy Policy.
          </span>
        </label>

        <Button
          onClick={handleAccept}
          disabled={submitting}
          className="w-full mt-6 h-11 rounded-xl font-semibold"
        >
          {submitting ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="size-4 animate-spin" />
              Recording your acceptance...
            </span>
          ) : (
            "Accept and continue"
          )}
        </Button>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          Signed in as {session?.user?.email}
        </p>
      </div>
    </div>
  );
}

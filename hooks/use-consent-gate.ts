"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

/**
 * Redirects to the consent screen until the signed-in user has accepted the
 * privacy policy and the terms of use.
 *
 * Accounts created through Google OAuth never see the registration form, so
 * the acceptance has to be collected separately. The portal layouts use this
 * hook to keep those accounts out of the portal until they accept.
 */
export function useRequireLegalConsent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const needsConsent =
    status === "authenticated" &&
    Boolean(session?.user?.id) &&
    !session?.user?.acceptedTermsAt;

  useEffect(() => {
    if (!needsConsent) return;
    if (pathname.startsWith("/auth/consent")) return;

    const callbackUrl = `${pathname}${window.location.search}`;
    // `replace` so the portal URL is not left in the history: going back to it
    // would only bounce the visitor straight back here again.
    router.replace(`/auth/consent?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  }, [needsConsent, pathname, router]);

  return needsConsent;
}

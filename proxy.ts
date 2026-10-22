import createMiddleware from "next-intl/middleware";
import { NextRequest } from "next/server";
import { locales } from "./i18n/request";

const intlMiddleware = createMiddleware({
  // A list of all locales that are supported
  locales,

  // Used when no locale matches
  defaultLocale: "en",

  // Always show locale prefix for clarity
  localePrefix: "always",
});

/**
 * Route groups that must not be prefixed with a locale.
 */
const NON_LOCALIZED_PREFIXES = [
  "/api",
  "/auth",
  "/student",
  "/admin",
  "/admission",
  "/privacy",
  "/terms",
  "/cookies",
  "/disclaimer",
  "/credits",
];

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip locale middleware for these paths
  const shouldSkipLocale =
    NON_LOCALIZED_PREFIXES.some((prefix) => pathname.startsWith(prefix)) ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/_vercel") ||
    pathname.includes(".");

  if (shouldSkipLocale) {
    return;
  }

  return intlMiddleware(request);
}

export const config = {
  // Match all pathnames except static files
  matcher: ["/((?!_next|_vercel|.*\\..*).*)", "/"],
};

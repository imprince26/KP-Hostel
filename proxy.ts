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

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip locale middleware for these paths
  const shouldSkipLocale =
    pathname.startsWith("/api") ||
    pathname.startsWith("/auth") ||
    pathname.startsWith("/student") ||
    pathname.startsWith("/admin") ||
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

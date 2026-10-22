import { NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ScrollToTop } from "@/components/scroll-to-top";
import enMessages from "@/messages/en.json";

/**
 * Layout for the standalone legal pages.
 *
 * The legal pages sit outside the `[locale]` segment so their wording is never
 * machine-translated. They still reuse the site chrome, which requires the
 * English message catalogue to be supplied to the client provider.
 *
 * `setRequestLocale` opts the route into static rendering: without it
 * next-intl would read the locale from the request headers and force the page
 * to be rendered on every request.
 */
export default function LegalLayout({ children }: { children: React.ReactNode }) {
  setRequestLocale("en");

  return (
    <NextIntlClientProvider locale="en" messages={enMessages}>
      <Header />
      {children}
      <Footer />
      <ScrollToTop />
    </NextIntlClientProvider>
  );
}

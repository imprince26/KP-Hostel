import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { locales } from "@/i18n/request";
import { isOneOf } from "@/lib/domain";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ScrollToTop } from "@/components/scroll-to-top";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!isOneOf(locales, locale)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  // Providing all messages to the client side is the easiest way to get started
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      {/*
        `lang` has to sit on the locale subtree because the root layout owns the
        <html> element and cannot know the locale without becoming dynamic.
        The `:lang(gu)` rule in globals.css then resolves the Gujarati
        typefaces for every string on the Gujarati site.
      */}
      <div lang={locale}>
        <Header />
        {children}
        <Footer />
        <ScrollToTop />
      </div>
    </NextIntlClientProvider>
  );
}

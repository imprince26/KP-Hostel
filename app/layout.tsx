import type { Metadata } from "next";
import localFont from "next/font/local";
import { locales } from "@/i18n/request";
import { ToastProvider } from "@/components/toast-provider";
import { SessionProvider } from "@/components/session-provider";
import { QueryProvider } from "@/components/query-provider";
import { DisclaimerDialog } from "@/components/disclaimer-dialog";
import "./globals.css";

// The typefaces are vendored in ./fonts instead of being loaded through
// `next/font/google`. Google Fonts occasionally answers with extensionless
// `/l/font?kit=…&skey=…&v=…` URLs, and Turbopack then fails the build with
// `next/font/google queries have exactly one entry` (vercel/next.js#99114).
// Keeping the woff2 files in the repo makes builds deterministic and removes
// the network request from the build entirely.

const outfit = localFont({
  src: "./fonts/outfit-latin.woff2",
  variable: "--font-outfit",
  weight: "300 800",
  display: "swap",
  declarations: [
    {
      prop: "unicode-range",
      value:
        "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD",
    },
  ],
});

const plusJakartaSans = localFont({
  src: "./fonts/plus-jakarta-sans-latin.woff2",
  variable: "--font-jakarta",
  weight: "300 800",
  display: "swap",
  declarations: [
    {
      prop: "unicode-range",
      value:
        "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD",
    },
  ],
});

const jetbrainsMono = localFont({
  src: "./fonts/jetbrains-mono-latin.woff2",
  variable: "--font-jetbrains",
  weight: "400 700",
  display: "swap",
  declarations: [
    {
      prop: "unicode-range",
      value:
        "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD",
    },
  ],
});

const playfair = localFont({
  src: "./fonts/playfair-display-latin.woff2",
  variable: "--font-playfair",
  weight: "400 900",
  display: "swap",
  preload: false,
  declarations: [
    {
      prop: "unicode-range",
      value:
        "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD",
    },
  ],
});

const geistSans = localFont({
  src: "./fonts/geist-latin.woff2",
  variable: "--font-geist-sans",
  weight: "100 900",
  display: "swap",
  preload: false,
  declarations: [
    {
      prop: "unicode-range",
      value:
        "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD",
    },
  ],
});

const geistMono = localFont({
  src: "./fonts/geist-mono-latin.woff2",
  variable: "--font-geist-mono",
  weight: "100 900",
  display: "swap",
  preload: false,
  declarations: [
    {
      prop: "unicode-range",
      value:
        "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD",
    },
  ],
});

// The Gujarati families ship a separate file per script, so each script gets
// its own @font-face with a matching unicode-range.
const notoSansGujarati = localFont({
  src: "./fonts/noto-sans-gujarati-gujarati.woff2",
  variable: "--font-noto-sans-gujarati",
  weight: "100 900",
  display: "swap",
  declarations: [
    {
      prop: "unicode-range",
      value: "U+0951-0952, U+0964-0965, U+0A80-0AFF, U+200C-200D, U+20B9, U+25CC, U+A830-A839",
    },
  ],
});

const notoSansGujaratiLatin = localFont({
  src: "./fonts/noto-sans-gujarati-latin.woff2",
  variable: "--font-noto-sans-gujarati-latin",
  weight: "100 900",
  display: "swap",
  preload: false,
  declarations: [
    {
      prop: "unicode-range",
      value:
        "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD",
    },
  ],
});

const anekGujarati = localFont({
  src: "./fonts/anek-gujarati-gujarati.woff2",
  variable: "--font-anek-gujarati",
  weight: "100 800",
  display: "swap",
  preload: false,
  declarations: [
    {
      prop: "unicode-range",
      value: "U+0951-0952, U+0964-0965, U+0A80-0AFF, U+200C-200D, U+20B9, U+25CC, U+A830-A839",
    },
  ],
});

const anekGujaratiLatin = localFont({
  src: "./fonts/anek-gujarati-latin.woff2",
  variable: "--font-anek-gujarati-latin",
  weight: "100 800",
  display: "swap",
  preload: false,
  declarations: [
    {
      prop: "unicode-range",
      value:
        "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD",
    },
  ],
});

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const metadata: Metadata = {
  title: {
    default: "KP Vidhyarthi Bhavan - Student Hostel in Ahmedabad",
    template: "%s | KP Vidhyarthi Bhavan",
  },
  description:
    "KP Vidhyarthi Bhavan Student Web Portal - An independent academic and portfolio project by Prince Patel for Sheth K.P. Vidhyarthi Bhavan hostel in Ahmedabad. Not the official website.",
  keywords: [
    "student hostel",
    "hostel in Ahmedabad",
    "student accommodation",
    "college hostel",
    "KP Vidhyarthi Bhavan",
    "hostel admission project",
    "portfolio project",
    "boys hostel Ahmedabad",
  ],
  authors: [{ name: "Prince Patel (Project Creator)" }],
  creator: "Prince Patel",
  publisher: "Independent Academic Project",
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: "/",
    languages: {
      "en": "/en",
      "gu": "/gu",
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: ["gu_IN"],
    url: siteUrl,
    title: "KP Vidhyarthi Bhavan - Student Hostel in Ahmedabad",
    description:
      "KP Vidhyarthi Bhavan is a premier student hostel in Ahmedabad offering comfortable accommodation for college students. Apply online for admission to blocks A, B, C, and D.",
    siteName: "KP Vidhyarthi Bhavan",
    images: [
      {
        url: "/logo.jpg",
        width: 800,
        height: 800,
        alt: "KP Vidhyarthi Bhavan Logo",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "KP Vidhyarthi Bhavan - Student Hostel in Ahmedabad",
    description:
      "Premier student hostel in Ahmedabad offering comfortable accommodation for college students. Apply online for admission.",
    images: ["/logo.jpg"]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  // verification: {
  //   google: "your-google-site-verification-code", // Add your actual verification code
  // },
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "StudentAccommodation",
    "name": "KP Vidhyarthi Bhavan",
    "description": "Premier student hostel in Ahmedabad offering comfortable accommodation for college students.",
    "url": siteUrl,
    "logo": `${siteUrl}/logo.jpg`,
    "image": `${siteUrl}/logo.jpg`,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Ahmedabad",
      "addressRegion": "Gujarat",
      "addressCountry": "IN"
    },
    "amenityFeature": [
      { "@type": "LocationFeatureSpecification", "name": "WiFi", "value": true },
      { "@type": "LocationFeatureSpecification", "name": "Study Room", "value": true },
      { "@type": "LocationFeatureSpecification", "name": "Common Area", "value": true },
      { "@type": "LocationFeatureSpecification", "name": "Security", "value": true }
    ],
    "priceRange": "$$",
    "audience": {
      "@type": "Audience",
      "audienceType": "College Students"
    }
  };

  const fontVariables = [
    plusJakartaSans.variable,
    outfit.variable,
    playfair.variable,
    jetbrainsMono.variable,
    geistSans.variable,
    geistMono.variable,
    notoSansGujarati.variable,
    notoSansGujaratiLatin.variable,
    anekGujarati.variable,
    anekGujaratiLatin.variable,
  ].join(" ");

  return (
    // The next/font variables must live on <html>: Tailwind resolves the
    // `--font-sans` / `--font-display` theme variables on the root element, so
    // on <body> they would resolve to an invalid value and every custom font
    // would silently fall back to the system stack.
    <html lang="en" suppressHydrationWarning className={fontVariables}>
      <head>
        <link rel="shortcut icon" href="/logo.jpg" type="image/x-icon" />
        <link rel="apple-touch-icon" href="/logo.jpg" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans antialiased" suppressHydrationWarning={true}>
        <SessionProvider>
          <QueryProvider>{children}</QueryProvider>
        </SessionProvider>
        <DisclaimerDialog />
        <ToastProvider />
      </body>
    </html>
  );
}

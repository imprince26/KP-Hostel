import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { locales } from "@/i18n/request";
import { ToastProvider } from "@/components/toast-provider";
import { SessionProvider } from "@/components/session-provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const metadata: Metadata = {
  title: {
    default: "KP Vidhyarthi Bhavan - Student Hostel in Ahmedabad",
    template: "%s | KP Vidhyarthi Bhavan",
  },
  description:
    "KP Vidhyarthi Bhavan is a premier student hostel in Ahmedabad offering comfortable accommodation for college students. Apply online for admission to blocks A, B, C, and D.",
  keywords: [
    "student hostel",
    "hostel in Ahmedabad",
    "student accommodation",
    "college hostel",
    "KP Vidhyarthi Bhavan",
    "hostel admission",
    "affordable hostel",
    "boys hostel Ahmedabad",
  ],
  authors: [{ name: "KP Vidhyarthi Bhavan" }],
  creator: "KP Vidhyarthi Bhavan",
  publisher: "KP Vidhyarthi Bhavan",
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

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="shortcut icon" href="/logo.jpg" type="image/x-icon" />
        <link rel="apple-touch-icon" href="/logo.jpg" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        <SessionProvider>
          {children}
        </SessionProvider>
        <ToastProvider />
      </body>
    </html>
  );
}

import { getTranslations, setRequestLocale } from "next-intl/server";
import { AboutClient } from "./about-client";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });

  return {
    title: `${t("title")} ${t("titleHighlight")} - KP Vidhyarthi Bhavan`,
    description: t("subtitle"),
  };
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Rendering the client component
  return <AboutClient />;
}   
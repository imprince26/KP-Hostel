import { getTranslations, setRequestLocale } from "next-intl/server";
import { VisionClient } from "./vision-client";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "vision" });

  return {
    title: `${t("title")} ${t("titleHighlight")} - KP Vidhyarthi Bhavan`,
    description: t("subtitle"),
  };
}

export default async function VisionPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <VisionClient />;
}

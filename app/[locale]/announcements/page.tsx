import { getTranslations, setRequestLocale } from "next-intl/server";
import AnnouncementsClient from "./announcements-client";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "announcements" });

  return {
    title: `${t("title")} ${t("titleHighlight")} - KP Vidhyarthi Bhavan`,
    description: t("subtitle"),
  };
}

export default async function AnnouncementsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <AnnouncementsClient />;
}

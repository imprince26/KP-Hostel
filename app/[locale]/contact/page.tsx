import { getTranslations, setRequestLocale } from "next-intl/server";
import ContactClient from "./contact-client";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });

  return {
    title: `${t("title")} ${t("titleHighlight")} - KP Vidhyarthi Bhavan`,
    description: t("subtitle"),
  };
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <ContactClient />;
}

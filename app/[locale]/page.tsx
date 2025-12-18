import { setRequestLocale } from "next-intl/server";
import { HomeClient } from "./home-client";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <HomeClient locale={locale} />;
}

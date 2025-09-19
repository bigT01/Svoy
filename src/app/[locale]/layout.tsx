import { ReactNode } from "react";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import Navbar from "@/components/layout/navBar";
import Footer from "@/components/layout/footer";
import MenuSection from "@/components/menu/menuSection";
import Hero from "@/components/hero/hero";
import { Metadata } from "next";

type Props = { children: ReactNode; params: Promise<{ locale: string }> };

export const metaData:Metadata = {
  title: 'Svoy Lounge',
  description: 'Svoy Lounge - ресторан и караоке в Астана. Лучшее место для отдыха с друзьями и семьей. Наслаждайтесь изысканной кухней и живой музыкой в уютной атмосфере.',
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      <Navbar />
      <Hero />
      <main className="relative">{children}</main>
      <Footer />
    </NextIntlClientProvider>
  );
}

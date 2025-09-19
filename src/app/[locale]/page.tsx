import Hero from "@/components/hero/hero";
import OffersSlider from "@/components/sections/offersSlider";
import Container from "@/components/layout/container";
import {setRequestLocale} from "next-intl/server";
import type {Locale} from "@/i18n";
import { Metadata } from "next";

type PageProps = { params: Promise<{locale: Locale}> };

export const metaData:Metadata = {
  title: 'Svoy Lounge',
  description: 'Svoy Lounge - ресторан и караоке в Астана. Лучшее место для отдыха с друзьями и семьей. Наслаждайтесь изысканной кухней и живой музыкой в уютной атмосфере.',
}

export default async function Home({params}: PageProps) {
  const {locale} = await params;
  setRequestLocale(locale);

  // choose a default menu to showcase on homepage
  const defaultMenuId = "common";

  return (
    <>
    </>
  );
}

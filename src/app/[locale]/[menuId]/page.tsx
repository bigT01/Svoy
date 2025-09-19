export const dynamic = 'force-dynamic';

import { notFound } from 'next/navigation';
import OfferPageClient from '@/components/sections/offerPageClient';
import { getOfferBySlug } from '@/data/offers';
import MenuSection from '@/components/menu/menuSection';
import { Metadata } from 'next';

export const metaData:Metadata = {
  title: 'Svoy Lounge',
  description: 'Svoy Lounge - ресторан и караоке в Астана. Лучшее место для отдыха с друзьями и семьей. Наслаждайтесь изысканной кухней и живой музыкой в уютной атмосфере.',
}

const Page = () => {
  return(
    <MenuSection/>
  )
}

export default Page;

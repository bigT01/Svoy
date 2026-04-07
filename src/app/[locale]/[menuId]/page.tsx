export const dynamic = 'force-dynamic';
import Hero from '@/components/hero/hero';
import { Metadata } from 'next';
import AddressInsteadOfMenu from '@/components/sections/AddressInsteadOfMenu';

export const metaData:Metadata = {
  title: 'Svoy Lounge',
  description: 'Svoy Lounge - ресторан и караоке в Астана. Лучшее место для отдыха с друзьями и семьей. Наслаждайтесь изысканной кухней и живой музыкой в уютной атмосфере.',
}

const Page = () => {
  return(
    <>
      <Hero />
      <AddressInsteadOfMenu />
    </>
  )
}

export default Page;

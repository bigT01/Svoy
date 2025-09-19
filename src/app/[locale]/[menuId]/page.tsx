export const dynamic = 'force-dynamic';
import Hero from '@/components/hero/hero';
import Container from '@/components/layout/container';
import MenuSection from '@/components/menu/menuSection';
import OffersSlider from '@/components/sections/offersSlider';
import { Metadata } from 'next';

export const metaData:Metadata = {
  title: 'Svoy Lounge',
  description: 'Svoy Lounge - ресторан и караоке в Астана. Лучшее место для отдыха с друзьями и семьей. Наслаждайтесь изысканной кухней и живой музыкой в уютной атмосфере.',
}

const Page = () => {
  return(
    <>
      <Hero />
      <section className="bg-white py-16">
        <Container>
          <OffersSlider/>
        </Container>
      </section>
    <MenuSection/>
    </>
  )
}

export default Page;

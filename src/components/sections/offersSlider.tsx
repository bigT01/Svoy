"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { useTranslations, useLocale } from "next-intl";
import axios from "axios";
import { usePathname } from "next/navigation";

// --- Interfaces ---
export interface IOffer {
  id: number;
  name_ru: string;
  name_en: string | null;
  name_kk: string | null;
  sub_title_ru: string | null;
  sub_title_en: string | null;
  sub_title_kk: string | null;
  description_ru: string | null;
  description_en: string | null;
  description_kk: string | null;
  medias: [{id: number, file: string}] | null;
  created_at?: string;
  updated_at?: string;
}

// --- Utility Functions ---
function getLocalizedText(
  item: IOffer,
  locale: string,
  field: "name" | "sub_title" | "description"
): string {
  const key = `${field}_${locale === "kz" ? "kk" : locale}` as keyof IOffer;
  const value = item[key];
  return typeof value === 'string' ? value : item[`${field}_ru` as keyof IOffer] as string;
}

// --- Main Component ---
export default function OffersSlider() {
  const pathname = usePathname();

  const swiperRef = useRef<SwiperType | null>(null);
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  const [offers, setOffers] = useState<IOffer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const locale = useLocale();
  const t = useTranslations();
  const sectionTitle = t("offers.sectionTitle");

  // --- Data Fetching ---
  useEffect(() => {
    const fetchOffers = async () => {
      try {
        setLoading(true);
        const response = await axios.get<IOffer[]>("/api/halls/");
        setOffers(response.data);
      } catch (error) {
        console.error("Error fetching offers:", error);
        setOffers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchOffers();
  }, []);

  const titleMobile = locale === "ru" ? sectionTitle.replace(" И ", " И\n ") : sectionTitle;

  if (loading) {
    return (
      <section id="offers" className="w-full text-center py-20">
        <div className="text-xl text-[#9b1b1b]">Загрузка данных...</div>
      </section>
    );
  }

  // Check if offers exist before rendering the slider
  if (!offers.length) {
    return null; // Or return a message like "No offers available."
  }

  return (
    <section id="offers" className="w-full">
      <h2 className="text-[24px] md:text-[40px] font-bold text-[#9b1b1b] mb-6 md:whitespace-nowrap">
        <span className="md:hidden whitespace-pre-line">{titleMobile}</span>
        <span className="hidden md:inline">{sectionTitle}</span>
      </h2>

      <div className="relative overflow-hidden px-2 md:px-[49px]">
        <div className="pointer-events-none hidden md:block absolute inset-y-0 left-0 w-[49px] bg-gradient-to-r from-black/55 to-transparent" />
        <div className="pointer-events-none hidden md:block absolute inset-y-0 right-0 w-[49px] bg-gradient-to-l from-black/55 to-transparent" />

        {offers[0] && <Swiper
          key={locale} // Key ensures Swiper re-initializes on locale change
          modules={[Navigation]}
          navigation={{
            prevEl: prevRef.current,
            nextEl: nextRef.current,
            enabled: offers.length > 1,
          }}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
            if (swiper.navigation) {
              if (nextRef.current && prevRef.current) {
                swiper.navigation.nextEl = nextRef.current;
                swiper.navigation.prevEl = prevRef.current;
              }
              swiper.navigation.init();
              swiper.navigation.update();
            }
          }}
          slidesPerView="auto"
          centeredSlides
          centeredSlidesBounds
          loop={offers.length > 1}
          watchOverflow={false}
          resistanceRatio={0.85}
          spaceBetween={8}
          breakpoints={{ 768: { spaceBetween: 24 }, 1024: { spaceBetween: 49 } }}
          className="offers-slider !overflow-visible"
        >
          {offers.map((offer, idx) => {
  const offerTitle = getLocalizedText(offer, locale, "name");
  const offerSubtitle = getLocalizedText(offer, locale, "sub_title");

  // берём первую картинку
  const firstMedia = offer.medias?.[0];
  const imageSrc = firstMedia
    ? firstMedia.file.startsWith("http")
      ? firstMedia.file
      : `https://api.svoy-lounge.kz${firstMedia.file}`
    : "/images/placeholder.png"; // запасная картинка, если меди нет

  return (
    <SwiperSlide
      key={offer.id}
      className="!w-[calc(100vw-32px)] sm:!w-[84vw] md:!w-[78vw] lg:!w-[1000px]"
    >
      <Link
        href={`/${locale}/${pathname.split("/")[2]}/offers/${offer.id}`}
        className="block group overflow-hidden"
      >
        <article className="relative aspect-[1000/492]">
          <Image
            src={imageSrc}
            alt={offerTitle || "Offer image"}
            fill
            sizes="(min-width:1024px) 1000px, (min-width:768px) 78vw, (min-width:640px) 84vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            priority={idx === 0}
          />
          <div className="fade-bottom absolute left-0 right-0 bottom-0 pointer-events-none z-10" />
          <div className="dim-all absolute inset-0 pointer-events-none z-10 transition-opacity duration-300" />
          <div className="absolute inset-x-0 bottom-0 z-20 px-4 pb-4 pt-10 md:px-6 md:pb-6 lg:px-8">
            <div className="text-white drop-shadow-sm">
              <div className="font-semibold leading-[1.1] text-[18px] sm:text-[20px] md:text-[24px] lg:text-[28px]">
                {offerTitle}
              </div>
              {offerSubtitle && (
                <div className="mt-1 opacity-90 text-[12px] sm:text-[14px] md:text-[16px] lg:text-[18px]">
                  {offerSubtitle}
                </div>
              )}
            </div>
          </div>
        </article>
      </Link>
    </SwiperSlide>
  );
})}

        </Swiper>}
      </div>

      {/* --- Slider Navigation --- */}
      {offers[0] && offers.length > 1 && (
        <div className="mt-6 flex items-center justify-center gap-4">
          <button
            ref={prevRef}
            aria-label="Предыдущий"
            onClick={() => swiperRef.current?.slidePrev()} 
            className="grid place-items-center transition hover:bg-[#9b1b1b]/10 border-2 border-[#9b1b1b] rounded-[6px] w-[44px] h-[44px] md:w-[64px] md:h-[64px]"
          >
            <Image src="/icons/sliderGallery/slider-arrow-back.svg" alt="" width={20} height={20} className="block md:hidden" aria-hidden />
            <Image src="/icons/sliderGallery/slider-arrow-back.svg" alt="" width={32} height={32} className="hidden md:block" aria-hidden />
          </button>
          <button
            ref={nextRef}
            onClick={() => swiperRef.current?.slideNext()}
            aria-label="Следующий"
            className="grid place-items-center transition hover:bg-[#9b1b1b]/10 border-2 border-[#9b1b1b] rounded-[6px] w-[44px] h-[44px] md:w-[64px] md:h-[64px]"
          >
            <Image src="/icons/sliderGallery/slider-arrow-forward.svg" alt="" width={20} height={20} className="block md:hidden" aria-hidden />
            <Image src="/icons/sliderGallery/slider-arrow-forward.svg" alt="" width={32} height={32} className="hidden md:block" aria-hidden />
          </button>
        </div>
      )}

      {/* --- Component Styles --- */}
      <style jsx global>{`
        .offers-slider .fade-bottom { height: 52%; background: linear-gradient(180deg, rgba(0,0,0,0) 0%, #000 100%); }
        .offers-slider .dim-all { background: rgba(0,0,0,.28); }
        .offers-slider .swiper-slide-active .dim-all { background: transparent; }
        .offers-slider .swiper-slide { border-radius: 0; }
      `}</style>
    </section>
  );
}
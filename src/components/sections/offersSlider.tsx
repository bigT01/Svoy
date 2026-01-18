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
import OfferSlide from "./OfferSlide";

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
        setOffers(response.data.filter(offer => offer.id !== 5)); // фильтруем несуществующие предложения
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

        {offers.map((offer, idx) => (
          <OfferSlide
            key={offer.id}
            offer={offer}
            locale={locale}
            pathname={pathname}
            priority={idx === 0}
          />
        ))}
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
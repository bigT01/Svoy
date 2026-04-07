"use client";

import { useEffect, useRef, useState } from "react";
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
import Container from "@/components/layout/container";

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
  medias: [{ id: number; file: string }] | null;
  created_at?: string;
  updated_at?: string;
}

function getLocalizedText(
  item: IOffer,
  locale: string,
  field: "name" | "sub_title" | "description"
): string {
  const key = `${field}_${locale === "kz" ? "kk" : locale}` as keyof IOffer;
  const value = item[key];
  return typeof value === "string" ? value : (item[`${field}_ru` as keyof IOffer] as string);
}

// --- Main Component ---
export default function OffersPageClient() {
  const pathname = usePathname();
  const swiperRef = useRef<SwiperType | null>(null);

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
        setOffers(response.data.filter((offer) => offer.id !== 5));
      } catch (error) {
        console.error("Error fetching offers:", error);
        setOffers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchOffers();
  }, []);

  const titleMobile =
    locale === "ru" ? sectionTitle.replace(" И ", " И\n ") : sectionTitle;

  if (loading) {
    return (
      <main className="min-h-screen bg-white font-raleway">
        <div className="pt-[120px] md:pt-[140px]" />
        <Container>
          {/* Skeleton back button */}
          <div className="flex items-center gap-3 h-[40px] mb-8">
            <div className="w-10 h-10 rounded bg-[#E4C7C7]/40 animate-pulse" />
            <div className="w-[180px] h-5 rounded bg-[#E4C7C7]/40 animate-pulse" />
          </div>
          {/* Skeleton title */}
          <div className="w-[320px] md:w-[480px] h-9 md:h-11 rounded bg-[#E4C7C7]/40 animate-pulse mb-8 md:mb-12" />
          {/* Skeleton cards grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 pb-16 md:pb-24">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-white border-2 border-[#E4C7C7]/30 rounded-xl overflow-hidden"
              >
                {/* Image skeleton */}
                <div className="relative aspect-[16/10] w-full bg-[#E4C7C7]/20 animate-pulse" />
                {/* Content skeleton */}
                <div className="p-5 md:p-6 space-y-3">
                  <div className="w-3/4 h-6 rounded bg-[#E4C7C7]/30 animate-pulse" />
                  <div className="w-full h-4 rounded bg-[#E4C7C7]/20 animate-pulse" />
                  <div className="w-2/3 h-4 rounded bg-[#E4C7C7]/20 animate-pulse" />
                  <div className="w-[100px] h-4 rounded bg-[#E4C7C7]/30 animate-pulse mt-4" />
                </div>
              </div>
            ))}
          </div>
        </Container>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white font-raleway">
      <div className="pt-[120px] md:pt-[140px]" />

      {/* Back Link */}
      <Container>
        <Link
          href={pathname.split("/").slice(0, -1).join("/")}
          className="inline-flex items-center gap-3 h-[40px] mb-8 text-[#6E2525]"
        >
          <span className="grid place-items-center w-10 h-10 border-2 border-[#6E2525]">
            <Image
              src="/icons/vip/red-arrow-back.svg"
              alt=""
              width={32}
              height={32}
              priority
            />
          </span>
          <span className="font-inter font-semibold text-[20px] md:text-[24px] leading-[24px]">
            {t("offerDetail.back")}
          </span>
        </Link>
      </Container>

      {/* Title */}
      <Container>
        <h1 className="text-[28px] md:text-[40px] font-bold text-[#6E2525] mb-8 md:mb-12">
          <span className="md:hidden whitespace-pre-line">{titleMobile}</span>
          <span className="hidden md:inline">{sectionTitle}</span>
        </h1>
      </Container>

      {/* Offers Grid */}
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 pb-16 md:pb-24">
          {offers.map((offer) => {
            const offerTitle = getLocalizedText(offer, locale, "name");
            const offerSubtitle = getLocalizedText(offer, locale, "sub_title");
            const offerDesc = getLocalizedText(offer, locale, "description");

            const getImageSrc = (media: any) => {
              if (!media || !media.file) return "/images/placeholder.jpg";
              if (media.file.startsWith("http")) return media.file;
              return `https://api.svoy-lounge.kz${media.file}`;
            };

            const firstMedia = offer.medias?.[0];
            const imgSrc = getImageSrc(firstMedia);

            return (
              <Link
                key={offer.id}
                href={`${pathname}/${offer.id}`}
                className="group block bg-white border-2 border-[#E4C7C7] rounded-xl overflow-hidden shadow-sm hover:border-[#6E2525] hover:shadow-lg transition-all duration-300"
              >
                {/* Image */}
                <div className="relative aspect-[16/10] w-full overflow-hidden">
                  <Image
                    src={imgSrc}
                    alt={offerTitle || "Offer"}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(min-width:768px) 50vw, 100vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                </div>

                {/* Content */}
                <div className="p-5 md:p-6">
                  <h3 className="font-raleway font-bold text-[20px] md:text-[24px] text-[#6E2525] leading-tight uppercase">
                    {offerTitle}
                  </h3>
                  {offerDesc && (
                    <p className="mt-2 text-[14px] md:text-[16px] text-[#151515]/70 leading-relaxed line-clamp-2">
                      {offerDesc}
                    </p>
                  )}
                  <div className="mt-4 inline-flex items-center gap-2 text-[#6E2525] font-semibold text-[14px] md:text-[16px] group-hover:gap-3 transition-all">
                    <span>{t("offerDetail.viewDetails") || "Подробнее"}</span>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </Container>
    </main>
  );
}

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import { Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import axios from "axios";
import Modal from "./modal";

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
  medias: string; // Changed to an array of objects
  created_at?: string;
  updated_at?: string;
}

// --- Utility Functions ---
function getLocalizedText(
  item: IOffer,
  locale: string,
  field: "name" | "sub_title" | "description"
): string | null {
  const key = `${field}_${locale}` as keyof IOffer;
  const value = item[key];
  if (typeof value === "string" && value.trim() !== "") {
    return value;
  }
  return item[`${field}_ru`] as string | null;
}

// --- Main Component ---
export default function OfferPageClient() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const slug = segments.pop();

  const [offer, setOffer] = useState<IOffer | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [open, setOpen] = useState(false);

  const locale = useLocale();
  const tDetail = useTranslations("offerDetail");

  const bookLabel =
    locale === "ru" ? "Забронировать" : locale === "kz" ? "Бронь жасау" : "Book a table";

  const swiperRef = useRef<SwiperType | null>(null);
  const paginationRef = useRef<HTMLDivElement>(null);
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  // --- Data Fetching ---
  useEffect(() => {
    if (!slug) {
      setLoading(false);
      console.error("No slug found in the URL.");
      return;
    }

    const fetchOffer = async () => {
      try {
        setLoading(true);
        const response = await axios.get<IOffer>(`/api/halls/${slug}`);
        setOffer(response.data); // Assuming the API returns an array
      } catch (error) {
        console.error("Error fetching offer data:", error);
        setOffer(null);
      } finally {
        setLoading(false);
      }
    };
    fetchOffer();
  }, [slug]);

  // --- Swiper Navigation & Pagination Wiring ---
  useEffect(() => {
    const sw = swiperRef.current;
    if (!sw) return;

    if (sw.navigation) {
      // sw.navigation.prevEl = prevRef.current;
      // sw.navigation.nextEl = nextRef.current;
      sw.navigation.init();
      sw.navigation.update();
    }

    if (sw.pagination) {
      // sw.pagination.el = paginationRef.current;
      // sw.pagination.clickable = true;
      // sw.pagination.renderBullet = (_i, className) => `<span class="${className} offer-detail-bullet"></span>`;
      sw.pagination.init();
      sw.pagination.render();
      sw.pagination.update();
    }
  }, [loading, offer]);

  // --- Share functionality ---
  const onShare = useCallback(async () => {
    if (!offer) return;
    const shareData = {
      title: getLocalizedText(offer, locale, "name") || "Offer",
      text: getLocalizedText(offer, locale, "sub_title") || "",
      url: typeof window !== "undefined" ? window.location.href : "/",
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareData.url);
        alert(
          locale === "ru"
            ? "Ссылка скопирована в буфер обмена"
            : locale === "kz"
            ? "Сілтеме буферге көшірілді"
            : "Link copied to clipboard"
        );
      } else {
        window.location.href = `mailto:?subject=${encodeURIComponent(
          shareData.title
        )}&body=${encodeURIComponent(shareData.url)}`;
      }
    } catch {}
  }, [offer, locale]);

  if (loading) {
    return (
      <main className="min-h-screen bg-white font-raleway flex items-center justify-center">
        <p className="text-xl text-[#961515]">Загрузка...</p>
      </main>
    );
  }

  if (!offer) {
    return (
      <main className="min-h-screen bg-white font-raleway flex items-center justify-center">
        <p className="text-xl text-[#961515]">Предложение не найдено.</p>
      </main>
    );
  }

  const title = getLocalizedText(offer, locale, "name");
  const subtitle = getLocalizedText(offer, locale, "sub_title");
  const content = getLocalizedText(offer, locale, "description");
  const images = offer.medias || [];

  return (
    <main className="min-h-screen bg-white font-raleway md:pb-24">
      <div className="hidden md:block pt-[120px]" />

      {/* Back link (desktop/tablet) */}
      <div className="hidden md:block desktop-rail">
        <Link
          href={pathname.split('/').slice(0, -2).join('/')}
          aria-label={tDetail("back")}
          className="inline-flex items-center gap-3 h-[40px] mb-8 text-[#961515]"
        >
          <span className="grid place-items-center w-10 h-10 border-2 border-[#961515]">
            <Image src="/icons/vip/red-arrow-back.svg" alt="" width={32} height={32} priority />
          </span>
          <span className="font-inter font-semibold text-[24px] leading-[24px]">
            {tDetail("back")}
          </span>
        </Link>
      </div>

      {/* Back button (mobile) */}
      <Link
        href={pathname.split('/').slice(0, -2).join('/')}
        aria-label={tDetail("back")}
        className="md:hidden absolute top-4 left-4 z-40 grid place-items-center w-10 h-10 rounded bg-white/60"
      >
        <Image src="/icons/arrow-back.svg" alt="" width={24} height={24} className="w-6 h-6" priority />
      </Link>

      {/* Gallery */}
      <div className="relative">
        <div className="desktop-rail relative">
          <Swiper
            modules={[Pagination, Navigation]}
            onSwiper={(sw) => (swiperRef.current = sw)}
            slidesPerView={1}
            loop={images.length > 1}
            navigation
            className="aspect-[412/372] md:aspect-[1040/492] w-full"
          >
            {/* {images.map((media: any, i: number) => ( */}
              <SwiperSlide>
                <div className="relative w-full h-full">
                  <Image
                    src={`https://api.svoy-lounge.kz${images}`}
                    alt={title || "Offer image"}
                    fill
                    sizes="(min-width:768px) calc(100vw - 400px), 100vw"
                    className="object-cover"
                    // priority={i === 0}
                  />
                </div>
              </SwiperSlide>
            {/* // ))} */}
          </Swiper>

          <div
            ref={paginationRef}
            className="offer-detail-pagination md:hidden absolute left-1/2 -translate-x-1/2 bottom-2 z-30"
          />

          <button
            ref={prevRef}
            onClick={() => swiperRef.current?.slidePrev()}
            aria-label="Prev"
            className="hidden md:grid place-items-center absolute left-[24px] top-1/2 -translate-y-1/2 z-30 w-12 h-12 bg-white border-2 border-[#961515]"
          >
            <Image src="/icons/vip/scroll-back.svg" alt="" width={18} height={18} />
          </button>
          <button
            ref={nextRef}
            onClick={() => swiperRef.current?.slideNext()}
            aria-label="Next"
            className="hidden md:grid place-items-center absolute right-[24px] top-1/2 -translate-y-1/2 z-30 w-12 h-12 bg-white border-2 border-[#961515]"
          >
            <Image src="/icons/vip/scroll-forward.svg" alt="" width={18} height={18} />
          </button>
        </div>
      </div>

      {/* Content */}
      <section className="px-6 md:px-0">
        <div className="desktop-rail">
          <div className="flex items-center justify-between pt-4 md:pt-6">
            <h1 className="font-semibold text-[#000] text-[20px] leading-[100%] md:text-[28px] md:leading-[32px]">
              {title}
            </h1>

            {/* Share (desktop) */}
            <button
              onClick={onShare}
              className="hidden md:inline-flex items-center justify-center gap-3 min-w-[210px] h-[50px] border-2 border-[#961515] text-[#961515] px-4"
            >
              <Image src="/icons/vip/share-red.svg" alt="" width={20} height={20} />
              <span className="font-inter font-medium whitespace-nowrap text-[24px] leading-[24px]">
                {tDetail("share")}
              </span>
            </button>

            {/* Share (mobile) */}
            <button
              onClick={onShare}
              aria-label={tDetail("share")}
              className="md:hidden p-2 -m-2 rounded hover:bg-black/5 active:bg.black/10"
            >
              <Image src="/icons/vip/share.svg" alt="" width={18} height={20} className="w-[18px] h-[20px]" priority />
            </button>
          </div>

          <div className="mt-3 h-px w-full bg-[#E5E5E5]" />

          {content && (
            <div>
              {content.split('\n').map((paragraph, i) => (
                <p
                  key={i}
                  className="mt-6 text-black/80 font-medium text-[14px] leading-[100%] md:text-[20px] md:leading-[100%]"
                  style={{ fontVariantNumeric: "lining-nums proportional-nums" }}
                >
                  {paragraph}
                </p>
              ))}
            </div>
          )}

          <div>
            <button
              onClick={() => setOpen(true)}
              className="mt-12 md:mt-16 w-[364px] md:w-full max-w-full h-[51px] rounded-sm bg-[#961515] text-white px-[40px] py-[16px] text-[18px] leading-[100%] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.15)]"
            >
              {bookLabel}
            </button>
          </div>
        </div>
      </section>

      {open && <Modal onClose={() => setOpen(false)} />}

      <style jsx global>{`
        .desktop-rail { width: 100%; margin-left: auto; margin-right: auto; }
        @media (min-width: 768px) {
          .desktop-rail { width: calc(100vw - 400px); }
        }
      `}</style>
    </main>
  );
}
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

import Modal from "@/components/sections/modal";
import type { Offer as DataOffer } from "@/data/offers";
import { useMenuId } from "@/components/menu/menuContext";

type Props = { offer: DataOffer };

export default function OfferPageClient({ offer }: Props) {
  const [open, setOpen] = useState(false);

  const locale = useLocale();
  const menuId = useMenuId() ?? "common"; // fallback
  const tOffer = useTranslations(`offerItems.${offer.slug}`);
  const tDetail = useTranslations("offerDetail");

  const title = tOffer("title");
  const subtitle = safeT(tOffer, "subtitle");
  const content = safeTArray(tOffer, "content");

  const bookLabel =
    locale === "ru" ? "Забронировать" : locale === "kz" ? "Бронь жасау" : "Book a table";

  const swiperRef = useRef<SwiperType | null>(null);
  const paginationRef = useRef<HTMLDivElement>(null);
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    const prevNavH = root.style.getPropertyValue("--nav-h");
    root.style.setProperty("--nav-h", "0px");
    root.classList.add("hide-footer");
    root.classList.add("hide-menu");
    return () => {
      if (prevNavH) root.style.setProperty("--nav-h", prevNavH);
      else root.style.removeProperty("--nav-h");
      root.classList.remove("hide-footer");
      root.classList.remove("hide-menu");
    };
  }, []);

  useEffect(() => {
    const sw = swiperRef.current;
    if (!sw || !paginationRef.current) return;
    // @ts-expect-error
    sw.params.pagination.el = paginationRef.current;
    // @ts-expect-error
    sw.params.pagination.clickable = true;
    // @ts-expect-error
    sw.params.pagination.renderBullet = (_i: number, className: string) =>
      `<span class="${className} offer-detail-bullet"></span>`;
    sw.pagination.destroy();
    sw.pagination.init();
    sw.pagination.render();
    sw.pagination.update();
  }, []);

  useEffect(() => {
    const sw = swiperRef.current;
    if (!sw || !prevRef.current || !nextRef.current) return;
    // @ts-expect-error
    sw.params.navigation.prevEl = prevRef.current;
    // @ts-expect-error
    sw.params.navigation.nextEl = nextRef.current;
    sw.navigation.destroy();
    sw.navigation.init();
    sw.navigation.update();
  }, []);

  const onShare = useCallback(async () => {
    const shareData = {
      title,
      text: subtitle || title,
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
  }, [title, subtitle, locale]);

  return (
    <main className="min-h-screen bg-white font-raleway md:pb-24">
      <div className="hidden md:block pt-[120px]" />

      {/* Back link (desktop/tablet) */}
      <div className="hidden md:block desktop-rail">
        <Link
          href={`/${locale}/#offers`}
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
        href={`/${locale}/#offers`}
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
            loop={offer.images.length > 1}
            navigation
            className="aspect-[412/372] md:aspect-[1040/492] w-full"
          >
            {offer.images.map(({ id, src }, i) => (
              <SwiperSlide key={id}>
                <div className="relative w-full h-full">
                  <Image
                    src={src}
                    alt={title}
                    fill
                    sizes="(min-width:768px) calc(100vw - 400px), 100vw"
                    className="object-cover"
                    priority={i === 0}
                  />
                </div>
              </SwiperSlide>
            ))}
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

          {!!content.length && (
            <div>
              {content.map((p, i) => (
                <p
                  key={i}
                  className="mt-6 text-black/80 font-medium text-[14px] leading-[100%] md:text-[20px] md:leading-[100%]"
                  style={{ fontVariantNumeric: "lining-nums proportional-nums" }}
                >
                  {p}
                </p>
              ))}
            </div>
          )}

          <div>
            <button
              onClick={() => setOpen(true)}
              className="mt-12 md:mt-16 w-[364px] md:w-full max-w-full h-[51px] rounded-sm bg-[#961515] text.white px-[40px] py-[16px] text-[18px] leading-[100%] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.15)]"
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

/** Helpers */
function safeT(t: ReturnType<typeof useTranslations>, key: string): string | undefined {
  try { return t(key); } catch { return undefined; }
}
function safeTArray(t: ReturnType<typeof useTranslations>, key: string): string[] {
  try { const raw = t.raw(key); return Array.isArray(raw) ? (raw as string[]) : []; } catch { return []; }
}

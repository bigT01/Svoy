'use client';

import {useEffect, useMemo, useRef, useState, useCallback} from "react";
import Image from "next/image";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {useLocale, useTranslations} from "next-intl";
import {locales} from "@/i18n/routing";
import Container from "@/components/layout/container";

export default function Navbar() {
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations("nav");
  const [showMobileBar, setShowMobileBar] = useState(false);

  // keep a cleanup for listeners / observers
  const cleanupRef = useRef<(() => void) | null>(null);

  // strip locale segment from the current path
  const pathWithoutLocale = useMemo(() => {
    if (!pathname) return "";
    const parts = pathname.split("/").filter(Boolean);
    if (parts.length && (locales as readonly string[]).includes(parts[0])) {
      return "/" + parts.slice(1).join("/");
    }
    return pathname;
  }, [pathname]);

  // NEW: hide navbar on /{menuId}/offers/{slug} detail page
  const isOfferDetail = /^\/[^/]+\/offers\/[^/]+$/.test(pathWithoutLocale || "");

  // Show mobile bar only after hero scrolled off-screen (home only)
  useEffect(() => {
    cleanupRef.current?.();

    if (isOfferDetail) {
      setShowMobileBar(false);
      return;
    }

    let mo: MutationObserver | null = null;

    const attach = (hero: HTMLElement) => {
      const update = () => {
        const bottom = hero.getBoundingClientRect().bottom;
        setShowMobileBar(bottom <= 0);
      };
      update();
      window.addEventListener("scroll", update, {passive: true});
      window.addEventListener("resize", update);

      cleanupRef.current = () => {
        window.removeEventListener("scroll", update);
        window.removeEventListener("resize", update);
      };
    };

    const existing = document.getElementById("hero");
    if (existing) {
      attach(existing);
    } else {
      setShowMobileBar(false);
      mo = new MutationObserver(() => {
        const el = document.getElementById("hero");
        if (el) {
          mo?.disconnect();
          attach(el);
        }
      });
      mo.observe(document.body, {childList: true, subtree: true});
      cleanupRef.current = () => mo?.disconnect();
    }

    return () => {
      cleanupRef.current?.();
      mo?.disconnect();
      cleanupRef.current = null;
    };
  }, [isOfferDetail]);

  // Smooth-scroll to footer when clicking “Contact”
  const onContactClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const el = document.getElementById("site-footer") || document.querySelector("footer");
    if (!el) return;
    const top = (el as HTMLElement).getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top, behavior: "smooth" });
  }, []);

  if (isOfferDetail) return null;

  return (
    <header className="fixed top-0 left-0 right-0 z-[60]">
      {/* Mobile top bar (phones & small tablets) */}
      <div
        className={`md:hidden transition-transform duration-300 will-change-transform ${
          showMobileBar
            ? "translate-y-0 opacity-100 pointer-events-auto"
            : "-translate-y-full opacity-0 pointer-events-none"
        } bg-white border-b-[3px] border-[#9b1b1b]`}
      >
        <div className="relative h-[96px] w-full">
          <Link
            href={`/${locale}`}
            aria-label="SVOY"
            className="absolute left-1/2 -translate-x-1/2 top-4"
          >
            <Image src="/icons/logo/logo-red.svg" alt="SVOY" width={85} height={40} priority />
          </Link>
          <span className="absolute left-1/2 -translate-x-1/2 top-16 text-[16px] leading-[16px] font-raleway">
            {t("address")}
          </span>
        </div>
      </div>

      {/* Desktop / Tablet bar */}
      <div className="hidden md:block bg-white border-b-[3px] border-[#9b1b1b]">
        <Container>
          <div className="h-[96px] flex items-center justify-between">
            {/* Left: logo */}
            <div className="flex-shrink-0">
              {/* <Link href={`/${locale}`} aria-label="SVOY"> */}
                <Image src="/icons/logo/logo-red.svg" alt="SVOY" width={109} height={52} />
              {/* </Link> */}
            </div>

            {/* Center nav (large screens) */}
            <nav className="hidden lg:flex flex-1 justify-center">
              <ul className="flex gap-10 text-[20px] leading-[28px] text-[#151515]">
                <li><a href="#about"  className="hover:opacity-70">{t("about")}</a></li>
                <li><a href="#offers" className="hover:opacity-70">{t("offers")}</a></li>
                <li><a href="#menu"   className="hover:opacity-70">{t("menu")}</a></li>
                {/* Scroll to footer on click */}
                <li>
                  <a href="#site-footer" onClick={onContactClick} className="hover:opacity-70">
                    {t("contact")}
                  </a>
                </li>
              </ul>
            </nav>

            {/* Right: address & phone */}
            <div className="hidden md:block">
              <div className="grid grid-cols-[20px_auto] gap-x-2 gap-y-1 items-center">
                <Image src="/icons/navbar/address-navbar.svg" alt="Адрес" width={20} height={20} />
                <span className="whitespace-nowrap text-[20px] leading-[23px]">
                  {t("address")}
                </span>
                <Image src="/icons/navbar/phone.svg" alt="Телефон" width={20} height={20} />
                <a
                  href={`tel:${t("phone").replace(/[^\d+]/g, "")}`}
                  className="whitespace-nowrap text-[20px] leading-[23px] hover:opacity-70"
                >
                  {t("phone")}
                </a>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </header>
  );
}

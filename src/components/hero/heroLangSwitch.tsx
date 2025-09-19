"use client";

import { useCallback } from "react";
import { useLocale } from "next-intl";
import { locales } from "@/i18n/routing";

type Props = {
  /** Optional extra/override classes (e.g. absolute positioning). */
  className?: string;
};

export default function HeroLangSwitch({ className }: Props) {
  const locale = useLocale();

  const navigateTo = useCallback((nextLocale: string) => {
    const { pathname, search, hash } = window.location;
    const parts = pathname.split("/").filter(Boolean);
    const hasLocale = parts.length && (locales as readonly string[]).includes(parts[0]);
    const pathWithoutLocale = hasLocale ? "/" + parts.slice(1).join("/") : pathname;

    const url =
      `/${nextLocale}` +
      (pathWithoutLocale === "/" ? "" : pathWithoutLocale) +
      search + hash;

    window.location.assign(url);
  }, []);

  return (
    <div
      className={[
        "md:hidden z-40", // mobile only
        // default Figma position when no className is passed
        className || "absolute top-[82px] left-[144px]",
      ].join(" ")}
    >
      <div className="relative inline-block pointer-events-auto">
        <select
          value={locale}
          onChange={(e) => navigateTo(e.target.value)}
          aria-label="Language"
          className={[
            "appearance-none",
            "bg-black/40 text-white",
            "text-[16px] leading-[20px] font-medium",
            "border border-white rounded-[2px]",
            "px-5 pr-10 py-3",
          ].join(" ")}
        >
          <option value="ru">Русский</option>
          <option value="en">English</option>
          <option value="kz">Қазақша</option>
        </select>

        {/* chevron */}
        <svg
          viewBox="0 0 24 24"
          width="16"
          height="16"
          className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2"
          fill="none"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          aria-hidden
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </div>
    </div>
  );
}

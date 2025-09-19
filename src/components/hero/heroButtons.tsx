"use client";

import React from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";

type Props = { variant?: "mobile" | "desktop" };

function SmoothScroll({
  targetId,
  offset = 96,
  children,
  className = "",
}: {
  targetId: string;
  offset?: number;
  children: React.ReactNode;
  className?: string;
}) {
  const onClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById(targetId);
    if (!el) return;
    const cssVar = getComputedStyle(document.documentElement)
      .getPropertyValue("--nav-h")
      .trim()
      .replace("px", "");
    const navOffset = Number(cssVar) || offset || 96;
    const top = el.getBoundingClientRect().top + window.scrollY - navOffset;
    window.scrollTo({ top, behavior: "smooth" });
  };
  return (
    <a href={`#${targetId}`} onClick={onClick} className={className}>
      {children}
    </a>
  );
}

export default function HeroButtons({ variant = "desktop" }: Props) {
  const t = useTranslations("hero.buttons");
  const isMobile = variant === "mobile";

  // widen the mobile download button and reduce its horizontal padding
  const dlW = isMobile ? "w-[226px]" : "w-[226px]";
  const dlH = isMobile ? "h-[51px]" : "h-[63px]";
  const viewW = isMobile ? "w-[273px]" : "w-[332px]";
  const viewH = isMobile ? "h-[51px]" : "h-[63px]";
  const pxX = isMobile ? "px-[20px]" : "px-[44px]"; // was 40px on mobile; tighter to fit one line
  const pyY = "py-[20px]";

  return (
    <div className={`flex flex-col items-center ${isMobile ? "gap-[16px]" : "gap-[24px]"}`}>
      {/* DOWNLOAD */}
      <Link
        href="/menu/menu.pdf"
        target="_blank"
        rel="noopener noreferrer"
        className={[
          "flex items-center justify-center rounded-[2px] border font-semibold",
          // text sizes: 16 mobile / 18 tablet / 20 desktop (if you're already doing this elsewhere, keep it)
          "text-[16px] md:text-[18px] lg:text-[20px] leading-[20px]",
          "whitespace-nowrap", // <-- keep on one line
          dlW, dlH, pxX, pyY, "text-white border-white",
        ].join(" ")}
        style={{
          background: "#00000080",
          boxShadow: "0px 0px 12px 0px #000000BF",
          backdropFilter: "blur(3px)",
          WebkitBackdropFilter: "blur(3px)",
        }}
      >
        {t("download")}
      </Link>

      {/* VIEW ONLINE */}
      <SmoothScroll
        targetId="menu"
        className={[
          "flex items-center justify-center rounded-[2px] border font-semibold",
          "text-[16px] md:text-[18px] lg:text-[20px] leading-[20px]",
          "whitespace-nowrap", // keep on one line just in case
          viewW, viewH, pxX, pyY,
          "bg-white text-[#9b1b1b] border-[#9b1b1b]",
          "shadow-[0_0_12px_0_rgba(0,0,0,0.75)]",
        ].join(" ")}
      >
        {t("viewOnline")}
      </SmoothScroll>
    </div>
  );
}

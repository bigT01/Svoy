// src/components/sections/modal.tsx
"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";

type ModalProps = { onClose: () => void };

export default function Modal({ onClose }: ModalProps) {
  const t = useTranslations("modal");
  const panelRef = useRef<HTMLDivElement>(null);

  // Close on Esc and outside click
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    const onDown = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onDown);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50">
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        className="w-[90%] max-w-[560px] bg-white rounded-md p-6 md:p-8"
      >
        <div className="flex flex-col gap-4">
          {/* WhatsApp */}
          <a
            href="https://wa.me/77770900333"
            target="_blank"
            rel="noopener"
            className="h-[56px] md:h-[64px] w-full rounded-sm bg-[#1AA75C] text-white
                       flex items-center justify-center gap-3 md:gap-4
                       font-raleway font-medium text-[18px] leading-[100%] md:text-[20px]"
          >
            <Image src="/icons/footer/whatsapp.svg" alt="" width={24} height={24} />
            {t("whatsapp")}
          </a>

          {/* Call */}
          <a
            href="tel:+77770900333"
            className="h-[56px] md:h-[64px] w-full rounded-sm bg-white text-[#961515]
                       border-2 border-[#961515] flex items-center justify-center gap-3 md:gap-4
                       font-raleway font-medium text-[18px] leading-[100%] md:text-[20px]"
          >
            <Image src="/icons/navbar/phone.svg" alt="" width={24} height={24} />
            {t("call")}
          </a>
        </div>
      </div>
    </div>
  );
}

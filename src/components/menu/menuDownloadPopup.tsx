"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function MenuDownloadPopup({ isOpen, onClose }: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  const content = (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative z-10 w-full max-w-[400px] bg-white rounded-lg shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="text-xl font-bold text-[#6E2525] font-raleway uppercase tracking-tight">Скачать меню</h2>
          <button
            onClick={onClose}
            className="p-2 -mr-2 text-gray-400 hover:text-[#6E2525] transition-colors"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className="p-6 flex flex-col gap-4 bg-gray-50/50">
          <Link
            href="/menu/menu.pdf"
            target="_blank" download
            rel="noopener noreferrer"
            onClick={onClose}
            className="flex items-center justify-center w-full h-[58px] rounded-md border-2 border-[#6E2525] bg-white text-[#6E2525] font-bold text-[18px] hover:bg-[#6E2525] hover:text-white transition-all active:scale-[0.98]"
          >
            Основное меню
          </Link>

          <Link
            href="https://xqqmtekqxsnuxmm3.public.blob.vercel-storage.com/menu.pdf"
            target="_blank" download
            rel="noopener noreferrer"
            onClick={onClose}
            className="flex items-center justify-center w-full h-[58px] rounded-md border-2 border-[#6E2525] bg-white text-[#6E2525] font-bold text-[18px] hover:bg-[#6E2525] hover:text-white transition-all active:scale-[0.98]"
          >
            Барное меню
          </Link>

          <Link
            href="https://xqqmtekqxsnuxmm3.public.blob.vercel-storage.com/Banket-menu.pdf"
            target="_blank" download
            rel="noopener noreferrer"
            onClick={onClose}
            className="flex items-center justify-center w-full h-[58px] rounded-md border-2 border-[#6E2525] bg-[#6E2525] text-white font-bold text-[18px] hover:opacity-90 transition-all active:scale-[0.98]"
          >
            Банкетное меню
          </Link>
        </div>
      </div>
    </div>
  );

  return createPortal(content, document.body);
}

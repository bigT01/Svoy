"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function MenuDownloadPopup({ isOpen, onClose }: Props) {
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative z-10 w-full max-w-[400px] bg-white rounded-lg shadow-xl overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-[#6E2525] font-raleway">Скачать меню</h2>
          <button 
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-800 transition-colors"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        
        <div className="p-6 flex flex-col gap-4">
          <Link
            href="/menu/menu.pdf"
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
            className="flex items-center justify-center w-full h-[54px] rounded border border-[#6E2525] bg-[#6E2525] text-white font-semibold text-[18px] hover:opacity-90 transition-opacity"
          >
            меню 1
          </Link>
          
          <Link
            href="https://xqqmtekqxsnuxmm3.public.blob.vercel-storage.com/menu.pdf"
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
            className="flex items-center justify-center w-full h-[54px] rounded border border-[#6E2525] bg-[#6E2525] text-white font-semibold text-[18px] hover:opacity-90 transition-opacity"
          >
            меню 2
          </Link>

          <Link
            href="https://xqqmtekqxsnuxmm3.public.blob.vercel-storage.com/Banket-menu.pdf"
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
            className="flex items-center justify-center w-full h-[54px] rounded border border-[#6E2525] bg-[#6E2525] text-white font-semibold text-[18px] hover:opacity-90 transition-opacity"
          >
            Банкетное меню
          </Link>
        </div>
      </div>
    </div>
  );
}

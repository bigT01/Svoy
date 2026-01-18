"use client";

import { useEffect, useRef } from "react";
import clsx from "clsx";

interface BackgroundVideoProps {
  src: string;
  posterSrc: string;
  index: number;
  isActive: boolean;
  registerVideo: (index: number, ref: HTMLVideoElement) => void;
  onTimeUpdate: (index: number) => void;
  onEnded: (index: number) => void;
  className?: string;
}

export default function BackgroundVideo({
  src,
  posterSrc,
  index,
  isActive,
  registerVideo,
  onTimeUpdate,
  onEnded,
  className,
}: BackgroundVideoProps) {
  const ref = useRef<HTMLVideoElement | null>(null);

  /** register */
  useEffect(() => {
    if (!ref.current) return;
    registerVideo(index, ref.current);
  }, [index, registerVideo]);

  /** activation / deactivation logic */
  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    if (isActive) {
      // ensure source exists
      if (!video.src) {
        video.src = src;
      }

      video.currentTime = 0;
      video.load();

      video.play().catch(() => {});
    } else {
      // 🔑 reset to poster state
      video.pause();
      video.currentTime = 0;

      video.removeAttribute("src");
      video.load();
    }
  }, [isActive, src]);

  /** when video ends */
  const handleEnded = () => {
    onEnded(index);
  };

  return (
    <video
      ref={ref}
      muted
      playsInline
      poster={posterSrc}
      preload="metadata"
      crossOrigin="anonymous"
      onTimeUpdate={() => onTimeUpdate(index)}
      onEnded={handleEnded}
      className={clsx(
        "absolute inset-0 w-full h-full object-cover transition-all duration-1000",
        isActive
          ? "opacity-100 filter-none"
          : "opacity-100 grayscale brightness-50",
        className
      )}
    />
  );
}

"use client";

import { useEffect, useRef } from "react";
import clsx from "clsx";

interface BackgroundVideoProps {
  src: string;
  index: number;
  isActive: boolean;
  registerVideo: (index: number, ref: HTMLVideoElement) => void;
  onTimeUpdate: (index: number) => void;
  onEnded: (index: number) => void;
  className?: string;
}

export default function BackgroundVideo({
  src,
  index,
  isActive,
  registerVideo,
  onTimeUpdate,
  onEnded,
  className,
}: BackgroundVideoProps) {
  const ref = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    registerVideo(index, ref.current);
  }, [index, registerVideo]);

  useEffect(() => {
    if (!ref.current) return;

    if (isActive) {
      ref.current.currentTime = 0;
      ref.current.play().catch(() => {});
    } else {
      ref.current.pause();
    }
  }, [isActive]);

  return (
    <video
      ref={ref}
      src={src}
      muted
      playsInline
      preload="metadata"
      crossOrigin="anonymous"
      onTimeUpdate={() => onTimeUpdate(index)}
      onEnded={() => onEnded(index)}
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

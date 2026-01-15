"use client";

import { useEffect, useRef, useState } from "react";
import clsx from "clsx";

interface BackgroundVideoProps {
  src: string;
  className?: string;
  grayscale?: boolean;
}

export default function BackgroundVideo({
  src,
  className,
  grayscale = false,
}: BackgroundVideoProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onReady = () => setIsReady(true);

    video.addEventListener("canplaythrough", onReady, { once: true });

    return () => {
      video.removeEventListener("canplaythrough", onReady);
    };
  }, []);

  return (
    <>
      {/* PRELOADER */}
      <div
        className={clsx(
          "absolute inset-0 z-10 bg-neutral-900 transition-opacity duration-700",
          isReady ? "opacity-0 pointer-events-none" : "opacity-100"
        )}
      >
        <div className="w-full h-full animate-pulse bg-neutral-800" />
      </div>

      {/* VIDEO */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        crossOrigin="anonymous"
        className={clsx(
          "absolute inset-0 w-full h-full object-cover transition-opacity duration-700",
          grayscale && "grayscale",
          isReady ? "opacity-100" : "opacity-0",
          className
        )}
        src={src}
      />
    </>
  );
}

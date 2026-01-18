"use client";

import { useRef, useState } from "react";

interface VideoMeta {
  duration: number;
  ref: HTMLVideoElement;
}

export function useSequentialTimelineVideos(total: number) {
  const [activeIndex, setActiveIndex] = useState(0);
  const videos = useRef<Map<number, VideoMeta>>(new Map());

  const registerVideo = (index: number, ref: HTMLVideoElement) => {
    if (!videos.current.has(index)) {
      videos.current.set(index, {
        ref,
        duration: ref.duration || 0,
      });
    }
  };

  const onTimeUpdate = (index: number) => {
    if (index !== activeIndex) return;

    const current = videos.current.get(index);
    if (!current) return;

    const nextIndex = (index + 1) % total;
    const next = videos.current.get(nextIndex);

    if (!next) return;

    const timeLeft = current.ref.duration - current.ref.currentTime;

    // ⏳ за 2 секунды до конца
    if (timeLeft < 2) {
      next.ref.preload = "auto";
      next.ref.load();
    }
  };

  const onEnded = (index: number) => {
    if (index !== activeIndex) return;

    const nextIndex = (index + 1) % total;
    setActiveIndex(nextIndex);

    const next = videos.current.get(nextIndex);
    if (next) {
      next.ref.currentTime = 0;
      next.ref.play().catch(() => {});
    }
  };

  return {
    activeIndex,
    registerVideo,
    onTimeUpdate,
    onEnded,
  };
}

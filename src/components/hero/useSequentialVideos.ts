"use client";

import { useEffect, useState } from "react";

export function useSequentialVideos(total: number) {
  const [activeIndex, setActiveIndex] = useState(0);

  const onVideoEnd = (index: number) => {
    if (index !== activeIndex) return;

    setActiveIndex((prev) => (prev + 1) % total);
  };

  return {
    activeIndex,
    onVideoEnd,
  };
}

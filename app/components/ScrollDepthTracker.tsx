"use client";

import { useEffect } from "react";
import { trackEvent } from "@/app/lib/analytics";

interface ScrollDepthTrackerProps {
  readonly page: string;
  readonly thresholds?: readonly number[];
}

export default function ScrollDepthTracker({
  page,
  thresholds = [25, 50, 75, 100],
}: ScrollDepthTrackerProps) {
  useEffect(() => {
    const checkpoints = [...thresholds].sort((a, b) => a - b);
    const fired = new Set<number>();

    const handleScroll = () => {
      const root = document.documentElement;
      const totalScrollable = root.scrollHeight - window.innerHeight;
      if (totalScrollable <= 0) return;

      const progress = Math.round((window.scrollY / totalScrollable) * 100);

      for (const checkpoint of checkpoints) {
        if (progress >= checkpoint && !fired.has(checkpoint)) {
          fired.add(checkpoint);
          trackEvent("scroll_depth", { page, depth: checkpoint });
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [page, thresholds]);

  return null;
}

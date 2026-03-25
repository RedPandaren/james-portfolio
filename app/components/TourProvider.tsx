"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

type TourStep = {
  id: string;
  title: string;
  body: string;
  selectors: string[];
  placement?: "top" | "bottom" | "left" | "right" | "auto";
  ctaLabel?: string;
  ctaHref?: string;
};

type TourContextValue = {
  startTour: (force?: boolean) => void;
  stopTour: () => void;
};

const TourContext = createContext<TourContextValue | undefined>(undefined);

const TOUR_STORAGE_KEY = "tourSeen_v1";

const steps: TourStep[] = [
  {
    id: "hero",
    title: "Fintech value prop",
    body: "Fintech-specialized backend engineer; secure payment systems and migrations without breaking contracts.",
    selectors: ["[data-tour=hero]", "#hero"],
    placement: "bottom",
  },
  {
    id: "impact",
    title: "Measured impact",
    body: "Uptime, migrations, and security improvements with quantified results.",
    selectors: ["[data-tour=impact]", "#impact"],
    placement: "top",
  },
  {
    id: "demo",
    title: "Signature demo",
    body: "See the fraud signal explainer (or encryption visualizer) for hands-on proof.",
    selectors: ["#demo-fraud-signal", "#demo-encryption-visualizer"],
    placement: "top",
  },
  {
    id: "chatbot",
    title: "AI chatbot",
    body: "Ask resume-grounded questions—powered by Gemini with fintech/security context.",
    selectors: ["[data-tour=chatbot-launcher]"],
    placement: "left",
  },
  {
    id: "contact",
    title: "Contact options",
    body: "Pick the fastest path to connect: intro call, architecture walkthrough, or recruiter thread.",
    selectors: ["[data-tour=contact]", "#contact"],
    placement: "top",
  },
];

type OverlayPosition = {
  top: number;
  left: number;
  placement: "top" | "bottom" | "left" | "right" | "auto";
};

function useIsReducedMotion() {
  const [prefersReduced, setPrefersReduced] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setPrefersReduced(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return prefersReduced;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function getStoredSeen(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(TOUR_STORAGE_KEY) === "true";
}

function setStoredSeen() {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(TOUR_STORAGE_KEY, "true");
}

function clearStoredSeen() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(TOUR_STORAGE_KEY);
}

function findTarget(selectors: string[]): HTMLElement | null {
  if (typeof document === "undefined") return null;
  for (const selector of selectors) {
    const el = document.querySelector<HTMLElement>(selector);
    if (el) return el;
  }
  return null;
}

function highlightTarget(el: HTMLElement | null, enable: boolean) {
  if (!el) return;
  if (enable) {
    el.classList.add("tour-highlight-ring");
  } else {
    el.classList.remove("tour-highlight-ring");
  }
}

function computeOverlay(target: HTMLElement, placement: TourStep["placement"]): OverlayPosition {
  const rect = target.getBoundingClientRect();
  const scrollY = window.scrollY || 0;
  const scrollX = window.scrollX || 0;
  const tooltipWidth = 320;
  const gap = 12;
  const desired = placement ?? "auto";

  if (desired === "top") {
    return {
      placement: "top",
      top: rect.top + scrollY - gap,
      left: clamp(rect.left + scrollX + rect.width / 2 - tooltipWidth / 2, 12, window.innerWidth - tooltipWidth - 12),
    };
  }
  if (desired === "bottom") {
    return {
      placement: "bottom",
      top: rect.bottom + scrollY + gap,
      left: clamp(rect.left + scrollX + rect.width / 2 - tooltipWidth / 2, 12, window.innerWidth - tooltipWidth - 12),
    };
  }
  if (desired === "left") {
    return {
      placement: "left",
      top: rect.top + scrollY,
      left: clamp(rect.left + scrollX - tooltipWidth - gap, 12, window.innerWidth - tooltipWidth - 12),
    };
  }
  if (desired === "right") {
    return {
      placement: "right",
      top: rect.top + scrollY,
      left: clamp(rect.right + scrollX + gap, 12, window.innerWidth - tooltipWidth - 12),
    };
  }

  // auto (default to bottom)
  return {
    placement: "auto",
    top: rect.bottom + scrollY + gap,
    left: clamp(rect.left + scrollX + rect.width / 2 - tooltipWidth / 2, 12, window.innerWidth - tooltipWidth - 12),
  };
}

function isTargetInViewport(el: HTMLElement) {
  const rect = el.getBoundingClientRect();
  const vh = window.innerHeight || 0;
  const vw = window.innerWidth || 0;
  const verticallyVisible = rect.top < vh * 0.9 && rect.bottom > vh * 0.1;
  const horizontallyVisible = rect.left < vw * 0.95 && rect.right > vw * 0.05;
  return verticallyVisible && horizontallyVisible;
}

export function useTour() {
  const ctx = useContext(TourContext);
  if (!ctx) throw new Error("useTour must be used within TourProvider");
  return ctx;
}

export default function TourProvider({ children }: { children: React.ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalFallback, setIsModalFallback] = useState(false);
  const [overlayPos, setOverlayPos] = useState<OverlayPosition | null>(null);
  const [activeTarget, setActiveTarget] = useState<HTMLElement | null>(null);
  const reducedMotion = useIsReducedMotion();
  const overlayRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setIsMounted(true);

    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      const force = url.searchParams.get("tour") === "1";
      if (force || !getStoredSeen()) {
        setIsOpen(true);
        setCurrentIndex(0);
      }
    }
  }, []);

  const startTour = useCallback(
    (force = false) => {
      if (force) {
        clearStoredSeen();
      }
      setIsOpen(true);
      setCurrentIndex(0);
    },
    [],
  );

  const stopTour = useCallback(() => {
    setIsOpen(false);
    setOverlayPos(null);
    highlightTarget(activeTarget, false);
  }, [activeTarget]);

  useEffect(() => {
    if (!isOpen || typeof document === "undefined") return;

    const target = findTarget(steps[currentIndex].selectors);
    setActiveTarget(target);
    setIsModalFallback(true);
    setOverlayPos(null);
    highlightTarget(target, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, currentIndex]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        stopTour();
      }
      if (e.key === "Enter" && overlayRef.current?.contains(document.activeElement)) {
        e.preventDefault();
        handleNext();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const handleSkip = useCallback(() => {
    setStoredSeen();
    stopTour();
  }, [stopTour]);

  const handleComplete = useCallback(() => {
    setStoredSeen();
    stopTour();
  }, [stopTour]);

  const handleNext = useCallback(() => {
    if (currentIndex + 1 >= steps.length) {
      handleComplete();
      return;
    }
    setCurrentIndex((idx) => Math.min(idx + 1, steps.length - 1));
  }, [currentIndex, handleComplete]);

  const handleBack = useCallback(() => {
    setCurrentIndex((idx) => Math.max(idx - 1, 0));
  }, []);

  const contextValue = useMemo(() => ({ startTour, stopTour }), [startTour, stopTour]);

  const show = isMounted && isOpen;
  const step = steps[currentIndex];
  const stepCount = steps.length;
  const isLast = currentIndex === stepCount - 1;

  const overlayContent = show ? (
    <div className="fixed inset-0 z-[999] pointer-events-none">
      <style>
        {`
          .tour-highlight-ring {
            box-shadow: 0 0 0 3px color-mix(in oklch, var(--sem-primary) 55%, transparent 45%);
            transition: box-shadow 0.2s ease;
            border-radius: 12px;
          }
        `}
      </style>
      <div className="absolute inset-0 bg-[color-mix(in_oklch,var(--sem-background)_55%,transparent_45%)] backdrop-blur-[3px] pointer-events-auto" />
      <div
        className="pointer-events-auto"
        style={
          isModalFallback || !overlayPos
            ? { position: "fixed", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }
            : { position: "absolute", top: overlayPos.top, left: overlayPos.left, width: "min(320px, calc(100vw - 24px))" }
        }
      >
        <div
          ref={overlayRef}
          className={`rounded-2xl border border-[var(--sem-border)] bg-[var(--sem-surface)] text-[var(--sem-text-primary)] shadow-xl p-4 sm:p-5 max-w-[320px] w-full ${
            reducedMotion ? "" : "transition-transform duration-200"
          }`}
          style={isModalFallback || !overlayPos ? {} : { position: "relative" }}
        >
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="space-y-1">
              <p className="text-[11px] uppercase tracking-[0.16em] text-[var(--sem-text-muted)] font-semibold">
                Step {currentIndex + 1} of {stepCount}
              </p>
              <h3 className="text-base font-semibold leading-tight">{step.title}</h3>
            </div>
            <button
              type="button"
              onClick={handleSkip}
              className="text-xs text-[var(--sem-text-muted)] hover:text-[var(--sem-text-primary)]"
              aria-label="Skip tour"
            >
              Skip
            </button>
          </div>

          <p className="text-sm text-[var(--sem-text-secondary)] leading-relaxed mb-3">{step.body}</p>

          {step.ctaHref && step.ctaLabel ? (
            <a
              href={step.ctaHref}
              className="text-xs font-semibold text-[var(--sem-primary)] hover:text-[var(--sem-primary-hover)]"
            >
              {step.ctaLabel}
            </a>
          ) : null}

          <div className="mt-4 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={handleBack}
              disabled={currentIndex === 0}
              className="rounded-full border border-[var(--sem-border-subtle)] px-3 py-2 text-xs font-medium text-[var(--sem-text-secondary)] disabled:opacity-50"
            >
              Back
            </button>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSkip}
                className="text-xs text-[var(--sem-text-muted)] hover:text-[var(--sem-text-primary)]"
              >
                Skip
              </button>
              <button
                type="button"
                onClick={isLast ? handleComplete : handleNext}
                className="rounded-full bg-[var(--sem-primary)] px-3 py-2 text-xs font-semibold text-[var(--sem-text-inverse)] shadow-sm hover:translate-y-[-1px] transition disabled:opacity-60"
              >
                {isLast ? "Done" : "Next"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <TourContext.Provider value={contextValue}>
      {children}
      {isMounted && overlayContent ? createPortal(overlayContent, document.body) : null}
    </TourContext.Provider>
  );
}

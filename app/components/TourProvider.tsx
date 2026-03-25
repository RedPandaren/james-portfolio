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
};

type TourContextValue = {
  startTour: (force?: boolean) => void;
  stopTour: () => void;
};

const TourContext = createContext<TourContextValue | undefined>(undefined);
const TOUR_KEY = "tourSeen_v1";

const steps: TourStep[] = [
  {
    id: "hero",
    title: "Fintech value prop",
    body: "Fintech-specialized backend engineer; secure payment systems and migrations without breaking contracts.",
    selectors: ["[data-tour=hero]", "#hero"],
  },
  {
    id: "impact",
    title: "Measured impact",
    body: "Uptime, migrations, and security improvements with quantified results.",
    selectors: ["[data-tour=impact]", "#impact"],
  },
  {
    id: "demo",
    title: "Interactive demos",
    body: "Inspect live demos (fraud explainer, encryption visualizer, security testers).",
    selectors: ["#projects"],
  },
  {
    id: "chatbot",
    title: "AI chatbot",
    body: "Ask resume-grounded questions—powered by Gemini with fintech/security context.",
    selectors: ["[data-tour=chatbot-launcher]"]
  },
  {
    id: "contact",
    title: "Contact options",
    body: "Choose intro call, architecture walkthrough, or recruiter thread.",
    selectors: ["[data-tour=contact]", "#contact"],
  },
];

type SpotlightRect = { top: number; left: number; width: number; height: number } | null;

export function useTour() {
  const ctx = useContext(TourContext);
  if (!ctx) throw new Error("useTour must be used within TourProvider");
  return ctx;
}

function findTarget(selectors: string[]): HTMLElement | null {
  if (typeof document === "undefined") return null;
  for (const sel of selectors) {
    const el = document.querySelector<HTMLElement>(sel);
    if (el) return el;
  }
  return null;
}

function storeSeen() {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(TOUR_KEY, "true");
}

function hasSeen(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(TOUR_KEY) === "true";
}

export default function TourProvider({ children }: { children: React.ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [spotlight, setSpotlight] = useState<SpotlightRect>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setIsMounted(true);
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    const force = url.searchParams.get("tour") === "1";
    if (force || !hasSeen()) {
      setIsOpen(true);
      setCurrentIndex(0);
    }
  }, []);

  const startTour = useCallback((force = false) => {
    if (force) {
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(TOUR_KEY);
      }
    }
    setIsOpen(true);
    setCurrentIndex(0);
  }, []);

  const stopTour = useCallback(() => {
    setIsOpen(false);
    setSpotlight(null);
  }, []);

  // Compute spotlight per step
  useEffect(() => {
    if (!isOpen || typeof document === "undefined") return;
    const step = steps[currentIndex];
    const target = findTarget(step.selectors);

    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
      const updateRect = () => {
        const rect = target.getBoundingClientRect();
        setSpotlight({
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
        });
      };
      const frame = requestAnimationFrame(updateRect);
      const handle = () => updateRect();
      window.addEventListener("resize", handle);
      window.addEventListener("scroll", handle, { passive: true });
      return () => {
        cancelAnimationFrame(frame);
        window.removeEventListener("resize", handle);
        window.removeEventListener("scroll", handle);
      };
    }

    setSpotlight(null);
    return;
  }, [isOpen, currentIndex]);

  // Auto-open chatbot on chatbot step
  useEffect(() => {
    if (!isOpen) return;
    if (steps[currentIndex]?.id === "chatbot") {
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("open-chatbot"));
      }
    }
  }, [isOpen, currentIndex]);

  // Keyboard shortcuts
  const handleNext = useCallback(() => {
    if (currentIndex + 1 >= steps.length) {
      storeSeen();
      stopTour();
      return;
    }
    setCurrentIndex((i) => Math.min(i + 1, steps.length - 1));
  }, [currentIndex, stopTour]);

  const handleBack = useCallback(() => {
    setCurrentIndex((i) => Math.max(i - 1, 0));
  }, []);

  const handleSkip = useCallback(() => {
    storeSeen();
    stopTour();
  }, [stopTour]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") stopTour();
      if (e.key === "Enter" && overlayRef.current?.contains(document.activeElement)) {
        e.preventDefault();
        handleNext();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, handleNext, stopTour]);

  const contextValue = useMemo(() => ({ startTour, stopTour }), [startTour, stopTour]);

  const show = isMounted && isOpen;
  const step = steps[currentIndex];
  const stepCount = steps.length;
  const isLast = currentIndex === stepCount - 1;

  const overlay = show ? (
    <div className="fixed inset-0 z-[1000000] pointer-events-auto">
      <style>
        {`
          .tour-spotlight {
            position: fixed;
            border-radius: 14px;
            box-shadow: 0 0 0 3px color-mix(in oklch, var(--sem-primary) 65%, transparent 35%);
            pointer-events: none;
            z-index: 1000002;
          }
        `}
      </style>
      <div className="absolute inset-0 bg-transparent pointer-events-none" />
      {spotlight ? (
        <div
          className="tour-spotlight"
          style={{
            top: spotlight.top,
            left: spotlight.left,
            width: spotlight.width,
            height: spotlight.height,
          }}
        />
      ) : null}
      <div
        className="pointer-events-auto"
        style={{ position: "fixed", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem", zIndex: 1000001 }}
      >
        <div
          ref={overlayRef}
          className={`rounded-2xl border border-[var(--sem-border)] bg-[var(--sem-surface)] text-[var(--sem-text-primary)] shadow-xl p-4 sm:p-5 max-w-[320px] w-full ${
            "transition-transform duration-200"
          } pointer-events-auto`}
          style={{ position: "relative", zIndex: 1000001 }}
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
                onClick={isLast ? () => { storeSeen(); stopTour(); } : handleNext}
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
      {isMounted && overlay ? createPortal(overlay, document.body) : null}
    </TourContext.Provider>
  );
}

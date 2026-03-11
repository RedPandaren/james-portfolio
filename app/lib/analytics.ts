export type AnalyticsPayload = Record<string, string | number | boolean>;

declare global {
  interface Window {
    gtag?: (command: "event", eventName: string, params?: AnalyticsPayload) => void;
    plausible?: (eventName: string, options?: { props?: AnalyticsPayload }) => void;
    dataLayer?: Array<Record<string, unknown>>;
  }
}

function cleanPayload(payload: AnalyticsPayload): AnalyticsPayload {
  return Object.fromEntries(
    Object.entries(payload).filter(([, value]) => value !== undefined)
  ) as AnalyticsPayload;
}

export function trackEvent(eventName: string, payload: AnalyticsPayload = {}): void {
  if (typeof window === "undefined") return;

  const eventPayload = cleanPayload(payload);

  if (window.gtag) {
    window.gtag("event", eventName, eventPayload);
  }

  if (window.plausible) {
    window.plausible(eventName, { props: eventPayload });
  }

  if (Array.isArray(window.dataLayer)) {
    window.dataLayer.push({ event: eventName, ...eventPayload });
  }

  if (process.env.NODE_ENV !== "production") {
    console.info("[analytics]", eventName, eventPayload);
  }
}

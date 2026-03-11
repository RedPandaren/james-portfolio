"use client";

import type { AnchorHTMLAttributes, MouseEventHandler, ReactNode } from "react";
import { trackEvent, type AnalyticsPayload } from "@/app/lib/analytics";

interface TrackedAnchorProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  readonly children: ReactNode;
  readonly eventName?: string;
  readonly eventPayload?: AnalyticsPayload;
}

export default function TrackedAnchor({
  children,
  eventName,
  eventPayload,
  onClick,
  href,
  ...rest
}: TrackedAnchorProps) {
  const handleClick: MouseEventHandler<HTMLAnchorElement> = (event) => {
    if (eventName) {
      trackEvent(eventName, {
        href: href ?? "",
        ...eventPayload,
      });
    }
    onClick?.(event);
  };

  return (
    <a href={href} onClick={handleClick} {...rest}>
      {children}
    </a>
  );
}

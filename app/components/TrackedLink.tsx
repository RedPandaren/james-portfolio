"use client";

import Link, { type LinkProps } from "next/link";
import type {
  AnchorHTMLAttributes,
  MouseEventHandler,
  ReactNode,
} from "react";
import { trackEvent, type AnalyticsPayload } from "@/app/lib/analytics";

interface TrackedLinkProps
  extends LinkProps,
    Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  readonly children: ReactNode;
  readonly eventName?: string;
  readonly eventPayload?: AnalyticsPayload;
}

function hrefToString(href: LinkProps["href"]): string {
  if (typeof href === "string") return href;
  return href.pathname?.toString() ?? "";
}

export default function TrackedLink({
  children,
  eventName,
  eventPayload,
  onClick,
  href,
  ...rest
}: TrackedLinkProps) {
  const handleClick: MouseEventHandler<HTMLAnchorElement> = (event) => {
    if (eventName) {
      trackEvent(eventName, {
        href: hrefToString(href),
        ...eventPayload,
      });
    }
    onClick?.(event);
  };

  return (
    <Link href={href} onClick={handleClick} {...rest}>
      {children}
    </Link>
  );
}

# Problem Statement: Fintech Portfolio Design System

Generated: 2026-01-29 • Detail Level: 3 • BA: Completed

---

## Context

James Florence Conales is a fintech-specialized backend engineer at PETNET, Inc. His portfolio (Next.js 16, React 19, Tailwind CSS v4) must prove he can architect, secure, ship, and sustain production fintech systems end-to-end. The portfolio itself is the first proof point — build quality demonstrates frontend proficiency for a backend-heavy engineer.

**Current state**: Minimal Next.js starter with only two CSS custom properties (`--background`, `--foreground`), Geist Sans/Mono fonts loaded, and ad-hoc Tailwind utilities. No design tokens, no typography scale, no semantic color system, no spacing conventions. Hardcoded hex values scattered across components.

**BA Findings** (user-confirmed):
- **Scope**: Tokens-only design system (CSS variables + Tailwind theme config) — no React component code
- **Aesthetic**: Mercury/Ramp-inspired ultra-minimal + Framer Motion for tasteful interactions
- **Accent**: Deep Blue (`#1a56db`) — classic fintech trust signal
- **Motion**: Minimal micro-interactions (functional transitions + subtle entrance animations for key sections)

---

## Core Problem

The portfolio lacks a systematic design foundation. Without a defined token system, every UI decision is ad-hoc, inconsistent, and unable to deliver the bank-grade, corporate-professional aesthetic required by the mission. The gap between stated design direction (Stripe/Plaid/Mercury-level precision) and current implementation (Next.js starter template defaults) undermines the portfolio's credibility as a proof of engineering judgment.

---

## Impact

- **Credibility gap**: Fintech employers expect visual precision; inconsistent styling signals carelessness
- **Development friction**: Every new component requires re-inventing spacing, colors, and typography decisions
- **Dark mode fragility**: Only 2 CSS variables defined; expanding without a system creates maintenance debt
- **Brand incoherence**: No accent color, no hierarchy, no consistent visual language across pages

---

## Requirements & Acceptance Criteria

1. **Semantic color token system** — Full palette: primary (Deep Blue), neutral scale, surface/background variants, border colors, text hierarchy (primary/secondary/muted), status colors (success/warning/error/info) — all as CSS custom properties with light and dark mode variants
2. **Typography scale** — Defined type scale (6-8 levels) with matching line-heights, letter-spacing, and font-weight tokens for Geist Sans/Mono
3. **Spacing system** — 4px base unit scale documented and tokenized for margins, padding, gaps
4. **Surface & elevation** — Shadow scale, border-radius set, surface color layers for card/modal/overlay patterns
5. **Motion tokens** — Transition durations, easing curves, entrance animation guidelines (Framer Motion compatible)
6. **Tailwind v4 integration** — All tokens registered via `@theme inline` directive in globals.css for native Tailwind utility access
7. **Mercury aesthetic alignment** — Ultra-minimal, near-monochrome base with Deep Blue accent, heavy typography focus, extreme restraint in decoration

---

## Constraints

- Tailwind CSS v4 (CSS-first config via `@theme inline`, no `tailwind.config.js`)
- Next.js 16 App Router with React 19
- Dark mode via `prefers-color-scheme` (system preference)
- Geist Sans (primary) + Geist Mono (code) — no additional fonts
- Tokens only — no React component implementations in this deliverable
- Must be implementable purely through CSS custom properties and Tailwind theme extension

---

## Dependencies

- Existing `app/globals.css` with `@theme inline` directive
- Geist font variables already loaded in `app/layout.tsx`
- Framer Motion will be added as dependency (not part of this deliverable, but tokens must be compatible)

---

## Out of Scope

- React component implementations (Button, Card, etc.)
- Framer Motion code/animations (tokens define values, not implementation)
- Page layouts or content
- Interactive demos
- Storybook or component documentation tooling
- Manual dark mode toggle implementation

---

## Open Questions

None — all critical decisions resolved via BA.

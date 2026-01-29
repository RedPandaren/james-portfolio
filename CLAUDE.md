# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Professional portfolio for James Florence Conales — a fintech-specialized software engineer. Built with Next.js 16 (App Router), React 19, TypeScript 5, and Tailwind CSS v4. See `.specs/MISSION.MD` for full project mission and positioning.

## Commands

```bash
pnpm dev       # Start dev server (port 3000)
pnpm build     # Production build
pnpm start     # Start production server
pnpm lint      # ESLint (Next.js core-web-vitals + TypeScript)
```

Package manager is **pnpm**. No test framework configured yet.

## Architecture

- **Next.js App Router** — all pages under `app/`, file-based routing
- **Path alias**: `@/*` maps to project root
- **Styling**: Tailwind v4 via PostCSS, CSS custom properties for theming (light/dark via `prefers-color-scheme`)
- **Fonts**: Geist Sans + Geist Mono loaded from Google Fonts via `next/font`
- **TypeScript strict mode** enabled

## Design Direction

Corporate-professional, bank-grade aesthetic (Stripe/Plaid). Minimal, typography-driven, no decorative animations. Dark mode supported via system preference. Color system: light (#ffffff/#171717), dark (#0a0a0a/#ededed).

## Key Constraints

- Portfolio must compensate for lack of public repos — use **interactive demos** as proof of capability, not descriptions
- Security-first fintech positioning is the core identity — every design and content decision should reinforce this
- Backend-heavy engineer, frontend-proficient — the portfolio's build quality itself is a proof point
- AI assistant feature is planned but deferred

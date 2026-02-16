# Problem Statement: Portfolio Scaffolding

Generated: 2026-01-29 • Detail Level: 3 • BA: Completed • Investigation: Completed

---

## Context

James Florence Conales is a fintech-specialized backend engineer at PETNET, Inc. His portfolio (Next.js 16, React 19, Tailwind CSS v4) must prove he can architect, secure, ship, and sustain production fintech systems end-to-end. A complete design token system is already implemented in `globals.css` (OKLCH colors, spacing, typography, shadows, motion). The codebase currently contains only the Next.js starter template — no custom components, no content, no sections.

**BA Findings** (user-confirmed):
- **Layout**: Single-page scroll with sticky navigation and smooth section anchors
- **Sections**: Full suite — Hero, About, Experience, Projects/Case Studies, Tech Stack, Contact
- **Projects**: Interactive demos (encryption visualizer, payment flow simulator, etc.) as proof of capability under NDA constraints
- **Content**: Real data from `resume.json` — not placeholders

---

## Core Problem

The portfolio has infrastructure (Next.js, design tokens, fonts) but zero UI — no components, no sections, no navigation, no content. The gap between a complete design token system and an empty `page.tsx` (still showing "Create Next App" template) must be bridged by scaffolding all structural components and populating them with real resume data, producing a functional single-page portfolio that consumes the design system tokens exclusively.

---

## Impact

- **Credibility gap**: An unbuilt portfolio cannot demonstrate capability — the portfolio's own build quality is the first proof point
- **Token system unused**: 80+ design tokens exist but nothing consumes them — no visual validation possible
- **No online presence**: All production work is behind NDAs; without this portfolio, James has no public proof of engineering capability
- **Hiring friction**: Employers cannot evaluate James without a working artifact

---

## Requirements & Acceptance Criteria

1. **Single-page layout** — All sections on one scrollable page with sticky header navigation and smooth anchor scrolling to each section
2. **Six sections implemented** — Hero, About, Experience, Projects/Case Studies, Tech Stack, Contact — each as a distinct component
3. **Design token consumption** — All styling uses semantic tokens from `globals.css` (`bg-primary`, `text-secondary`, `gap-6`, `shadow-sm`, etc.) — zero hardcoded hex/pixel values
4. **Real content** — All sections populated with actual data from `resume.json` (name, role, skills, experience details, achievements, education, contact)
5. **Light/dark mode** — All components render correctly in both modes via `prefers-color-scheme` (no manual toggle required)
6. **Mercury aesthetic** — Ultra-minimal, typography-driven, near-monochrome with Deep Blue accent at <10% visual weight
7. **Interactive demo placeholders** — Projects section includes cards/structure for future interactive demos (encryption visualizer, payment flow simulator, etc.) with clear affordances — actual demo implementation is out of scope
8. **Responsive** — Works on mobile (375px+), tablet, and desktop viewports
9. **Metadata** — Proper `<title>`, `<meta description>`, and Open Graph tags for James's brand

---

## Constraints

- Next.js 16 App Router (React Server Components by default, `"use client"` only when needed)
- React 19 with TypeScript 5 strict mode
- Tailwind CSS v4 via `@theme inline` tokens — no `tailwind.config.js`
- Geist Sans (primary) + Geist Mono (code) — no additional fonts
- Single-page scroll (no separate routes for sections)
- Content sourced from `resume.json` structure
- No external UI libraries (no shadcn, no Radix, no Headless UI) unless explicitly approved

---

## Dependencies

- `app/globals.css` — complete design token system (implemented)
- `app/layout.tsx` — Geist font loading (implemented)
- `.specs/Resume/resume.json` — structured resume data (exists)
- Framer Motion — may be needed for entrance animations (not yet installed)

---

## Out of Scope

- Interactive demo implementations (encryption visualizer, payment flow, etc.) — only card placeholders
- Blog/writing section
- AI assistant feature (deferred per MISSION.MD)
- Manual dark mode toggle
- CMS or content management
- Analytics or tracking
- Deployment configuration

---

## Current State (Investigation Findings)

### Files to Replace
- **`app/page.tsx:3-65`** — Next.js starter placeholder. Full replacement needed.
- **`app/layout.tsx:15-18`** — Metadata still says "Create Next App". Needs James's brand.

### Files Ready to Consume
- **`app/globals.css:1-232`** — Complete design token system: 80+ tokens across colors, spacing, typography, shadows, motion. All registered via `@theme inline` for Tailwind utility generation.
- **`.specs/Resume/resume.json:1-194`** — Structured content: personalInfo, professionalSummary, experience (10 responsibility areas), education, technicalSkills (4 categories with subcategories), coreCompetencies (12 items), achievements (6 metric-driven), platforms.

### Missing Infrastructure
- **No `/components` directory** — all components must be created from scratch
- **No `/lib`, `/utils`, `/hooks`** — utility functions need creation
- **No assets** — `public/` contains only Next.js default SVGs (next.svg, vercel.svg, window.svg, globe.svg, file.svg). Need favicon, potentially profile photo.
- **No test framework** — defer until scaffolding complete

### Token Consumption Pattern
Tailwind v4 `@theme inline` tokens generate utilities. Semantic tokens should be consumed via Tailwind classes:
- Colors: `bg-primary`, `text-text-secondary`, `border-border`
- Spacing: `p-4` (16px), `gap-6` (24px), `m-8` (32px)
- Typography: `text-5xl`, `font-semibold`, `tracking-tight`
- Shadows: `shadow-sm`, `shadow-md`
- Radius: `rounded-md`, `rounded-lg`

### Content Mapping (resume.json → Sections)
| Section | Data Source | Key Fields |
|---------|------------|------------|
| Hero | `personalInfo` + `professionalSummary` | name, title, headline, focus areas |
| About | `professionalSummary` + `achievements` | specialization, 6 metric-driven achievements |
| Experience | `experience[0].keyResponsibilities` | 10 detailed responsibility areas with technical depth |
| Projects | N/A (interactive demos) | Placeholder cards for future demos |
| Tech Stack | `technicalSkills` + `platforms` | 4 skill categories, GCP certification, platform badges |
| Contact | `personalInfo.contact` | email, phone |

### Gotchas
- **App Router default**: Components are Server Components — use `"use client"` only for interactive elements (navigation toggle, scroll behavior)
- **TypeScript strict**: All props and types must be explicitly defined
- **Dark mode**: Automatic via CSS media query — no class toggling needed
- **Experience density**: 10 responsibility areas risk wall-of-text — consider expandable/accordion pattern
- **Path alias**: `@/` maps to project root — use for all imports

---

## Open Questions

None — all critical decisions resolved via BA.

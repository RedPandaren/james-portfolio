# Implementation Plan: Portfolio Scaffolding

## Problem Analysis

The portfolio has complete design infrastructure (80+ Tailwind v4 tokens) but zero UI — `page.tsx` is still the Next.js starter template. This plan scaffolds a functional single-page portfolio with 6 sections, sticky navigation, smooth scroll, real resume content, and Mercury/Ramp aesthetic. Approach: Flat Component Architecture (validated in Exploration.md).

## User Journey

Visitor lands on page → sees Hero (name, title, CTA) → scrolls or clicks nav link → About (summary, achievements) → Experience (responsibility cards) → Projects (interactive demo placeholders) → Tech Stack (categorized skills) → Contact (email, phone) → Footer. Sticky header follows scroll. Smooth anchor scrolling between sections. Light/dark mode automatic.

## Technical Overview

- **Structure**: `app/page.tsx` as section container, flat `app/components/` directory
- **Data**: `app/lib/data.ts` (typed resume exports), `app/lib/types.ts` (TypeScript interfaces)
- **Components**: Header (Client), Hero, About, Experience, Projects, TechStack, Contact, Footer (all Server except Header)
- **Styling**: Tailwind v4 semantic tokens exclusively — zero hardcoded values
- **Dependencies**: None new (existing Next.js 16, React 19, Tailwind v4)

## Impact & Regression Scope

- **Breaking changes**: `page.tsx` fully replaced (starter template removed), `layout.tsx` metadata updated
- **Affected**: `app/page.tsx`, `app/layout.tsx`, new files in `app/components/` and `app/lib/`
- **Ripple effects**: None — additive (no existing components to break)

---

## Implementation Phases

### Phase 1: Foundation — Data Layer, Types, Layout & Navigation

**Status**: [X] Complete

---

#### Context

**Objective**: Establish the data layer (typed resume exports), TypeScript interfaces, updated layout metadata, and sticky navigation component — the foundation all sections depend on.

**Why This Phase**: Every section component needs typed data and a consistent page shell (layout + nav). Must be built first.

**Success Criteria**:
- `app/lib/types.ts` defines all interfaces (PersonalInfo, Experience, Skill, Project, Achievement)
- `app/lib/data.ts` exports typed resume data from `resume.json` structure
- `app/layout.tsx` metadata updated with James's name, role, description, OG tags
- Sticky Header component with nav links to all 6 section anchors
- Mobile-responsive navigation (hamburger menu on small screens)
- `pnpm build` succeeds

---

#### Architecture

**Key Decisions**:
- Static TypeScript data (not JSON import) — better type safety, tree-shaking, Server Component compatible
- Header as Client Component (`"use client"`) — needs scroll state for sticky behavior and mobile toggle
- `scroll-behavior: smooth` on `<html>` element via globals.css — CSS-first scroll, no JS library
- `scroll-margin-top` on sections to offset sticky header height

**Constraints**:
- All types must use `readonly` arrays and objects for immutability
- Header must consume only semantic design tokens
- Mobile nav: simple slide-down menu, no animation library needed

**Dependencies**:
- **Requires**: `globals.css` design tokens (exists), `resume.json` content (exists)
- **Provides**: Data layer + types for all Phase 2/3 section components, page shell for section mounting

---

#### Execution Hints

**Affected Areas**:
- **Types**: Create `app/lib/types.ts`
- **Data**: Create `app/lib/data.ts`
- **Layout**: Modify `app/layout.tsx:15-18` (metadata)
- **Styling**: Add `scroll-behavior: smooth` to `globals.css` base layer
- **Component**: Create `app/components/Header.tsx`

**Contracts**:
```typescript
interface PersonalInfo {
  readonly fullName: string;
  readonly title: string;
  readonly location: string;
  readonly contact: { readonly phone: string; readonly email: string };
}

interface ProfessionalSummary {
  readonly headline: string;
  readonly focus: readonly string[];
  readonly specialization: string;
}

interface ExperienceItem {
  readonly company: string;
  readonly position: string;
  readonly duration: { readonly start: string; readonly end: string };
  readonly description: string;
  readonly keyResponsibilities: readonly {
    readonly area: string;
    readonly details: string;
  }[];
}

interface TechSkillCategory {
  readonly name: string;
  readonly items: readonly string[];
}

interface Achievement {
  readonly key: string;
  readonly label: string;
  readonly value: string;
}

interface NavLink {
  readonly label: string;
  readonly href: string;
}
```

**Logic Pseudo Code**:
```
DATA LAYER:
  DEFINE typed constants matching resume.json structure
  EXPORT personalInfo, professionalSummary, experience, technicalSkills, achievements, coreCompetencies
  ALL data is static — no fetching, no async

HEADER:
  RENDER sticky nav bar with logo (name) + nav links
  ON mobile: toggle hamburger menu (useState for open/close)
  EACH nav link: <a href="#section-id"> with smooth scroll
  STYLE: bg-surface, border-border-subtle, shadow-xs on scroll
```

**Outcome-Focused Tasks**:
- [ ] **TypeScript interfaces**: Define all data types covering resume.json structure.
  - *Affected*: `app/lib/types.ts` (create)
  - *Verify*: No TypeScript errors, all interfaces exported
- [ ] **Typed data exports**: Static constants with resume content, typed with interfaces.
  - *Affected*: `app/lib/data.ts` (create)
  - *Verify*: Import in page.tsx works, data matches resume.json content
- [ ] **Layout metadata**: Update title, description, OG tags for James's brand.
  - *Affected*: `app/layout.tsx:15-18`
  - *Verify*: `<title>` renders "James Florence Conales | Software Engineer" in browser tab
- [ ] **Smooth scroll**: Add `scroll-behavior: smooth` and `scroll-margin-top` to globals.css.
  - *Affected*: `app/globals.css` (base layer)
  - *Verify*: Clicking anchor link scrolls smoothly with header offset
- [ ] **Sticky Header**: Client Component with nav links, mobile toggle, semantic token styling.
  - *Affected*: `app/components/Header.tsx` (create)
  - *Verify*: Header sticks on scroll, mobile menu toggles, all links point to section IDs

**Pattern References**:
- Existing `layout.tsx:5-13` font loading pattern (preserve)
- `globals.css:222-231` base layer pattern (extend)

---

#### Risk Assessment

**Regression Checklist**:
- 🟡 **MEDIUM**: Layout metadata change. Check: Verify page still renders after metadata update
- 🟡 **MEDIUM**: globals.css modification. Check: Existing tokens unaffected, `pnpm build` passes

**Breaking Changes**: None — additive files, metadata-only change to layout.

---

#### Testing

- [ ] `pnpm build` succeeds
- [ ] `pnpm lint` passes
- [ ] Header renders sticky on scroll in dev server
- [ ] Mobile menu opens/closes
- [ ] All nav links present (Hero, About, Experience, Projects, Tech Stack, Contact)

**Commands**: `pnpm build && pnpm lint`

---

### Phase 2: Content Sections — Hero, About, Experience

**Status**: [X] Complete

---

#### Context

**Objective**: Build the three narrative-heavy sections — Hero (first impression), About (professional identity + achievements), Experience (PETNET responsibilities) — all as Server Components consuming typed data and design tokens.

**Why This Phase**: These sections form the portfolio's core narrative arc. Hero → About → Experience tells the story: who James is, what he's accomplished, and how he works. Must precede Projects/Skills which are more technical/visual.

**Success Criteria**:
- Hero section with name, headline, focus areas, and CTA button (scroll to Contact)
- About section with professional summary and 6 achievement metric cards
- Experience section with PETNET role header and 10 expandable responsibility areas
- All sections use semantic tokens exclusively
- Responsive on mobile (375px+), tablet, desktop
- Light/dark mode renders correctly

---

#### Architecture

**Key Decisions**:
- Hero: Full-viewport height, large typography (text-5xl name, text-xl subtitle), Deep Blue CTA button
- About: Two-column layout (summary left, achievement grid right) on desktop, stacked on mobile
- Experience: Timeline or card-based layout for 10 responsibility areas — avoid wall-of-text
- All three are Server Components (no interactivity needed)

**Constraints**:
- Mercury aesthetic: typography-driven, minimal decoration, generous whitespace
- Deep Blue accent <10% visual weight (CTA button, links only)
- Achievement metrics: use `font-mono` for numbers (fintech precision feel)

**Dependencies**:
- **Requires**: Phase 1 (data layer, types, Header, smooth scroll)
- **Provides**: Core narrative sections for page.tsx assembly

---

#### Execution Hints

**Affected Areas**:
- **Components**: Create `app/components/Hero.tsx`, `app/components/About.tsx`, `app/components/Experience.tsx`
- **Page**: Modify `app/page.tsx` — replace starter template with section imports

**Logic Pseudo Code**:
```
HERO:
  RENDER full-height section with vertical center
  DISPLAY personalInfo.fullName (text-5xl, tracking-tighter, font-bold)
  DISPLAY professionalSummary.headline (text-xl, text-text-secondary)
  RENDER focus areas as subtle pill badges
  CTA button: "Get in Touch" → scrolls to #contact (bg-primary, text-text-inverse)

ABOUT:
  SECTION with id="about"
  LEFT column: specialization paragraph + short narrative
  RIGHT column: 2x3 grid of achievement cards
    EACH card: metric value (font-mono, text-2xl, text-primary) + label (text-sm, text-text-muted)

EXPERIENCE:
  SECTION with id="experience"
  HEADER: company name, position, duration
  GRID/LIST of responsibility cards:
    EACH card: area title (font-semibold) + details paragraph
    CONSIDER: collapsible on mobile (show first 4, "Show more" toggle)

PAGE.TSX:
  IMPORT Header, Hero, About, Experience
  RENDER in order within <main>
  EACH section gets id attribute matching nav links
```

**Outcome-Focused Tasks**:
- [ ] **Hero section**: Full-viewport intro with name, headline, focus badges, CTA.
  - *Affected*: `app/components/Hero.tsx` (create)
  - *Verify*: Name renders at text-5xl, CTA scrolls to contact, responsive on mobile
- [ ] **About section**: Professional summary + 6 achievement metric cards in grid.
  - *Affected*: `app/components/About.tsx` (create)
  - *Verify*: Achievement values use font-mono, 2-column on desktop, stacked on mobile
- [ ] **Experience section**: PETNET role with 10 responsibility cards.
  - *Affected*: `app/components/Experience.tsx` (create)
  - *Verify*: All 10 areas render, readable layout, not wall-of-text
- [ ] **Page assembly**: Replace starter template, import and render sections in order.
  - *Affected*: `app/page.tsx` (full replace)
  - *Verify*: Page renders Hero → About → Experience in order, section IDs match nav links

---

#### Risk Assessment

**Regression Checklist**:
- 🟠 **HIGH**: Full page.tsx replacement. Check: `pnpm build` passes, page renders in browser
- 🟡 **MEDIUM**: Responsive breakpoints. Check: Test at 375px, 768px, 1280px widths

**Breaking Changes**: `page.tsx` fully replaced — starter template removed permanently.

---

#### Testing

- [ ] `pnpm build` succeeds
- [ ] All 3 sections render with correct content from data layer
- [ ] Light and dark mode both render correctly
- [ ] Mobile responsive (375px) — no horizontal overflow
- [ ] Nav links scroll to correct sections

**Commands**: `pnpm build`

---

### Phase 3: Remaining Sections — Projects, Tech Stack, Contact & Footer

**Status**: [X] Complete

---

#### Context

**Objective**: Complete the portfolio with Projects (interactive demo placeholder cards), Tech Stack (categorized skills), Contact (email/phone CTA), and Footer — producing a fully functional single-page portfolio.

**Why This Phase**: These sections complete the visitor journey. Projects proves capability, Tech Stack shows breadth, Contact enables action, Footer provides closure. Depends on Phase 2 page assembly being in place.

**Success Criteria**:
- Projects section with 3-4 interactive demo placeholder cards (encryption visualizer, payment flow simulator, etc.) with clear "Coming Soon" or "Demo" affordances
- Tech Stack section with 4 categorized skill groups (Backend, Cloud, Security, Frontend/Observability) + platform badges
- Contact section with email, phone, and professional CTA
- Footer with copyright, minimal links
- Complete single-page portfolio renders end-to-end
- All sections responsive and light/dark compatible
- `pnpm build` and `pnpm lint` pass

---

#### Architecture

**Key Decisions**:
- Projects: Card grid with title, description, tech tags, and status indicator (placeholder for future demos). Cards use `bg-surface`, `border-border`, `rounded-lg`
- Tech Stack: 4-column grid on desktop (one per category), pills/badges for individual technologies. GCP certification highlighted with `bg-primary-muted` badge
- Contact: Minimal — large heading + email link (text-link color) + phone. No form (keep minimal, avoid Client Component)
- Footer: Single line — name, year, "Built with Next.js" (optional)

**Constraints**:
- Project cards must clearly indicate "interactive demo" intent without actual implementation
- Tech Stack must match resume.json `technicalSkills` structure exactly
- Contact must not include a form (avoids Client Component complexity for v1)

**Dependencies**:
- **Requires**: Phase 2 (page assembly with Hero/About/Experience already rendering)
- **Provides**: Complete portfolio — all 6 sections + footer

---

#### Execution Hints

**Affected Areas**:
- **Components**: Create `app/components/Projects.tsx`, `app/components/TechStack.tsx`, `app/components/Contact.tsx`, `app/components/Footer.tsx`
- **Page**: Modify `app/page.tsx` — add remaining section imports

**Logic Pseudo Code**:
```
PROJECTS:
  SECTION with id="projects"
  HEADING: "Projects" or "Interactive Demos"
  SUBTEXT: "Proving capability through working software — not descriptions"
  GRID of 3-4 cards:
    Card 1: "Encryption Visualizer" — Cloud KMS, HMAC/RSA signing flow
    Card 2: "Payment Flow Simulator" — EMI migration, transaction lifecycle
    Card 3: "API Security Tester" — Request signing, payload encryption
    Card 4: "System Architecture Explorer" — Microservices, state machines (optional)
  EACH card: title, description, tech tags (font-mono, text-xs), status badge ("Coming Soon")
  STYLE: bg-surface, border-border, rounded-lg, shadow-xs on hover

TECH STACK:
  SECTION with id="tech-stack"
  4 category columns from technicalSkills:
    - Backend Architecture (core + patterns + system design)
    - Cloud Infrastructure (compute + devops + storage + certification badge)
    - Security & Compliance (cryptography + identity + remediation)
    - Frontend & Observability (frontend + observability)
  EACH skill: pill badge (bg-surface-raised, text-sm, rounded-full)
  GCP Certified: highlighted badge (bg-primary-muted, text-primary)

CONTACT:
  SECTION with id="contact"
  HEADING: "Let's Connect" or "Get in Touch"
  EMAIL: mailto link (text-link, underline on hover)
  PHONE: tel link
  LOCATION: Quezon City, Metro Manila
  STYLE: centered, generous spacing, minimal

FOOTER:
  SEMANTIC <footer> element
  COPYRIGHT: "© 2026 James Florence Conales"
  STYLE: border-t border-border-subtle, text-text-muted, text-sm
```

**Outcome-Focused Tasks**:
- [ ] **Projects section**: 3-4 interactive demo placeholder cards with titles, descriptions, tech tags, "Coming Soon" badges.
  - *Affected*: `app/components/Projects.tsx` (create)
  - *Verify*: Cards render in grid, responsive, clearly indicate future demos
- [ ] **Tech Stack section**: 4 categorized skill groups with pill badges, GCP certification highlight.
  - *Affected*: `app/components/TechStack.tsx` (create)
  - *Verify*: All skills from resume.json render, 4-column desktop / stacked mobile
- [ ] **Contact section**: Email, phone, location with professional CTAs.
  - *Affected*: `app/components/Contact.tsx` (create)
  - *Verify*: Email/phone links work (mailto:, tel:), centered layout
- [ ] **Footer**: Copyright line with year.
  - *Affected*: `app/components/Footer.tsx` (create)
  - *Verify*: Renders at page bottom, subtle styling
- [ ] **Complete page assembly**: All 6 sections + footer render in correct order.
  - *Affected*: `app/page.tsx` (modify — add imports)
  - *Verify*: Full scroll from Hero → Footer works, all nav links functional

---

#### Risk Assessment

**Regression Checklist**:
- 🟡 **MEDIUM**: Adding sections to page.tsx. Check: Existing Hero/About/Experience sections still render correctly
- 🟡 **MEDIUM**: Project card content is fabricated (not from resume.json). Check: Descriptions accurately reflect James's actual capabilities

**Breaking Changes**: None — additive components added to existing page.

---

#### Testing

- [ ] `pnpm build` succeeds
- [ ] `pnpm lint` passes
- [ ] Complete portfolio scrolls Hero → About → Experience → Projects → Tech Stack → Contact → Footer
- [ ] All 6 nav links scroll to correct sections
- [ ] Light and dark mode render correctly for all sections
- [ ] Mobile responsive (375px) — no overflow, readable layout
- [ ] All achievement data, skills, experience entries match resume.json

**Commands**: `pnpm build && pnpm lint`

---

## Final Validation

- [ ] `pnpm build` — zero errors
- [ ] `pnpm lint` — zero warnings
- [ ] Complete single-page portfolio renders all 6 sections + header + footer
- [ ] All content matches resume.json data
- [ ] Sticky navigation works with smooth scroll to all sections
- [ ] Light mode renders Mercury-minimal aesthetic
- [ ] Dark mode — all tokens swap correctly
- [ ] Mobile (375px), tablet (768px), desktop (1280px) — responsive
- [ ] No hardcoded hex/pixel values — all semantic tokens
- [ ] Metadata correct: title, description, OG tags

## Execution Tracking

Plan is guidance only. Mark `[x]` when done. "mark phase X complete" → checkboxes + summary appended.

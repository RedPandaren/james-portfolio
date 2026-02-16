# Implementation Plan: Fintech Portfolio Design System (Tokens-Only)

## Problem Analysis

The portfolio lacks a systematic design foundation. Only 2 CSS custom properties exist (`--background`, `--foreground`) with ad-hoc Tailwind utilities and hardcoded hex values. A tokens-only design system in `globals.css` via Tailwind v4 `@theme inline` will establish the full visual language: semantic colors (Deep Blue #1a56db accent, Mercury/Ramp neutral palette), typography scale (Geist Sans/Mono), spacing (4px base), surfaces/elevation, and motion tokens — all as CSS custom properties generating Tailwind utilities.

**Approach**: Pure CSS Custom Properties + `@theme inline` in single `globals.css` file (validated in Exploration.md).

## User Journey

Developers (James) open `globals.css` → see complete token system organized by category → use generated Tailwind utilities (`bg-primary`, `text-heading-1`, `shadow-surface`) → dark mode works automatically via `prefers-color-scheme` → motion tokens consumed by Framer Motion or CSS transitions.

## Technical Overview

- **Single file**: `app/globals.css` (~250-350 lines)
- **Tailwind v4**: `@theme inline` registers tokens as utilities
- **Dark mode**: `@media (prefers-color-scheme: dark)` with `@theme inline` overrides
- **Color space**: OKLCH for perceptually uniform palette
- **Dependencies**: None new (Tailwind v4 already installed)
- **Integration**: All existing Tailwind utilities continue working; new semantic utilities added

## Impact & Regression Scope

- **Breaking changes**: None — additive only, existing classes preserved
- **Affected**: `app/globals.css` (modified), all future components (consume tokens)
- **Ripple effects**: Existing page.tsx inline hex values become candidates for token replacement (deferred)

---

## Implementation Phases

### Phase 1: Color System — Primitive & Semantic Tokens

**Status**: [X] Complete

---

#### Context

**Objective**: Define the complete color token system — Deep Blue primary palette, neutral gray scale, semantic mappings, and dark mode overrides — all registered with Tailwind v4.

**Why This Phase**: Colors are the foundation. Typography, surfaces, and elevation all reference color tokens. Must be established first.

**Success Criteria**:
- Deep Blue (#1a56db) palette with 10 shades (50-950) in OKLCH
- Neutral gray palette with 11 shades (50-950) in OKLCH
- Semantic tokens: primary, text (primary/secondary/muted), background, surface, border, status (success/warning/error/info)
- All dark mode variants defined
- `bg-primary`, `text-secondary`, `border-default` etc. work as Tailwind utilities

---

#### Architecture

**Key Decisions**:
- OKLCH color space for perceptually uniform lightness across palette (Tailwind v4 default, better dark mode transitions)
- Three-tier tokens: primitive (`--color-blue-600`) → semantic (`--color-primary`) registered via `@theme inline`
- Mercury aesthetic: neutral base dominates, Deep Blue accent < 10% visual weight

**Constraints**:
- Must use `@theme inline` (not `@theme`) because semantic tokens reference primitive variables
- Tailwind v4 namespace: `--color-*` generates `bg-*`, `text-*`, `border-*` utilities

**Dependencies**:
- **Requires**: None (first phase)
- **Provides**: Color tokens for Phase 2 (surfaces reference colors) and Phase 3 (typography references text colors)

---

#### Execution Hints

**Affected Areas**:
- **Styling**: `app/globals.css` — replace existing minimal `:root` block with full token system

**Contracts**:
```css
/* Primitive layer */
--color-blue-50 through --color-blue-950  /* Deep Blue palette */
--color-gray-50 through --color-gray-950  /* Neutral palette */

/* Semantic layer (light) */
--color-primary, --color-primary-hover, --color-primary-muted
--color-background, --color-surface, --color-surface-raised
--color-text-primary, --color-text-secondary, --color-text-muted
--color-border, --color-border-subtle
--color-success, --color-warning, --color-error, --color-info

/* Dark mode overrides all semantic tokens */
```

**Logic Pseudo Code**:
```
DEFINE primitive tokens in @theme inline:
  Deep Blue scale: oklch(L C H) where H≈264, vary L from 0.97 to 0.15
  Neutral scale: oklch(L 0 0) — zero chroma for true neutrals

DEFINE semantic tokens in @theme inline:
  Map primitives to intent (primary→blue-600, background→white, text-primary→gray-900)

IN @media (prefers-color-scheme: dark):
  OVERRIDE semantic tokens only (primitives stay, mappings change)
  background→gray-950, text-primary→gray-50, surface→gray-900, border→gray-800
```

**Outcome-Focused Tasks**:
- [ ] **Deep Blue primitive palette**: 10 OKLCH shades (50-950) derived from #1a56db base.
  - *Affected*: `app/globals.css`
  - *Verify*: `bg-blue-600` renders as #1a56db in browser DevTools
- [ ] **Neutral gray primitive palette**: 11 OKLCH shades (50-950), zero chroma.
  - *Affected*: `app/globals.css`
  - *Verify*: Grays appear neutral (no color cast) in both light/dark
- [ ] **Semantic color tokens (light mode)**: All intent-based tokens mapped to primitives.
  - *Affected*: `app/globals.css`
  - *Verify*: `bg-primary`, `text-secondary`, `border-default` generate correct utilities
- [ ] **Dark mode semantic overrides**: All semantic tokens re-mapped for dark theme.
  - *Affected*: `app/globals.css`
  - *Verify*: Toggle system dark mode → all semantic colors swap correctly
- [ ] **Status colors**: Success (green), warning (amber), error (red), info (blue) with light/dark variants.
  - *Affected*: `app/globals.css`
  - *Verify*: `text-success`, `bg-error` render distinct, accessible colors

**Pattern References**:
- Existing `@theme inline` block in `globals.css:8-13`
- Existing dark mode block in `globals.css:15-20`

---

#### Risk Assessment

**Regression Checklist**:
- 🟡 **MEDIUM**: Existing `--background`/`--foreground` variables replaced. Check: Verify page.tsx still renders correctly
- 🟡 **MEDIUM**: OKLCH browser support. Check: 96%+ global support per caniuse, fallback not needed

**Breaking Changes**: None — existing Tailwind default utilities (`bg-white`, `text-zinc-600`) still work alongside new semantic tokens.

---

#### Testing

- [ ] `pnpm build` succeeds (no CSS compilation errors)
- [ ] Light mode: verify 5+ semantic tokens in DevTools computed styles
- [ ] Dark mode: toggle system preference, verify all semantic tokens swap
- [ ] Existing page.tsx renders without visual regression

---

### Phase 2: Spacing, Surfaces & Elevation Tokens

**Status**: [X] Complete

---

#### Context

**Objective**: Define spacing scale (4px base), border-radius set, shadow elevation scale, and surface layer tokens for card/section patterns.

**Why This Phase**: Spacing and surfaces define the structural grid. Must precede typography (which defines vertical rhythm using spacing tokens).

**Success Criteria**:
- Semantic spacing tokens (xs through 3xl) mapped to 4px base
- Border-radius set (none, sm, md, lg, full)
- Shadow scale (none, xs, sm, md, lg) — Mercury-minimal (prefer borders over shadows)
- Surface tokens: default, raised, overlay with appropriate backgrounds

---

#### Architecture

**Key Decisions**:
- 4px base unit (industry standard, Tailwind default compatible)
- Mercury aesthetic: shadows are minimal — 0-2 levels max, prefer 1px borders
- Surface hierarchy through subtle background color shifts, not heavy shadows
- Semantic spacing names (not numeric) for intent clarity

**Constraints**:
- `--spacing-*` namespace generates `p-*`, `m-*`, `gap-*` utilities
- `--radius-*` namespace generates `rounded-*` utilities
- `--shadow-*` namespace generates `shadow-*` utilities

**Dependencies**:
- **Requires**: Phase 1 (surface colors reference color tokens)
- **Provides**: Spacing/layout foundation for Phase 3 typography vertical rhythm

---

#### Execution Hints

**Affected Areas**:
- **Styling**: `app/globals.css` — add spacing, radius, shadow, surface tokens to `@theme inline`

**Contracts**:
```css
/* Spacing (semantic) */
--spacing-xs: 4px;   --spacing-sm: 8px;   --spacing-md: 16px;
--spacing-lg: 24px;  --spacing-xl: 32px;  --spacing-2xl: 48px;
--spacing-3xl: 64px;

/* Radius */
--radius-sm: 4px;  --radius-md: 8px;  --radius-lg: 12px;

/* Shadow (Mercury-minimal) */
--shadow-xs: 0 1px 2px oklch(0 0 0 / 0.05);
--shadow-sm: 0 2px 4px oklch(0 0 0 / 0.06);
--shadow-md: 0 4px 8px oklch(0 0 0 / 0.08);
```

**Outcome-Focused Tasks**:
- [ ] **Semantic spacing tokens**: xs through 3xl (7 levels, 4px base).
  - *Affected*: `app/globals.css`
  - *Verify*: `gap-lg` resolves to 24px in DevTools
- [ ] **Border-radius tokens**: sm/md/lg/full set.
  - *Affected*: `app/globals.css`
  - *Verify*: `rounded-md` renders 8px radius
- [ ] **Shadow elevation scale**: xs/sm/md (Mercury-minimal).
  - *Affected*: `app/globals.css`
  - *Verify*: `shadow-sm` produces subtle, low-contrast shadow
- [ ] **Dark mode shadow/surface adjustments**: Darker shadows, adjusted surface layers.
  - *Affected*: `app/globals.css`
  - *Verify*: Cards look distinct from background in both modes

---

#### Risk Assessment

**Regression Checklist**:
- 🟡 **MEDIUM**: Custom spacing tokens may conflict with Tailwind defaults. Check: Verify `p-4` (Tailwind default 16px) still works alongside `p-md` (semantic 16px)

**Breaking Changes**: None — additive.

---

#### Testing

- [ ] `pnpm build` succeeds
- [ ] Spacing utilities generate correct pixel values
- [ ] Shadows render with Mercury-level subtlety (near-invisible in light mode)

---

### Phase 3: Typography Scale & Motion Tokens

**Status**: [X] Complete

---

#### Context

**Objective**: Define 8-level typography scale with line-heights, letter-spacing, and font-weights for Geist Sans/Mono. Add motion duration and easing tokens compatible with Framer Motion and CSS transitions. Add `prefers-reduced-motion` accessibility.

**Why This Phase**: Typography is the primary visual differentiator in Mercury aesthetic. Motion tokens complete the system. Both depend on color and spacing being established.

**Success Criteria**:
- 8-level type scale (xs through 5xl) with matched line-heights
- Letter-spacing tokens (tight for headings, normal for body, wide for labels)
- Font-weight tokens (normal, medium, semibold, bold)
- 3 motion durations (quick/standard/elaborate) + 3 easings (productive/expressive/entrance)
- `prefers-reduced-motion` reduces/eliminates all transitions
- Geist Sans wired as `font-sans`, Geist Mono as `font-mono`

---

#### Architecture

**Key Decisions**:
- Scale ratio 1.2 (major third) — conservative, fintech-appropriate
- Mercury typography: large headlines (48px+), restrained body (16px), small labels (12-14px)
- Motion tokens as `:root` custom properties (not `@theme`) — Framer Motion reads via `getComputedStyle()`
- `@media (prefers-reduced-motion: reduce)` sets all durations to 0ms

**Constraints**:
- `--text-*` namespace generates `text-*` size utilities
- `--font-*` namespace generates `font-*` family utilities
- `--leading-*` generates `leading-*` utilities
- `--tracking-*` generates `tracking-*` utilities
- Motion values must be consumable by both CSS `transition` and Framer Motion `transition` prop

**Dependencies**:
- **Requires**: Phase 1 (text colors), Phase 2 (spacing for vertical rhythm)
- **Provides**: Complete design system ready for component development

---

#### Execution Hints

**Affected Areas**:
- **Styling**: `app/globals.css` — add typography and motion tokens
- **Layout**: `app/layout.tsx` — verify Geist font variables are correctly consumed

**Contracts**:
```css
/* Typography scale */
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 1.875rem;  /* 30px */
--text-4xl: 2.25rem;   /* 36px */
--text-5xl: 3rem;      /* 48px */

/* Motion */
--duration-quick: 120ms;
--duration-standard: 280ms;
--duration-elaborate: 450ms;
--ease-productive: cubic-bezier(0.2, 0, 0, 1);
--ease-expressive: cubic-bezier(0.4, 0, 0.2, 1);
--ease-entrance: cubic-bezier(0, 0, 0.2, 1);
```

**Outcome-Focused Tasks**:
- [ ] **Typography scale**: 8 levels (xs-5xl) with matched line-heights and letter-spacing.
  - *Affected*: `app/globals.css`
  - *Verify*: `text-5xl` renders 48px Geist Sans, `leading-tight` at 1.2
- [ ] **Font-weight tokens**: normal (400), medium (500), semibold (600), bold (700).
  - *Affected*: `app/globals.css`
  - *Verify*: `font-semibold` renders correctly with Geist Sans
- [ ] **Geist font registration**: Wire `--font-geist-sans` → `--font-sans`, `--font-geist-mono` → `--font-mono`.
  - *Affected*: `app/globals.css`
  - *Verify*: `font-sans` applies Geist Sans (not Arial fallback)
- [ ] **Motion duration tokens**: quick/standard/elaborate as `:root` custom properties.
  - *Affected*: `app/globals.css`
  - *Verify*: `var(--duration-standard)` resolves to 280ms in DevTools
- [ ] **Motion easing tokens**: productive/expressive/entrance curves.
  - *Affected*: `app/globals.css`
  - *Verify*: `transition: all var(--duration-standard) var(--ease-productive)` animates smoothly
- [ ] **Reduced motion accessibility**: `@media (prefers-reduced-motion: reduce)` zeroes all durations.
  - *Affected*: `app/globals.css`
  - *Verify*: Enable reduced motion in OS → transitions are instant

**Pattern References**:
- Material Design 3 duration/easing standards
- Existing font loading in `app/layout.tsx:5-13`

---

#### Risk Assessment

**Regression Checklist**:
- 🟡 **MEDIUM**: Typography scale may override Tailwind defaults. Check: `text-lg` still works as expected
- 🟡 **MEDIUM**: Font registration. Check: `font-sans` resolves to Geist Sans, not system sans-serif

**Breaking Changes**: None — additive. Existing text utilities continue working.

---

#### Testing

- [ ] `pnpm build` succeeds
- [ ] `pnpm dev` — verify all typography levels render in browser
- [ ] Dark mode + reduced motion combination works correctly
- [ ] Full design system audit: count total tokens, verify all generate Tailwind utilities
- [ ] Existing `page.tsx` renders without visual regression

---

## Final Validation

- [ ] `pnpm build` — zero errors
- [ ] All semantic Tailwind utilities available (`bg-primary`, `text-secondary`, `gap-lg`, `shadow-sm`, `text-5xl`, etc.)
- [ ] Light mode renders Mercury-minimal aesthetic
- [ ] Dark mode — all tokens swap correctly
- [ ] Reduced motion — all transitions disabled
- [ ] Token count: ~80-100 custom properties total
- [ ] No visual regressions on existing page

## Execution Tracking

Plan is guidance only. Mark `[x]` when done. "mark phase X complete" → checkboxes + summary appended.

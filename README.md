James Florence Conales — CV / Portfolio Overview
================================================

Bank-grade fintech/security portfolio built with Next.js 16 (App Router), React 19, TypeScript 5, and Tailwind CSS v4. The site functions as an interactive CV: the AI chatbot is grounded in the bundled resume JSON and answers with resume-only facts.

Profile snapshot
----------------
- Fintech-specialized backend engineer (PETNET, Inc.).
- Security-first mindset; strict data handling and prompt redaction in AI flows.
- Communicates impact concisely; favors measurable outcomes over fluff.

Interactive CV features
-----------------------
- AI chatbot: Gemini-backed, seeded with `specs/Resume/resume.json`, greeting shortcut, and prompt hygiene (PII/contact refusals).
- Design system: Tailwind v4 tokens with light/dark via `prefers-color-scheme`, Stripe/Plaid-style polish.
- Guided tour hooks: `data-tour` attributes for the product walkthrough.

Run locally (for reviewers)
---------------------------
- Install deps: `pnpm install`
- Dev server: `pnpm dev` (http://localhost:3000)
- Lint: `pnpm lint`
- Production preview: `pnpm build` then `pnpm start`

Hosting notes
-------------
- AI requires a Gemini API key; add it to your hosting provider’s secret store (keep env files out of git).
- The resume JSON is imported from `specs/Resume/resume.json` at build time; keep it present and case-correct to avoid build failures.

Code map
--------
- `app/` — App Router pages and components (e.g., `components/ChatbotWidget.tsx`).
- `app/api/chat/` — Chatbot API route.
- `app/lib/` — Persona, resume context, Gemini client.
- `specs/Resume/resume.json` — Sanitized resume source consumed by the chatbot.

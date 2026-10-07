# Portfolio Project Handoff Summary

**Scope:** Audit-only onboarding of the supplied portfolio archive. No feature code was written. The only project change in this audit is this handoff document; environment setup was completed separately with development placeholders only.

## 1. Project overview

ASFAKUL SIAM — Digital Design House is a Next.js portfolio and lightweight CMS for a solo designer/developer. Its core idea is **“One Identity. Multiple Moods.”**: the same CMS-backed portfolio is presented through Quiet, Editorial, and Play art directions.

**Stack verified in `package.json`:** Next.js 16.3.3, React 19, GSAP 3.15, Lenis 1.3.26, MongoDB Node driver 7.7, NextAuth 5 beta.32, Cloudinary 2.11, Resend 6.32, Zod 4, pnpm 12.3.4.

## 2. Phase status and repository provenance

The onboarding instructions are the controlling status source: Phases 0–3 are closed, Phase 4 is closed as-is, and this audit must stop before Phase 5 until the owner reviews the handoff. The imported Git checkout contains only `main` and `origin/main` at `9b3d66c`; its parent is `bbd4e4a`. Historical per-phase branch/commit references are not available in this archive, so they cannot be honestly mapped to individual phases.

| Phase | Status | Branch / commit available in this archive |
|---|---|---|
| 0 — Audit & baseline | CLOSED | Historical phase ref unavailable; current snapshot `main@9b3d66c` |
| 1 — Shell & information architecture | CLOSED | Historical phase ref unavailable; current snapshot `main@9b3d66c` |
| 2 — Motion engine | CLOSED | Historical phase ref unavailable; current snapshot `main@9b3d66c` |
| 2.5 — Story script & storyboard | CLOSED | Historical phase ref unavailable; current snapshot `main@9b3d66c` |
| 3 — Showcase & storytelling | CLOSED | Historical phase ref unavailable; current snapshot `main@9b3d66c` |
| 4 — Three moods / three designs | CLOSED AS-IS | Historical phase ref unavailable; current snapshot `main@9b3d66c` |
| 5 — 3D & signature moments | NOT STARTED | No phase-specific ref available |
| 6 — Micro-interactions & transitions | NOT STARTED | No phase-specific ref available |
| 7 — Mobile experience & performance | NOT STARTED | No phase-specific ref available |
| 8 — Data, security & CRUD hardening | NOT STARTED | No phase-specific ref available |
| 9 — Platform & SEO | NOT STARTED | No phase-specific ref available |
| 10 — QA & award readiness | NOT STARTED | No phase-specific ref available |

The working tree was clean before this document was added.

## 3. What is built

### Story acts

The home route renders the seven-act story structure:

1. **Arrival** — plain-to-designed introduction.
2. **The problem** — sameness and forgettable web experiences.
3. **The turn** — one identity shown through three moods.
4. **Proof** — selected work and links to `/work`.
5. **How it is made** — design, understanding, and building capabilities.
6. **Trust** — reviews and social proof.
7. **Invitation** — contact CTA and next step.

The `/work` archive currently renders an empty state; no published project slug was available to test.

### Mood system

`lib/mood/moods.ts` is the single mood configuration. Quiet uses warm paper, rust accents, restrained spacing and a serif/sans pairing; Editorial uses near-black, cream, orange accents, a visible grid and a chaptered layout; Play uses cobalt, acid-lime accents, oversized type, mono body text and a collage-oriented layout. The configuration also carries layout, cursor, navigation, image-treatment and motion presets. In the preview, the default Editorial mood and switching to Quiet and Play rendered; the owner-only blur acceptance test was not run.

### Motion system

`lib/motion/gsap.ts` registers ScrollTrigger, SplitText, Flip, Observer, CustomEase, DrawSVGPlugin, MorphSVGPlugin, MotionPathPlugin, ScrollToPlugin and `useGSAP`; it defines reduced-motion, hover and desktop-motion queries plus custom easing curves. Confirmed reusable primitives include Reveal, StaggerGroup, TextSplit, ScrollText, Parallax and ImageReveal, with additional motion components for glyphs, scroll reset and smooth scrolling. The MorphSVG plugin is registered; actual use for every intended transition was not verified.

### CMS and admin

The registry-driven admin uses `/admin/[collection]` and a shared `CollectionEditor`; `/admin/messages` is a separate contact inbox. Registry entries map to:

- `projects`, `reviews`, `skills`, `memes`
- `socials` → MongoDB `social_links`
- `characters` → MongoDB `character_moments`
- `contactMessages` → MongoDB `contact_messages`
- `media` → MongoDB `media_assets`
- `about`, `settings`, `now`, and `moods` → the `singletons` collection

The admin editor is schema-driven and serializes basic text, tags, image, and gallery values. The current project model is shallower than the full Phase 3 case-study schema described in the brief.

### MongoDB indexes

`lib/db/indexes.ts` currently declares:

| Collection key | Indexes |
|---|---|
| `projects` | Unique `slug`; `(status, featured, order)` public ordering |
| `reviews` | `(status, featured, order)` public ordering |
| `skills` | `(active, category, order)` |
| `socials` | `(active, order)` — **does not match** registry collection `social_links` |
| `memes` | `(active, placement, order)` |
| `characters` | `(active, placement, order)` — **does not match** registry collection `character_moments` |
| `contact_messages` | `createdAt` descending; unique `idempotencyKey` |
| `rate_limits` | Unique `(key, windowStart)`; TTL on `windowStart` after 900 seconds |
| `revoked_sessions` | Unique `sessionId` |
| `singletons` | Unique `key` |

No `media_assets` index is declared. The `socials` and `characters` index-name mismatch is a verified code-level discrepancy to resolve in its planned hardening phase, not in this audit.

### Authentication

`auth.ts` configures NextAuth credentials authentication. Email/password are Zod-validated; password verification uses bcryptjs against `ADMIN_PASSWORD_HASH`; login attempts are rate-limited; sessions use JWT strategy with a 12-hour max age and a revoked-session check. The authorization callback protects `/admin` except `/admin/login`, with `ADMIN_DEV_BYPASS` available only outside production. The `/admin` runtime check redirected to the login page. `auth.ts` still reads several environment values directly, and the JWT callback checks revocation on each request; these remain documented hardening considerations.

### Repo map

- **Public routes:** `/`, `/work`, `/work/[slug]`, `/about`, `/reviews`, `/contact`; `/design` is the motion/design reference route.
- **Admin/API:** `/admin`, `/admin/[collection]`, `/admin/login`, `/admin/messages`, `/api/auth/[...nextauth]`, `/api/health`; `app/robots.ts` provides robots metadata.
- **UI:** `components/site/` contains the story, navigation, work, contact, about, reviews, and footer surfaces; `components/mood/` owns mood state/cursor; `components/motion/` owns animation primitives; `components/visuals/` owns shape layers; `components/admin/` owns the admin shell/editor/login.
- **Libraries:** `lib/cms/` registry, types and repository; `lib/db/` Mongo connection/indexes; `lib/auth/` rate limiting/session helpers; `lib/motion/`, `lib/mood/`, `lib/visuals/`, `lib/env.ts`, `lib/errors.ts`, and email/media helpers.
- **Tests:** 7 test files, 41 tests in the baseline run: CMS repository integration (24), scroll behavior (4), Resend (4), capabilities (3), env (2), errors (2), and rate limiting (2).

## 4. What is not built / carried debt

- **Phase 5:** one reversible signature moment per mood (Quiet shader/paper-fold plane; Editorial displaced project image plane and CSS-3D case-study depth; Play pointer-reactive 3D shapes), plus a shared lazy Stage3D wrapper, capability fallback, lifecycle handling, DPR clamp and mood-aware TiltCard.
- **Phase 6:** complete interaction feedback, magnetic/velocity details, route transitions and a skippable asset-aware preloader.
- **Phase 7:** mobile-specific motion/performance pass, responsive image strategy, viewport-unit/safe-area work and throttled device testing.
- **Phase 8:** data/security/CRUD hardening. Documented items include insert-order races, index mismatches, inconsistent rate-limit window types/TTL semantics, safe admin error mapping, auth environment validation/revocation costs and trusted-proxy IP handling.
- **Phase 9:** tagged revalidation, draft preview, structured logging, complete SEO/canonical/JSON-LD, dynamic OG images and route loading/error coverage.
- **Phase 10:** full route × mood accessibility/keyboard/reduced-motion review, Lighthouse targets, cross-browser checks and evidence-based award readiness review.
- **Carried evidence/tests:** no complete section × mood × viewport contact sheet was verified; no story acceptance test suite covering the 5-second, mute, blur, continuity, mind-change and performance criteria was found. Human acceptance/blur testing is explicitly owner-run and was not performed. An expired-cookie test remains a documented item. MorphSVG is registered in code, so older notes treating it as wholly absent may be stale.

## 5. Runtime verification and baseline

The dev preview was checked at 411×598 in dark mode. The home route rendered the seven-act structure. Editorial, Quiet and Play mood switching rendered. `/work`, `/about`, `/reviews`, `/contact`, `/admin` (login gate) and `/design` loaded. The contact form expanded; its observed page heading is an `h2` with no `h1`, a semantic/accessibility issue to review. No console errors or hydration warnings were observed. `/work/[slug]` was not exercised because the archive had no project fixture. No blur test, human acceptance test, Lighthouse run, real-device performance test or cross-browser test was run.

| Gate | Result |
|---|---|
| `pnpm typecheck` | Passed; the validation chain proceeded to lint. |
| `pnpm lint` | Passed; the validation chain proceeded to tests. |
| `pnpm test` | Passed: 41 tests. |
| `pnpm build` | **Not conclusively confirmed.** Output reached compilation, static generation (23/23), and route output, but the command tool never returned a final exit status. A later process check found no active build process. Treat this gate as unconfirmed, not passed. |

## 6. Contradictions and owner flags

1. **Phase 4 status conflict:** the controlling onboarding brief says Phase 4 is closed as-is and forbids reopening it. `docs/design/REMAINING-WORK.md`, `docs/design/PHASE-4-ACCEPTANCE-PROTOCOL.md` and Step 4 status notes describe it as partial or awaiting acceptance. Per the onboarding rule, this audit treats Phase 4 as closed; lower-priority notes should be reconciled before the next phase report.
2. **Empty content archive:** `/work` currently has no published project to exercise `/work/[slug]` or the Phase 5 Editorial image effect. Confirm that the empty archive is intentional or provide real CMS project content/fixture; no portfolio claims or sample content were invented.
3. **Build gate:** `pnpm build` did not return a final exit code. Confirm the build gate before opening Phase 5. The imported archive also lacks phase-specific Git refs, so historical branch/commit mapping cannot be recovered from this checkout.

Other verified discrepancies: the high-level prompt describes a duplicate `app/page.tsx`, while the current route tree/build exposes a single `/` route under the `(site)` group; docs that say `/about` or `/reviews` are absent are stale because those routes exist and render. The docs list 37 existing tests; the current test run reports 41.

## 7. Resume plan

The documented next phase is **Phase 5 — 3D & signature moments**, but the onboarding gate requires the owner to review this handoff and explicitly authorize starting it. Before Phase 5, confirm the build gate and whether the empty project archive is intentional. Keep Phase 5 scoped to the brief: lazy Stage3D wrapper, capability/poster fallback, quiet shader moment, editorial CMS-image displacement, play 3D shapes, reduced-motion/touch safeguards, DPR/lifecycle handling and CSS-3D TiltCard; do not reopen Phases 0–4.

**Working rules:** use the pinned stack and package manager; keep all content CMS-driven; no fabricated projects/stats/client claims; add tests for new logic; read the Next.js 16 local guide before using changed framework APIs; pass `pnpm typecheck && pnpm lint && pnpm test && pnpm build` at each phase gate; save browser evidence under `/tmp/agent-browser/`; clearly mark anything not verified.

**Primary references:** `docs/Siam Portfolio — Award-Grade Rebuild Prompt v2.pdf/.txt`, `docs/design/BRIEF.md`, `docs/design/STORY.md`, `docs/design/REMAINING-WORK.md`, `docs/design/PHASE-4-ACCEPTANCE-PROTOCOL.md`, ordered ADRs under `docs/decisions/`, and existing evidence under `docs/evidence/`.

**Audit outcome:** setup succeeded; the codebase and content were audited in read-only mode; no feature code or CMS content was changed. This document records the earlier audit only.

## Subsequent owner decision — 2026-10-07

This later owner-approved continuation supersedes the earlier Phase 4 and Phase 5 gate status above without rewriting the historical audit: Phase 4 is CLOSED AS-IS, with blur/story acceptance waived and MorphSVG plus expired-cookie debt retained. Phase 5 was authorized on `v0/phase-5-3d-signature`. The owner declined integrations, environment-variable changes, project package scripts, fixture seeds, and CMS writes; therefore the Phase 5 build gate and `/work/[slug]` remain unverified. See `docs/evidence/phase-4-closeout.md`, `docs/design/REMAINING-WORK.md`, and `docs/evidence/phase-5-closeout.md` for current status and limits.

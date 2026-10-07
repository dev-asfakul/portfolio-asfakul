# Siam Portfolio — Award-Grade Rebuild Prompt

## Mission

Turn ASFAKUL SIAM — Digital Design House into an Awwwards / FWA / CSSDA-level site.

Core concept: **One Identity. Multiple Moods.** One MongoDB CMS content model powers three genuinely different designs: Quiet, Editorial, and Play.

Definition of done:

- A stranger understands who Siam is, what he makes, and what to do next within five seconds.
- Every section communicates its purpose and destination.
- Every interaction has weight, feedback, and a reversible state.
- The experience targets 60fps on mid-range phones.
- Each mood remains recognisable when text is blurred.
- Inner pages continue the same story and mood system.

## Working rules

1. Read before writing. Inspect `app/`, `components/`, `lib/`, and `docs/` before changing code.
2. Do not invent production content. Copy, projects, stats, socials, process steps, and story chapters belong in MongoDB and the admin CMS. Missing data requires schema, admin input, and graceful empty states. Approved defaults must be clearly marked as editable drafts.
3. End every phase with:

   ```text
   pnpm typecheck && pnpm lint && pnpm test && pnpm build
   ```

   Preserve the existing 37 tests and add tests for new logic.

4. Do not interleave phases. Finish, report, and gate one phase before starting the next.
5. For every UI change, capture `/tmp/agent-browser/<phase>-<route>-<mood>-mobile.png` at 375px and the matching desktop capture at 1440px. Capture signature animations and re-test `/admin` after every phase.
6. Add an ADR under `docs/decisions/00NN-*.md` for every structural decision. Keep `AGENTS.md` and `docs/AGENT.md` consistent.
7. Every phase report must contain: Changed, Bugs closed, Gates, Screenshots, Captures, Metrics before→after, Not verified, Remaining, Next.
8. Use pinned project versions: Next 16.3.3, React 19, GSAP 3.15. Read the relevant Next documentation under `node_modules/next/dist/docs/` before using new Next APIs.

## Stage 1 — Mission, facts, and information architecture

### Ground-truth repository facts to verify

- Routes: `/`, `/work`, `/work/[slug]`, `/about`, `/reviews`, `/contact`, `/design`, and `/admin/*`.
- The public shell owns skip link, grid overlay, navigation, one `<main id="main">`, and shared footer.
- No duplicate `/` route and no nested `<main>` landmarks.
- Header is fixed, mood-aware, responsive, and does not remount between routes.
- Inner pages use the same mood context as home.
- CMS owns all public copy and content.
- Contact already has Zod, honeypot, idempotency, and IP rate limiting; do not regress it.
- Existing data concerns include insert-order races, index mismatches, rate-limit TTLs, raw admin errors, plain unauthorized errors, forwarded-IP trust, and hardcoded VerbSwap math.

### Narrative architecture

Home is a guided tour. Each chapter has a number, eyebrow, CMS-editable objective, content, and forward link:

1. Hero — who I am, what I make, for whom — `/work`, `/contact`.
2. Proof strip — credibility at a glance — `/about`.
3. Selected work — three to five visual case-study stories — `/work`, `/work/[slug]`.
4. Capabilities / Process — how design and engineering meet — `/about`.
5. About teaser — the person behind the work — `/about`.
6. Kind words — social proof — `/reviews`.
7. Contact — availability, response time, and what happens next — `/contact`.

Every inner page has breadcrumb, objective line, logical `Next up →`, shared footer, availability, mood name, socials, and back-to-top.

### Portfolio clarity

- Hero uses plain-language role and offer before art direction.
- Work index supports Design / Development / Both filters with GSAP Flip.
- Case studies answer: problem, role, approach, process, outcome, stack, links, gallery, and next project.
- `/design` is a read-only design-system proof page and is noindex if retained.

## Stage 2 — Three moods and visual language

The same content must be staged differently in type, grid, image treatment, navigation, cursor, motion, and inner pages.

| Mood | Feel | Palette | Type | Grid | Hero | Work | Signature | Cursor | Motion |
|---|---|---|---|---|---|---|---|---|---|
| Quiet | Gallery, calm, air | `#F2F0EB`, `#1A1917`, `#B2532E` | Refined serif display + quiet sans | Single column, huge margins | Still, centered, slow reveal | List with hover preview | Soft shader / paper fold | Subtle dot | Long soft eases, low intensity |
| Editorial | Magazine, confident, structured | `#0E0E0C`, `#ECE8DF`, `#FF4A1C` | Grotesk display + serif italic | Visible 12-column hairlines | Split headline + meta rail | Chaptered full-bleed sequence | Image-plane distortion + depth cards | Crosshair + label | Precise masks, line draws, expo |
| Play | Loud, kinetic, brutalist-joyful | `#2230FF`, `#F6F4EE`, `#E4FF3A` | Oversized display + mono | Broken, overlapping, animated | Stacked brutal type | Collage + horizontal run | Physics-like shapes / stickers | Blob / sticker | Spring overshoot, parallax, velocity skew |

## Stage 3 — Motion engineering system

GSAP is a system, not decoration.

Register and use where available: `ScrollTrigger`, `SplitText`, `Flip`, `Observer`, `CustomEase`, `DrawSVGPlugin`, `MorphSVGPlugin`, `MotionPathPlugin`, and `ScrollToPlugin`.

### Motion requirements

- Build one Lenis instance, driven by `gsap.ticker`; connect Lenis scroll to `ScrollTrigger.update`.
- Disable smooth scrolling for reduced motion. Evaluate touch devices by profiling before enabling.
- Create `lib/motion/tokens.ts` with `0.18 / 0.35 / 0.7 / 1.1s` durations, staggers, and `siamOut`, `siamInOut`, `siamSpring` eases.
- Use `FULL_MOTION = '(min-width: 768px) and (prefers-reduced-motion: no-preference)'`, `HOVER = '(hover: hover) and (pointer: fine)'`, and `REDUCED` through `gsap.matchMedia()`.
- Animate transform, opacity, and profiled clip-path only. Use `will-change` only during animation.
- Keep one ticker. Cap mobile ScrollTriggers below 15. Batch repeated items. Use `quickTo` for pointer follow.
- Use `immediateRender: false` when needed, scrub `0.6–1.2`, `toggleActions`, `invalidateOnRefresh`, and `useGSAP({ scope })` cleanup.
- Refactor repeated animation into reusable primitives: `SplitReveal`, `MaskImage`, `Magnetic`, `TiltCard`, `VelocitySkew`, `Marquee`, `PinnedSequence`, `HorizontalRail`, `FlipGrid`, `DrawLine`, `Counter`, `Cursor`, `Preloader`, `PageTransition`, and `SectionProgress`.
- Add a dev-only performance overlay at `?perf=1` showing FPS and active triggers.
- Fix VerbSwap to derive its step from `VERBS.length` and index; test 2, 3, and 5 verbs.
- Replace raw ScrollPercent listeners with ScrollTrigger/Lenis progress.
- Test reverse, route back, resize, orientation change, and hard refresh mid-page.

## Stage 4 — Story-first creative direction

The site is a design house told as one continuous story. The belief journey is:

**Curious → Surprised → Understands → Trusts → Wants it → Acts**

Seven acts:

1. Arrival — starts plain: “Hi, I make websites.” The first scroll transforms it into “I design how websites feel.”
2. The problem — “Most websites are seen. Few are remembered.” / “Templates look alike. People forget alike.”
3. The turn — “One identity. Three moods.” / “Same words: Quiet, Editorial, Play. Watch what changes.”
4. Proof — “Work that moves.” / “Selected projects, told as short films.” Link: `See all work → /work`.
5. How it is made — “I design it. I understand it. I build it.” / “One person, from first sketch to shipped code.” Link: `About me → /about`.
6. Trust — “In their words.” / “What clients say after launch.” Link: `Kind words → /reviews`. Hide until real reviews exist.
7. Invitation — “Your story is next.” / “Tell me what you're making. I reply personally.” Link: `Start a project → /contact`.

Rules:

- Acts share a visual world and carry shared lines, shapes, fields, or type blocks between transitions.
- The mute test must still communicate design/build quality.
- A keyboard-accessible chapter rail links acts and stays synced with scroll.
- “Start a project” becomes persistent after Act 3 without blocking content.
- Desktop acts are 1–1.5 viewports; mobile acts are at most 1.5 screens.
- Reduced motion is a designed still storyboard, not a degraded fallback.
- CMS collection: `storyChapters` with `act`, `title`, `line`, `visualKey`, `linkLabel`, `linkHref`, and `order`.

## Stage 5 — Data, storytelling, and case-study content

CMS fields must support:

- Section objectives and links.
- About role, headline, availability, response time, story, principles, experience, toolbox, resume, and socials.
- Stats and selected clients, hidden when empty.
- Process steps with title, body, image, and order.
- Case studies: role, year, timeline, stack, problem, process, outcomes, links, gallery, video, and next project.
- Reviews, hidden until real records exist.
- Story chapters and CMS-editable approved defaults.

All empty fields hide their blocks gracefully. Admin gets an input for each field.

## Stage 6 — Inner pages and mood-specific design

Build mood-aware variants without creating parallel CMS configuration:

- `HeroStill`, `HeroSplit`, `HeroStack`.
- `WorkIndex`, `WorkSequence`, `WorkCollage`.
- `AboutColumn`, `AboutTwoUp`, `AboutCollage`.
- `ContactInline`, `ContactForm`, `ContactBigType`.

Apply the variants to home, `/work`, `/work/[slug]`, `/about`, `/reviews`, and `/contact`.

Load active mood fonts with `next/font` and size-adjust fallbacks. Add mood-specific nav, cursor, transitions, and accessible mood switching with cookie persistence, `aria-live`, and authored clip-path/cross-fade transitions. Native cursor must remain on touch.

## Stage 7 — 3D, signature moments, and micro-interactions

One reversible signature moment per mood:

- Quiet: soft shader-gradient or paper-fold plane.
- Editorial: lazy WebGL image plane with displacement and CSS-3D depth cards.
- Play: pointer-reactive 3D shapes/stickers with spring physics.

Use a shared lazy `Stage3D` wrapper with capability probe, DPR clamp to 1.5, visibility/offscreen pause, disposal, reserved aspect ratio, and static poster fallback. Only load on desktop/capable devices; keep the 3D chunk under 180kB gzipped. No WebGL on mobile; use poster or CSS-3D fallback.

Add:

- Focus, hover, press, underline draw, arrow shift, card lift, magnetic CTA, and nav accent states.
- SplitReveal headings and eyebrows.
- VelocitySkew, section progress, and scroll-linked color shifts.
- View Transitions API with GSAP fallback.
- Shared-element case-study transitions.
- One-session preloader under 1.5s, skippable, asset-readiness based, disabled for reduced motion.
- Mood-specific loading, empty, and error states.

## Stage 8 — Mobile, security, platform, and award QA

### Mobile

- Replace `min-h-screen` / `100vh` with `100dvh` / `svh` where appropriate.
- Add text-size adjustment, overscroll behavior, safe-area insets, and 44px tap targets.
- Use light masked reveals, tap feedback, momentum rails, and no heavy pinned timelines on mobile.
- Test 320, 375, 390, 768, 1024, and 1440 at 6× CPU throttle and Fast 3G.
- Targets: LCP < 2.5s, CLS < 0.05, INP < 200ms. Real-device measurements must be marked unverified unless actually tested.
- Decide whether Cloudinary transforms replace `images.unoptimized`; reserve image aspect ratios and prioritize only LCP media.

### Data and security

- Replace insert order races with an atomic counters collection and concurrency tests.
- Correct index collection names and test that every queried collection has its indexes.
- Add TTL `expiresAt` to login and contact rate-limit records.
- Normalize unauthorized and admin errors into a safe standard error contract.
- Validate upload magic bytes and size; use signed Cloudinary uploads and orphan cleanup.
- Persist contact messages before sending; use bounded timeout, retry, idempotency, and delayed retry visibility.
- Add CSRF protection for cookie-authenticated mutations, audit logs for admin mutations, trusted request IDs, and safe IP extraction.

### Platform and SEO

- Use tagged cache reads and `revalidateTag` instead of blanket invalidation where possible.
- Add admin-only draft preview for unpublished projects.
- Add server-only structured logging with request IDs.
- Add `app/sitemap.ts`, `app/robots.ts`, route metadata/canonicals, Person/WebSite/CreativeWork JSON-LD, and CMS socials as `sameAs`.
- Add mood-aware dynamic OG images with `ImageResponse`.
- Add route-group `loading.tsx` and `error.tsx`; use `generateStaticParams` for project slugs.

### Award readiness

- Run axe on every route and mood.
- Complete keyboard-only and reduced-motion walkthroughs.
- Record contrast per mood.
- Lighthouse mobile target: Performance ≥90, Accessibility 100, Best Practices ≥95, SEO 100; explain misses.
- Check Chrome, Safari iOS/macOS, and Firefox.
- Remove dead code/dependencies; zero console errors and hydration warnings.
- Update `AGENTS.md`, `docs/AGENT.md`, and README with motion/mood extension instructions.
- Score Design, Usability, Creativity, Content, and Developer craft from 0–10 with evidence and list the five weakest areas.

## 10-phase execution plan

### PHASE 0 — Audit & baseline

Read the full repository, output a repo map, run untouched gates, record test count, bundle sizes, Lighthouse metrics, CLS/LCP/INP, and active ScrollTrigger counts. Confirm or refute repository facts with file/line evidence. Write the design brief and baseline ADR.

### PHASE 1 — Shell & information architecture

Remove duplicate root route. Make the grouped layout the single shell with skip link, nav, one main, and footer. Add header tokens, active route indicator, socials, mood switcher, mobile menu, SectionHeading, PageHeader, breadcrumbs/JSON-LD, NextUp, noindex design route, and CMS section objectives/contact availability fields.

### PHASE 2 — Motion engine foundation

Register GSAP plugins. Create motion tokens. Add Lenis and scroll reset. Build and document reusable motion primitives. Refactor existing GSAP and ScrollTrigger code with matchMedia, cleanup, immediate-render safety, invalidation, batching, and viewport-relative bounds. Fix VerbSwap and ScrollPercent. Add performance overlay and reverse/restart matrix. Gate all checks.

### PHASE 2.5 — Story script & storyboard — approval gate

No feature code. Write `docs/design/STORY.md` with each act and mood: sentence, visual metaphor, GSAP technique, shared transition element, mobile version, and reduced-motion version. Produce storyboard frames and a viewport timing map. Define `storyChapters` CMS fields and admin forms. Stop for owner approval before Phase 3.

### PHASE 3 — Build the story: showcase & storytelling

Implement the approved seven acts using Phase 2 primitives. Build hero role/offer, proof strip, selected-work visual stories, process line, about teaser, reviews conditionally, contact invitation, forward links, memes as non-blocking beats, mood-aware work index, case studies, About, Reviews, and Contact. Add all required CMS fields and admin inputs.

### PHASE 4 — Three moods = three designs

Extend the existing mood configuration with fonts, nav, cursor, hero/work/about/contact variants, and transitions. Apply distinct layouts and type systems to every public and inner page. Add active-font loading, mood-specific navigation/cursor, accessible cookie-persisted transitions, `aria-live`, and the complete contact sheet across moods and breakpoints.

### PHASE 5 — 3D & signature moments

Build Quiet, Editorial, and Play signature moments with fallbacks. Add lazy Stage3D, capability probe, DPR clamp, offscreen/visibility pause, cleanup, poster fallback, CSS-3D TiltCard, and optional opt-in device tilt. Measure frame budget and chunk size.

### PHASE 6 — Micro-interactions & transitions

Finish hover/press/focus feedback, magnetic CTAs, text reveals, counters, velocity skew, section progress, scroll-linked color, page transitions, shared elements, preloader, and mood-specific loading/empty/error states.

### PHASE 7 — Mobile designed experience

Remove remaining viewport anti-patterns. Add safe areas and tap targets. Implement mobile-specific motion and disable expensive desktop choreography/WebGL. Batch/lazy-create/kill triggers. Make image loading strategy explicit. Run responsive/performance matrix and reverse/restart matrix.

### PHASE 8 — Data, security & CRUD hardening

Fix ordering races, index mismatches, rate-limit TTLs, safe errors, CSRF, audit logs, request IDs, upload validation, Cloudinary reliability, contact delivery/retry, database indexes, and admin CRUD completeness. Add concurrency/security tests.

### PHASE 9 — Platform & SEO

Implement tagged cache revalidation, draft mode, structured logging, request IDs, sitemap, robots, canonical metadata, JSON-LD, CMS-driven sameAs, dynamic mood-aware OG images, loading/error routes, and static project params.

### PHASE 10 — QA & award readiness

Run accessibility, keyboard, reduced-motion, contrast, Lighthouse, browser compatibility, console/hydration, dead-code, documentation, and award self-review passes. Record all evidence and five weakest areas. Do not claim production readiness where real-device or production checks were not performed.

## Story acceptance tests from Phase 3 onward

- 5-second test: a stranger names what the studio does and what to do next.
- Mute test: same conclusion without text.
- Blur test: Quiet, Editorial, and Play remain distinguishable.
- Continuity test: full scroll feels like one film, not stacked templates.
- Mind-change test: show the recording to five unfamiliar people; record honest answers to what they think of the designer and whether they would contact him. Failure blocks the phase.
- Performance test: full story holds 60fps on a mid-range laptop and phone profile; every act reverses cleanly.

## Phase report template

```text
PHASE N — <name>
Changed:       <files + summary>
Bugs closed:   <IDs>
Gates:         typecheck ✓ lint ✓ test ✓ (N tests) build ✓
Screenshots:   <paths>
Captures:      <paths>
Metrics:       <before → after>
Not verified:  <honest list>
Remaining:     <list>
Next:          PHASE N+1
```

Start with Phase 0. Do not skip the phase gate. Do not start the next phase until the current phase is reported and verified.

## Current execution status

- Phase 0: completed in the repository with baseline docs and gates.
- Phase 1: implemented shell consolidation and verified with gates; remaining evidence and full route/mood review are tracked.
- Phase 2: partially implemented motion gating and cleanup; the expanded motion-engine requirements above remain the source of truth.
- Phase 2.5: next required phase; write the storyboard and request approval before Phase 3 feature implementation.

_Last updated: 2026-10-07._

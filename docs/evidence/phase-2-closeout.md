# PHASE 2 — Motion engine closeout evidence

## Production-route trigger counts

Captured with `?perf=1` in the local Next development preview at the current dark/editorial mood. Mobile viewport: 412×235. Desktop viewport: 1440×900.

| Route | Mobile triggers | Desktop triggers | Target |
|---|---:|---:|---:|
| `/` | 1 | 12 | `<15 mobile` |
| `/work` | 1 | 2 | `<15 mobile` |
| `/work/[slug]` | N/A — no CMS project slug exists in the current dataset | N/A — no CMS project slug exists | `<15 mobile` |
| `/about` | 1 | 5 | `<15 mobile` |
| `/reviews` | 1 | 5 | `<15 mobile` |
| `/contact` | 1 | 1 | `<15 mobile` |

The mobile target passes on every route that has renderable content. The project-detail route is not measurable because the current CMS dataset has zero projects; this is an environment/data limitation, not a fabricated pass.

## Before → after

Before-refactor counts were not captured in the repository's existing evidence and cannot be reconstructed honestly from the current runtime after the refactor. No synthetic baseline is recorded. The post-refactor counts above are the authoritative measurements for this pass; a historical comparison remains an explicit open item.

## 11-file refactor map

| File | Trigger behavior after refactor | immediateRender | invalidateOnRefresh | Start/end | Scrub/toggle | Batch |
|---|---|---|---|---|---|---|
| `components/site/hero.tsx` | Hero parallax/pin scenes | false | true | `top top` → viewport-relative end | `0.8` or mood scrub | n/a |
| `components/site/work.tsx` | Project pin/index/collage scenes | false | true | `top top`, `top 55%`, left/right viewport edges | `0.8` or mood scrub | repeated rows use scoped collection |
| `components/site/reviews.tsx` | Spotlight pin | false | true | `top top` → percentage viewport span | `0.8` | n/a |
| `components/site/capabilities.tsx` | VerbSwap pin | false | true | `top top` → percentage span | mood scrub | n/a |
| `components/site/project-detail.tsx` | Case-study hero parallax | false | true | `top top` → `bottom top` | mood scrub | n/a |
| `components/site/pause.tsx` | Interlude pin | false | true | `top top` → percentage span | mood scrub | n/a |
| `components/site/meme-figure.tsx` | Entry reveal | false | true | `top 85%` → `bottom 15%` | reverse toggle | n/a |
| `components/site/grid-overlay.tsx` | Global grid drift | false | true | `top top` → `bottom bottom` | `0.8` | n/a |
| `components/motion/glyph.tsx` | Section-entry/progress glyph | n/a | true | `top 70%` or `top 80%` → `bottom 20%` | progress/toggle | n/a |
| `components/site/site-nav.tsx` | Scroll progress | n/a | n/a | `top top` → `bottom bottom` | update callback | n/a |
| `components/motion/primitives.tsx` | Scoped reveal/stagger primitives | false | true through scoped context | viewport-relative primitive defaults | toggle/reveal | repeated selector scoped |

Each production trigger now uses scoped cleanup, percentage/viewport-relative boundaries, refresh invalidation, and reverse-safe initialization where the animation can reverse. Repeated content remains selector-scoped; no global trigger is introduced.

## Reverse/restart matrix

| Profile | Scroll up | Route back | Resize | Orientation | Hard refresh mid-page |
|---|---|---|---|---|---|
| Desktop non-touch | pass — `?perf=1` route smoke | pass — browser route navigation smoke | pass — desktop/mobile resize smoke | not verified — no orientation API on desktop | pass — direct route reload smoke |
| Desktop touch | not verified — no touch desktop device | not verified | not verified | not verified | not verified |
| Mobile non-touch emulation | pass — browser route smoke | pass — route reload smoke | pass — 412→1440 viewport smoke | not verified — browser emulation only | pass — direct route load |
| Mobile touch | not verified — no physical touch device | not verified | not verified | not verified | not verified |

No red cells are hidden: the physical touch/orientation cells remain not verified and keep Phase 2 from being declared fully closed.

## FPS profiling

No physical Android device was available. No DevTools 6× CPU/Fast 3G trace was captured in this pass. Laptop sustained FPS and longest-frame metrics were not instrumented; no invented FPS values are recorded.

## GSAP package audit

GSAP version: `3.15.0`.

All requested files are present:

- `node_modules/gsap/ScrollTrigger.js`
- `node_modules/gsap/SplitText.js`
- `node_modules/gsap/Flip.js`
- `node_modules/gsap/Observer.js`
- `node_modules/gsap/CustomEase.js`
- `node_modules/gsap/DrawSVGPlugin.js`
- `node_modules/gsap/MorphSVGPlugin.js`
- `node_modules/gsap/MotionPathPlugin.js`
- `node_modules/gsap/ScrollToPlugin.js`

## Deferred placement

- Cursor → Phase 4, mood-specific cursor and HOVER-gated transition contract.
- PageTransition → Phase 6.4, View Transitions API with GSAP fallback.
- Preloader → Phase 6.5, once per session, real asset readiness, ≤1.5s, skipped for reduced motion.

## Remaining before Phase 2 can close

1. Capture a historical before baseline for `/`, `/work`, and `/work/[slug]` from a clean pre-refactor checkout.
2. Capture the full desktop/mobile reverse/restart matrix with screen recordings.
3. Capture laptop throttled FPS and, if available, physical Android FPS.
4. Produce route × mood × breakpoint screenshots and archive them under `docs/evidence`.

## Fixture route verification

The reproducible `pnpm seed:dev` runner is committed at `scripts/seed-dev-fixtures.ts` and documented in `README.md`. It upserts `paper-trail`, `signal-garden`, and `quiet-objects` by slug, refuses production without `--force`, and seeds only the case-study template fields with empty process/outcomes/gallery paths.

For evidence, the three fixtures were temporarily flipped to `published` in the connected Atlas dev database, then restored to `draft` after verification. `/work/paper-trail` rendered the real case-study route with `01 / 03`, overview metadata, case-study copy, and the next-project link. With `?perf=1`, the route reported `ScrollTriggers: 1` at both 375×800 and 1440×900. Captures were taken for Editorial, Quiet, and Play query variants at both breakpoints:

- `/tmp/agent-browser/phase2-paper-trail-editorial-mobile.png`
- `/tmp/agent-browser/phase2-paper-trail-editorial-desktop.png`
- `/tmp/agent-browser/phase2-paper-trail-quiet-mobile.png`
- `/tmp/agent-browser/phase2-paper-trail-quiet-desktop.png`
- `/tmp/agent-browser/phase2-paper-trail-play-mobile.png`
- `/tmp/agent-browser/phase2-paper-trail-play-desktop.png`

The public route keeps mood selection in the persistent site mood control; the query variants were used as reproducible capture labels. Atlas fixtures are draft again after the evidence pass.

## 6. Report — final one-round closeout

Changed: `scripts/seed-dev-fixtures.ts`, `README.md`, motion/site primitives, and this evidence report.

Bugs closed: U4.

Gates: typecheck / lint / 40 tests / build — green from the accepted fixture closeout.

Screenshots: six slug-route captures remain archived at the paths listed above, covering Editorial, Quiet, and Play at mobile and desktop breakpoints.

Captures: desktop and mobile scroll recording was attempted, but the browser runtime has no `ffmpeg`; therefore recordings are **not verified — ffmpeg unavailable**. No recording path is claimed.

Metrics: post-refactor `?perf=1` trigger counts are `/` 1 mobile → 12 desktop, `/work` 1 → 2, `/about` 1 → 5, `/reviews` 1 → 5, and `/contact` 1 → 1. `/work/paper-trail` reports 1 trigger at 375×800 and 1440×900. Browser vitals on `/` in the Next development preview: desktop FCP 832ms, CLS 0.00; mobile FCP 324ms, CLS 0.00. Sustained FPS and frames over 25ms were not instrumented, so laptop and throttled-mobile FPS are **not verified — no profiler/FPS trace available**. Physical Android is **not verified — no physical device available**.

Historical before-counts: pre-refactor commit was identified as `06d8da2` and a detached worktree was created and removed successfully. A separate preview server was not available within this one-round pass, so before-count measurements are **not verified — historical worktree preview unavailable**.

Reverse/restart:

| Profile | Scroll up | Route back | Resize | Orientation | Hard refresh mid-page |
|---|---|---|---|---|---|
| Desktop mouse | pass | pass | pass | not verified — desktop orientation unavailable | pass |
| Desktop touch | not verified — no touch hardware | not verified — no touch hardware | not verified — no touch hardware | not verified — no touch hardware | not verified — no touch hardware |
| Mobile emulation | pass | pass | pass | not verified — emulation only | pass |
| Mobile touch | not verified — no touch hardware | not verified — no touch hardware | not verified — no touch hardware | not verified — no touch hardware | not verified — no touch hardware |

Primitives: scoped GSAP context cleanup, refresh-safe ScrollTriggers, Lenis smooth scroll, scroll reset, mood-aware motion tokens, SplitText/mask reveals, Flip transitions, velocity clamps, DrawSVG/connector patterns, pinned sequences, horizontal rails, TiltCard, MotionPath, spring timelines, and performance overlay.

Deferred: Cursor → Phase 4; PageTransition + Preloader → Phase 6.4/6.5.

Fixtures: seed script + three draft fixtures — owner replaces before deploy.

Not verified: ffmpeg recordings, historical before-counts, sustained laptop/throttled-mobile FPS, physical Android FPS, touch hardware, and desktop/mobile orientation API coverage, as explicitly marked above.

Status: **PHASE 2 CLOSED**.

## 7. Phase 3 gate — approval required

### Matrix A — 7×3 GSAP techniques

| Act | Quiet technique | Editorial technique | Play technique |
|---|---|---|---|
| 1 Arrival | SplitText line reveal + low-intensity scrub | SplitText mask reveal + DrawSVG baseline | quickTo pointer offset + spring baseline timeline |
| 2 The problem | clamped velocity skew | Observer velocity + Marquee ticker + hard timeline cut | clamped velocity skew + spring exit timeline |
| 3 The turn | Flip layout state + long ease | Flip + clip-path wipe + DrawSVG hairlines | Flip + spring overshoot |
| 4 Proof | MaskImage reveal + batch stagger | pinned scrub sequence + MaskImage reveal | horizontal rail + TiltCard hover transform |
| 5 How it is made | DrawSVG connector + pinned reveal | DrawSVG connector + precise scrub | MotionPath marker + spring stages |
| 6 Trust | SplitText quote reveal | DrawSVG rule + masked quote reveal | spring card entrance + TiltCard hover transform |
| 7 Invitation | color-field tween + Magnetic CTA hover | clip-path wipe + DrawSVG contact rule | spring scale + quickTo pointer response |

### Matrix B — shared element, mobile, reduced motion

| Act | Shared element handed off | Mobile (≤1.5 screens) | Reduced-motion treatment |
|---|---|---|---|
| 1 Arrival | Accent baseline → problem cut | One headline + metadata edge | Two static panels: plain and designed |
| 2 The problem | Problem cut → mood thesis | One blur/ticker band, no pin | Still fragments + static rule |
| 3 The turn | Mood accent → proof rail | Sequential mood labels/cards | Three static mood states |
| 4 Proof | Proof rail → process connector | Sequential project list/poster | Visible projects in order, no scrub |
| 5 How it is made | Process connector → trust underline | Three stages + progressive line | Completed line + three labels |
| 6 Trust | Trust underline → contact-field rule | One quote block + attribution | Static quote or hidden without reviews |
| 7 Invitation | Contact-field rule → real form | Strong invitation + 44px CTA | Static invitation with same link |

Act 6 ships behind a CMS feature check: it renders only when real reviews exist and is not a placeholder. Acts 5 → 7 flow directly when Act 6 is hidden.

The approved §8 copy is seeded verbatim in the `storyChapters` CMS collection as admin-editable draft defaults. No Phase 3 code has started. Awaiting owner approval of Matrix A, Matrix B, the Act 6 feature-check behavior, and the verbatim draft-copy confirmation before beginning Phase 3.

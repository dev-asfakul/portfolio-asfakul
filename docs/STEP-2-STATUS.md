# STEP 2 — ACCEPTED WITH CARRY-FORWARD DEBT

Step 2 is accepted as of 2026-10-06. The two items below are known debt and do not block Step 3.

## Carry-forward debt

- **Evidence archive:** captured at 360, 390, 768, 1024, 1280, 1440, 1920, and 2560 using the sandbox browser viewport controls.
- **A11y computed-style audit:** recorded in `docs/evidence/design/a11y.md`; focus outline, computed colors, reduced-motion preference, and overflow were checked on `/design`.

## Previous status


## Scope
Mood engine, semantic design tokens, typography scale, motion primitives, and the gated development-only `/design` reference page.

## Status

**PARTIAL / FOUNDATION VALIDATED — NOT ACCEPTED**

The foundation is implemented and the live reference surface now proves the system in rendered form. Step 2 remains partial until the full viewport matrix and accessibility contrast review are complete.

## Completed

- Added enforceable viewport/evidence rules to `docs/STEP-1-RULES.md` §5: `/tmp` is not evidence; 412×235 is not an acceptance viewport; required widths are 360, 390, 768, 1024, 1280, 1440, 1920, and 2560.
- Rewrote `docs/design/moods.md`, `docs/design/typography.md`, and `docs/design/motion.md` as contracts with allowed/forbidden behavior and worked examples.
- Strengthened `/design` with live token swatches, resolved values, contrast ratios, all type roles with fluid sizes, the same component side-by-side across every mood, state specimens for success/warning/error/focus/disabled, and replayable motion specimens with duration/easing labels.
- Added semantic success, warning, error, and focus tokens for every mood in `app/globals.css`.
- Archived repository evidence in `docs/evidence/design/`.

## Evidence

- Route: `/design`
- Color scheme: dark
- Repository screenshots:
  - `docs/evidence/design/design-390-dark.png` — 390×844
  - `docs/evidence/design/design-768-dark.png` — 768×1024
  - `docs/evidence/design/design-1280-dark.png` — 1280×900
  - `docs/evidence/design/design-1920-dark.png` — 1920×1080
- Untested required widths: 360, 1024, 1440, 2560.
- Automated pass output: `pnpm typecheck && pnpm lint && pnpm test && pnpm build` — all passed; 30 tests passed across 3 files; production build completed successfully.

## Known debt

- The required 360/1024/1440/2560 full-frame screenshots are not available from this environment and are explicitly marked untested.
- Token contrast is calculated from declared mood hex values; a browser accessibility audit should still verify computed styles and focus visibility before acceptance.
- The design page is a development reference surface, not a public route.

## Gate

Step 3 must not begin until the owner accepts this partial status or the remaining viewport and accessibility evidence is completed. Public sections must consume these tokens and primitives rather than introducing one-off visual systems.

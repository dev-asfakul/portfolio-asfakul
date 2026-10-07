# Remaining Work

Phase 3 home story is complete (Acts 1–7). **Phase 4 is CLOSED AS-IS by owner decision.** The blur test and story acceptance tests are waived; MorphSVG is dropped debt; the expired-cookie case remains sandbox-limited carried debt. Thirty individual contact-sheet captures exist, but a combined master was not assembled (see `docs/evidence/phase-4-closeout.md`). Phase 5 is PARTIAL on `v0/phase-5-3d-signature`: each mood has a capability-gated CSS-3D signature scene and static fallback. All three desktop transforms were exercised in a synthetic browser capability profile; six screenshots cover 375×667 and 1440×900, with three supplemental static-fallback captures at the current 411×598 dark preview. Offscreen pause/resume and reduced-motion behavior were observed. The native preview profile reports two CPU threads, 4 GB, and no fine pointer; no physical-device result or numeric FPS is claimed. The seed script exists but was not run. No package scripts, integrations, environment variables, or CMS writes were used per owner instruction; `/work/[slug]`, production gates, and production bundle size remain unverified. Recording was attempted but unavailable because ffmpeg is missing.

## Status

| Scope | Status |
|---|---|
| Phases 0, 1, 2, 2.5 | Closed |
| Phase 3 (story acts) | Closed: Acts 1–7 shipped; home story complete |
| Phase 4 (three designs) | Closed as-is by owner decision; waived acceptance tests and carried implementation debt are listed below and in `docs/evidence/phase-4-closeout.md` |
| Phase 5 (3D signature moments) | Partial on `v0/phase-5-3d-signature`; all three desktop motions and static fallbacks are browser-verified with synthetic capability conditions; reduced-motion fallback and offscreen pause/resume were checked. Package gates, production gzip/lazy-load behavior, recordings, physical-device performance, and `/work/[slug]` remain unverified |
| Phases 6–10 | Not started |

## Phase and branch history

- Phase 0–2.5: closed on their existing phase branches; see `docs/evidence/phase-2-closeout.md`.
- Phase 3 Acts 1–2: shipped on `v0/phase-3-act-2-variants`.
- Phase 3 Act 3: shipped on `v0/phase-3-act-3-turn` (`37523cc`).
- Phase 3 Act 4: shipped on `v0/phase-3-act-4-proof`.
- Phase 3 Act 5: shipped on `v0/phase-3-act-5-process` (`73ef6e4`).
- Phase 3 Act 6: shipped on `v0/phase-3-act-6-trust`.
- Phase 3 Act 7: shipped on `v0/phase-3-act-7-invitation` (historical branch). Phase 3 CLOSED.
- Phase 4 mood work: shipped on the existing phase branch; confirm the final branch history with Git before resuming.

## Carried and waived debt

- Phase 3 story acceptance tests (5-second, mute, blur, continuity, mind-change) are waived by owner; no human results are claimed.
- Phase 4 blur/story acceptance is waived by owner. MorphSVG on the mood toggle is dropped debt; the reduced-motion-safe crossfade/scale treatment remains.
- Phase 4 expired-cookie verification is a sandbox limitation and remains carried debt. The tampered-cookie rejection was separately verified (see `docs/evidence/phase-4-closeout.md`).
- Route-by-route visual review and physical-device performance verification remain deferred; no physical-device FPS result is claimed.
- `scripts/seed-dev-fixtures.ts` exists, but it was not run under the owner’s no-scripts instruction. No CMS records were changed; `/work/[slug]` remains unverified and no fixture screenshots are claimed.
- Phase 3 Act 3 continues to use its approved default copy rather than the CMS story-chapter contract.
- Phase 5 active motion was exercised in a synthetic 8-core/8-GB fine-pointer profile; the native browser profile (2 cores, 4 GB, no fine pointer) remained on the static fallback. The 10-frame sample was observed only in the synthetic profile; no numeric FPS or physical-device result is claimed. Reduced-motion fallback and offscreen pause/resume were runtime checked.
- Phase 5 uses CSS 3D, not WebGL/canvas, so DPR clamping and GPU-resource disposal are not applicable. Production bundle/gzip size and production lazy-loading behavior remain unverified because the owner declined package scripts. The dev preview requested the small dynamic scene chunk even under reduced motion, while the scene itself remained inactive. Recording was unavailable because `ffmpeg` is missing.

## Phase 5 partial closeout

- Wrapper: `components/motion/stage3d.tsx`; the GSAP scene is lazily imported after capability approval and first intersection. `components/motion/stage3d-scene.tsx` owns the reversible pointer/scroll effects and cleanup.
- Capability: viewport at least 768px, hover + fine pointer, `prefers-reduced-motion: no-preference`, at least 6 logical cores, at least 4 GB reported device memory, and a 10-frame requestAnimationFrame sample of at least 45 FPS.
- Fallback: the existing shape vocabulary remains a reserved-aspect-ratio static poster on mobile, reduced motion, and ineligible devices. This implementation is CSS-3D; there is no canvas, WebGL, or DPR scaling to clamp.
- Bundle: production gzip size not measured because package scripts/build were not permitted. No 3D dependency was added.
- Browser evidence: the six initial screenshots cover Quiet, Editorial, and Play at 375×667 and 1440×900; three supplemental captures cover all moods at the current 411×598 dark preview. Synthetic desktop capability checks exercised each animated mood and offscreen pause/resume. The native runner (2 cores, 4 GB, no fine pointer) correctly showed static fallbacks at both viewport widths. Reduced-motion fallback was verified separately; recordings remain unavailable.
- Data: `/work/paper-trail` returned 404. No fixtures were seeded or published and no CMS records were written.

## Resume instruction

Phase 4 is closed as-is and must not be reopened. Phase 5 is PARTIAL on `v0/phase-5-3d-signature`; the remaining release-gate and evidence gaps are listed in `docs/evidence/phase-5-closeout.md`. Keep the database untouched; do not seed or write CMS records, add integrations/environment variables, or run package scripts without new owner authorization. Do not push an unverified build. Next session: Phase 6 — micro-interactions and transitions. Do not begin Phase 6 in this pass.

Reference `docs/design/STORY.md`, `docs/design/BRIEF.md`, and ADR-0007–0010 for the existing product and motion conventions.

## Act 3 implementation note

Act 3 uses the project’s GSAP setup (`useGSAP`, `ScrollTrigger`, `FULL_MOTION`, `REDUCED`) and the Phase 2 primitives (`SplitReveal`, `DrawLine`, and the shared motion token system). The desktop turn is a scrubbed clip-path handoff; mobile uses tap-through stage controls and reduced motion keeps the three mood treatments distinct without a pinned timeline.

## Branch and commit record

Phase 5 work is on local branch `v0/phase-5-3d-signature`. Local code commits exist on this branch; no remote push was made because package gates/build were not run under the owner instruction. Do not interpret the local commit history as a passing release gate.

# ADR 0011 — Phase 5 CSS-3D signature scenes

## Status

Accepted for Phase 5; release status remains partial pending the owner-permitted verification gates.

## Context

Phase 5 calls for one reversible signature moment per mood, a shared lazy stage, capability gating, and a static fallback. The available portfolio archive has no published project cover image to exercise the Editorial media effect. The project already has a GSAP wrapper, mood-specific motion tokens, and reusable CSS shape vocabulary. Adding a WebGL dependency would increase the production chunk and device-performance burden before the source image and production bundle could be verified.

## Decision

Use CSS 3D and the existing GSAP setup rather than WebGL, shaders, or a physics library:

- Quiet uses the shared paper-fold vocabulary with slow pointer tilt and scroll travel.
- Editorial uses a CSS-3D image-depth card and scroll-velocity skew when a CMS cover image exists; a static CSS frame is the empty-media fallback.
- Play reuses the existing Play shape vocabulary with a GSAP `siamSpring` entrance and pointer-reactive depth layers.
- `components/motion/stage3d.tsx` owns the reserved-ratio poster, capability probe, and visibility/offscreen lifecycle. `components/motion/stage3d-scene.tsx` owns the mood-specific GSAP scene.
- The scene is enabled only when the desktop, fine-pointer, reduced-motion, hardware, and 10-frame budget checks pass. `TiltCard` uses the same capability contract and the active mood intensity.

## Consequences

The stage has a static poster at all times and uses CSS transforms only; no canvas, WebGL context, DPR configuration, or GPU-resource disposal is needed. GSAP listeners, ScrollTriggers, tweens, and transform state are reverted when the stage leaves view, the document is hidden, or the component unmounts. No new dependencies are added.

## Verification limits

The responsive fallbacks and synthetic desktop motion path were checked in agent-browser. Synthetic hardware/media overrides are not physical-device evidence. No package scripts or production build were run under the owner instruction, so the production gzip size and production lazy-chunk behavior remain unverified. The Next development preview requested the scene chunk while the reduced-motion fallback remained inactive; that development observation is recorded in `docs/evidence/phase-5-closeout.md`.

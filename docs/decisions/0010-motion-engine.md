# ADR 0010 — Phase 2 motion engine

- GSAP 3.15 ships all requested plugin entry points in `node_modules/gsap`: ScrollTrigger, SplitText, Flip, Observer, CustomEase, DrawSVGPlugin, MorphSVGPlugin, MotionPathPlugin, and ScrollToPlugin. They are registered from `lib/motion/gsap.ts`.
- Motion tokens live in `lib/motion/tokens.ts`; mood presets remain the source of mood-specific overrides.
- Lenis is mounted once in the root layout, bridged through the GSAP ticker, and disabled for reduced motion. Touch sync remains off pending physical-device profiling.
- Browser scroll restoration remains the default. Route changes refresh ScrollTrigger; history restoration is not forcibly overwritten.
- Phase 2 implementation evidence includes the four gates and plugin/package inspection. Full reverse/restart and active-trigger profiling remain explicit verification work before final phase closure.

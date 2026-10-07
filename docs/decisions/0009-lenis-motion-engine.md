# ADR 0009 — Lenis motion engine

- Status: accepted for Phase 2
- Decision: mount one Lenis instance in the root layout through `SmoothScroll`.
- Feel: `lerp: 0.09`, `wheelMultiplier: 0.9`, smooth wheel enabled.
- Touch: `syncTouch: false`; native touch scrolling remains the default until physical-device profiling proves Lenis touch smoothness.
- Reduced motion: no Lenis instance is created when `prefers-reduced-motion: reduce` matches.
- GSAP bridge: `gsap.ticker.add((time) => lenis.raf(time * 1000))`, `lagSmoothing(0)`, and `lenis.on('scroll', ScrollTrigger.update)`.
- Restoration: browser restoration remains the default; route changes refresh ScrollTrigger without overriding browser back/forward positions.

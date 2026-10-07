# Siam Portfolio Design Brief

## Mission
ASFAKUL SIAM — Digital Design House: one identity, multiple moods, one CMS content model. The experience should make the work, the person, and the next action understandable within five seconds while using motion as communication rather than decoration.

## Narrative
The homepage is a guided seven-act story: Arrival, The problem, The turn, Proof, How it is made, Trust, and Invitation. Each act has one job in the belief journey: Curious → Surprised → Understands → Trusts → Wants it → Acts. The same story continues on Work (evidence), About (the person), Reviews (trust), and Contact (invitation).

## Mood system
- Quiet: spacious, restrained, calm; warm paper palette, refined display type, still hero, soft index.
- Editorial: confident, structured, visible grid; dark editorial palette, oversized type, chaptered work.
- Play: kinetic, surprising, brutalist-joyful; blue/lime palette, stacked type, collage and pointer-reactive forms.

Moods must differ in palette, typography, grid, image treatment, cursor, navigation, layout, and motion language while sharing CMS content.

## Motion rules
Use GSAP/ScrollTrigger as a system. Gate desktop motion with `(min-width: 768px) and (prefers-reduced-motion: no-preference)`, gate hover with fine pointers, and provide a designed reduced-motion storyboard. Prefer transform, opacity, and profiled clip-path; clean up every context; make scroll animations reversible and refresh-safe. Smooth scrolling is opt-in only after profiling touch devices.

## Content rules
All claims, projects, stats, socials, process steps, reviews, and story chapters are CMS-editable. Missing data hides the corresponding block or presents a clearly marked admin-editable default. Do not invent client names, metrics, or portfolio claims.

## Accessibility and performance
Keyboard order, focus-visible states, semantic landmarks, accessible dialogs, reduced motion, responsive layouts, reserved media space, and 44px touch targets are required. Target LCP < 2.5s, CLS < 0.05, INP < 200ms, and sustained 60fps on representative devices; real-device results must be marked unverified unless tested.

## Phase acceptance
Every phase runs `pnpm typecheck && pnpm lint && pnpm test && pnpm build`, browser-verifies `/admin`, captures 375px mobile and 1440px desktop evidence for UI changes, and records what is not verified.

_Source: Siam Portfolio — Award-Grade Rebuild Prompt v2._

# ADR 0007: Phase 0 baseline and sequencing

- Status: accepted
- Date: 2026-10-07

## Context
The award-grade rebuild prompt requires a verified baseline before feature work and mandates preserving the existing MongoDB, Cloudinary, Resend, NextAuth, Next.js 16, React 19, and GSAP stack.

## Decision
Treat the current repository as the Phase 0 baseline. Preserve the existing provider architecture, complete work in sequential phases, and require all four project gates before moving between phases. Motion work will use GSAP/ScrollTrigger with reduced-motion and viewport gating; any Lenis adoption requires a separate implementation decision after touch profiling.

## Baseline evidence
- `pnpm typecheck`: passed
- `pnpm lint`: passed
- `pnpm test`: passed, 37 tests across 6 files
- `pnpm build`: passed
- Build route inventory includes `/`, `/about`, `/contact`, `/design`, `/reviews`, `/work`, `/work/[slug]`, `/admin`, and `/api/health`.
- Existing evidence is stored under `docs/evidence/`; real-device performance and Lighthouse metrics are not verified in this baseline.

## Consequences
The baseline is safe to modify, but it does not claim production readiness. Phase 1 must consolidate the shell and route information architecture before story and motion expansion. Any missing CMS data must be represented by schema/admin fields rather than invented public claims.

# Project overview

## What this is

A mood-driven portfolio and studio CMS for Asfakul Siam: a public site for presenting selected digital work, capabilities, reviews, and contact information, with a single-admin content workspace behind `/admin`.

## Owner, audience, goal

- **Owner:** Asfakul Siam.
- **Audience:** prospective clients, collaborators, recruiters, and peers.
- **Goal:** turn a personal portfolio into a readable, expressive, maintainable studio surface.

## Five steps and current state

1. **Step 1 — Foundation:** accepted; folded security and integration debt remains.
2. **Step 2 — Design system:** accepted with carry-forward viewport/a11y verification debt.
3. **Step 3 — Public experience:** accepted for the current homepage sections; missing public routes remain.
4. **Step 4 — Auth and CMS:** login and shell exist; CMS CRUD surfaces are incomplete.
5. **Step 5 — Delivery:** not complete; SEO, health, error routes, full verification, and deployment hardening remain.

## Doctrine and moods

- [Design doctrine](design/DOCTRINE.md)
- [Editorial shapes](visuals/shapes-editorial.md)
- [Quiet shapes](visuals/shapes-quiet.md)
- [Play shapes](visuals/shapes-play.md)

**Editorial** is serif-led, warm, measured, and reading-first. It uses long-form rhythm, restrained vermilion signal, and typographic hierarchy.

**Quiet** is spacious, body-led, and low-noise. It uses stillness, warm off-white surfaces, charcoal type, and muted terracotta accents.

**Play** is kinetic, saturated, and interruption-led. It uses electric blue, acid lime, hot pink, tighter rhythm, and spatial composition.

## Stack

Next.js 16, React 19, TypeScript, Tailwind CSS 4, MongoDB, Cloudinary, Resend, NextAuth, Gemini (planned), GSAP + ScrollTrigger, and Motion primitives.

## Directory structure

- `app/` — App Router routes, layouts, server actions, and route handlers.
- `components/` — site, admin, mood, motion, visual, and UI components.
- `lib/cms/` — collection registry, types, validation, queries, and repository.
- `lib/db/` — MongoDB client and index definitions.
- `lib/media/` — Cloudinary signing, validation, transforms, and image helpers.
- `lib/email/` — Resend delivery service and tests.
- `lib/mood/` — mood configuration, selection, and cookie behavior.
- `lib/visuals/` — scene taxonomy, scroll handoffs, and mood-specific shape vocabularies.
- `docs/` — doctrine, decisions, status reports, evidence, and operations documentation.
- `public/` — static icons and image assets.

## Data flow

```text
UI → server action → Zod validation → service → repository → MongoDB
                                      ├→ Cloudinary
                                      ├→ Resend
                                      └→ planned Gemini / GitHub services
```

All mutations should authenticate, authorize, validate, execute business logic, access data, return the standard contract, and write an audit event.

## CMS model

- `projects` — published and draft case studies, galleries, metadata, and ordering.
- `reviews` — testimonial quotes, attribution, rating, status, and ordering.
- `skills` — design and technology capabilities.
- `social_links` — active footer/contact profiles.
- `memes` — designed internet-culture moments with placement, mood, trigger, and timing.
- `characters` — frame-based character moments.
- `media` — Cloudinary assets and alt text.
- `contact_messages` — submitted enquiries, read state, idempotency, and email status.
- `singletons` — `about`, `site_settings`, and `mood_settings` records.
- `rate_limits` — durable contact limiter records.
- `audit_log` — required future mutation history with actor, action, target, timestamp, and metadata.

## Auth model

One administrator signs in with environment-backed credentials through NextAuth. Admin authorization is server-side through `requireAdmin()`. A production credential hash, durable auth rate limiting, audit logging, and stronger session invalidation remain required before launch.

## Deployment target

Vercel is the intended deployment target. MongoDB Atlas, Cloudinary, and Resend are external runtime services.

## Environment setup

Use Node and pnpm versions from `package.json` (`pnpm@12.3.4`). Copy `.env.example` into the local environment, provide the required service values, then run `pnpm install`, `pnpm dev`, and the verification scripts. See [DEPLOYMENT.md](DEPLOYMENT.md) for the complete setup and release checklist.

## Adding a collection

1. Add the TypeScript model in `lib/cms/types.ts`.
2. Add its field definitions and collection metadata in `lib/cms/registry.ts`.
3. Add Zod rules in `lib/cms/validation.ts`.
4. Add query and repository access patterns.
5. Add indexes in `lib/db/indexes.ts`.
6. Add the admin list/editor surface and all pending, success, validation, server-error, and empty states.
7. Add public query/render support, metadata, mood scenes, and evidence.
8. Add tests, an audit-log event, and a migration/version note.

## Design, mood, and shape systems

- Design system: `app/globals.css`, `components/design/`, and `docs/design/`.
- Mood system: `components/mood/`, `lib/mood/`, and `docs/design/moods.md`.
- Shape system: `components/visuals/shape-layer.tsx`, `lib/visuals/`, and `docs/visuals/`.

## Decision records

- `docs/decisions/0001-step-one-testing-strategy.md`
- `docs/decisions/0004-step-2-5-rebaseline.md`
- `docs/decisions/0006-admin-shape-policy.md`
- `docs/decisions/ADMIN-DEV-BYPASS.md`
- `docs/decisions/0005-gemini-model.md` — required and not yet created.

## Verification baseline

Existing recorded checks: `pnpm typecheck`, `pnpm lint`, `pnpm test`, and `pnpm build` passed for the Step 3/4 baseline. The full route, accessibility, SEO, deployment, and production-service audit is still open.

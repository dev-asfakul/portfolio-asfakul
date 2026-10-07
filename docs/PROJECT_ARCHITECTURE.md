# Portfolio Studio — Project Architecture

## 1. Purpose

This project is a creative and modern portfolio for a web designer and developer. It combines a public-facing studio-style experience with a private CMS for managing portfolio content, media, settings, and inbound contact messages.

The project is intentionally built as a modular Next.js monolith. Keep the system simple, server-first, and easy for a future developer to understand and extend.

## 2. Governing documents

- `docs/AGENT.md` — binding engineering, design, security, testing, and reporting contract.
- `docs/decisions/` — architectural decision records. Add a decision record for significant architectural choices.
- `.env.example` — environment variable names only; never commit secret values.

The continuation plan is sequential:

1. Data layer
2. Mood engine, design system, and motion primitives
3. Public experience
4. Authentication and admin CMS
5. SEO, project detail, and final verification

Do not begin a later step until the current step satisfies its Definition of Done and has been reported.

## 3. Technology stack

- **Framework:** Next.js 16 App Router
- **Language:** TypeScript with strict configuration
- **Runtime UI:** React 19
- **Styling:** Tailwind CSS 4, CSS custom properties, and `tw-animate-css`
- **UI primitives:** Base UI, shadcn conventions, `class-variance-authority`, `clsx`, and `tailwind-merge`
- **Animation:** GSAP with `@gsap/react`
- **Icons:** `lucide-react`
- **Database:** MongoDB driver
- **Authentication:** NextAuth
- **Media:** Cloudinary
- **Email:** Resend
- **Validation:** Zod
- **Analytics:** Vercel Analytics
- **Package manager:** pnpm 12

Avoid adding dependencies unless the problem, alternatives, bundle/maintenance cost, and license are documented and approved.

## 4. High-level architecture

The application is a modular monolith deployed as one Next.js application:

```text
Browser
  -> Next.js App Router pages and components
  -> Server Actions / Route Handlers
  -> Validation and authorization boundary
  -> Domain services and repositories
  -> MongoDB / Cloudinary / Resend
```

Use these boundaries:

- `app/` owns routing, page composition, layouts, server actions, and route handlers.
- `components/` owns presentational and interaction components.
- `lib/` owns domain logic, integrations, validation, shared utilities, and design behavior.
- `docs/` owns project contracts, architecture notes, and decision records.

Handlers and server actions should remain thin. They must authenticate, authorize, validate, invoke domain logic, and return a consistent result. Database queries and external-service calls belong in the appropriate `lib/` module, not in UI components.

## 5. Directory conventions

```text
app/
  (site)/              Public site route group
  actions/             Server Actions, including contact submission
  api/                 Route Handlers when an HTTP endpoint is required
  globals.css          Global tokens, mood styles, utilities, and base rules
  layout.tsx           Root document metadata and providers

auth.ts                NextAuth configuration and auth callbacks
components/
  site/                Public experience sections and composition
  ui/                  Reusable UI primitives
lib/
  brand/               Identity and brand-resolution helpers
  cms/                 CMS types, validation, repositories, and queries
  db/                  MongoDB connection and database concerns
  email/               Resend client and email delivery helpers
  errors.ts            Shared application/data-layer error contract
  media/               Cloudinary helpers
  mood/                Mood definitions, resolution, and mood-specific behavior
  motion/              GSAP and reusable motion helpers

docs/
  AGENT.md             Master working contract
  PROJECT_ARCHITECTURE.md  This document
  decisions/            Architecture decision records
```

The exact directory list may grow by domain, but new code should follow the existing domain boundary instead of creating generic catch-all utilities.

## 6. Data model and data flow

CMS content is represented through typed models in `lib/cms/types.ts`. The public page obtains content through `lib/cms/queries.ts`, which uses the CMS repository layer. The repository owns MongoDB access and should return projection-aware domain data rather than raw, unbounded database documents.

Current public read flow:

```text
app/(site)/page.tsx
  -> getSiteContent()
  -> CMS repository
  -> MongoDB
  -> resolveIdentity(content.about)
  -> Experience content composition
  -> JSON-LD + rendered public experience
```

Current contact flow:

```text
Contact UI
  -> app/actions/contact.ts
  -> Zod boundary validation
  -> contact/business rules
  -> Resend delivery and/or persistence path
  -> structured success or application error
```

For every write path, preserve this order:

1. Authenticate
2. Authorize
3. Validate and reject unknown/invalid input
4. Apply business rules
5. Access data through a repository
6. Call external services with bounded timeouts/retries
7. Return a safe, consistent response
8. Log useful metadata without secrets or unnecessary PII

## 7. Integration responsibilities

### MongoDB

`lib/db/mongo.ts` owns the MongoDB client lifecycle. It must use a serverless-safe singleton/pooling pattern and must not create a new client per request. Repositories should use the shared connection and explicit projections.

Schema/model responsibilities:

- Define required fields and timestamps.
- Add indexes only for real access patterns.
- Preserve unique constraints and ownership boundaries.
- Avoid full-document reads when a projection is sufficient.
- Keep database details behind repositories.

### Cloudinary

`lib/media/cloudinary.ts` owns media configuration and media operations. Media handling must include:

- Signed upload support.
- Safe, generated public IDs/filenames.
- Content/type and size validation before upload.
- Delete support.
- Explicit transformation helpers.
- No secrets in browser bundles or logs.

Large binaries should remain in Cloudinary; MongoDB stores metadata and references.

### Resend

`lib/email/resend.ts` owns email configuration and delivery helpers. Email paths must use typed payloads/templates, safe error mapping, bounded retries for transient failures, and idempotency for retried sends. Never log API keys, message bodies containing sensitive data, or full recipient details unnecessarily.

### Authentication

`auth.ts` owns NextAuth configuration. Authentication is not authorization: every protected route/action must separately enforce server-side permissions and resource ownership. Admin UI visibility is never a security boundary.

## 8. Design language

The public experience is editorial, expressive, and content-led rather than dashboard-like. It presents the designer/developer’s thinking and work with strong typography, controlled whitespace, and purposeful movement.

### Typography

The project defines three primary font roles in `app/globals.css`:

- Sans/body: Inter Tight
- Display/serif: Instrument Serif
- Metadata/technical labels: JetBrains Mono

Use display typography for the identity and section moments, sans typography for readable supporting copy, and mono typography for compact metadata and system-like labels. Keep long reading text left-aligned and within a comfortable line length.

### Grid and spacing

The shared `site-grid` utility is responsive:

- 4 columns on mobile
- 8 columns from 768px
- 12 columns from 1024px

Gutters and section spacing use CSS variables with `clamp()` so the composition breathes at different viewport sizes. Prefer the shared spacing and token system over arbitrary values.

### Color and tokens

Semantic custom properties are defined in `app/globals.css`:

- `--background`
- `--foreground`
- `--muted`
- `--line`
- `--accent`
- `--accent-foreground`
- `--surface`
- `--radius`
- typography and layout variables such as `--display-family`, `--gutter`, and `--section-space`

Components should consume semantic tokens. Do not hardcode visual hex values in component markup or create one-off color systems.

## 9. Mood engine

The mood engine is a first-class design system, not a theme toggle. It changes visual atmosphere, layout strategy, image treatment, typography behavior, grid visibility, and motion intensity.

Mood definitions live in `lib/mood/moods.ts`. The current moods are:

### Quiet

- Space, restraint, and calm
- Light background
- Minimal grid
- Soft image treatment
- Still/index-led composition
- Low-intensity motion

### Editorial

- Grid, type, and photography
- Dark background with orange accent
- Visible grid
- Framed images
- Split/sequence composition
- Stronger editorial motion

### Play

- Energy, characters, and surprise
- Blue background with lime accent
- Animated grid
- Cutout/collage image treatment
- Stacked/collaged composition
- Highest motion intensity and rounded treatment

`resolveMoods()` validates enabled moods and selects a safe default. `moodStyleSheet()` allows CMS-configured accent overrides only when they pass the expected format. The active mood is persisted through the `siam-mood` cookie where the current implementation requires persistence.

When extending the mood system:

- Read the existing mood configuration first.
- Preserve the same semantic token contract across moods.
- Make behavior differences intentional and documented.
- Never create a fourth mood or bypass `MoodId` without updating the model, validation, and documentation.

## 10. Motion principles

Motion is used to communicate hierarchy, continuity, state change, and feedback. It is not decoration.

The project uses GSAP as its primary system for complex motion. Existing helpers live in `lib/motion/gsap.ts`. Keep animation setup reusable and clean up contexts/listeners on unmount. Respect `prefers-reduced-motion` by replacing large movement with simple opacity or immediate state changes.

Use the mood’s motion preset for duration, easing, stagger, distance, scrub, and intensity. Do not scatter arbitrary timelines across unrelated components.

## 11. Public experience structure

The public experience is ordered as:

1. Hero — identity, positioning, and primary orientation
2. Statement — point of view and working philosophy
3. Work — selected projects and case-study entry points
4. Capabilities — service/skill areas
5. Reviews — social proof and perspective
6. Contact — clear, validated route to start a conversation

The public page should have one clear `h1`, semantic sections, keyboard-visible focus states, intentional mobile composition, and no dependence on hover alone.

## 12. CMS and admin direction

The private CMS will manage the content consumed by the public experience. It should remain domain-oriented rather than becoming a generic database editor.

Expected admin capabilities:

- Authenticated admin shell
- Server-side authorization on every operation
- CRUD for the defined content models
- Media upload/delete through Cloudinary
- Validation shared at the boundary
- Loading, empty, error, success, disabled, and pending states
- Safe optimistic behavior only when rollback is implemented

Do not allow client-provided IDs, roles, or ownership fields to bypass authorization.

## 13. Reliability and security rules

- Never expose secrets to client code.
- Validate all external input with Zod or the established validation layer.
- Use structured application errors from `lib/errors.ts`.
- Do not leak stack traces, database queries, tokens, or internal implementation details.
- Bound external requests with timeouts.
- Retry only transient and safe/idempotent operations.
- Prevent duplicate contact/email sends with idempotency protection.
- Scope user/admin data access server-side.
- Add security headers in `next.config.mjs`; keep each header in one place.
- Treat missing production configuration as a deployment/configuration error, not as a reason to silently substitute fake data.

## 14. Testing and verification expectations

Before a step is accepted, run the repository checks available for the project:

```text
pnpm typecheck       # if defined by package scripts or equivalent TypeScript check
pnpm lint            # if defined
pnpm test            # if defined
pnpm build
```

Also verify the live preview in a browser. For UI work, inspect at the required responsive widths: 360, 390, 768, 1024, 1280, 1440, 1920, and 2560px. Check keyboard navigation, focus-visible states, reduced motion, contrast, and no horizontal overflow.

If a check is unavailable because the project has no script or environment dependency, report that explicitly; do not claim it passed.

## 15. Current progress and next work

The project has completed the initial Step 1 hardening work in the working tree, including documentation and updates to shared data/integration modules. The public homepage has also been runtime-checked at desktop and mobile viewport sizes.

Before starting the next step, verify the current working tree and rerun the relevant typecheck/build checks. Then continue with Step 2:

1. Audit the existing mood engine against the intended behavior.
2. Consolidate/complete semantic design tokens.
3. Complete reusable motion primitives and reduced-motion handling.
4. Verify the design system across the defined responsive widths.
5. Produce the required Section 23 report before moving to Step 3.

## 16. Future developer checklist

Before changing code:

- Read `docs/AGENT.md` and this document.
- Inspect the relevant existing module and its callers.
- Confirm which sequential step the work belongs to.
- Check environment variable names without reading or exposing values.
- Prefer existing tokens, repositories, validators, and motion helpers.
- Add or update a decision record for significant choices.

Before calling work complete:

- Confirm requirements and edge cases.
- Run applicable type, lint, test, and build checks.
- Verify runtime behavior in the browser.
- Check accessibility and responsive behavior.
- Remove debug output and unused code.
- Update this document if architecture or design contracts change.
- Write the required factual completion report with evidence and remaining risks.

## 17. Known risks to keep visible

- External integrations require correctly configured environment variables in each deployment environment.
- MongoDB, Cloudinary, and Resend availability must be handled as dependency failures rather than assumed always-on services.
- NextAuth authentication must be paired with explicit authorization checks for every admin operation.
- The design system currently supports three intentionally different moods; additions should not weaken the shared semantic token contract.
- Performance and accessibility numbers must be measured in a production-like build before final acceptance.

This document describes the architecture and intent. The source code and `docs/AGENT.md` remain authoritative when implementation details change.


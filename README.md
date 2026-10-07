# Creative Web Designer & Developer Portfolio

A modular Next.js 16 portfolio and studio site for a creative web designer and developer. The public experience is mood-led and editorial; the private CMS owns projects, reviews, skills, social links, media, and contact messages.

## Architecture

- **Presentation:** `app/(site)` and `components/site` render the public portfolio. Route handlers and server actions are thin boundaries.
- **Domain/data:** `lib/cms` contains typed content contracts, validation, queries, and repository access. MongoDB is accessed through the server-only pooled singleton in `lib/db/mongo.ts`.
- **Integrations:** Cloudinary handles signed media workflows (`lib/media`); Resend handles transactional email (`lib/email`). Secrets are server-only and validated by `lib/env.ts`.
- **Design:** semantic tokens live in `app/globals.css`; mood definitions live in `lib/mood`; GSAP primitives live in `lib/motion`. Motion must respect reduced-motion preferences.
- **Security:** authenticate, authorize, validate, then perform data access. Never expose secrets or trust client input.

## Dev CMS fixtures

Run `pnpm seed:dev` to idempotently upsert the three draft case-study fixtures (`paper-trail`, `signal-garden`, and `quiet-objects`) into the configured MongoDB Atlas `projects` collection. The script includes only the fields needed by the case-study template, leaves process/outcomes/gallery empty for empty-state coverage, and refuses to run when `NODE_ENV=production` unless `--force` is explicitly supplied.

## Local setup

Use Node and pnpm matching `package.json` and install dependencies with `pnpm install`. Copy `.env.example` to `.env.local` and provide values. Development/preview can intentionally run with explicit service fallbacks; production fails fast when required configuration is missing.

## Verification

`pnpm typecheck` · `pnpm lint` · `pnpm test` · `pnpm build`

See `docs/AGENT.md` for the binding engineering contract and `docs/PROJECT_ARCHITECTURE.md` for design and data-flow decisions. Decision records live in `docs/decisions/`.

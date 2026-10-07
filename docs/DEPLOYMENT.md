# Deployment guide

## Target

Deploy the Next.js app to Vercel. Use MongoDB Atlas for MongoDB, Cloudinary for media, and Resend for transactional email.

## Prerequisites

- Node.js compatible with Next.js 16.
- pnpm 12.3.4, declared by `package.json`.
- Vercel account and project.
- MongoDB Atlas database.
- Cloudinary account.
- Resend account with a verified sending domain.
- GitHub token only when the planned import/sync feature is enabled.
- Gemini project/API access only when the planned AI features are enabled.

## Environment variables

| Name | Required | Source | Notes |
|---|---:|---|---|
| `MONGODB_URI` | yes | MongoDB Atlas | Use the SRV connection string; production requires a replica set for transactions if introduced. |
| `MONGODB_DB` | yes | MongoDB Atlas | Database name, currently `asfakul-siam` in the example. |
| `AUTH_SECRET` | yes | generated secret | Minimum 32 characters. |
| `ADMIN_EMAIL` | yes | owner | Admin login email. |
| `ADMIN_PASSWORD_HASH` | yes | generated bcrypt hash | Store only the bcrypt hash; never deploy a plaintext admin password. |
| `NEXTAUTH_URL` | production | Vercel | Production canonical auth URL. |
| `CLOUDINARY_CLOUD_NAME` | yes | Cloudinary console | Server-only. |
| `CLOUDINARY_API_KEY` | yes | Cloudinary console | Server-only. |
| `CLOUDINARY_API_SECRET` | yes | Cloudinary console | Server-only. |
| `RESEND_API_KEY` | yes | Resend console | Server-only. |
| `RESEND_FROM` | yes | verified Resend domain | Sender address. |
| `NEXT_PUBLIC_SITE_URL` | planned | public site URL | Required for canonical URLs and sitemap generation; not currently wired. |
| `GEMINI_API_KEY` | planned | Google AI/Gemini | Required only after AI features are implemented. |
| `GITHUB_TOKEN` | planned | GitHub settings | Required only after GitHub import/sync is implemented. |
| `NODE_ENV` | implicit | runtime | Set by the platform. |

`.env.example` currently includes the core MongoDB, auth, Cloudinary, and Resend names but not all names in the locked audit requirement. Never commit real values.

## Database setup

1. Create a MongoDB Atlas project and database.
2. Create a least-privileged application user.
3. Restrict the network allowlist to the deployment egress strategy selected for the project.
4. Set `MONGODB_URI` and `MONGODB_DB` in Vercel development, preview, and production environments.
5. The application creates indexes from `lib/db/indexes.ts` on first database access.
6. Add migration/version records when field contracts change; MongoDB’s schema flexibility does not replace versioned contracts.
7. Configure backups and test restore before production launch.

## Cloudinary setup

Configure the cloud name, API key, and API secret in Vercel. The current media folder is `asfakul-siam`; future collection-specific folders should use `projects/`, `reviews/`, `about/`, and `site/`. Upload signing, size limits, allowed formats, magic-byte validation, safe folder sanitization, transforms, and idempotent deletion live in `lib/media/cloudinary.ts`. A separate upload route and orphan cleanup policy remain to be completed.

## Resend setup

1. Verify the sending domain.
2. Publish the provider’s DKIM, SPF, and DMARC records.
3. Set `RESEND_FROM` to a verified address.
4. Set the contact recipient through CMS settings.
5. The current contact path persists first and attempts delivery with an idempotency header, timeout, and bounded jittered retry. A durable retry worker, typed templates, and explicit provider error mapping remain required.

## Auth setup

Generate a strong `AUTH_SECRET`, set the admin identity, and configure `NEXTAUTH_URL` in production. Set `ADMIN_PASSWORD_HASH` to a bcrypt hash generated outside the repository. Login attempts are durably rate limited in MongoDB, and logout revokes the admin session family server-side.

## Build and deploy

```text
pnpm install --frozen-lockfile
pnpm typecheck
pnpm lint
pnpm test
pnpm build
```

Connect the repository to Vercel, add environment variables to all intended environments, and deploy. Do not expose secrets through `NEXT_PUBLIC_*` variables.

## Health check

`/api/health` reports liveness separately from dependency readiness. Liveness is always true; readiness pings MongoDB when configured and returns HTTP 503 when the database is unavailable. The response contains no credentials or connection strings.

## Post-deploy smoke test

- Load `/`, `/about`, `/work`, `/reviews`, `/contact`, `/privacy`, and `/terms`.
- Load a published `/work/[slug]` route.
- Confirm designed 404 and 500 behavior.
- Sign in at `/admin/login`.
- Verify admin CRUD, preview, publish, media upload/delete, and contact inbox flows.
- Submit the contact form and verify durable persistence, idempotency, and email status.
- Verify AI project import only after the Gemini/GitHub implementation exists.
- Run accessibility, keyboard, reduced-motion, and screen-reader checks.

## Rollback

Use Vercel deployment history to promote the last known-good deployment. If a schema contract changed, deploy the compatible reader before rolling back writers. Disable unsafe mutations until the data contract is restored.

## Backup and restore

Use MongoDB Atlas scheduled backups and on-demand snapshots. Test restore into a separate database, verify indexes and singleton records, then switch the connection only after application smoke tests pass.

## Monitoring

Monitor Vercel function errors and duration, MongoDB connection/operation failures, Cloudinary upload/delete errors, Resend delivery and rate limits, contact-message delayed status, authentication failures, and audit-log write failures. Alerts should go to the owner’s operational channel; never include secrets or full contact-message contents in logs.

## Rate limits

Current contact form limit: 5 submissions per IP per 10-minute window, stored in MongoDB `rate_limits`. The locked audit also requires a durable admin AI limit of 10 requests per 15 minutes; it is not implemented. Adjust values only with a decision record and tests.

## Cost assumptions

Choose the smallest production-appropriate MongoDB Atlas, Cloudinary, Resend, Gemini, and Vercel plans, then validate usage against actual traffic. Record the selected tiers, quotas, retention, and alert thresholds in a deployment decision record before launch.

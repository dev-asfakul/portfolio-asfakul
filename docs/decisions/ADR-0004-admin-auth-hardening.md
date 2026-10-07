# ADR-0004: Admin auth hardening

- Status: Accepted
- Date: 2026-10-07

## Decision

Admin authentication remains NextAuth 5 credentials + JWT with bcrypt verification and MongoDB-backed rate limiting/revocation. The auth boundary now uses typed `AppError` codes, imports validated environment configuration, applies a TTL index to login-window records, requires admin authorization for logout, and marks the entire `/admin` route tree noindex/disallowed to crawlers.

## Consequences

Production startup fails when required auth variables are absent or invalid through the explicit top-level `instrumentation.ts` environment import. Revocation remains keyed by the NextAuth subject (`admin`), so revoking the admin subject invalidates all admin JWTs sharing that subject on their next authorization check. The runtime checks depend on MongoDB availability and fail closed for authorization when auth configuration is unavailable.

## Verification

`pnpm typecheck`, `pnpm lint`, `pnpm test` (41 tests), and `pnpm build` pass. #1 is covered by `instrumentation.ts` and the production-missing-auth test in `lib/env.test.ts`. #8 revoked-session and #9 expired/tampered/no-cookie checks are blocked on owner env: configured admin credentials and a running MongoDB-backed session environment were not available in this sandbox; they are not claimed as executed here.

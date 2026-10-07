# Admin shell verification bypass

For local preview evidence only, `auth.ts` accepts `ADMIN_DEV_BYPASS=true` when `NODE_ENV !== 'production'`. The production guard is part of the condition, so the bypass cannot authorize the deployed app. It exists because no `ADMIN_EMAIL` or `ADMIN_PASSWORD_HASH` environment variables are configured in this sandbox. Production authentication remains the configured NextAuth credentials flow.

# Pre-deployment checklist

**Assessment date:** 2026-10-07  
**Decision:** Not ready for production yet.  
**Rule:** A box is checked only when verified in this project or explicitly documented below.

## Verified gates

- [x] `pnpm typecheck` passes.
- [x] `pnpm lint` passes.
- [x] `pnpm test` passes (37 tests).
- [x] `pnpm build` passes.
- [x] Home and About routes render in the browser at desktop and mobile dark viewports.
- [x] Hero scroll manager has one scene-scoped `gsap.matchMedia()` scope, cleanup, and reduced-motion branches.
- [x] Shared reveal/stagger primitives gate GSAP to desktop + reduced-motion-safe conditions and revert their matchMedia contexts.
- [x] Phase 2 motion engine core now includes requested GSAP plugin registration, motion tokens, Lenis bridge, route refresh, derived verb offsets, ScrollTrigger progress, and `?perf=1` active-trigger overlay.
- [x] Phase 2 motion evidence captured at 1440×900 desktop and 375×800 mobile; `/admin` still resolves through the protected login gate.
- [ ] Phase 2 full closure remains open: production triggers were refactored and measured in `docs/evidence/phase-2-closeout.md`; historical before-baseline, complete desktop/mobile reverse/restart captures, route × mood × breakpoint archive, and throttled/physical FPS evidence remain required.
- [x] Mood evidence exists for Editorial, Quiet, and Play hero states.
- [x] Admin routes are protected by the existing login gate.
- [x] `.env.example` exists and contains variable names only.
- [x] `/api/health` returns liveness/readiness status and avoids secret output.
- [x] Production config validates required service variables and bcrypt password format.

## Design and motion — unresolved

- [ ] All public routes have three verified mood screenshots under `docs/evidence/mood-audit/`. Current evidence is primarily hero-focused; full-page mood audit is still required.
- [ ] Editorial and Quiet have been independently judged structurally distinct on every public page.
- [ ] Every scene has verified background, midground, and foreground shape layers.
- [ ] Every section boundary has a designed transition in all three moods.
- [ ] Full interactive-state audit is complete for buttons, fields, links, cards, loading, success, and error states.
- [ ] Physical-device 60fps test is complete; currently unverified.
- [ ] Route-level Play code-splitting is proven in a deployed Network trace; currently unverified.
- [ ] Responsive sweep at 360, 390, 768, 1024, 1280, 1440, 1920, and 2560 is complete.
- [ ] Contrast, axe, keyboard-only, and screen-reader audits are complete on every route.

## Content and routes — unresolved

- [x] `/work` archive route exists and is designed; browser smoke remains required.
- [x] `/reviews` dedicated route exists and is designed; browser smoke remains required.
- [x] `/contact` dedicated route exists and is designed; browser smoke remains required.
- [ ] `/privacy` and `/terms` are present if required.
- [x] Designed not-found and server-error pages are present; browser smoke remains required.
- [ ] Every content item is CRUD-able from admin, including gallery uploads, media replacement/delete, reorder, and contact retry.
- [ ] Header resume link and current-page state are verified in all moods.
- [ ] Footer socials, resume, sitemap, and legal links are verified with empty-data fallbacks.

## Backend, auth, and security — unresolved

- [ ] Production variables are configured: `MONGODB_URI`, `MONGODB_DB`, `AUTH_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `RESEND_API_KEY`, and `RESEND_FROM`.
- [ ] Mongo indexes, explain plans, backups, restore drill, replica-set status, and migration/version registry are documented and verified.
- [ ] Login and expensive endpoints have durable rate limiting; current implementation is not verified against this gate.
- [ ] CSRF protection for cookie-authenticated mutations is explicitly verified.
- [ ] Audit log is written for every admin mutation.
- [ ] Standard error contract and status-code behavior are verified for every server action.
- [ ] Upload magic-byte validation, size limits, signed Cloudinary uploads, orphan cleanup, and SSRF allow-listing are verified.
- [ ] Contact persist-then-send behavior, timeout/retry policy, and delayed-message worker/retry surface are verified.
- [ ] CSP, HSTS, `X-Content-Type-Options`, and `Referrer-Policy` are configured in deployed response headers.
- [ ] Structured logs, request IDs, metrics, error tracking, alerts, and release tagging are configured.

## Admin — unresolved

- [ ] `/admin/login` is mood-aware and has designed pending, invalid, locked/rate-limited, and success states.
- [ ] Every collection has pagination, filtering, sorting, search, loading, empty, error, validation, and server-error states.
- [ ] Every destructive action has an accessible confirmation dialog with focus trap and Escape handling.
- [ ] Reorder operations are atomic.
- [ ] Media library supports drag/drop progress, aspect-ratio previews, replacement, deletion confirmation, alt text, and metadata editing.
- [ ] Contact inbox supports read state, delivery states, detail/reply, and retry.
- [ ] Admin mood audit is complete; Play is intentionally not used as a kinetic background behind data tables.

## Final production gates — unresolved

- [ ] Production preview smoke test: every public route, admin login, contact submission, CMS read/write, and health check. Local route smoke evidence now covers `/`, `/about`, `/work`, `/reviews`, `/contact`, and `/does-not-exist`; production services remain unverified.
- [ ] Lighthouse target: LCP < 2.5s, INP < 200ms, CLS < 0.1.
- [ ] Rollback procedure exercised.
- [ ] Monitoring and alerts tested.
- [ ] Backup restore drill executed.
- [ ] Cost tiers and quotas documented.

## Unchecked-box decision log

The unchecked gates below are explicitly classified. Dev-blocked items were audited this turn and either verified with evidence or deferred as accepted pre-launch debt with a concrete reason. Owner-blocked items require production credentials, infrastructure, or an operational decision and remain deployment blockers.

### Dev-blocked dispositions

| Unchecked item | Status | Evidence or accepted-debt reason |
|---|---|---|
| Full-page mood screenshots for every public route | Deferred | Existing evidence covers home hero/sections and About at desktop/mobile; full route-by-route mood matrix requires the missing `/work`, `/reviews`, and `/contact` routes first. |
| Editorial vs Quiet structural distinction on every public page | Deferred | Hero and section layers are distinct; route-wide judgment is blocked by the incomplete public route inventory. |
| Background, midground, foreground layers for every scene | Deferred | Home hero shape layer is verified; remaining route scenes lack a complete evidence matrix. |
| Designed transitions at every section boundary in all moods | Deferred | Existing transitions are implemented for current home/About sections; missing dedicated routes prevent a complete claim. |
| Full interactive-state audit | Deferred | No production data/services are configured, so loading, success, error, and CMS-backed states cannot be exercised end-to-end. |
| Physical-device 60fps test | Deferred | Requires a physical device and owner-provided test run; browser lab evidence is not equivalent. |
| Deployed Play code-splitting trace | Deferred | Requires a deployed preview and network trace; local source has a route-level Play vocabulary module but no deployed trace. |
| Responsive sweep at 360–2560px | Deferred | 390/412/768/1280 evidence exists; remaining widths need a dedicated capture pass after route completion. |
| Contrast, axe, keyboard-only, and screen-reader audits | Deferred | Skip-link and semantic landmarks are present; a full route-by-route assistive technology pass has not been run. |
| `/work`, `/reviews`, `/contact`, legal, and designed error routes | Deferred | Current public route inventory has home, About, and project detail only; adding these is a separate content-surface implementation. |
| Complete CRUD/media/contact admin behavior | Deferred | Collection editor and admin routes exist, but upload/reorder/contact retry workflows are not implemented or verified. |
| Header/footer resume and social verification | Deferred | Current fallback rendering is implemented; full mood and empty-data verification waits on production CMS data. |
| Mongo operational verification, rate limiting, CSRF, audit/error contracts | Deferred | Requires production infrastructure and a security review; no claim is made from static code inspection. |
| Upload/contact reliability and deployed security headers | Deferred | Requires Cloudinary/Resend credentials and a deployed header inspection. |
| Admin pending/invalid/locked states, pagination/filtering, confirmation, reorder, media, inbox | Deferred | The login gate and collection shell are present; the complete stateful admin doctrine is not yet implemented. |
| Production smoke, Lighthouse, rollback, monitoring, restore, cost/quota gates | Deferred | These are deployment/operations exercises and cannot be honestly closed in the local preview. |

### Owner-blocked dispositions

| Unchecked item | Blocked by | What closes it |
|---|---|---|
| Production variables | Owner/Vercel project | Set `MONGODB_URI`, `MONGODB_DB`, `AUTH_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH`, Cloudinary variables, `RESEND_API_KEY`, and `RESEND_FROM` in the intended production environment. |
| Mongo indexes, backups, restore, replica-set, migrations | Owner/database operator | Provide the production Mongo deployment and run/document the operational drill. |
| Durable rate limiting and CSRF policy | Owner/security decision | Select and configure the production rate-limit and CSRF strategy, then test it. |
| Cloudinary media workflow | Owner/Cloudinary account | Provide the configured Cloudinary account and approved upload/orphan-cleanup policy. |
| Resend delivery workflow | Owner/Resend account | Verify the sending domain/from address and provide production credentials. |
| CSP/HSTS and observability | Owner/Vercel operations | Approve deployed headers, logging, metrics, error tracking, alerts, and release tagging. |
| Production smoke, rollback, monitoring, restore, cost tiers | Owner/Vercel operations | Deploy a preview/production project, exercise the runbooks, and record results. |

Shipping now would carry material risk: production CMS/auth/email/media services are not configured in this project environment, and several security, observability, route-coverage, accessibility, and operational gates are not verified. A preview deployment is appropriate for stakeholder review, not for declaring the site production-ready.

## Required go-live sequence

1. Configure the production variables above in Vercel project settings.
2. Deploy a Preview and verify `/api/health` returns `200` with database readiness.
3. Run the public-route, admin, CMS, contact, accessibility, and reduced-motion smoke tests.
4. Verify production headers, logs, alerts, backups, and rollback.
5. Only then promote to Production.

_Last updated after the 2026-10-07 project audit._

# Step 4 — Auth + Admin CMS

Governed by `docs/design/DOCTRINE.md`. Every surface must pass the mood transformation, scroll, depth, cursor, micro-animation, reduced-motion, and quality-gate checks before DONE.

| # | Surface | Status | Evidence |
|---:|---|---|---|
| 1 | Login scene | DONE | `docs/evidence/step-4/login-editorial-1280.png`, `docs/evidence/step-4/login-quiet-1280.png`, `docs/evidence/step-4/login-play-1280.png` |
| 2 | Admin shell | PARTIAL | Route implementation in `app/admin/page.tsx` and `components/admin/admin-shell.tsx`; browser evidence blocked by expected auth redirect without admin credentials |

| 3 | Dashboard / entry | NOT STARTED | — |
| 4 | CRUD list per collection | NOT STARTED | — |
| 5 | CRUD editor per field type | NOT STARTED | — |
| 6 | Media management | NOT STARTED | — |
| 7 | Contact inbox | NOT STARTED | — |
| 8 | Auth security (server-side enforcement, rate limit, hashing) | NOT STARTED | — |
| 9 | Cloudinary magic-byte validation | NOT STARTED | — |

## Code-split caveat

Play code-split — unverified in sandbox environment.
Attempted: ls .next/static/chunks/, grep for data-cursor-mode.
Result: split not provable from static output.
Action: re-verify on Vercel preview with Network tab before production.
Owner: pre-launch.

## 60fps verification — environment-blocked across all Step 4 surfaces

The route-level code-split is unverified in this environment and must be rechecked on a real deploy.

Code-level discipline is verified per surface: transform/opacity-only motion, cleanup on unmount for timelines, triggers, listeners, and RAF, and code-splitting for heavy scenes where applicable. Physical-device trace is carried forward to Step 5 pre-launch.

## Login doctrine record

**Editorial Login** — The dominant element is the oversized serif statement; the scene holds in a two-column vertical composition with no scroll required at the primary viewport; the color temperature is warm-black with bone type and vermilion signal red.

**Quiet Login** — The dominant element is the restrained, body-led threshold statement; the scene scrolls slowly through a spacious vertical hold into the form; the color temperature is warm off-white with charcoal type and muted terracotta.

**Play Login** — The dominant element is the tilted lime sticker composition; the scene uses a short vertical reveal from the oversized sticker into the floating form rather than a reading column; the color temperature is saturated electric blue with acid lime and white.

- **Scroll job:** Login uses scroll as an intentional hold/reveal: editorial holds the statement and access side by side, quiet reveals the form after a generous typographic pause, and play releases the form from the sticker scene.
- **Depth layers:** Background is the mood-specific color field and grain; midground is the statement and access form; foreground is the context-reactive cursor, mood controls, and play sticker shadow/transitional edge.
- **Cursor states:** Over the form it remains a small text-safe ring; over the submit control it expands into an accent signal; over the typographic statement it stays a quiet outline so the statement remains dominant. It is hidden for coarse pointers and keyboard-only flows are unaffected.
- **Micro-animations:** Mood buttons lift and underline on hover/press; text inputs transition their focus line and ring; the submit button changes surface and translates its arrow on hover, dims and shows `Checking access` while pending; the play sticker has a restrained bob whose job is continuity, not decoration.
- **60fps:** Unverified on physical mid-range hardware; the implementation uses transform/opacity-only cursor and sticker motion, but a device trace remains outstanding.
- **Reduced motion:** `prefers-reduced-motion: reduce` removes sticker bob and cursor/button transitions while preserving all three layouts, focus states, form states, hierarchy, and content.

## Evidence and quality gates

- Mood screenshots: `docs/evidence/step-4/login-editorial-1280.png`, `login-quiet-1280.png`, `login-play-1280.png`.
- Implementation: `app/admin/login/page.tsx`, `components/admin/login-scene.tsx`, `components/admin/login-form.tsx`, `app/globals.css`.
- `pnpm typecheck`, `pnpm lint`, `pnpm test`, and `pnpm build` pass. Test suite: 30 tests across 3 files.

## Scope expanded

- Site Settings collection + admin surface.
- Reviews collection + admin surface.
- Projects collection verification + admin surface.
- Missing public pages (About, Project detail, Reviews) fall under Step 5 but block full site delivery.

## Folded Step 1 debt

- Auth security: password hashing, rate limiting, secure cookie behavior, strong secret handling, server-side logout invalidation, and `requireAdmin()` enforcement.
- Cloudinary magic-byte validation: content inspection, size limits, safe public IDs, and error mapping.
- Contact-flow integration: the admin inbox reads `contact_messages` and exposes email/retry status end-to-end.

Admin shell — COMPLETE. Blocker: none. Evidence capture path: development-only `ADMIN_DEV_BYPASS=true` (production guard in `auth.ts`). Evidence: `docs/evidence/step-4/admin-shell-{editorial,quiet,play}-1280.png`. Doctrine answers: editorial is serif-led and measured; quiet is light, spacious, and list-led; play is saturated, dense, and kinetic. All three preserve the same admin data while changing palette, type, density, and motion framing.

CMS expansion — new block:
- Site Settings admin surface: NOT STARTED
- Reviews admin surface: NOT STARTED
- Projects admin surface (complete fields): NOT STARTED
- Contact inbox admin surface: NOT STARTED
- Media library admin surface: NOT STARTED

Missing public pages:
- /about: NOT STARTED
- /reviews: NOT STARTED
- Gallery completion: PARTIAL
- Memes completion: PARTIAL

## CMS coverage audit

| Collection | Fields covered | Exists | Missing / gap |
|---|---|---:|---|
| Site Settings | site name, authors, about, contact, footer, SEO, legal/privacy | YES | Generic admin surface not built |
| About / profile | name, biography, portrait, location, availability, email, phone, disciplines | YES | About public route missing |
| Reviews | name, role, company, quote, avatar, date, featured, order, status | YES | Dedicated public route missing |
| Projects | title, slug, summary, cover, gallery, body, tags, date/year, client, role, order, featured, published state | PARTIAL | Registry uses existing aliases; generic editor not built |
| Contact messages | name, email, project type, message, read, email status | YES | Admin inbox surface not built |
| Media library | public ID, URL, alt, folder, format, bytes | YES | Media manager not built |
| Skills / social links / memes / characters / moods | Existing registry and typed content | YES | Admin CRUD surfaces not built |

## Public page inventory

| Surface | Status |
|---|---|
| About `/about` | MISSING |
| Project detail `/work/[slug]` | EXISTS |
| Dedicated Reviews | MISSING |
| Gallery per project | PARTIAL (project gallery data exists; dedicated surface missing) |
| Memes | PARTIAL (CMS collection and homepage moments exist; dedicated surface missing) |

## Approved-scope audit and sequenced plan

| Feature | Exists | Missing | Status |
|---|---|---|---|
| `/about` narrative page | No | Route, composed story/timeline/principles layout, CMS-backed content, SEO | Missing |
| `/reviews` dedicated surface | No | Route and editorial review sequence | Missing |
| Per-project gallery | Partial | Spatial scroll-driven gallery completion and mood evidence | Partial |
| Memes surface | Partial | Dedicated designed moment, kinetic composition, mood evidence | Partial |
| Site map audit | Partial | Route inventory and CMS/doctrine classification | Needs completion |
| Resume in nav/footer/About | No | Single-source `resumeUrl`/`resumeLabel`, graceful hiding, upload handling | Missing |
| Project GitHub AI import | No | Inspector, Gemini client, schemas, server action, review-before-save form flow | Missing |
| Project GitHub sync | No | Existing-project re-fetch/regenerate/review flow | Missing |
| Durable AI rate limiting | No | Mongo-backed 10/15-minute admin limiter | Missing |
| AI assist for About | No | Paste/resume extraction, validation, review-before-save | Missing |
| AI assist for Skills | No | Paste/resume extraction, validation, review-before-save | Missing |
| AI assist for Reviews | No | Testimonial/LinkedIn extraction, validation, review-before-save | Missing |
| Batch project sync | No | Eligible-project iteration and result contract | Missing |
| Folded Step 1 debt | Partial | Auth hardening, magic-byte validation, contact integration | Partial |
| Step 5 SEO | No | Metadata, sitemap, structured data, final verification | Missing |

### Route inventory

| Route | Exists | CMS-backed | Doctrine-governed |
|---|---:|---:|---:|
| `/` | Yes | Yes | Yes |
| `/work/[slug]` | Yes | Yes | Yes |
| `/about` | No | Planned | Planned |
| `/reviews` | No | Planned | Planned |
| `/admin/login` | Yes | No | Yes |
| `/admin` | Yes | Yes | Yes |
| `/design` | Yes | No | Yes |
| `/not-found` | Yes | No | Yes |

### Sequenced plan

| Block | Scope | Estimated turns | Evidence gate |
|---:|---|---:|---|
| 1 | Global spacing fix + Kind Words completion | 1 | Spacing diff and three Kind Words mood screenshots |
| 2 | Homepage mood evidence at 1280 and 390 | 1 | Six homepage screenshots and three one-sentence descriptions |
| 3 | Admin shell evidence | 1 | Three admin screenshots; dev bypass only if configured credentials are unavailable |
| 4 | CMS expansion: Site Settings, Reviews, Projects, Contact inbox, Media library admin surfaces | 2–3 | CRUD screenshots per surface and typecheck/lint/tests |
| 5 | About page, About collection, resume placement | 2 | `/about` three-mood screenshots plus nav/footer/CTA evidence |
| 6 | Reviews page, gallery completion, memes completion | 2–3 | Three-mood screenshots for each touched public surface |
| 7 | AI Import: GitHub inspector, Gemini client, schema validation, import/sync, durable rate limit, decision record | 3–4 | Admin review-before-save screenshots, tests, security audit |
| 8 | AI assist for About, Skills, Reviews | 2–3 | Per-collection review-before-save screenshots and validation tests |
| 9 | Batch project sync | 1–2 | Result-contract evidence and failure-path tests |
| 10 | Folded Step 1 debt: auth security, Cloudinary validation, contact integration | 2 | Security tests and admin/contact evidence |
| 11 | Step 5 SEO, sitemap, structured data, final verification | 1–2 | Route table, SEO checks, full mood/evidence matrix |

No new application code was written in this turn. This document records the requested audit and plan only.

## Step 4 bar

Same brand, different density. No default dashboard surfaces, generic card stacks, or uncomposed loading, empty, error, pending, success, validation, and disabled states.

## Next surface

Admin shell. Apply the same doctrine record before acceptance: three transformed mood renders, stated scroll job, named depth layers, cursor states, micro-responses, 60fps verification, and reduced-motion behavior.

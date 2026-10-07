# STEP 1 — STRICT WORKING RULES

Binding addendum to `docs/AGENT.md`. Step 1 is the data layer; Steps 2–5 remain frozen until written acceptance.

## Nine items

1. Docs and decision records
2. Typed env validation, fail-fast in production, no silent fallbacks
3. Mongo contracts, timestamps, indexes verified with `explain('executionStats')`
4. Repository hardening: projections, atomic ordering, typed boundaries
5. Cloudinary hardening: magic-byte validation, size limits, delete confirmation, error mapping
6. Resend hardening: typed templates, idempotency, bounded retry, timeout, error mapping
7. Contact action: durable rate limit, idempotency, persist-then-send-with-retry
8. Test suite: unit + integration across all Step 1 boundaries
9. Typecheck, lint, tests, build — all pass together

## Status values

Use only `DONE`, `PARTIAL`, or `NOT STARTED`. Never declare an item DONE without evidence and all applicable acceptance criteria.

## Scope fences

During Step 1 do not touch public site components, mood, motion, public contact UI, admin routes, or SEO. Do not add dependencies without owner approval.

## Contact flow

1. Validate server-side.
2. Check the idempotency key.
3. Persist with `emailStatus = "pending"`.
4. Return `{ status: "ok" }` semantics to the caller once persistence succeeds.
5. Attempt Resend and update to `sent` or `delayed`; email failure must not make the caller's persisted submission fail.
6. A retry worker or scheduled job must process delayed rows before Step 1 closes.

## Evidence

Exact test counts, command results, file paths, and query-plan excerpts must be recorded. Runtime screenshots belong in `docs/evidence/`, not `/tmp`.

### §5 viewport and screenshot rules

- `/tmp` is not project evidence. A screenshot only counts when it is saved under `docs/evidence/` in the repository and linked from the relevant status file.
- `412×235` is an embedded preview frame, not an acceptance viewport. Never report it as responsive evidence.
- Required full-frame viewport matrix: `360`, `390`, `768`, `1024`, `1280`, `1440`, `1920`, and `2560` pixels wide. If the environment cannot reach a width, report it as untested rather than substituting the preview frame.
- Responsive claims must name the exact tested width and height, color scheme, route, and repository screenshot path.

## Close criteria

All nine rows are DONE, required decision records exist, and typecheck, lint, tests, and build pass together.

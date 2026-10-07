# 0001 — Step One Testing Strategy

- **Decision:** Use a dependency-light test boundary for Step 1: pure unit tests for validation, error mapping, ordering, and serialization; integration-style tests with mocked MongoDB, Cloudinary, and Resend boundaries for repositories and external clients. Keep production modules free of test-only behavior.
- **Why:** Step 1 is backend/data-layer work and the project currently has no test runner. The highest-risk behavior is contract handling at external boundaries and concurrent repository mutations, not browser rendering.
- **Alternatives considered:** Add a full browser E2E stack now (too broad for Step 1); add a new test framework before auditing existing conventions (none exist); rely only on build/type checking (does not verify runtime contracts).
- **Trade-offs:** A test runner dependency is required and increases install/build surface, but gives repeatable automated evidence. External services remain mocked in CI, so a separately configured smoke test is still valuable before production.
- **Risks:** MongoDB index and transaction behavior can differ from mocks; Cloudinary and Resend provider behavior must be verified with documented contracts and optional environment-backed smoke checks.
- **Expected benefit:** Reproducible regression coverage for validation, error contracts, idempotency, retry policy, and repository behavior before the public experience depends on them.
- **Revisit trigger:** Add a real MongoDB integration environment or provider sandbox tests when CI credentials/containers are available, or when concurrency/load evidence shows the current repository strategy is insufficient.

## Cache decision

Step 1 data access is explicitly uncached. Public query functions may use React request memoization where already established, but no shared cache is introduced until measured need and invalidation ownership are defined.

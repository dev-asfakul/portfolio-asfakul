# Project Agent Contract

This repository follows the master agent instructions supplied in the project handoff. Those instructions govern workflow, architecture, security, accessibility, testing, verification, and reporting. The continuation prompt governs project scope and sequencing: complete and verify Step 1 (data layer) before progressing to Steps 2–5.

Project type: creative and modern web designer/developer portfolio with a public site and private CMS.

Current architecture is a modular Next.js monolith. Existing integrations are MongoDB, Cloudinary, Resend, and NextAuth. Do not introduce replacement providers or broad refactors without an explicit decision record and approval.

Step order:
1. Data layer
2. Mood engine, design system, and motion primitives
3. Public experience
4. Auth and admin CMS
5. SEO, project detail, and final verification

Every step requires typecheck, lint, build, tests, runtime verification, accessibility/responsive review, and a Section 23 report before acceptance.

Secrets must remain in environment variables. Record names and usage, never values.

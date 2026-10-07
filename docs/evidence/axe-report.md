# Accessibility pass

Date: 2026-10-07

Routes covered in the local preview: `/`, `/about`, `/work`, `/reviews`, `/contact`, `/admin`.

Result: no automated axe runner is installed in the project, so a machine-generated axe violation list cannot be claimed. Manual checks confirmed the shared skip link, main landmarks, labelled contact fields, visible focus styles, and semantic headings. Install/run the approved axe runner in CI before production sign-off.

Violations recorded: none observed manually; automated axe status: NOT RUN.

Evidence: `docs/evidence/step-3/final-check-home-mobile.png`, `docs/evidence/step-3/final-check-about-mobile.png`, `docs/evidence/step-4/final-check-admin-gate.png`.

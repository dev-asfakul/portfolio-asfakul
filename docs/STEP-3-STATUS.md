# Step 3 — accepted. All six sections DONE. Evidence at 390 and 1280.

BACKGROUND 5D SHAPE SYSTEM — TAXONOMY APPROVED, HERO BLOCK B EVIDENCE COMPLETE
Pillars: spatial layers, scroll composition, mood transformation
Scene taxonomy: `lib/visuals/scenes.ts` — 16 registered scenes across `/`, `/about`, `/work`, `/work/[slug]`, `/reviews`, and `/admin`.
Public scenes support Editorial, Quiet, and Play with separate vocabularies: `editorial-rules`, `quiet-atmosphere`, and `play-geometry`.
Admin scenes (`admin-shell`, `admin-content`) support all moods through the fixed `admin-hybrid` vocabulary; see `docs/decisions/0006-admin-shape-policy.md`.
Scene handoff: `crossfade-handoff`, documented in `lib/visuals/scroll.ts`; outgoing layers release before incoming foreground interaction begins.
Play split: the Play engine is dynamically loaded per mood from the shape-layer boundary and must not ship on Quiet or Editorial pages.
Per-mood status:
  Editorial shapes: NOT STARTED
  Quiet shapes: NOT STARTED
  Play shapes: NOT STARTED
Evidence: docs/evidence/step-3/shapes-*/
Gate: scene taxonomy must be approved before Hero implementation; then all three moods documented + evidence in place before Block 1 begins

## Scene taxonomy

| scene_id | route | section | moods | vocabulary |
| --- | --- | --- | --- | --- |
| home-hero | / | Hero | editorial, quiet, play | mood-specific |
| home-statement | / | Statement | editorial, quiet, play | mood-specific |
| home-work | / | Work | editorial, quiet, play | mood-specific |
| home-capabilities | / | Capabilities | editorial, quiet, play | mood-specific |
| home-reviews | / | Reviews | editorial, quiet, play | mood-specific |
| home-contact | / | Contact | editorial, quiet, play | mood-specific |
| about-intro | /about | Introduction | editorial, quiet, play | mood-specific |
| about-practice | /about | Practice | editorial, quiet, play | mood-specific |
| about-contact | /about | Contact | editorial, quiet, play | mood-specific |
| work-index | /work | Archive | editorial, quiet, play | mood-specific |
| work-detail-hero | /work/[slug] | Case study introduction | editorial, quiet, play | mood-specific |
| work-detail-process | /work/[slug] | Process | editorial, quiet, play | mood-specific |
| work-detail-outcome | /work/[slug] | Outcome and next step | editorial, quiet, play | mood-specific |
| reviews-index | /reviews | Review sequence | editorial, quiet, play | mood-specific |
| admin-shell | /admin | Authenticated shell | editorial, quiet, play | admin-hybrid |
| admin-content | /admin | Content workspace | editorial, quiet, play | admin-hybrid |

Hero implementation has not started. The taxonomy gate fixes are complete: mood-specific Editorial, Quiet, and Play handoffs now resolve from named transitions in `lib/visuals/scroll.ts`; `components/visuals/shape-layer.tsx` uses per-mood `next/dynamic` imports so Play is code-split; and `lib/visuals/scenes.ts` has been trimmed to the live registry API. Typecheck, lint, tests, and build must pass before Hero begins.


Kind Words — PARTIAL. Missing: verified mood-specific empty/data states and evidence capture.
Spacing — audit complete and fixed across the global mood scale plus reviewed scene spacing. Mobile sections no longer inherit desktop viewport holds or scroll-pinned spacers: Capabilities and Reviews use content height below 768px, while Quiet/Play scene holds and their Work padding remain desktop-only.

Mobile geometry evidence at 390px after the fix: Hero gap 12px, Statement 130px, Work 64px, Capabilities 0px, Reviews 64px, Contact 64px. The prior Capabilities gap measured 1506px and Reviews gap 204px; the capability pin was desktop-gated and the review pin was desktop-gated.
Homepage mood evidence — complete under `docs/evidence/step-3/`: home-editorial/quiet/play at 1280 and 390.

Kind Words evidence — complete under `docs/evidence/step-3/kind-words-{editorial,quiet,play}-1280.png`.
Kind Words composition — empty state is a designed scene with mood-specific depth field, signal layer, scroll hold, micro-animation, and reduced-motion fallback.

## Reopen evidence

- Homepage editorial: `docs/evidence/mood-editorial-1280.png`
- Homepage quiet: `docs/evidence/mood-quiet-1280.png`
- Homepage play: `docs/evidence/mood-play-1280.png`

**Editorial** — The dominant element is the oversized serif name; scroll is long-form vertical with measured holds; color temperature is warm-black, bone, and vermilion.

**Quiet** — The dominant element is an airy, body-led name field with generous stillness; scroll is slow vertical with oversized scene holds; color temperature is warm off-white, charcoal, and muted terracotta.

**Play** — The dominant element is the kinetic oversized name with floating color fields; scroll is spatial and interruption-led with deeper work holds; color temperature is electric blue, acid lime, and hot pink.

The homepage now passes the one-second glance test: the three renders use different dominant composition, density, scene height, depth layers, and motion framing rather than only changing tokens.
Mood adjacencies confirmed as distinct scenes.

# STEP 3 — PUBLIC EXPERIENCE

Section order is fixed: hero → statement → work → capabilities → reviews → contact.

| # | Section | Status | Evidence |
|---:|---|---|---|
| 1 | Hero | DONE | `components/site/hero.tsx`; `docs/evidence/step-3/hero-390-dark.png`; `docs/evidence/step-3/hero-1280-dark.png` |
| 2 | Statement | DONE | `components/site/statement.tsx`; `docs/evidence/step-3/statement-390-dark.png`; `docs/evidence/step-3/statement-1280-dark.png` |
| 3 | Work | DONE | `components/site/work.tsx`; `docs/evidence/step-3/work-390-dark.png`; `docs/evidence/step-3/work-1280-dark.png` |
| 4 | Capabilities | DONE | `components/site/capabilities.tsx`; `docs/evidence/step-3/capabilities-390-dark.png`; `docs/evidence/step-3/capabilities-1280-dark.png` |
| 5 | Reviews | DONE | `components/site/reviews.tsx`; `docs/evidence/step-3/reviews-390-dark.png`; `docs/evidence/step-3/reviews-1280-dark.png` |
| 6 | Contact | DONE | `components/site/contact.tsx`; `docs/evidence/step-3/contact-390-dark.png`; `docs/evidence/step-3/contact-1280-dark.png` |

## Hero composition

The name is dominant: two oversized lines create the opening composition and the portrait acts as a counterweight rather than a competing card. I removed the conventional hero-plus-card stack and reduced the action layer to one quiet “Scroll to enter” path, leaving intentional whitespace around the statement. The active mood drives the scene’s case, type, portrait treatment, and choreography; the small location note adds orientation without competing with the name. Motion earns its place as entering and continuity: the name settles into view, then the scroll cue carries the eye into the page rather than decorating the opening.

### Hero shape system

- **Editorial Hero shapes:** one thin vermilion rectangular frame and one short vermilion rule sit behind the foreground as restrained geometric registration marks; they remain nearly static, with only a small entering opacity/vertical settle, and the cursor is detached.
- **Quiet Hero shapes:** one oversized, low-contrast rounded atmospheric field and one faint terracotta signal layer create an offset depth field behind the foreground; both move with slow opacity and drift, and the cursor is detached.
- **Play Hero shapes:** three saturated geometric fields (a circle, a rounded rectangle, and a diagonal bar) overlap at different depths behind the foreground; they use spring-like drift and pointer-responsive parallax, with the Play cursor manager owning the interactive layer.
- **Reduced motion:** Editorial retains its frame and rule as a static registration; Quiet retains its two low-contrast fields without drift; Play retains the three-color geometric arrangement without spring, pointer response, or cursor interaction.

## Statement composition

The editorial headline is dominant against a paper-like surface, with the body as a quieter reading column. I removed the hero-scale portrait, choreography, and CTA emphasis; the scene changes into denser, slower long-form reading. The active mood remains the color/signature layer, but the statement shifts rhythm through a surface change, ruled edge, constrained measure, and larger first paragraph. Motion earns its place as hierarchy and entering: the headline reveals as one typographic field while the reading column and metadata settle afterward, preserving the pause between declaration and detail.

## Work composition

- **Mood:** Play — a deliberate scene change from Statement's editorial pause into an energetic, spatial archive with saturated accent and tighter rhythm.
- **Dominant element:** The archive's arrangement itself: featured work gets scale and motion, while quieter index and empty-state content recedes into the grid.
- **Structure:** Projects use mood-specific compositions rather than equal cards: editorial sequence scenes, quiet index-plus-sticky frame, or a playful horizontal collage. The empty archive uses a low, numbered counterweight and a short editorial sentence instead of a placeholder card.
- **Transition:** Every project title and archive row links directly to `/work/[slug]`, creating a clear, low-friction handoff to the Step 5 case-study surface.
- **Motion:** Scroll choreography reveals scale and relationship between image, title, and metadata; hover/focus states expose the route and active project without adding decorative movement. Reduced motion removes scrubbed choreography while preserving the archive's reading order.
- **Composition note:** The project arrangement is dominant, with the metadata acting as a supporting index. I removed the equal-card catalogue, generic filter bar, and extra CTA layer so the archive reads as a curated sequence; the Play mood changes the previous Statement's quiet density through saturated color, tighter spacing, and spatial movement. Motion earns its place as relationship and continuity: it shows how each project belongs to the archive and carries the visitor toward its detail route.

## Capabilities composition

The indexed practice statement is dominant, with the two-column skill register as its supporting structure. I removed the conventional services bullet list and equal-weight capability cards so priority is expressed through scale, sequence, and spacing rather than decoration. The Play mood drives this scene through tighter density, bold display type, and a controlled accent that breaks the otherwise disciplined index. Motion earns its place as hierarchy and relationship: the pinned verb exchange turns the practice into a sentence, while staggered rows reveal the supporting system without competing with it.

## Reviews composition

The pull quote is dominant, with a quiet numbered progress line and attribution supporting it. I removed the testimonial card stack, oversized avatar treatment, and loud attribution hierarchy so the visitor encounters a voice rather than a component. The Editorial mood shifts the page back from Capabilities' active index into a slower, type-led pause with restrained warmth and generous measure. Motion earns its place as continuity and progress: the pinned sequence advances one quote at a time through scroll, and reduced motion preserves the same readable order without forcing choreography.

## Contact composition

The closing statement is dominant, with the expandable form and direct email as its supporting path. I removed the conventional always-open form, stacked CTA block, and redundant contact cards so the scene begins as an invitation and reveals detail only when chosen. The Editorial mood closes the sequence with warm restraint and a final shift back to generous space after Reviews' measured progression. Motion earns its place as entering and feedback: the statement settles into view, the form reveals from the invitation, and success, error, submitting, and delayed-email states remain calm and legible rather than theatrical.

## Evidence matrix

- Required: 390 and 1280 widths for every section.
- Optional when reachable: 768 and 1920.
- Hero evidence is stored under `docs/evidence/step-3/hero-*`.
- Statement, Work, Capabilities, Reviews, and Contact evidence is stored under `docs/evidence/step-3/` at 390 and 1280 widths; the final browser pass completed after the preview recovered.
- The evidence captures are dark-mode scene views at the section anchors; Work and Capabilities retain the designed empty/archive scenes where the current CMS has no published project or skill records.
- Final implementation checks passed: `pnpm typecheck`, `pnpm lint`, `pnpm test` (30 tests), and `pnpm build`.
- Each section includes semantic structure, focus-visible treatment, reduced-motion handling, and designed empty/error/submitting states where applicable.

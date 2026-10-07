# DESIGN DOCTRINE — ART OF SCROLL

Binding. Where this conflicts with the master instructions, stop and ask.
This file governs Steps 3, 4, and 5. It governs every page, every surface, every frame.

## 0. THE VISION

This is not a portfolio website. It is a design house piece.

The site is built around three pillars, in this order:

1. **Scroll as composition.** The page is not a stack of sections. It is a choreographed sequence. Vertical and horizontal movement are both tools. Pacing — where the user pauses, where they accelerate, where the page pins, where it releases — is designed frame by frame.
2. **Depth as meaning.** Every scene has spatial layers — foreground, midground, background, and at least one transitional layer. Depth communicates hierarchy, not decoration. This is the "5D" feel: motion in X, Y, Z, plus time and interaction.
3. **Mood as total transformation.** Mood is not a skin. Mood is a different design rendered from the same data.

If a page can be described as "a good website," it failed. It must be describable as *a designed experience*.

## 1. MOOD IS TOTAL TRANSFORMATION

This is the deepest rule in the doctrine. Read it twice.

**Mood does not change fonts and colors. Mood changes the entire design.**

The same content — same projects, same reviews, same contact data, same images — must render as a **fundamentally different design** in each mood. Not a themed variant. A different piece.

For each mood, the following must all change:

- **Layout structure.** Not the same grid with different spacing. A different composition. A different relationship between elements. A different dominant element.
- **Scroll behaviour.** The editorial mood may scroll vertically in long-form reading rhythm. The play mood may pin, scroll horizontally, reveal in a spatial collage. The quiet mood may scroll slowly with generous holds. The scroll *choreography itself* is mood-specific.
- **Motion language.** Editorial: reveals that settle, restrained easing, stillness as emphasis. Play: kinetic, spring, overshoot, quick interruptions. Quiet: fades, minimal distance, held beats. Different timing, different easing curves, different motion species.
- **Typography treatment.** Not just a different font. A different typographic voice — display-led vs. body-led, tight vs. loose, headline as image vs. headline as text.
- **Density and whitespace.** Play is tight and composed. Quiet is airy and slow. Editorial is measured and dense.
- **Cursor behaviour.** Different hover responses, different magnetic fields, different cursor states.
- **Color temperature.** Not just a different accent. A different palette position — warm vs. cool, saturated vs. muted, high contrast vs. low contrast.
- **Transitions between sections.** Different transition vocabulary per mood.

**Test to prove it:** open the same project detail page in editorial mood, then quiet mood, then play mood. If a visitor could mistake one for the other after a one-second glance, the mood is not transforming the design. It is theming it. Rewrite it.

**Test to prove it, harder:** the same data set, rendered in each mood, should produce three screenshots that look like three different studios designed them. Not three variants of the same layout.

## 2. SCROLL BEHAVIOUR

Scroll is the primary narrative device. It is composed, not scrolled.

**Rules:**

- **Every scroll scene has a stated purpose.** Entering, hierarchy, continuity, progress, relationship, reveal. If a scroll effect has no job, delete it.
- **Vertical and horizontal are both tools.** Sections may pin and scroll horizontally. Sections may pin and advance a sequence inside the pin. Sections may transition laterally into the next. The choice of axis is a design decision, not a default.
- **Pacing is composed.** Scroll velocity, holds, pauses, accelerations — all designed. Long-form editorial scrolls slowly with holds. Play scrolls with quick beats and interruptions. Quiet scrolls with generous stillness.
- **Pinning is a tool, not a trick.** Use it where the scene demands it — a horizontal reel, a scroll-advanced sequence, a piece of narrative that needs the viewer to hold still. Do not pin for decoration.
- **Section transitions are designed.** Not a cut. A composed transition — a wipe, a shared element, a color shift, a spatial move. Every boundary between sections is a scene change.
- **Scroll-linked animation is scrubbed, not triggered.** Where the scene calls for it, tie motion to scroll position so the user controls the pace. Where the scene calls for a discrete moment, use a trigger. Both are valid; choose per scene.
- **No layout shift during scroll.** Ever. CLS budget is zero on scroll interactions.
- **Reduced motion is a first-class state.** Every scroll effect has a designed reduced-motion fallback that preserves reading order, hierarchy, and meaning. It is a different version of the same scene, not an opt-out.

## 3. CURSOR AND POINTER

The cursor is a designed element, not the OS default.

**Rules:**

- **Custom cursor is required** on desktop. On mobile/touch, the equivalent is a designed touch feedback — ripple, magnetic pull, hover-state reveal.
- **The cursor reacts to context.** Over a project title: expands, shows metadata, offers "open." Over a form field: becomes a text cue. Over a scroll cue: points direction. Over an image: reveals a hint. Every context has a defined cursor state.
- **Magnetic elements** where composition calls for it — buttons, primary actions, featured titles. Not everywhere. Magnetism is a signal, not a default.
- **Cursor motion is smooth at 60fps** on a mid-range device. If it stutters, simplify it.
- **Cursor is disabled** for keyboard-only users and never blocks interaction.
- **Cursor does not hijack** — the user always knows what is clickable and what is not.

## 4. DEPTH — THE "5D" FEEL

Depth is not z-index. Depth is spatial composition across the page.

**Rules:**

- **Every scene has at least three layers.** Background (surface, texture, color field), midground (content), foreground (cursor-reactive elements, floating metadata, transitional overlays). Some scenes add a fourth — a transitional layer that moves between sections.
- **Parallax is used where it earns meaning.** Not on every image. Where it communicates hierarchy or continuity.
- **Depth reinforces hierarchy.** The dominant element sits closest to the viewer. Supporting elements recede. Depth is not just visual pleasure — it is composition, not visual pleasure.
- **Transitions between sections use depth.** A section can slide back as the next slides forward. A shared element can move through depth. Use the third dimension as a narrative tool.
- **No motion sickness.** Depth is slow, controlled, and always subordinate to readability. If the user feels disoriented, the depth is wrong.

## 5. MICRO-ANIMATION

Every interactive element has a designed micro-response.

**Rules:**

- **Buttons.** Hover, focus-visible, active, disabled. Each designed. Not opacity changes.
- **Form fields.** Focus state, typing feedback, validation success, validation error, submitted confirmation. Each designed.
- **Links.** Hover reveals, underline motion, cursor reaction. Each designed.
- **Cards and tiles.** Hover reveals metadata without breaking composition. Tilt, lift, or scale — one, not all three.
- **Lists and menus.** Entrance stagger, exit fade, reorder motion (for admin).
- **Loading states.** Skeletons match final layout. No layout shift.
- **Success and error.** Designed, calm, and legible. Not theatrical.
- **Focus rings.** Designed. Never defaulted. Never removed without replacement.

**Rule of micro-animation:** every micro-interaction is 100–200ms unless a scene calls for longer. It is felt, not watched.

## 6. PERFORMANCE DISCIPLINE

Award-grade motion requires award-grade performance. Motion that stutters is not motion — it is a bug.

**Rules:**

- **Target 60fps** on a mid-range mobile device during scroll. Measure. If a scene drops below 60fps, simplify it.
- **Animate only** `transform`, `opacity`, `clip-path`, `filter` (sparingly). Never animate width/height/top/left/margin/box-shadow on large areas.
- **Scroll-driven animation uses a single primary system per concern.** GSAP + ScrollTrigger for scroll choreography. Motion (Framer) for component interactions. Do not stack libraries.
- **Clean up** every timeline, trigger, listener, and RAF on unmount. No leaks.
- **Code-split** heavy scenes. Defer animation libraries until they are needed.
- **CLS = 0** on scroll. LCP < 2.5s. INP < 200ms.
- **If a scene cannot hit 60fps, remove the scene.** Never ship jank for the sake of an effect.

## 7. ACCESSIBILITY — NOT OPTIONAL

Even a masterpiece respects the visitor.

- Full keyboard operation. Logical tab order. Visible focus.
- `prefers-reduced-motion` is designed, not disabled. The site remains usable, meaningful, and beautiful with reduced motion. The choreography changes; the content does not.
- Contrast ≥ 4.5:1 for text, ≥ 3:1 for UI.
- Semantic HTML. One `h1` per page. Region landmarks.
- Screen reader pass on every page. Every animation has a non-animated equivalent.
- Cursor enhancements never block interaction with keyboard or assistive tech.

## 8. WHAT THIS MEANS FOR EACH STEP

**Step 3 — Public experience.** Six sections, six scenes, six composed scroll behaviours. The mood sequence across the page is itself a composition — it must feel deliberate as you scroll from hero to contact. Every section transition is designed.

**Step 4 — Admin CMS.** Same doctrine, applied to the admin. Login is a scene. Lists, editors, and media management use the same motion language, cursor reactions, and depth. The admin is not exempt from the doctrine because it is "internal."

**Step 5 — Project detail, gallery, reviews, memes, about.** Every individual page is a designed scene. The project detail is a scroll-driven case study. The gallery is a spatial experience. The reviews page is a sequence. The memes section is a designed moment. About me is a narrative. No page is a default layout with content dropped in.

**Every page gets the same treatment.** No page is a "utility page." No page is exempt.

## 9. ENFORCEMENT

- Before any section or page is marked DONE, run the mood transformation test (§1).
- Before any section is marked DONE, run the scroll composition test (§2): can you describe the scroll behaviour in one sentence, and does it have a stated job?
- Before any section is marked DONE, run the 60fps test (§6): does it hold on a mid-range device?
- Before any section is marked DONE, run the reduced-motion test (§7): does the scene still work?
- If any test fails, the section is not done. Say so in the status file and keep working.

## 11. MOOD TRANSFORMATION IS VERIFIED PER PAGE

Before any page or surface is marked DONE, run the mood transformation test:
render the page in all three moods, screenshot at 1280, describe the dominant
element, scroll behavior, and color temperature per mood.

If a visitor could mistake one mood for another after a one-second glance,
the page fails. The mood system is not a theme switcher. It is a
reconstruction system. Rewrite until the test passes.

This test applies to every page. No exceptions.

## CODE HYGIENE

- No unused exports. Grep before declaring any export.
- No aliases for the same value or function.
- No self-describing constants (`COMPLETE_X = true`, `IS_Y = false`).
- No comments masquerading as code.
- No helper functions with a single call site unless the helper improves readability.
- If unsure whether something is used, delete it. Git remembers.

## 10. FINAL RULE

A visitor should be able to describe the site as *"the site where you scroll and things happen with intention"* — not *"a nice portfolio."*

If the site can be described with a template sentence, it is not finished.
If the site can be mistaken for a themed variant, the mood system is not finished.
If the site can be scrolled through without feeling the pacing, the scroll behaviour is not finished.

The site is a piece. Build it like one.

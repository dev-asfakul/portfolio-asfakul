# Siam Portfolio — Story Script & Storyboard

## Story rule

One continuous design-house story: **Curious → Surprised → Understands → Trusts → Wants it → Acts**. Every mood tells the same seven-act plot with a different visual language. No act exists only as decoration.

## Timing map

| Act | Desktop | Mobile | Primary transition |
|---|---:|---:|---|
| 1 Arrival | 1.25 viewport | 1 screen | plain system surface transforms into active mood |
| 2 The problem | 1 viewport | 1 screen | velocity blur resolves into silence |
| 3 The turn | 1.5 viewports | 1.25 screens | Flip / crossfade between three mood treatments |
| 4 Proof | 1.5 viewports per project | 1.5 screens total | pinned media and mask reveals |
| 5 How it is made | 1.25 viewport | 1 screen | DrawLine connects design → understand → build |
| 6 Trust | 1 viewport when reviews exist | 1 screen | weighted words and outcomes; hidden without CMS reviews |
| 7 Invitation | 1.25 viewport | 1 screen | story world resolves into contact CTA |

## Shared elements

- A thin accent line begins as the arrival baseline, becomes the problem cut, splits into the three-mood thesis, becomes the proof rail, turns into the process connector, underlines trust, and becomes the contact-field rule.
- A single type block travels from plain system text to the active mood display face.
- The active accent color is the continuity signal; it changes treatment, not plot.
- The chapter rail remains keyboard accessible and syncs to ScrollTrigger/Lenis.

## Act storyboard by mood

### Act 1 — Arrival

Copy: “Hi, I make websites.” → “I design how websites feel.”

- Quiet: centered system-gray statement settles into warm paper, serif display, and a slow line reveal. GSAP: SplitReveal + low-intensity scrub. Mobile: one opacity/translate reveal. Reduced motion: two static storyboard panels.
- Editorial: flat black/gray baseline snaps into a measured twelve-column composition; the offer locks into a display rail. GSAP: SplitText mask + line draw. Mobile: single split headline and metadata edge. Reduced motion: static column shift.
- Play: plain statement drops into a blue/lime stack with a springing baseline and sticker-like type. GSAP: quickTo pointer offset + spring timeline. Mobile: one drop-in, no pointer tracking. Reduced motion: static stacked composition.

### Act 2 — The problem

Copy: “Most websites are seen. Few are remembered.” / “Templates look alike. People forget alike.”

- Quiet: a soft, slow stream of blurred gray layout fragments passes behind the sentence, then stops. GSAP: restrained velocity skew. Mobile: one horizontal blur band. Reduced motion: still blur band.
- Editorial: generic page fragments move as a precise editorial ticker and hard-cut to a single rule. GSAP: Marquee + Observer velocity + hard timeline cut. Mobile: short ticker, no pinned sequence. Reduced motion: two static states.
- Play: repeated template blocks bounce and collide before the composition clears. GSAP: clamped velocity skew and spring exits. Mobile: one staggered burst. Reduced motion: arranged repeated blocks without motion.

### Act 3 — The turn

Copy: “One identity. Three moods.” / “Same words: Quiet, Editorial, Play. Watch what changes.”

- Quiet: the same sentence widens into generous air and warm serif contrast. GSAP: Flip between layout states, long ease. Mobile: sequential mood labels. Reduced motion: three side-by-side/static states.
- Editorial: the sentence travels through three exact column systems with visible hairlines. GSAP: Flip + clip-path wipe + line draw. Mobile: stacked chapter cards. Reduced motion: static three-panel comparison.
- Play: the same words recompose into a kinetic stack with accent stickers and rounded geometry. GSAP: Flip + spring overshoot. Mobile: one controlled stack swap. Reduced motion: static color/type comparison.

### Act 4 — Proof

Copy: “Work that moves.” / “Selected projects, told as short films.” Link: `/work`.

- Quiet: selected work appears as a calm list with a single hover preview and soft image-plane drift. GSAP: MaskImage + batch reveal. Mobile: sequential list and poster image. Reduced motion: visible list and image.
- Editorial: one project fills the viewport while metadata travels on a rail. GSAP: PinnedSequence + MaskImage + scrub. Mobile: unpinned chapter sequence. Reduced motion: full project sections in order.
- Play: projects form a collage/horizontal run with depth cards and bold numbers. GSAP: HorizontalRail + TiltCard. Mobile: momentum rail with tap feedback. Reduced motion: vertical project stack.

### Act 5 — How it is made

Copy: “I design it. I understand it. I build it.” / “One person, from first sketch to shipped code.” Link: `/about`.

- Quiet: a fine line quietly connects three spacious words. GSAP: DrawLine + pinned reveal. Mobile: one progressive line, no pin. Reduced motion: completed line and three labels.
- Editorial: the line behaves like a diagram through a structured process rail. GSAP: DrawSVG + precise scrub. Mobile: vertical diagram. Reduced motion: static diagram.
- Play: the line snaps between oversized stages and carries a small moving marker. GSAP: MotionPath + spring. Mobile: three tap-sized stages. Reduced motion: static connected stages.

Owner confirmation needed: “One person, from first sketch to shipped code.” remains approved editable default copy and must not be presented as a CMS fact until confirmed.

### Act 6 — Trust

Copy: “In their words.” / “What clients say after launch.” Link: `/reviews`.

- Hidden entirely when the CMS has no real reviews.
- Quiet: one calm quote with generous measure and a slow entrance. GSAP: SplitReveal only.
- Editorial: quote, attribution, and outcome appear as a magazine pull-quote and ruled metadata. GSAP: line draw + mask.
- Play: quote enters as a bold card with a restrained bounce, never a carousel. GSAP: spring entrance + TiltCard on hover.
- Mobile/reduced motion: one static quote block with clear attribution.

### Act 7 — Invitation

Copy: “Your story is next.” / “Tell me what you're making. I reply personally.” Link: `/contact`.

- Quiet: the line becomes a warm, quiet field with availability and response time only when CMS values exist. GSAP: slow color-field transition and Magnetic CTA on hover.
- Editorial: a precise contact rule and large type resolve the chapter rail into the form. GSAP: clip-path wipe + line draw.
- Play: the accent field expands with one playful shape settling near the CTA. GSAP: spring scale + quickTo pointer response.
- Mobile/reduced motion: no WebGL or pinned motion; show the strongest typographic invitation and a 44px CTA.

## CMS contract

`storyChapters` fields:

- `act`: integer 1–7
- `title`: dominant line
- `line`: quiet caption
- `visualKey`: mood-aware visual identifier
- `linkLabel`
- `linkHref`
- `order`
- `status`: draft or published

Approved defaults are seed content and must be editable in admin. Act 6 is conditionally hidden without real reviews. Act 7 availability and response time come from CMS and render nothing when empty.

## 7 × 3 implementation matrix

| Act | Quiet — GSAP technique | Editorial — GSAP technique | Play — GSAP technique |
|---|---|---|---|
| 1 Arrival | SplitText line reveal + low-intensity scrub | SplitText mask reveal + DrawSVG baseline | quickTo pointer offset + siamSpring baseline timeline |
| 2 The problem | velocity skew with clamped transform | Observer velocity + Marquee ticker + hard timeline cut | clamped velocity skew + spring exit timeline |
| 3 The turn | Flip layout state + long ease | Flip + clip-path wipe + DrawSVG hairlines | Flip + spring overshoot |
| 4 Proof | MaskImage reveal + batch stagger | pinned scrub sequence + MaskImage reveal | horizontal rail + TiltCard hover transform |
| 5 How it is made | DrawSVG connector + pinned reveal | DrawSVG connector + precise scrub | MotionPath marker + spring stages |
| 6 Trust | SplitText quote reveal | DrawSVG rule + masked quote reveal | spring card entrance + TiltCard hover transform |
| 7 Invitation | color-field tween + Magnetic CTA hover | clip-path wipe + DrawSVG contact rule | spring scale + quickTo pointer response |

## Shared-element / mobile / reduced-motion matrix

| Act | Shared element handed off to next act | Mobile (≤1.5 screens) | Reduced-motion treatment |
|---|---|---|---|
| 1 Arrival | Accent baseline becomes the problem cut | One headline and one metadata edge | Two static panels: plain and designed |
| 2 The problem | Problem cut resolves into the mood thesis | One blur/ticker band, no pin | Still fragments followed by a static rule |
| 3 The turn | Active mood accent becomes the proof rail | Sequential mood labels/cards | Three static mood states |
| 4 Proof | Proof rail becomes the process connector | Sequential project list/poster | Visible projects in order, no scrub |
| 5 How it is made | Process connector becomes trust underline | Three stages and one progressive line | Completed line with three labels |
| 6 Trust | Trust underline becomes contact-field rule | One quote block with attribution | Static quote or hidden when no reviews |
| 7 Invitation | Contact-field rule resolves to the real form | Strong invitation and 44px CTA | Static invitation with the same link |

## Deferred primitive placement

- Cursor is explicitly scheduled for Phase 4: mood-specific cursors, gated by `HOVER`, and integrated with the mood-switch transition.
- PageTransition is explicitly scheduled for Phase 6.4: View Transitions API where supported, GSAP fallback otherwise, persistent shell, shared-element card-to-case-study handoff, and no scroll jump.
- Preloader is explicitly scheduled for Phase 6.5: once per session, real asset readiness, skippable, no longer than 1.5 seconds, and absent for reduced motion.

## Phase 3 approval constraints

Phase 3 may not start until Phase 0, Phase 1, and Phase 2 are fully closed with their required gates. During implementation, any deviation from this document requires an amendment to `STORY.md` and a new ADR before code lands. Act 6 is CMS-gated and must never use fabricated reviews; Act 1 must preserve both plain and designed states; Act 5 copy remains an editable owner-confirmation default; approved copy is used verbatim; every act must expose its forward pointer and real route link; mobile is a designed reduction; reduced motion preserves the seven-act order and links; and every signature animation requires a screen recording alongside screenshots.

## Acceptance checklist

- [ ] 5-second test names the studio offer and next action.
- [ ] Mute test communicates design/build quality.
- [ ] Blur test distinguishes all three moods.
- [ ] Full-scroll capture feels continuous.
- [ ] Five-person mind-change test recorded after implementation.
- [ ] Desktop and mobile reverse cleanly.
- [ ] Reduced-motion storyboard preserves order and links.

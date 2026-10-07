# Background 5D Shape System — Architecture

## Purpose

The Background 5D Shape System is the spatial layer beneath every page, section, and scene. It treats depth as meaning: a base surface establishes atmosphere, a mid-background establishes scene hierarchy, and a foreground layer establishes relationship with scroll and cursor. Mood is not a color theme; it selects a distinct shape vocabulary, motion language, and interaction model while content remains structurally shared.

## Components

`ShapeLayer` is the single rendering boundary: `<ShapeLayer mood={mood} scene={scene} />`. It reads the active mood from the existing mood provider and the current scene from the scene registry, then selects the vocabulary and choreography for that combination. It owns only composition and lifecycle; it does not contain per-section shape rules.

The boundary uses `next/dynamic` with one import per mood vocabulary. Editorial and Quiet load their lightweight renderers independently; Play loads `lib/visuals/shapes/play.tsx` only when Play is selected. This keeps the heavier Play renderer out of the Editorial and Quiet client paths. Confirm the split with `pnpm build` by inspecting the emitted route chunks for the Play module.

The system is split by responsibility:

- `components/visuals/shape-layer.tsx` — scene-aware renderer and reduced-motion boundary.
- `lib/visuals/scenes.ts` — declarative scene registry: scene IDs, shape assignments, layer depth, and rendering choice.
- `lib/visuals/shapes/editorial.ts`, `quiet.ts`, `play.ts` — mood vocabularies, palettes, motion parameters, and interaction behavior.
- `lib/visuals/scroll.ts` — mood-and-scene scroll choreography using GSAP, ScrollTrigger, and `gsap.matchMedia()`.
- `lib/visuals/cursor.ts` — one cursor manager with three mood behaviors and cleanup ownership.

Rendering is chosen per scene: CSS for a light static composition, SVG for one to three vector shapes, and canvas for four or more active shapes or heavy motion. The choice is declared in the scene registry rather than inferred inside a section component.

## Data flow

The active mood is selected once at the site shell and propagates through the existing provider. The shell derives the current scene from the page/section boundary and passes both values to `ShapeLayer`. `ShapeLayer` resolves `scenes[scene][mood]`, loads only that mood’s vocabulary, and renders base, mid, and foreground layers in a stable stacking context behind content. Scene changes update the declarative composition; they do not create a new one-off animation implementation.

Scroll choreography receives the resolved scene and mood, creates scoped GSAP timelines and ScrollTriggers, and binds them to the rendered layer refs. Every trigger is created inside `gsap.matchMedia()` so breakpoint behavior is explicit. Cursor behavior is similarly resolved from the mood vocabulary and attaches one listener/RAF loop only while the interactive layer is mounted. All timelines, triggers, listeners, observers, and animation frames are cleaned up on unmount or scene change.

## Spatial and accessibility rules

The base surface is always present. Mid-background shapes establish depth without competing with readable content. Foreground shapes may cross scene boundaries only when the registry declares that relationship. Shapes never carry required meaning alone, remain behind interactive content, and preserve layout when motion is reduced. `prefers-reduced-motion` switches to each mood’s designed static composition: positions, hierarchy, and color relationships remain; scroll and cursor motion are removed.

The performance contract is transform/opacity/clip-path/filter only for animated properties, with `will-change` applied narrowly and removed after transient motion. Play’s heavier engine is code-split from quiet and editorial paths. The shape system is considered complete only when all three mood vocabularies are visibly distinct, reduced-motion states preserve composition, and evidence covers desktop, mobile, scroll, and Play cursor interaction.

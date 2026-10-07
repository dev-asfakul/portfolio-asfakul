# Mood contract

The mood engine is a content-invariant visual state machine. A mood may change palette, typography, spacing, grid treatment, image treatment, and motion feel; it must never change information architecture, semantic order, focus order, URLs, or the meaning of content.

## Allowed signatures

| Mood | Must feel like | Allowed | Forbidden |
|---|---|---|---|
| Quiet | warm paper, calm index, generous air | terracotta signal, low density, light display type, soft lift | neon accents, dense collage, aggressive overshoot |
| Editorial | dark gallery, sharp editorial chapter | bone type, orange signal, visible rules, serif display, long scroll emphasis | rounded playful UI, multiple competing accents, casual bounce |
| Play | electric poster, kinetic collage | blue field, acid-lime signal, heavy sans, tight spacing, controlled overshoot | quiet paper treatment, slow solemn reveal, muted ambiguous states |

## Invariants

- Use one accent per mood. Accent is reserved for interaction, selection, status, and intentional emphasis.
- Preserve `content → focus → URL` across every mood switch.
- Keep state colors semantic: success, warning, error, focus, and disabled must remain legible in every mood.
- Reduced-motion users receive the same content and visibility without curtain, scrub, parallax, or stagger choreography.

## Worked example

A project card keeps the same title, image, metadata, CTA, and link in all moods. Quiet uses an index row with breathing room; Editorial uses a ruled split card; Play uses a compact collage card. The component may change composition and motion, but the accessible name and destination remain identical.

## Implementation contract

Add new moods to `lib/mood/moods.ts` with a complete palette and motion config. Consume values through `useMood()` and semantic CSS variables; do not create page-local palettes or hard-coded mood branches in public sections.

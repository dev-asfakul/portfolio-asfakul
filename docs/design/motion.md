# Motion contract

Motion must establish hierarchy, reveal information, connect scroll position to editorial pacing, or make a mood change legible. If it does none of these, do not add it.

## Primitive contracts

| Primitive | Allowed use | Timing/easing contract | Forbidden |
|---|---|---|---|
| Reveal | One-shot section/block entrance | Mood duration and easing | Repeating attention loop |
| StaggerGroup | Ordered related children | Shared timeline, deliberate stagger | Random child delays |
| TextSplit | Dominant words only | Masked character/word reveal | Splitting body paragraphs |
| ScrollText | Progressive reading emphasis | Scroll-linked scrub | Essential content hidden without scroll |
| Parallax | Low-frequency image/object depth | Small travel, scrubbed | Large shifts, layout dependence |
| ImageReveal | Image entrance with counter-scale | Clip-path, then stable layout | Decorative crop that changes meaning |

## Runtime rules

Register GSAP only in the browser. Scope every animation with `useGSAP` and revert on unmount/update. Gate every primitive with `gsap.matchMedia()` and `prefers-reduced-motion: no-preference`. Reduced motion must preserve semantic content, visibility, layout, and focus order while removing choreography.

## Worked example

A work section uses Reveal for its heading, StaggerGroup for project rows, and ImageReveal for the lead image. It does not also add parallax to the CTA or a looping hover animation. At reduced motion, all rows and the image are immediately visible in the same DOM order.

## Review checklist

Before shipping motion, verify purpose, keyboard/focus behavior, reduced-motion behavior, cleanup after route changes, no cumulative layout shift, and a stable fallback when JavaScript is unavailable.

# Typography contract

Typography is the primary compositional system. It must establish hierarchy before decoration and remain readable at every required viewport width.

## Roles

| Role | Contract | Forbidden |
|---|---|---|
| Display | Dominant statement; `clamp(4rem, 12–15vw, 16rem)`; controlled line length | Paragraph copy, arbitrary fixed desktop size |
| H1 | Page-level title; `clamp(3rem, 9vw, 9rem)` | Competing with Display |
| H2 | Section/chapter title; `clamp(2rem, 5vw, 5rem)` | Tiny labels masquerading as headings |
| H3 | Card/subheading; `clamp(1.25rem, 2vw, 2rem)` | Dense metadata styling |
| Body | Inter Tight; `clamp(1rem, 1.2vw, 1.25rem)`; readable measure | All-caps long-form text, narrow unreadable measure |
| Label | Mono uppercase; `0.6875rem`; compact tracking | Decorative paragraphs |
| Caption | `0.75rem`; muted but readable | Essential information only in captions |
| Mono | Technical values and indexes; `0.6875rem` | Long prose or emotional headlines |

## Allowed composition

Use max-width, explicit editorial spans, and fluid values to compose line breaks. Let mobile recompose rather than merely shrink. Keep two font families plus the utility mono family; do not introduce one-off fonts per section.

## Worked example

A hero uses one Display statement, one Body support paragraph, and one Label index. At 390px the statement receives a narrower max-width and a deliberate two-line break; at 1440px it expands without exceeding the intended measure. The DOM order stays heading → support → action for screen readers.

Implementation: `app/globals.css`, `app/layout.tsx`, and the role specimens at `/design`.

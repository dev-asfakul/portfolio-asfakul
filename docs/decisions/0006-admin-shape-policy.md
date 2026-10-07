# Decision 0006 — Admin shape policy

## Decision

Admin scenes use a fixed quiet-editorial hybrid regardless of the selected site mood. The admin registry contains two scene IDs — `admin-shell` and `admin-content` — but both resolve to the same `admin-hybrid` vocabulary for Editorial, Quiet, and Play.

The hybrid may use restrained ruled geometry and one low-contrast atmospheric field. It never uses Play's cursor attract/repel, spring physics, scroll-pinned choreography, canvas particle field, or foreground shapes that cross reading surfaces.

## Reasoning

The admin is a task surface, not a mood-performance surface. A data table, editor, or form needs stable visual anchors, predictable pointer behavior, and strong contrast. Letting Play's kinetic background respond behind rows would compete with scanning, while changing the composition between moods would make authenticated workspaces feel unreliable.

The policy preserves the doctrine's requirement that admin is not exempt: admin still participates in the shape system, has registered scenes, and receives a deliberate composition. It is simply a bounded vocabulary whose interaction model is always readable.

## Accessibility and lifecycle

Admin hybrid composition remains present under reduced motion, but all scroll and cursor response is removed. The cursor manager receives an explicit non-interactive ownership state when an admin scene mounts, preventing Play listeners from leaking into the workspace. Shape layers remain behind content and never carry required meaning.

## Implementation boundary

The policy is represented in `lib/visuals/scenes.ts` as `admin-hybrid`. Rendering and lifecycle remain in `ShapeLayer`; cursor ownership remains centralized in `lib/visuals/cursor.ts`. No admin component should invent a second shape vocabulary.

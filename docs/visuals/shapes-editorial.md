# Editorial Shape Language

Editorial makes invisible typographic architecture visible. Its dominant shapes are rectilinear: thin rules, column edges, baseline marks, margin frames, and restrained vermilion signals. A scene carries only one or two active shapes. Warm-black and bone form the field; vermilion is the single accent and appears as a deliberate mark, never as a general wash.

Motion is measured and slow. Shapes drift by small transform distances, breathe opacity subtly, and use long two-to-five-second durations. On scroll entry, a rule or frame fades in softly as the section arrives. Layers move at slightly different parallax rates, hold their relationship during pinned sections, and release as the scene exits. The motion should feel like a page settling into registration rather than an object performing.

The cursor does not chase or magnetize Editorial shapes. Cursor position may introduce a barely perceptible tilt or translation to a foreground rule, but the response is deliberately subordinate to reading. No shape changes state merely because the pointer crosses it. Reduced motion preserves the exact rectilinear composition, positions, and hierarchy as a static page architecture; it removes drift, opacity breathing, parallax, and cursor response without hiding any layer.

Editorial is rendered with CSS or SVG when its scene contains one to three light vector layers. Its shape data declares the rules, bounds, accent, duration, easing, parallax ratio, and static reduced-motion position. The implementation must remain restrained: if a scene needs more than two active Editorial shapes, simplify the composition rather than increasing density.

# ADR 0008 — Story script and storyboard

## Status
Proposed — owner approval required before Phase 3 implementation.

## Context
The portfolio must communicate as one continuous design-house story rather than a stack of unrelated portfolio sections. The approved copy and seven-act structure are supplied by the rebuild prompt.

## Decision
Use seven acts: Arrival, The problem, The turn, Proof, How it is made, Trust, and Invitation. Keep plot and approved copy consistent across Quiet, Editorial, and Play, while changing layout, typography, motion, grid, and signature treatment per mood. Use one continuity line, one traveling type block, the active accent field, and an accessible chapter rail as shared story elements.

The story is represented in an admin-editable `storyChapters` collection. Act 6 is hidden until real reviews exist. Act 7 renders availability and response time only when CMS fields are populated. The phrase about working from first sketch to shipped code remains an editable approved default pending owner confirmation.

## Consequences
Phase 3 can implement acts against a stable visual and CMS contract. The storyboard limits decorative motion and gives reduced-motion and mobile versions equal narrative status. No feature code should be added for Phase 3 until the owner approves this storyboard.

## Verification
Phase 2.5 is documentation-only. Phase gates for code are unchanged. Approval is the gate to Phase 3.

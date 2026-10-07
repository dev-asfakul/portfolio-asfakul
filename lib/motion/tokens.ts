import type { MoodId } from '@/lib/cms/types'
import { MOODS } from '@/lib/mood/moods'

export const MOTION_DURATIONS = { micro: 0.18, reveal: 0.35, section: 0.7, statement: 1.1 } as const
export const MOTION_STAGGERS = { tight: 0.03, standard: 0.06, relaxed: 0.1 } as const

export const MOTION_EASES = {
  siamOut: 'power3.out',
  siamInOut: 'power2.inOut',
  siamSpring: 'back.out(1.35)',
} as const

export const MOTION_MEDIA = {
  FULL_MOTION: '(min-width: 768px) and (prefers-reduced-motion: no-preference)',
  HOVER: '(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)',
  REDUCED: '(prefers-reduced-motion: reduce)',
} as const

export function motionForMood(mood: MoodId) {
  const preset = MOODS[mood].motion
  return { ...preset, durations: MOTION_DURATIONS, staggers: MOTION_STAGGERS, eases: MOTION_EASES }
}

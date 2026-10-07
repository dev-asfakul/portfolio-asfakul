import { beforeEach, describe, expect, it, vi } from 'vitest'

const effects: Array<() => undefined | (() => void)> = []
const matchMediaScopes: Array<{ add: ReturnType<typeof vi.fn>; revert: ReturnType<typeof vi.fn> }> = []
const gsapCalls: Array<{ method: string; vars?: Record<string, unknown> }> = []

vi.mock('react', () => ({
  useEffect: (effect: () => undefined | (() => void)) => {
    effects.push(effect)
  },
}))

vi.mock('@/lib/motion/gsap', () => ({
  REDUCED: '(prefers-reduced-motion: reduce)',
  FULL_MOTION: '(prefers-reduced-motion: no-preference)',
  gsap: {
    matchMedia: vi.fn(() => {
      const scope = { add: vi.fn(), revert: vi.fn() }
      matchMediaScopes.push(scope)
      return scope
    }),
    set: vi.fn((target: unknown, vars: Record<string, unknown>) => gsapCalls.push({ method: 'set', vars })),
    to: vi.fn((target: unknown, vars: Record<string, unknown>) => gsapCalls.push({ method: 'to', vars })),
    timeline: vi.fn(() => ({ paused: vi.fn(() => undefined) })),
  },
}))

import { HERO_TRANSITIONS, useSceneScroll } from './scroll'

function root() {
  return {
    current: {
      querySelector: vi.fn(() => ({ nodeType: 1 })),
      querySelectorAll: vi.fn(() => [{ nodeType: 1 }, { nodeType: 1 }, { nodeType: 1 }]),
      closest: vi.fn(() => null),
    },
  } as never
}

describe('useSceneScroll', () => {
  beforeEach(() => {
    effects.length = 0
    matchMediaScopes.length = 0
    gsapCalls.length = 0
  })

  it('registers reduced-motion and full-motion branches in one scope', () => {
    useSceneScroll({ rootRef: root(), mood: 'editorial', scene: 'home-hero' })
    effects[0]()
    expect(matchMediaScopes).toHaveLength(1)
    expect(matchMediaScopes[0].add).toHaveBeenCalledWith('(prefers-reduced-motion: reduce)', expect.any(Function))
    expect(matchMediaScopes[0].add).toHaveBeenCalledWith('(prefers-reduced-motion: no-preference)', expect.any(Function))
  })

  it('registers no ScrollTrigger motion in the reduced branch', () => {
    useSceneScroll({ rootRef: root(), mood: 'quiet', scene: 'home-hero' })
    effects[0]()
    const reduced = matchMediaScopes[0].add.mock.calls[0][1]
    reduced()
    expect(gsapCalls).toEqual([{ method: 'set', vars: { autoAlpha: 0.6, scale: 1 } }])
  })

  it('reverts the matchMedia scope on unmount', () => {
    useSceneScroll({ rootRef: root(), mood: 'play', scene: 'home-hero' })
    const cleanup = effects[0]()
    cleanup?.()
    expect(matchMediaScopes[0].revert).toHaveBeenCalledOnce()
  })

  it('uses different transition contracts for all three moods', () => {
    expect(new Set(Object.values(HERO_TRANSITIONS).map(({ ease, duration }) => `${ease}:${duration}`)).size).toBe(3)
  })
})

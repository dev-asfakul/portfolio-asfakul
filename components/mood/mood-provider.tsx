'use client'

import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from 'react'
import type { MoodId } from '@/lib/cms/types'
import { MOODS, MOOD_COOKIE, type MoodConfig } from '@/lib/mood/moods'
import { gsap, prefersReducedMotion, ScrollTrigger } from '@/lib/motion/gsap'

interface MoodContextValue {
  mood: MoodId
  config: MoodConfig
  available: MoodId[]
  transitioning: boolean
  setMood: (mood: MoodId) => void
}

const MoodContext = createContext<MoodContextValue | null>(null)

function visibleSectionId() {
  const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-scene]'))
  const mid = window.innerHeight / 2
  const current = sections.find((s) => {
    const r = s.getBoundingClientRect()
    return r.top <= mid && r.bottom >= mid
  })
  return current?.dataset.scene
}

export function MoodProvider({
  initialMood,
  available,
  children,
}: {
  initialMood: MoodId
  available: MoodId[]
  children: ReactNode
}) {
  const [mood, setMoodState] = useState<MoodId>(initialMood)
  const [incoming, setIncoming] = useState<MoodId | null>(null)
  const curtainRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLDivElement>(null)

  const commit = useCallback((next: MoodId) => {
    document.documentElement.dataset.mood = next
    document.cookie = `${MOOD_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`
    setMoodState(next)
  }, [])

  const setMood = useCallback(
    (next: MoodId) => {
      if (next === mood || incoming) return
      const anchor = visibleSectionId()
      const restore = () => {
        requestAnimationFrame(() => {
          ScrollTrigger.refresh()
          const target = anchor ? document.querySelector<HTMLElement>(`[data-scene="${anchor}"]`) : null
          if (target) window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY, behavior: 'instant' })
        })
      }

      if (prefersReducedMotion() || !curtainRef.current) {
        commit(next)
        restore()
        return
      }

      setIncoming(next)
      const curtain = curtainRef.current
      const label = labelRef.current
      gsap
        .timeline({ defaults: { ease: 'expo.inOut' } })
        .set(curtain, { display: 'flex', clipPath: 'inset(100% 0% 0% 0%)' })
        .to(curtain, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.8 })
        .fromTo(label, { yPercent: 110 }, { yPercent: 0, duration: 0.7, ease: 'expo.out' }, '-=0.35')
        .add(() => {
          commit(next)
          restore()
        })
        .to(label, { yPercent: -110, duration: 0.6, ease: 'expo.in' }, '+=0.25')
        .to(curtain, { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.8 }, '-=0.2')
        .add(() => {
          gsap.set(curtain, { display: 'none' })
          setIncoming(null)
        })
    },
    [commit, incoming, mood],
  )

  const value = useMemo(
    () => ({ mood, config: MOODS[mood], available, transitioning: incoming !== null, setMood }),
    [available, incoming, mood, setMood],
  )

  const nextConfig = incoming ? MOODS[incoming] : null

  return (
    <MoodContext.Provider value={value}>
      {children}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        Mood: {MOODS[mood].label}
      </div>
      <div
        ref={curtainRef}
        data-mood={incoming ?? mood}
        aria-hidden="true"
        className="fixed inset-0 z-[100] hidden flex-col justify-between bg-background p-[var(--gutter)] text-foreground"
      >
        <div className="meta flex justify-between">
          <span>Changing mood</span>
          <span>{nextConfig?.index} / 03</span>
        </div>
        <div className="overflow-hidden">
          <div ref={labelRef} className="display text-[clamp(4rem,18vw,16rem)]">
            {nextConfig?.label}
          </div>
        </div>
        <div className="meta flex justify-between">
          <span>{nextConfig?.descriptor}</span>
          <span>Same content. Different eyes.</span>
        </div>
      </div>
    </MoodContext.Provider>
  )
}

export function useMood() {
  const ctx = useContext(MoodContext)
  if (!ctx) throw new Error('useMood must be used inside MoodProvider')
  return ctx
}

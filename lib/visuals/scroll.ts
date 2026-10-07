import { useEffect, type RefObject } from 'react'
import { gsap, FULL_MOTION, REDUCED } from '@/lib/motion/gsap'
import type { Mood, SceneId } from './scenes'

export const HERO_TRANSITIONS = {
  editorial: { duration: 1, ease: 'power2.inOut', overlap: 0.3 },
  quiet: { duration: 0.6, ease: 'none', overlap: 0.2 },
  play: { duration: 0.55, ease: 'back.inOut(1.2)', overlap: 1 },
} as const

const scrollTrigger = (root: HTMLElement) => ({
  trigger: root,
  start: 'top top',
  end: 'bottom top',
  scrub: true,
})

function registerHeroMotion(root: HTMLElement, mood: Mood) {
  const trigger = scrollTrigger(root)

  if (mood === 'editorial') {
    const frame = root.querySelector<HTMLElement>('.shape-editorial__frame')
    const rule = root.querySelector<HTMLElement>('.shape-editorial__rule')
    gsap.to([frame, rule].filter(Boolean), {
      yPercent: -15,
      ease: 'power2.inOut',
      scrollTrigger: trigger,
    })
    gsap.to(root, {
      autoAlpha: 0,
      ease: 'power2.inOut',
      scrollTrigger: { ...trigger, start: '60% top' },
    })
    return
  }

  if (mood === 'quiet') {
    const field = root.querySelector<HTMLElement>('.shape-quiet__field')
    gsap.to(field, {
      scale: 1.04,
      ease: 'sine.inOut',
      scrollTrigger: trigger,
    })
    gsap.to(root, {
      autoAlpha: 0,
      ease: 'sine.inOut',
      scrollTrigger: { ...trigger, start: '70% top' },
    })
    return
  }

  const fields = root.querySelectorAll<HTMLElement>('.shape-play__orb, .shape-play__plane')
  fields.forEach((field, index) => {
    const rate = [-0.3, -0.45, -0.6][index] ?? -0.45
    gsap.to(field, {
      yPercent: rate * 100,
      ease: 'back.out(1.4)',
      scrollTrigger: trigger,
    })
  })
  gsap.to(root.querySelector<HTMLElement>('.shape-play__plane'), {
    rotation: 18,
    ease: 'back.out(1.4)',
    scrollTrigger: trigger,
  })
  gsap.to(root.querySelector<HTMLElement>('.shape-play__orb'), {
    scale: 1.25,
    ease: 'back.out(1.4)',
    scrollTrigger: trigger,
  })
}

function registerHandoff(root: HTMLElement, mood: Mood) {
  const transition = HERO_TRANSITIONS[mood]
  let initialLoad = true
  const nextRoot = root.closest('section')?.nextElementSibling?.querySelector<HTMLElement>('[data-shape-scroll-root]')
  if (!nextRoot) return

  gsap.timeline({
    paused: true,
    scrollTrigger: {
      trigger: root.closest('section'),
      start: 'bottom 80%',
      end: 'bottom 40%',
      onEnter: () => {
        if (initialLoad) return
        gsap.to(root, { autoAlpha: 0, duration: transition.duration, ease: transition.ease })
        gsap.fromTo(nextRoot, { autoAlpha: 0 }, { autoAlpha: 1, duration: transition.duration, ease: transition.ease })
      },
      onLeaveBack: () => {
        gsap.to(root, { autoAlpha: 1, duration: transition.duration, ease: transition.ease })
        gsap.to(nextRoot, { autoAlpha: 0, duration: transition.duration, ease: transition.ease })
      },
    },
  })
  window.requestAnimationFrame(() => { initialLoad = false })
}

export function useSceneScroll({
  scene,
  mood,
  rootRef,
  enabled = true,
}: {
  scene: SceneId
  mood: Mood
  rootRef: RefObject<HTMLElement | null>
  enabled?: boolean
}) {
  useEffect(() => {
    const root = rootRef.current
    if (!enabled || !root) return

    const mm = gsap.matchMedia()
    mm.add(REDUCED, () => {
      if (mood === 'editorial') gsap.set(root, { autoAlpha: 1 })
      if (mood === 'quiet') gsap.set(root, { autoAlpha: 0.6, scale: 1 })
      if (mood === 'play') gsap.set(root, { clearProps: 'all' })
    })
    mm.add(FULL_MOTION, () => {
      registerHeroMotion(root, mood)
      if (scene === 'home-statement') registerHandoff(root, mood)
    })

    return () => mm.revert()
  }, [enabled, mood, rootRef, scene])
}

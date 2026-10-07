'use client'

import { useRef, type ElementType, type ReactNode, type CSSProperties } from 'react'
import { cn } from '@/lib/utils'
import { useMood } from '@/components/mood/mood-provider'
import { FULL_MOTION, gsap, useGSAP } from '@/lib/motion/gsap'

type Polymorphic = { as?: ElementType; className?: string; children?: ReactNode; style?: CSSProperties }

/** Fades and lifts children into place when the element enters the viewport. */
export function Reveal({ as: Tag = 'div', className, children, delay = 0, style }: Polymorphic & { delay?: number }) {
  const ref = useRef<HTMLElement>(null)
  const { config } = useMood()
  useGSAP(
    () => {
      gsap.matchMedia().add(FULL_MOTION, () => {
        gsap.from(ref.current, {
          y: config.motion.distance,
          autoAlpha: 0,
          duration: config.motion.duration,
          ease: config.motion.ease,
          delay,
          scrollTrigger: { trigger: ref.current, start: 'top 88%', once: true },
        })
      })
    },
    { scope: ref },
  )
  return (
    <Tag ref={ref} className={className} style={style}>
      {children}
    </Tag>
  )
}

/** Staggers direct children (marked with data-stagger) on entry. */
export function StaggerGroup({ as: Tag = 'div', className, children }: Polymorphic) {
  const ref = useRef<HTMLElement>(null)
  const { config } = useMood()
  useGSAP(
    () => {
      gsap.matchMedia().add(FULL_MOTION, () => {
        gsap.from('[data-stagger]', {
          y: config.motion.distance * 0.6,
          autoAlpha: 0,
          duration: config.motion.duration * 0.8,
          ease: config.motion.ease,
          stagger: config.motion.stagger * 2,
          scrollTrigger: { trigger: ref.current, start: 'top 85%', once: true },
        })
      })
    },
    { scope: ref },
  )
  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  )
}

/**
 * Splits text into masked lines/words/characters and slides them up.
 * `scrub` ties the reveal to scroll position instead of a one-shot entry.
 */
export function TextSplit({
  text,
  as: Tag = 'span',
  className,
  by = 'chars',
  scrub = false,
  delay = 0,
  start = 'top 85%',
}: {
  text: string
  as?: ElementType
  className?: string
  by?: 'chars' | 'words'
  scrub?: boolean
  delay?: number
  start?: string
}) {
  const ref = useRef<HTMLElement>(null)
  const { config } = useMood()
  useGSAP(
    () => {
      gsap.matchMedia().add(FULL_MOTION, () => {
        gsap.from('[data-piece]', {
          yPercent: 115,
          rotate: config.id === 'play' ? 8 : 0,
          duration: config.motion.duration,
          ease: config.motion.ease,
          stagger: config.motion.stagger,
          delay,
          scrollTrigger: scrub
            ? { trigger: ref.current, start, end: 'bottom 40%', scrub: config.motion.scrub }
            : { trigger: ref.current, start, once: true },
        })
      })
    },
    { scope: ref, dependencies: [text] },
  )
  const words = text.split(' ')
  return (
    <Tag ref={ref} className={className} aria-label={text}>
      {words.map((word, wi) => (
        <span key={wi} aria-hidden="true" className="inline-block whitespace-nowrap">
          {by === 'words' ? (
            <span className="inline-block overflow-hidden pb-[0.08em] align-bottom">
              <span data-piece className="inline-block will-change-transform">
                {word}
              </span>
            </span>
          ) : (
            Array.from(word).map((char, ci) => (
              <span key={ci} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
                <span data-piece className="inline-block will-change-transform">
                  {char}
                </span>
              </span>
            ))
          )}
          {wi < words.length - 1 ? '\u00A0' : null}
        </span>
      ))}
    </Tag>
  )
}

/** Words light up one after another as the paragraph is scrolled through. */
export function ScrollText({ text, className, as: Tag = 'p' }: { text: string; className?: string; as?: ElementType }) {
  const ref = useRef<HTMLElement>(null)
  const { config } = useMood()
  useGSAP(
    () => {
      gsap.matchMedia().add(FULL_MOTION, () => {
        gsap.fromTo(
          '[data-word]',
          { opacity: 0.14 },
          {
            opacity: 1,
            stagger: 0.1,
            ease: 'none',
            scrollTrigger: { trigger: ref.current, start: 'top 80%', end: 'bottom 45%', scrub: config.motion.scrub },
          },
        )
      })
    },
    { scope: ref, dependencies: [text] },
  )
  return (
    <Tag ref={ref} className={className}>
      {text.split(/\s+/).map((w, i) => (
        <span key={i} data-word className="inline">
          {w}{' '}
        </span>
      ))}
    </Tag>
  )
}

/** Moves an element on the y-axis relative to scroll. Positive speed lags, negative leads. */
export function Parallax({ as: Tag = 'div', className, children, speed = 0.2, style }: Polymorphic & { speed?: number }) {
  const ref = useRef<HTMLElement>(null)
  const { config } = useMood()
  useGSAP(
    () => {
      gsap.matchMedia().add(FULL_MOTION, () => {
        const amount = speed * 100 * config.motion.intensity
        gsap.fromTo(
          ref.current,
          { yPercent: -amount / 2 },
          {
            yPercent: amount / 2,
            ease: 'none',
            scrollTrigger: { trigger: ref.current, start: 'top bottom', end: 'bottom top', scrub: true },
          },
        )
      })
    },
    { scope: ref },
  )
  return (
    <Tag ref={ref} className={cn('will-change-transform', className)} style={style}>
      {children}
    </Tag>
  )
}

/** Clip-path reveal with a counter-scaling inner layer. */
export function ImageReveal({
  className,
  children,
  direction = 'up',
}: {
  className?: string
  children: ReactNode
  direction?: 'up' | 'left' | 'center'
}) {
  const ref = useRef<HTMLDivElement>(null)
  const { config } = useMood()
  useGSAP(
    () => {
      gsap.matchMedia().add(FULL_MOTION, () => {
        const from =
          direction === 'left' ? 'inset(0% 100% 0% 0%)' : direction === 'center' ? 'inset(30% 30% 30% 30%)' : 'inset(100% 0% 0% 0%)'
        const tl = gsap.timeline({ scrollTrigger: { trigger: ref.current, start: 'top 85%', once: true } })
        tl.fromTo(ref.current, { clipPath: from }, { clipPath: 'inset(0% 0% 0% 0%)', duration: config.motion.duration * 1.3, ease: 'expo.inOut' })
        tl.from('[data-reveal-inner]', { scale: 1.25, duration: config.motion.duration * 1.6, ease: 'expo.out' }, 0)
      })
    },
    { scope: ref },
  )
  return (
    <div ref={ref} className={cn('overflow-hidden', className)}>
      <div data-reveal-inner className="h-full w-full will-change-transform">
        {children}
      </div>
    </div>
  )
}

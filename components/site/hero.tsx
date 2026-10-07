'use client'

import { useRef } from 'react'
import { useMood } from '@/components/mood/mood-provider'
import { Glyph } from '@/components/motion/glyph'
import { CmsImage } from '@/components/media/cms-image'
import { LiveClock } from '@/components/site/live-clock'
import { ShapeLayer } from '@/components/visuals/shape-layer'
import { useCursorManager } from '@/lib/visuals/cursor'
import { FULL_MOTION, gsap, useGSAP } from '@/lib/motion/gsap'
import { cn } from '@/lib/utils'
import type { About, CharacterMoment } from '@/lib/cms/types'
import type { Identity } from '@/lib/brand'

function caseFor(word: string, mood: string) {
  if (mood !== 'quiet') return word.toUpperCase()
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
}

function Letters({ word }: { word: string }) {
  return (
    <>
      {Array.from(word).map((c, i) => (
        <span key={i} data-letter className="inline-block will-change-transform">
          {c}
        </span>
      ))}
    </>
  )
}

export function Hero({ identity, about, glyph }: { identity: Identity; about: About; glyph?: CharacterMoment }) {
  const ref = useRef<HTMLElement>(null)
  const roleRef = useRef<HTMLParagraphElement>(null)
  const { config } = useMood()
  const variant = config.layout.hero
  const portrait = about.profileImage
  useCursorManager({ mood: config.id, rootRef: ref })

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(FULL_MOTION, () => {
        const intro = gsap.timeline({ defaults: { ease: config.motion.ease } })
        intro
          .from('[data-letter]', {
            yPercent: variant === 'stack' ? -120 : 110,
            rotate: variant === 'stack' ? () => gsap.utils.random(-25, 25) : 0,
            duration: config.motion.duration * 1.2,
            stagger: config.motion.stagger,
          })
          .from('[data-portrait]', { clipPath: 'inset(100% 0% 0% 0%)', duration: 1.4, ease: 'expo.inOut' }, 0.15)
          .from('[data-hero-meta]', { autoAlpha: 0, y: 12, stagger: 0.06, duration: 0.8 }, 0.5)

        if (variant === 'still') {
          gsap.to('[data-line="a"]', { yPercent: -18, ease: 'none', scrollTrigger: { trigger: ref.current, start: 'top top', end: 'bottom top', scrub: 0.8, invalidateOnRefresh: true, immediateRender: false } })
          gsap.to('[data-portrait]', { yPercent: 14, ease: 'none', scrollTrigger: { trigger: ref.current, start: 'top top', end: 'bottom top', scrub: 0.8, invalidateOnRefresh: true, immediateRender: false } })
          return
        }

        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: { trigger: ref.current, start: 'top top', end: '+=110%', pin: true, scrub: config.motion.scrub, invalidateOnRefresh: true, immediateRender: false },
        })
        tl.to('[data-line="a"]', { xPercent: variant === 'split' ? -38 : -10, yPercent: variant === 'stack' ? -30 : 0 }, 0)
          .to('[data-line="b"]', { xPercent: variant === 'split' ? 38 : 10, yPercent: variant === 'stack' ? 30 : 0 }, 0)
          .to('[data-portrait]', { scale: variant === 'split' ? 1.55 : 1.3, rotate: variant === 'stack' ? -6 : 0, yPercent: -6 }, 0)
          .to('[data-portrait-img]', { scale: 1.15 }, 0)
          .to('[data-hero-meta]', { autoAlpha: 0, y: -20, stagger: 0.02 }, 0)
          .to(roleRef.current, { scale: variant === 'stack' ? 1.4 : 1.15, letterSpacing: variant === 'split' ? '0.2em' : undefined }, 0)
        if (variant === 'stack') {
          tl.to('[data-letter]', { yPercent: () => gsap.utils.random(-60, 60), rotate: () => gsap.utils.random(-14, 14), stagger: 0.01 }, 0)
        }
        tl.to('[data-hero-fade]', { autoAlpha: 0.15 }, 0.6)
      })
    },
    { scope: ref, dependencies: [variant] },
  )

  const sizes = {
    still: 'text-[17vw] lg:text-[13vw]',
    split: 'text-[22.5vw] lg:text-[20vw]',
    stack: 'text-[19.5vw] lg:text-[18.5vw]',
  }[variant]

  return (
    <section
      ref={ref}
      id="top"
      data-scene="hero"
      aria-label={`${identity.publicName}, ${identity.role}`}
      className="relative flex h-[100svh] min-h-[560px] flex-col overflow-hidden pt-16"
    >
      <h1 className="sr-only">
        {identity.publicName} — {identity.role}
      </h1>

      <ShapeLayer mood={config.id} scene="home-hero" />

      <div className="meta site-grid relative z-30 pt-4 text-muted-foreground">
        <p data-hero-meta className="col-span-2">
          <span className="text-foreground">{identity.fullName}</span>
          <br />
          Portfolio — {new Date().getFullYear()}
        </p>
        <p data-hero-meta className="col-span-2 text-right md:col-start-5 md:text-left lg:col-start-7">
          {about.location ? <>{about.location}<br /></> : null}
          <LiveClock timezone={about.timezone} className="tabular-nums" />
        </p>
        <p data-hero-meta className="col-span-2 hidden md:col-start-7 md:block md:text-right lg:col-start-11">
          {about.availableForWork !== false && about.availability ? (
            <span className="inline-flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-accent" aria-hidden="true" />
              {about.availability}
            </span>
          ) : null}
        </p>
      </div>

      <div className="relative flex flex-1 flex-col justify-center" aria-hidden="true">
        <p data-hero-meta className="meta absolute left-[var(--gutter)] top-1/2 z-30 hidden -translate-y-1/2 text-muted-foreground lg:block">
          Selected work<br />from {about.location || 'anywhere'}
        </p>
        <div
          data-line="a"
          className={cn(
            'display relative z-0 whitespace-nowrap px-[var(--gutter)] will-change-transform',
            sizes,
            variant === 'still' ? 'text-left' : 'text-left -ml-[0.04em]',
          )}
        >
          <span className="inline-block overflow-hidden pb-[0.05em] align-bottom">
            <Letters word={caseFor(identity.first, config.id)} />
          </span>
        </div>

        {portrait ? (
          <div
            data-portrait
            className={cn(
              'mood-frame absolute z-10 overflow-hidden will-change-transform',
              variant === 'still' && 'right-[var(--gutter)] top-1/2 aspect-[4/5] w-[34vw] -translate-y-1/2 md:w-[20vw] lg:w-[16vw]',
              variant === 'split' && 'left-1/2 top-1/2 aspect-[3/4] w-[42vw] -translate-x-1/2 -translate-y-1/2 md:w-[26vw] lg:w-[19vw]',
              variant === 'stack' && 'left-[58%] top-[44%] aspect-square w-[44vw] -translate-x-1/2 -translate-y-1/2 rotate-3 md:w-[26vw] lg:w-[20vw]',
            )}
          >
            <div data-portrait-img className="h-full w-full will-change-transform">
              <CmsImage media={portrait} alt={portrait.alt || `Portrait of ${identity.fullName}`} sizes="(min-width:1024px) 22vw, 45vw" aspect="3:4" gravity="face" priority />
            </div>
          </div>
        ) : null}

        <div
          data-line="b"
          className={cn(
            'display relative z-20 whitespace-nowrap px-[var(--gutter)] will-change-transform',
            sizes,
            variant === 'still' ? 'text-left pl-[calc(var(--gutter)+8vw)]' : 'text-right -mr-[0.04em]',
            variant === 'stack' && 'text-accent',
          )}
        >
          <span className="inline-block overflow-hidden pb-[0.05em] align-bottom">
            <Letters word={caseFor(identity.last || identity.shortName, config.id)} />
          </span>
        </div>
      </div>

      <div className="site-grid relative z-30 items-end gap-y-6 pb-6">
        <p
          ref={roleRef}
          className={cn(
            'col-span-4 origin-left text-[clamp(1.5rem,5vw,3.25rem)] leading-none md:col-span-5',
            config.id === 'play' ? 'font-black uppercase tracking-tight' : 'serif-italic',
          )}
        >
          Designer{' '}
          {glyph ? <Glyph moment={glyph} triggerRef={ref} className="mx-1 text-[0.7em]" label="times" /> : <span className="text-accent">×</span>}{' '}
          Developer
        </p>
        <ul data-hero-fade className="meta col-span-2 hidden flex-col gap-1 text-muted-foreground md:col-start-6 md:flex lg:col-span-3 lg:col-start-8">
          {identity.disciplines.map((d) => (
            <li key={d} data-hero-meta>
              {d}
            </li>
          ))}
        </ul>
        <a
          href="#about"
          data-hero-meta
          className="meta col-span-4 flex items-center justify-between border-t border-line pt-3 text-muted-foreground transition-colors hover:text-foreground md:col-span-2 md:col-start-8 md:flex-col md:items-end md:border-0 md:pt-0 lg:col-span-2 lg:col-start-11"
        >
          <span>Scroll to enter</span>
          <span className="glyph-box text-foreground" aria-hidden="true">
            ↓
          </span>
        </a>
      </div>
    </section>
  )
}

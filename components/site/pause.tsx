'use client'

import { useRef } from 'react'
import { useMood } from '@/components/mood/mood-provider'
import { CmsImage } from '@/components/media/cms-image'
import { Glyph } from '@/components/motion/glyph'
import { FULL_MOTION, gsap, useGSAP } from '@/lib/motion/gsap'
import { cn } from '@/lib/utils'
import type { CharacterMoment, Meme } from '@/lib/cms/types'

/**
 * The intentional hold before the work. Text holds, the meme waits,
 * and the scene collapses into the project sequence.
 */
export function Pause({ meme, glyph }: { meme?: Meme; glyph?: CharacterMoment }) {
  const ref = useRef<HTMLElement>(null)
  const { config } = useMood()

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(FULL_MOTION, () => {
        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: { trigger: ref.current, start: 'top top', end: meme ? '+=180%' : '+=90%', pin: true, scrub: config.motion.scrub, invalidateOnRefresh: true, immediateRender: false },
        })
        tl.from('[data-wait-word]', { yPercent: 120, stagger: 0.15, duration: 0.4 })
        if (meme) {
          tl.fromTo('[data-wait-meme]', { clipPath: 'inset(48% 48% 48% 48%)', scale: 0.6 }, { clipPath: 'inset(0% 0% 0% 0%)', scale: 1, duration: 0.6 }, '+=0.2')
            .from('[data-wait-caption]', { autoAlpha: 0, y: 20, duration: 0.2 })
            .to({}, { duration: 0.5 })
            .to('[data-wait-meme]', { scale: 2.6, autoAlpha: 0, duration: 0.6 })
        } else {
          tl.to({}, { duration: 0.4 })
        }
        tl.to('[data-wait-word]', { yPercent: -120, stagger: 0.08, duration: 0.4 }, meme ? '<' : '>')
      })
      return () => mm.revert()
    },
    { scope: ref, dependencies: [meme?.id] },
  )

  return (
    <section ref={ref} data-scene="pause" aria-label="Interlude" className="relative z-10 flex h-[100svh] items-center justify-center overflow-hidden bg-background">
      <p className="meta absolute left-[var(--gutter)] top-20 text-muted-foreground">(02) Interlude</p>
      <p className="meta absolute right-[var(--gutter)] top-20 flex gap-1 text-muted-foreground" aria-hidden="true">
        Loading suspense
        <span className="wait-dot">.</span>
        <span className="wait-dot">.</span>
        <span className="wait-dot">.</span>
      </p>

      <h2
        className={cn(
          'display relative z-0 flex flex-col items-center text-center',
          config.id === 'quiet' ? 'text-[clamp(3rem,12vw,11rem)]' : 'text-[clamp(4rem,17vw,17rem)]',
        )}
      >
        {['Wait', 'for', 'it'].map((w, i) => (
          <span key={w} className="block overflow-hidden pb-[0.06em]">
            <span data-wait-word className={cn('inline-block', i === 1 && 'serif-italic text-accent')}>
              {w}
              {i === 2 ? '…' : ''}
            </span>
          </span>
        ))}
        {glyph && !meme ? <Glyph moment={glyph} triggerRef={ref} className="mt-6 text-[0.25em]" /> : null}
      </h2>

      {meme?.image ? (
        <figure className="absolute inset-0 z-10 grid place-items-center px-[var(--gutter)]">
          <div data-wait-meme className="mood-frame w-[78vw] max-w-[640px] overflow-hidden border border-line bg-surface will-change-transform md:w-[42vw]">
            <CmsImage media={meme.image} alt={meme.altText} sizes="(min-width:768px) 42vw, 78vw" maxWidth={1440} className="aspect-[4/3]" />
          </div>
          {meme.caption ? (
            <figcaption data-wait-caption className="meta absolute bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap text-center text-muted-foreground">
              {meme.caption}
            </figcaption>
          ) : null}
        </figure>
      ) : null}
    </section>
  )
}

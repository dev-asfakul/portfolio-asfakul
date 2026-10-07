'use client'

import { useRef } from 'react'
import { useMood } from '@/components/mood/mood-provider'
import { CmsImage } from '@/components/media/cms-image'
import { FULL_MOTION, gsap, useGSAP } from '@/lib/motion/gsap'
import { cn } from '@/lib/utils'
import type { Meme } from '@/lib/cms/types'

const ENTRANCES: Record<NonNullable<Meme['animation']>, gsap.TweenVars> = {
  fade: { autoAlpha: 0 },
  pop: { scale: 0.4, rotate: -8, autoAlpha: 0, ease: 'back.out(2.2)' },
  slide: { xPercent: -40, autoAlpha: 0 },
  rise: { yPercent: 40, autoAlpha: 0 },
  wait: { scale: 0.85, autoAlpha: 0, ease: 'power4.out' },
}

/** A CMS meme rendered as an art-directed figure. Animation is chosen by the CMS, executed here. */
export function MemeFigure({ meme, className, animate = true }: { meme: Meme; className?: string; animate?: boolean }) {
  const ref = useRef<HTMLElement>(null)
  const { config } = useMood()

  useGSAP(
    () => {
      if (!animate) return
      gsap.matchMedia().add(FULL_MOTION, () => {
        gsap.from(ref.current, {
          ...ENTRANCES[meme.animation ?? 'pop'],
          duration: (meme.duration ?? 0) > 0 ? meme.duration : config.motion.duration,
          ease: ENTRANCES[meme.animation ?? 'pop'].ease ?? config.motion.ease,
          scrollTrigger: { trigger: ref.current, start: 'top 85%', once: true },
        })
      })
    },
    { scope: ref, dependencies: [meme.id] },
  )

  if (!meme.image) return null

  return (
    <figure ref={ref} className={cn('relative', className)}>
      <div className={cn('mood-frame overflow-hidden border border-line bg-surface', config.memes === 'loud' && 'rotate-[-3deg] border-2 border-accent')}>
        <CmsImage media={meme.image} alt={meme.altText} sizes="(min-width:1024px) 28vw, 70vw" maxWidth={1080} className="aspect-[4/3]" />
      </div>
      {meme.caption ? (
        <figcaption className="meta mt-3 flex gap-2 text-muted-foreground">
          <span aria-hidden="true">[ {meme.name} ]</span>
          <span className="text-foreground">{meme.caption}</span>
        </figcaption>
      ) : null}
    </figure>
  )
}

'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'
import { useMood } from '@/components/mood/mood-provider'
import { FULL_MOTION, REDUCED, gsap, useGSAP } from '@/lib/motion/gsap'
import { motionForMood } from '@/lib/motion/tokens'
import { DrawLine, Magnetic, MaskImage, PrimitiveLabel, SplitReveal } from '@/components/motion/phase-two-primitives'
import type { About } from '@/lib/cms/types'

export function Arrival({ about }: { about: About }) {
  const { mood } = useMood()
  const motion = motionForMood(mood)
  const title = about.headline || 'I design how websites feel.'

  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add(FULL_MOTION, () => gsap.fromTo('[data-arrival-designed]', { autoAlpha: 0, y: 28 }, { autoAlpha: 1, y: 0, duration: motion.durations.statement, ease: motion.eases.siamInOut, scrollTrigger: { trigger: '[data-arrival]', start: 'top 25%', end: 'bottom 60%', scrub: motion.scrub, invalidateOnRefresh: true } }))
    mm.add(REDUCED, () => gsap.set('[data-arrival-designed]', { clearProps: 'all' }))
    return () => mm.revert()
  }, { dependencies: [mood], revertOnUpdate: true })

  return (
    <section data-arrival aria-labelledby="arrival-title" className={cn('relative flex min-h-[100svh] items-end overflow-hidden px-5 pb-12 pt-28 md:min-h-[125svh] md:px-10 md:pb-16', `arrival-${mood}`)}>
      <div className="mx-auto w-full max-w-[1400px]">
        <div className="grid gap-10 md:grid-cols-12 md:items-end">
          <div className="md:col-span-9">
            <p className="mb-8 font-mono text-xs uppercase tracking-[.22em] text-muted-foreground">Act 01 / Arrival</p>
            <div className="relative max-w-5xl">
              <SplitReveal className="text-[clamp(3.25rem,10vw,9rem)] font-light leading-[.88] tracking-[-.075em]">
                <PrimitiveLabel><span className="font-sans">Hi, I make websites.</span></PrimitiveLabel>
              </SplitReveal>
              <div data-arrival-designed className="absolute inset-x-0 top-0 opacity-0" aria-hidden="true">
                <MaskImage><span id="arrival-title" className="block font-serif text-[clamp(3.25rem,10vw,9rem)] italic leading-[.88] tracking-[-.075em]">{title}</span></MaskImage>
              </div>
            </div>
          </div>
          <div className="md:col-span-3 md:pb-2">
            <p className="text-sm leading-relaxed text-muted-foreground">Plain language first. Then the feeling underneath.</p>
            <Magnetic className="mt-8 inline-block"><Link href="/about" className="inline-flex min-h-11 items-center border-b border-current pb-2 text-sm">Read the approach <span aria-hidden="true" className="ml-3">→</span></Link></Magnetic>
          </div>
        </div>
        <DrawLine className="mt-16 md:mt-24" />
        <div className="mt-4 flex items-center justify-between font-mono text-[10px] uppercase tracking-[.18em] text-muted-foreground"><span>Scroll to change the sentence</span><span>01 / 07</span></div>
      </div>
    </section>
  )
}

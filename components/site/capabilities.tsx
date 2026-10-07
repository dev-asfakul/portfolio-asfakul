'use client'

import { useRef } from 'react'
import { useMood } from '@/components/mood/mood-provider'
import { Glyph } from '@/components/motion/glyph'
import { StaggerGroup } from '@/components/motion/primitives'
import { MemeFigure } from '@/components/site/meme-figure'
import { FULL_MOTION, gsap, useGSAP } from '@/lib/motion/gsap'
import { cn } from '@/lib/utils'
import type { CharacterMoment, Meme, Skill } from '@/lib/cms/types'

export const VERBS = ['design', 'understand', 'build']
export function verbOffset(index: number, count: number) {
  return -100 * (index / count)
}

function VerbSwap() {
  const ref = useRef<HTMLDivElement>(null)
  const { config } = useMood()

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add({ desktop: '(min-width: 768px)', motion: FULL_MOTION }, (ctx) => {
        if (!ctx.conditions?.desktop || !ctx.conditions.motion) return
        gsap
          .timeline({
            defaults: { ease: 'power2.inOut' },
            scrollTrigger: { trigger: ref.current, start: 'top top', end: '+=140%', pin: true, scrub: config.motion.scrub, invalidateOnRefresh: true, immediateRender: false },
          })
          .to('[data-verbs]', { yPercent: verbOffset(1, VERBS.length), duration: 1 })
          .to('[data-verbs]', { yPercent: verbOffset(2, VERBS.length), duration: 1 }, '+=0.3')
          .to('[data-verb-it]', { color: 'var(--accent)', duration: 0.4 })
      })
      return () => mm.revert()
    },
    { scope: ref },
  )

  return (
    <div ref={ref} className="flex min-h-0 flex-col justify-center overflow-hidden md:min-h-[100svh]">
      <p className="meta site-grid mb-8 text-muted-foreground">
        <span className="col-span-4">
          <span className="text-foreground">(04)</span> Design × Technology
        </span>
      </p>
      <h2
        id="capabilities-title"
        aria-label="I design it. I understand it. I build it."
        className={cn(
          'display px-[var(--gutter)]',
          config.id === 'quiet' ? 'text-[clamp(3.25rem,12vw,12rem)]' : 'text-[clamp(3.5rem,14.5vw,15rem)]',
        )}
      >
        <span aria-hidden="true" className="block">
          I
        </span>
        <span aria-hidden="true" className="block h-[1em] overflow-hidden">
          <span data-verbs className="flex flex-col will-change-transform">
            {VERBS.map((v) => (
              <span key={v} className={cn('block h-[1em] leading-[1]', config.id !== 'play' && 'serif-italic')}>
                {v}
              </span>
            ))}
          </span>
        </span>
        <span aria-hidden="true" data-verb-it className="block">
          it.
        </span>
      </h2>
    </div>
  )
}

function SkillColumn({ title, skills, index }: { title: string; skills: Skill[]; index: string }) {
  const { config } = useMood()
  if (!skills.length) return null

  if (config.layout.capabilities === 'scatter') {
    return (
      <StaggerGroup className="col-span-4 md:col-span-4 lg:col-span-6">
        <p className="meta mb-6 text-muted-foreground">
          {index} — {title}
        </p>
        <ul className="flex flex-wrap gap-3">
          {skills.map((s, i) => (
            <li
              key={s.id}
              data-stagger
              title={s.description}
              className={cn(
                'rounded-full border-2 border-foreground px-5 py-2 text-[clamp(1.25rem,3vw,2.25rem)] font-black uppercase tracking-tight',
                i % 4 === 1 && 'rotate-2 bg-accent text-accent-foreground border-accent',
                i % 4 === 3 && '-rotate-3',
              )}
            >
              {s.name}
            </li>
          ))}
        </ul>
      </StaggerGroup>
    )
  }

  return (
    <StaggerGroup className="col-span-4 md:col-span-4 lg:col-span-6">
      <p className="meta mb-6 flex justify-between border-b border-line pb-3 text-muted-foreground">
        <span>
          {index} — {title}
        </span>
        <span>{String(skills.length).padStart(2, '0')}</span>
      </p>
      <ul>
        {skills.map((s, i) => (
          <li key={s.id} data-stagger className="group grid grid-cols-[2.5rem_1fr] items-baseline border-b border-line py-4">
            <span className="meta text-muted-foreground">{String(i + 1).padStart(2, '0')}</span>
            <span>
              <span
                className={cn(
                  'heading block transition-transform duration-500 group-hover:translate-x-2',
                  config.layout.capabilities === 'split' ? 'text-[clamp(1.75rem,3.6vw,3.25rem)]' : 'text-[clamp(1.5rem,2.8vw,2.5rem)]',
                )}
              >
                {s.name}
              </span>
              {s.description ? <span className="mt-1 block max-w-sm text-sm text-muted-foreground">{s.description}</span> : null}
            </span>
          </li>
        ))}
      </ul>
    </StaggerGroup>
  )
}

export function Capabilities({ skills, meme, glyph }: { skills: Skill[]; meme?: Meme; glyph?: CharacterMoment }) {
  const ref = useRef<HTMLElement>(null)
  const design = skills.filter((s) => s.category === 'design')
  const tech = skills.filter((s) => s.category === 'technology')

  return (
    <section ref={ref} id="capabilities" data-scene="capabilities" aria-labelledby="capabilities-title" className="relative z-10 bg-background">
      <VerbSwap />
      {skills.length || meme ? (
        <div className="site-grid gap-y-16 pb-[var(--section-space)]">
          <div className="col-span-4 border-t border-line pt-4 md:col-span-3 lg:col-span-4">
            <p className="meta text-accent">How the work holds</p>
            <p className="mt-6 max-w-xs text-lg leading-tight text-muted-foreground">A practice is more than a stack. It is the rhythm between seeing, deciding, and making.</p>
          </div>
          <div className="col-span-4 md:col-span-5 md:col-start-4 lg:col-span-7 lg:col-start-6">
            <SkillColumn title="Design" index="A" skills={design} />
            <div className="mt-16">
              <SkillColumn title="Technology" index="B" skills={tech} />
            </div>
          </div>
          {glyph || meme ? (
            <div className="col-span-4 flex items-end gap-6 md:col-span-8 lg:col-span-12">
              {glyph ? <Glyph moment={glyph} triggerRef={ref} className="text-4xl" /> : null}
              {meme ? <MemeFigure meme={meme} className="w-2/3 md:w-1/3 lg:w-1/4" /> : null}
            </div>
          ) : null}
        </div>
      ) : null}
    </section>
  )
}

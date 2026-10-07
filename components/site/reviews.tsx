'use client'

import { useRef, useState } from 'react'
import { useMood } from '@/components/mood/mood-provider'
import { CmsImage } from '@/components/media/cms-image'
import { StaggerGroup } from '@/components/motion/primitives'
import { FULL_MOTION, gsap, useGSAP } from '@/lib/motion/gsap'
import { cn } from '@/lib/utils'
import type { Review } from '@/lib/cms/types'

function Attribution({ review }: { review: Review }) {
  return (
    <footer className="meta mt-4 flex items-center gap-3 text-muted-foreground">
      {review.avatar ? (
        <span className="size-9 shrink-0 overflow-hidden rounded-full">
          <CmsImage media={review.avatar} alt="" sizes="36px" aspect="1:1" gravity="face" maxWidth={480} />
        </span>
      ) : null}
      <span>
        <cite className="not-italic text-foreground">{review.name}</cite>
        {[review.role, review.company].filter(Boolean).length ? <span className="block">{[review.role, review.company].filter(Boolean).join(', ')}</span> : null}
      </span>
    </footer>
  )
}

function Spotlight({ reviews }: { reviews: Review[] }) {
  const ref = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)

  useGSAP(
    () => {
      if (reviews.length < 2) return
      const mm = gsap.matchMedia()
      mm.add({ desktop: '(min-width: 768px)', motion: FULL_MOTION }, (ctx) => {
        if (!ctx.conditions?.desktop || !ctx.conditions.motion) return
        gsap.timeline({
          scrollTrigger: {
            trigger: ref.current,
            start: 'top top',
            end: `+=${reviews.length * 70}%`,
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
            immediateRender: false,
            onUpdate: (s) => setActive(Math.min(reviews.length - 1, Math.floor(s.progress * reviews.length))),
          },
        })
      })
      return () => mm.revert()
    },
    { scope: ref, dependencies: [reviews.length] },
  )

  const review = reviews[active]
  return (
    <div ref={ref} className="site-grid min-h-0 content-center gap-y-8 py-[var(--section-space)] md:min-h-[100svh]">
      <span className="sr-only" aria-live="polite">
        Review {active + 1} of {reviews.length}
      </span>
      <p className="meta col-span-4 text-muted-foreground md:col-span-2">
        {String(active + 1).padStart(2, '0')} / {String(reviews.length).padStart(2, '0')}
      </p>
      <blockquote key={review.id} className="col-span-4 animate-in fade-in slide-in-from-bottom-4 duration-700 md:col-span-6 lg:col-span-9">
        <p className="heading text-balance text-[clamp(1.75rem,4.6vw,4.5rem)]">
          <span className="text-accent" aria-hidden="true">
            “
          </span>
          {review.message}
        </p>
        <Attribution review={review} />
      </blockquote>
      <ol className="col-span-4 flex gap-2 md:col-span-8 lg:col-span-12" aria-hidden="true">
        {reviews.map((r, i) => (
          <li key={r.id} className={cn('h-px flex-1 transition-colors duration-500', i <= active ? 'bg-foreground' : 'bg-line')} />
        ))}
      </ol>
    </div>
  )
}

export function Reviews({ reviews }: { reviews: Review[] }) {
  const { config } = useMood()
  const strategy = config.layout.reviews

  return (
    <section id="reviews" data-scene="reviews" aria-label="Kind words" className={cn('kind-words relative z-10 bg-background', `kind-words-${strategy}`)}>
      {!reviews.length ? (
        <div className="kind-words-empty site-grid min-h-0 content-center gap-y-8 py-[var(--section-space)] md:min-h-[70svh]">
          <span className="kind-words-empty__field" aria-hidden="true" />
          <span className="kind-words-empty__signal" aria-hidden="true">05</span>
          <p className="meta col-span-4 text-muted-foreground md:col-span-2 lg:col-span-3">(05) KIND WORDS</p>
          <div className="col-span-4 border-t border-line pt-8 md:col-span-6 lg:col-span-8 lg:col-start-5">
            <p className="heading text-balance text-[clamp(2rem,5vw,5rem)]">The work will speak soon.</p>
            <p className="mt-6 max-w-md text-muted-foreground">A considered archive of collaborators&apos; words is taking shape alongside the work.</p>
          </div>
        </div>
      ) : strategy === 'spotlight' ? (
        <Spotlight reviews={reviews} />
      ) : (
        <div className="site-grid gap-y-10 py-[var(--section-space)]">
          <p className="meta col-span-4 text-muted-foreground md:col-span-2 lg:col-span-3">
            <span className="text-foreground">(05)</span> Kind words
          </p>
          <StaggerGroup className={cn('col-span-4 md:col-span-6 lg:col-span-9', strategy === 'stack' ? 'flex flex-col gap-4 md:gap-0' : 'grid gap-8')}>
            {reviews.map((r, i) => (
              <blockquote
                key={r.id}
                data-stagger
                className={cn(
                  strategy === 'stack' &&
                    cn('mood-frame max-w-xl rounded-3xl border-2 border-foreground bg-surface p-6 md:p-8', i % 2 ? 'md:ml-auto md:rotate-2' : 'md:-rotate-2', i > 0 && 'md:-mt-6'),
                )}
              >
                <p className={cn(strategy === 'stack' ? 'text-xl font-bold leading-snug md:text-2xl' : 'heading text-[clamp(1.5rem,3vw,2.5rem)] text-balance')}>
                  {r.message}
                </p>
                <Attribution review={r} />
              </blockquote>
            ))}
          </StaggerGroup>
        </div>
      )}
    </section>
  )
}

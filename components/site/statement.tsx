'use client'

import { useRef } from 'react'
import { useMood } from '@/components/mood/mood-provider'
import { Glyph } from '@/components/motion/glyph'
import { Reveal, ScrollText, StaggerGroup } from '@/components/motion/primitives'
import { cn } from '@/lib/utils'
import type { About, CharacterMoment, SocialLink } from '@/lib/cms/types'
import type { Identity } from '@/lib/brand'
import { ShapeLayer } from '@/components/visuals/shape-layer'

export function Statement({
  about,
  identity,
  socials,
  glyph,
}: {
  about: About
  identity: Identity
  socials: SocialLink[]
  glyph?: CharacterMoment
}) {
  const ref = useRef<HTMLElement>(null)
  const { config } = useMood()
  const paragraphs = (about.biography ?? '').split(/\n{2,}/).map((p) => p.trim()).filter(Boolean)
  const hasContent = about.headline || paragraphs.length

  return (
    <section
      ref={ref}
      id="about"
      data-scene="about"
      aria-labelledby="about-title"
      className="statement-scene section-space relative z-10 overflow-hidden bg-surface"
    >
      <ShapeLayer mood={config.id} scene="home-statement" />
      <div className="site-grid relative z-10 gap-y-10">
        <p className="meta statement-kicker col-span-4 flex items-center gap-3 text-muted-foreground md:col-span-2 lg:col-span-3">
          <span className="text-foreground">(01)</span> About
          {glyph ? <Glyph moment={glyph} triggerRef={ref} /> : null}
        </p>

        <h2 id="about-title" className="sr-only">
          About {identity.fullName}
        </h2>

        {about.headline ? (
          <ScrollText
            text={about.headline}
            className={cn(
              'statement-headline col-span-4 text-balance md:col-span-8 lg:col-span-9',
              config.id === 'quiet' && 'heading text-[clamp(2rem,5.2vw,5rem)]',
              config.id === 'editorial' && 'heading text-[clamp(2.4rem,6.4vw,6.5rem)]',
              config.id === 'play' && 'display text-[clamp(2.4rem,7.5vw,7.5rem)]',
            )}
          />
        ) : null}

        {!hasContent ? (
          <p className="heading col-span-4 text-[clamp(2rem,6vw,5.5rem)] text-muted-foreground md:col-span-8 lg:col-span-9">
            {identity.disciplines.join(' / ')}
          </p>
        ) : null}

        {paragraphs.length ? (
          <StaggerGroup
            className={cn(
              'statement-body col-span-4 grid gap-6 text-pretty text-base leading-relaxed text-muted-foreground md:text-lg',
              config.id === 'editorial' ? 'md:col-span-4 md:col-start-5 lg:col-span-4 lg:col-start-7 md:columns-1' : 'md:col-span-5 md:col-start-4 lg:col-span-5 lg:col-start-7',
            )}
          >
            {paragraphs.map((p, i) => (
              <p key={i} data-stagger className={i === 0 ? 'text-foreground' : undefined}>
                {p}
              </p>
            ))}
          </StaggerGroup>
        ) : null}

        <Reveal className="col-span-4 grid grid-cols-2 gap-6 border-t border-line pt-6 md:col-span-8 md:grid-cols-4 lg:col-span-12">
          {about.location ? (
            <div>
              <p className="meta text-muted-foreground">Based in</p>
              <p className="mt-2">{about.location}</p>
            </div>
          ) : null}
          {about.availability ? (
            <div>
              <p className="meta text-muted-foreground">Status</p>
              <p className="mt-2">{about.availability}</p>
            </div>
          ) : null}
          {about.email ? (
            <div>
              <p className="meta text-muted-foreground">Write</p>
              <a href={`mailto:${about.email}`} className="mt-2 block underline-offset-4 hover:underline">
                {about.email}
              </a>
            </div>
          ) : null}
          {socials.length ? (
            <div>
              <p className="meta text-muted-foreground">Elsewhere</p>
              <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                {socials.map((s) => (
                  <li key={s.id}>
                    <a href={s.url} target="_blank" rel="noopener noreferrer" className="underline-offset-4 hover:underline">
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </Reveal>
      </div>
    </section>
  )
}

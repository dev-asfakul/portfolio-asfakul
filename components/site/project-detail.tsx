'use client'

import Link from 'next/link'
import { useRef } from 'react'
import { useMood } from '@/components/mood/mood-provider'
import { CmsImage } from '@/components/media/cms-image'
import { ImageReveal, Reveal, TextSplit } from '@/components/motion/primitives'
import { FULL_MOTION, gsap, useGSAP } from '@/lib/motion/gsap'
import { cn } from '@/lib/utils'
import type { Project } from '@/lib/cms/types'

type Block = { kind: 'heading' | 'paragraph'; text: string }

function parseCaseStudy(source?: string): Block[] {
  if (!source) return []
  return source
    .split(/\n\s*\n/)
    .map((chunk) => chunk.trim())
    .filter(Boolean)
    .map((chunk) => (chunk.startsWith('## ') ? { kind: 'heading', text: chunk.slice(3).trim() } : { kind: 'paragraph', text: chunk }))
}

function Meta({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-line pt-3">
      <dt className="meta text-muted-foreground">{label}</dt>
      <dd className="mt-1 text-sm">{children}</dd>
    </div>
  )
}

export function ProjectDetail({ project, index, total, next }: { project: Project; index: number; total: number; next?: Project }) {
  const heroRef = useRef<HTMLDivElement>(null)
  const { config } = useMood()
  const blocks = parseCaseStudy(project.caseStudy)
  const gallery = project.gallery ?? []

  useGSAP(
    () => {
      gsap.matchMedia().add(FULL_MOTION, () => {
        gsap
          .timeline({ scrollTrigger: { trigger: heroRef.current, start: 'top top', end: 'bottom top', scrub: config.motion.scrub } })
          .to('[data-detail-cover]', { scale: 1.12, yPercent: 12, ease: 'none' }, 0)
          .to('[data-detail-title]', { yPercent: -40, opacity: 0.2, ease: 'none' }, 0)
      })
    },
    { scope: heroRef },
  )

  return (
    <article data-scene="project">
      <header ref={heroRef} className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden pb-10 pt-28">
        {project.coverImage ? (
          <div className="absolute inset-0 -z-10">
            <div data-detail-cover className="h-full w-full will-change-transform">
              <CmsImage media={project.coverImage} alt={project.coverImage.alt || project.title} priority sizes="100vw" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
          </div>
        ) : null}
        <div className="site-grid gap-y-6">
          <p className="meta col-span-4 flex gap-6 text-muted-foreground md:col-span-8 lg:col-span-12">
            <Link href="/#work" className="text-foreground underline-offset-4 hover:underline">
              ← All work
            </Link>
            <span>
              {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
            </span>
          </p>
          <h1 data-detail-title className="col-span-4 md:col-span-8 lg:col-span-12">
            <TextSplit
              text={project.title}
              by="chars"
              className={cn(
                'display block break-words',
                config.id === 'quiet' ? 'text-[clamp(3rem,11vw,11rem)]' : 'text-[clamp(3.25rem,15vw,16rem)]',
              )}
            />
          </h1>
        </div>
      </header>

      <section className="site-grid gap-y-12 py-[calc(var(--section-space)*0.6)]" aria-label="Overview">
        <dl className="col-span-4 grid grid-cols-2 gap-x-6 gap-y-6 md:col-span-3 lg:col-span-4 lg:self-start">
          {project.year ? <Meta label="Year">{project.year}</Meta> : null}
          {project.category ? <Meta label="Category">{project.category}</Meta> : null}
          {project.role ? <Meta label="Role">{project.role}</Meta> : null}
          {project.client ? <Meta label="Client">{project.client}</Meta> : null}
          {project.services?.length ? (
            <div className="col-span-2">
              <Meta label="Services">{project.services.join(' · ')}</Meta>
            </div>
          ) : null}
          {project.technologies?.length ? (
            <div className="col-span-2">
              <Meta label="Built with">
                <span className="meta flex flex-wrap gap-2">
                  {project.technologies.map((t) => (
                    <span key={t} className="border border-line px-2 py-1">
                      {t}
                    </span>
                  ))}
                </span>
              </Meta>
            </div>
          ) : null}
          {project.liveUrl || project.githubUrl ? (
            <div className="meta col-span-2 flex gap-6 border-t border-line pt-3">
              {project.liveUrl ? (
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="text-accent underline-offset-4 hover:underline">
                  Visit live ↗
                </a>
              ) : null}
              {project.githubUrl ? (
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="underline-offset-4 hover:underline">
                  Source ↗
                </a>
              ) : null}
            </div>
          ) : null}
        </dl>

        <div className="col-span-4 md:col-span-5 lg:col-span-7 lg:col-start-6">
          {project.description || project.shortDescription ? (
            <Reveal as="p" className="heading text-balance text-[clamp(1.5rem,3vw,2.75rem)]">
              {project.description || project.shortDescription}
            </Reveal>
          ) : null}
          {blocks.length ? (
            <div className="mt-14 flex flex-col gap-6">
              {blocks.map((b, i) =>
                b.kind === 'heading' ? (
                  <Reveal key={i} as="h2" className="meta mt-8 text-accent first:mt-0">
                    {b.text}
                  </Reveal>
                ) : (
                  <Reveal key={i} as="p" className="max-w-prose text-pretty text-lg leading-relaxed text-foreground/85">
                    {b.text}
                  </Reveal>
                ),
              )}
            </div>
          ) : null}
        </div>
      </section>

      {gallery.length ? (
        <section className="site-grid gap-y-[var(--gutter)] pb-[var(--section-space)]" aria-label="Gallery">
          {gallery.map((img, i) => {
            const wide = i % 3 === 0
            return (
              <ImageReveal
                key={img.publicId + i}
                direction={i % 2 ? 'left' : 'up'}
                className={cn(
                  'mood-frame col-span-4',
                  wide ? 'md:col-span-8 lg:col-span-12' : i % 3 === 1 ? 'md:col-span-4 lg:col-span-7' : 'md:col-span-4 lg:col-span-5 lg:mt-24',
                )}
              >
                <CmsImage media={img} alt={img.alt || `${project.title} — image ${i + 1}`} sizes={wide ? '100vw' : '(min-width: 1024px) 58vw, 100vw'} />
              </ImageReveal>
            )
          })}
        </section>
      ) : null}

      {next ? (
        <Link href={`/work/${next.slug}`} className="group block border-t border-line py-[calc(var(--section-space)*0.6)]" aria-label={`Next project: ${next.title}`}>
          <div className="site-grid items-end gap-y-4">
            <p className="meta col-span-4 text-muted-foreground md:col-span-8 lg:col-span-12">Next project →</p>
            <p className="display col-span-4 text-[clamp(2.75rem,10vw,10rem)] transition-transform duration-700 group-hover:translate-x-4 md:col-span-8 lg:col-span-12">
              {next.title}
            </p>
          </div>
        </Link>
      ) : null}
    </article>
  )
}

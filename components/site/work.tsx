'use client'

import Link from 'next/link'
import { Fragment, useRef, useState } from 'react'
import { useMood } from '@/components/mood/mood-provider'
import { CmsImage } from '@/components/media/cms-image'
import { TextSplit } from '@/components/motion/primitives'
import { MemeFigure } from '@/components/site/meme-figure'
import { FULL_MOTION, gsap, ScrollTrigger, useGSAP } from '@/lib/motion/gsap'
import { cn } from '@/lib/utils'
import type { Meme, Project } from '@/lib/cms/types'

const pad = (n: number) => String(n).padStart(2, '0')

function years(projects: Project[]) {
  const list = projects.map((p) => Number.parseInt(p.year ?? '', 10)).filter(Number.isFinite)
  if (!list.length) return null
  const min = Math.min(...list)
  const max = Math.max(...list)
  return min === max ? `${min}` : `${min}—${max}`
}

function WorkHeader({ projects }: { projects: Project[] }) {
  const { config } = useMood()
  const range = years(projects)
  return (
    <header className="site-grid items-end gap-y-6 pb-12 pt-[var(--section-space)] md:pb-20">
      <p className="meta col-span-4 text-muted-foreground md:col-span-2 lg:col-span-3">
        <span className="text-foreground">(03)</span> Selected work
      </p>
      <h2 id="work-title" className="col-span-4 md:col-span-6 lg:col-span-9">
        <TextSplit
          text={config.id === 'quiet' ? 'Selected work' : 'The Work'}
          by="chars"
          className={cn('display block', config.id === 'quiet' ? 'text-[clamp(3.5rem,11vw,11rem)]' : 'text-[clamp(4.5rem,17vw,17rem)]')}
        />
      </h2>
      <p className="meta col-span-4 flex justify-between border-t border-line pt-3 text-muted-foreground md:col-span-8 lg:col-span-12">
        <span>{pad(projects.length)} projects</span>
        {range ? <span>{range}</span> : null}
        <span className="hidden md:inline">Scroll to travel</span>
      </p>
    </header>
  )
}

function ProjectMeta({ project, className }: { project: Project; className?: string }) {
  const rows = [
    ['Year', project.year],
    ['Category', project.category],
    ['Role', project.role],
    ['Client', project.client],
  ].filter((r): r is [string, string] => Boolean(r[1]))
  return (
    <dl className={cn('meta grid grid-cols-2 gap-x-6 gap-y-3', className)}>
      {rows.map(([k, v]) => (
        <div key={k} data-meta-row>
          <dt className="text-muted-foreground">{k}</dt>
          <dd className="mt-1 text-foreground">{v}</dd>
        </div>
      ))}
    </dl>
  )
}

/* ---------------- EDITORIAL: full-bleed chapters ---------------- */

function SequenceScene({ project, index, total }: { project: Project; index: number; total: number }) {
  const ref = useRef<HTMLElement>(null)
  const { config } = useMood()

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add({ desktop: '(min-width: 768px)', motion: FULL_MOTION }, (ctx) => {
        if (!ctx.conditions?.motion) return
        const desktop = ctx.conditions.desktop
        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: { trigger: ref.current, start: 'top top', end: '+=160%', pin: true, scrub: config.motion.scrub },
        })
        tl.fromTo(
          '[data-cover]',
          { clipPath: desktop ? 'inset(16% 3% 22% 36%)' : 'inset(22% 5% 34% 5%)' },
          { clipPath: 'inset(0% 0% 0% 0%)', duration: 1 },
        )
          .fromTo('[data-cover-img]', { scale: 1.3 }, { scale: 1, duration: 1.2 }, 0)
          .fromTo('[data-title]', { yPercent: 0 }, { yPercent: desktop ? -60 : -30, duration: 1 }, 0)
          .from('[data-meta-row], [data-tech]', { autoAlpha: 0, y: 24, stagger: 0.05, duration: 0.3 }, 0.55)
          .to('[data-cover-img]', { yPercent: -8, duration: 0.6 }, 1)
          .to('[data-index]', { yPercent: -100, duration: 0.4 }, 1.1)
      })
    },
    { scope: ref },
  )

  return (
    <article ref={ref} data-scene={`project-${project.slug}`} className="relative z-10 h-[100svh] overflow-hidden bg-background">
      {project.coverImage ? (
        <div data-cover className="absolute inset-0 will-change-[clip-path]">
          <div data-cover-img className="h-full w-full will-change-transform">
            <CmsImage media={project.coverImage} alt={project.coverImage.alt || project.title} sizes="100vw" />
          </div>
          <div className="absolute inset-0 bg-background/35" aria-hidden="true" />
        </div>
      ) : null}

      <div className="site-grid relative z-10 h-full grid-rows-[auto_1fr_auto] py-20 md:py-24">
        <div className="meta col-span-4 flex justify-between overflow-hidden md:col-span-8 lg:col-span-12">
          <span data-index className="inline-block">
            Project {pad(index + 1)} / {pad(total)}
          </span>
          <span>{project.category}</span>
        </div>

        <div className="col-span-4 self-end md:col-span-6 lg:col-span-8">
          <h3 data-title className="display text-[clamp(3.5rem,13vw,13rem)] will-change-transform">
            <Link href={`/work/${project.slug}`} className="focus-visible:outline-offset-8">
              {project.title}
            </Link>
          </h3>
          {project.shortDescription ? <p className="mt-4 max-w-md text-pretty text-sm leading-relaxed md:text-base">{project.shortDescription}</p> : null}
        </div>

        <div className="col-span-4 mt-8 flex flex-col gap-5 self-end md:col-span-2 md:col-start-7 lg:col-span-3 lg:col-start-10">
          <ProjectMeta project={project} />
          {project.technologies?.length ? (
            <ul className="meta flex flex-wrap gap-1.5">
              {project.technologies.map((t) => (
                <li key={t} data-tech className="border border-line px-2 py-1">
                  {t}
                </li>
              ))}
            </ul>
          ) : null}
          <Link href={`/work/${project.slug}`} className="meta inline-flex items-center gap-2 text-accent" data-meta-row>
            Open case study <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </article>
  )
}

function SequenceStrategy({ projects, interlude }: { projects: Project[]; interlude?: Meme }) {
  return (
    <>
      {projects.map((p, i) => (
        <Fragment key={p.id}>
          <SequenceScene project={p} index={i} total={projects.length} />
          {interlude && i === 0 && projects.length > 1 ? (
            <div className="site-grid relative z-10 bg-background py-24">
              <MemeFigure meme={interlude} className="col-span-3 md:col-span-3 md:col-start-5 lg:col-span-3 lg:col-start-6" />
            </div>
          ) : null}
        </Fragment>
      ))}
    </>
  )
}

/* ---------------- QUIET: index with a sticky frame ---------------- */

function IndexStrategy({ projects, interlude }: { projects: Project[]; interlude?: Meme }) {
  const ref = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add({ motion: FULL_MOTION }, (ctx) => {
        if (!ctx.conditions?.motion) return
        const rows = gsap.utils.toArray<HTMLElement>('[data-row]')
        rows.forEach((row, i) => {
          ScrollTrigger.create({ trigger: row, start: 'top 55%', end: 'bottom 55%', onToggle: (s) => s.isActive && setActive(i) })
        })
      })
      return () => mm.revert()
    },
    { scope: ref },
  )

  return (
    <div ref={ref} className="site-grid relative z-10 pb-[var(--section-space)]">
      <ol className="col-span-4 md:col-span-8 lg:col-span-7">
        {projects.map((p, i) => (
          <li key={p.id} data-row className="border-t border-line last:border-b">
            <Link
              href={`/work/${p.slug}`}
              onFocus={() => setActive(i)}
              onMouseEnter={() => setActive(i)}
              className="group grid grid-cols-[3rem_1fr] gap-y-4 py-8 md:grid-cols-[4rem_1fr_auto] md:py-12"
            >
              <span className="meta pt-2 text-muted-foreground">{pad(i + 1)}</span>
              <span>
                <span
                  className={cn(
                    'heading block text-[clamp(2.25rem,6vw,5.5rem)] transition-[color,transform] duration-700',
                    active === i ? 'text-foreground lg:translate-x-2' : 'text-muted-foreground',
                  )}
                >
                  {p.title}
                </span>
                {p.shortDescription ? <span className="mt-3 block max-w-md text-sm leading-relaxed text-muted-foreground">{p.shortDescription}</span> : null}
              </span>
              <span className="meta col-start-2 flex gap-4 text-muted-foreground md:col-start-3 md:flex-col md:items-end md:gap-1 md:pt-3">
                {p.year ? <span>{p.year}</span> : null}
                {p.category ? <span>{p.category}</span> : null}
              </span>
              {p.coverImage ? (
                <span className="col-span-2 mt-2 block aspect-[4/3] overflow-hidden lg:hidden">
                  <CmsImage media={p.coverImage} alt={p.coverImage.alt || p.title} sizes="(min-width:768px) 90vw, 100vw" aspect="4:3" />
                </span>
              ) : null}
            </Link>
          </li>
        ))}
        {interlude ? (
          <li className="py-16">
            <MemeFigure meme={interlude} className="w-2/3 md:w-1/3" />
          </li>
        ) : null}
      </ol>

      <div className="hidden lg:col-span-4 lg:col-start-9 lg:block">
        <div className="sticky top-28 aspect-[4/5] w-full overflow-hidden bg-surface">
          {projects.map((p, i) =>
            p.coverImage ? (
              <div
                key={p.id}
                className={cn(
                  'absolute inset-0 transition-[opacity,transform] duration-1000 ease-out',
                  active === i ? 'scale-100 opacity-100' : 'scale-105 opacity-0',
                )}
                aria-hidden={active !== i}
              >
                <CmsImage media={p.coverImage} alt="" sizes="34vw" aspect="4:5" />
              </div>
            ) : null,
          )}
          <p className="meta absolute bottom-3 left-3 bg-background px-2 py-1 text-foreground">
            {pad(active + 1)} — {projects[active]?.title}
          </p>
        </div>
      </div>
    </div>
  )
}

/* ---------------- PLAY: horizontal collage ---------------- */

function CollageStrategy({ projects, interlude }: { projects: Project[]; interlude?: Meme }) {
  const ref = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      gsap.matchMedia().add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
        const track = trackRef.current
        if (!track) return
        const distance = () => track.scrollWidth - window.innerWidth
        const move = gsap.to(track, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: { trigger: ref.current, start: 'top top', end: () => `+=${distance()}`, pin: true, scrub: 0.6, invalidateOnRefresh: true },
        })
        gsap.utils.toArray<HTMLElement>('[data-panel-img]').forEach((img, i) => {
          gsap.fromTo(
            img,
            { rotate: i % 2 ? 8 : -8, scale: 0.85 },
            { rotate: i % 2 ? -3 : 3, scale: 1, ease: 'none', scrollTrigger: { trigger: img, containerAnimation: move, start: 'left right', end: 'center center', scrub: true } },
          )
        })
        gsap.utils.toArray<HTMLElement>('[data-panel-title]').forEach((t) => {
          gsap.fromTo(t, { xPercent: 30 }, { xPercent: -10, ease: 'none', scrollTrigger: { trigger: t, containerAnimation: move, start: 'left right', end: 'right left', scrub: true } })
        })
      })
    },
    { scope: ref },
  )

  return (
    <div ref={ref} className="relative z-10 overflow-hidden md:h-[100svh] motion-reduce:md:h-auto motion-reduce:md:overflow-x-auto">
      <div ref={trackRef} className="flex flex-col gap-16 px-[var(--gutter)] pb-24 md:h-full md:w-max md:flex-row md:items-center md:gap-[8vw] md:pb-0 md:pr-[20vw] will-change-transform">
        {projects.map((p, i) => (
          <Fragment key={p.id}>
            <Link href={`/work/${p.slug}`} className="group relative flex shrink-0 flex-col md:h-[78svh] md:w-[62vw] md:justify-center lg:w-[52vw]">
              <span className="meta absolute -top-2 left-0 z-20 bg-accent px-2 py-1 text-accent-foreground md:top-0">
                {pad(i + 1)} {p.year ? `· ${p.year}` : ''}
              </span>
              {p.coverImage ? (
                <span data-panel-img className={cn('mood-frame relative block aspect-[4/3] w-[86%] overflow-hidden border-2 border-foreground md:w-[78%]', i % 2 ? 'ml-auto rotate-2' : '-rotate-2')}>
                  <CmsImage media={p.coverImage} alt={p.coverImage.alt || p.title} sizes="(min-width:768px) 50vw, 86vw" aspect="4:3" />
                </span>
              ) : (
                <span className="mood-frame block aspect-[4/3] w-[86%] border-2 border-dashed border-foreground/60 md:w-[78%]" aria-hidden="true" />
              )}
              <h3
                data-panel-title
                className={cn(
                  'display relative z-10 -mt-[0.45em] text-[clamp(3.5rem,14vw,11rem)] text-accent transition-transform duration-500 group-hover:-translate-y-2',
                  i % 2 ? 'text-left' : 'text-right',
                )}
              >
                {p.title}
              </h3>
              <span className="mt-4 flex flex-wrap gap-1.5">
                {(p.technologies ?? []).slice(0, 5).map((t, ti) => (
                  <span key={t} className={cn('meta rounded-full border border-foreground px-3 py-1', ti % 3 === 1 && 'rotate-3 bg-foreground text-background')}>
                    {t}
                  </span>
                ))}
              </span>
            </Link>
            {interlude && i === 0 && projects.length > 1 ? (
              <div className="flex shrink-0 items-center md:w-[28vw]">
                <MemeFigure meme={interlude} animate={false} className="w-3/4 md:w-full" />
              </div>
            ) : null}
          </Fragment>
        ))}
      </div>
    </div>
  )
}

export function Work({ projects, interlude }: { projects: Project[]; interlude?: Meme }) {
  const { config } = useMood()
  const strategy = config.layout.projects

  return (
    <section id="work" data-scene="work" aria-labelledby="work-title" className="relative z-10 bg-background">
      <WorkHeader projects={projects} />
      {projects.length === 0 ? (
        <div className="site-grid min-h-[55svh] items-end pb-[var(--section-space)]">
          <div className="col-span-4 border-t border-line pt-5 md:col-span-5 lg:col-span-4">
            <p className="meta text-accent">Archive / In formation</p>
            <p className="mt-8 max-w-sm text-[clamp(1.35rem,2.6vw,2.5rem)] leading-[1.05] tracking-[-0.04em]">
              The work is taking shape in the quiet before release.
            </p>
          </div>
          <div className="col-span-4 mt-16 flex items-end justify-between md:col-span-3 md:col-start-6 md:mt-0 lg:col-span-4 lg:col-start-9">
            <span className="display text-[clamp(4rem,12vw,10rem)] text-muted-foreground/25" aria-hidden="true">00</span>
            <p className="meta max-w-[12ch] text-right text-muted-foreground">A considered archive, not a catalogue.</p>
          </div>
        </div>
      ) : strategy === 'sequence' ? (
        <SequenceStrategy projects={projects} interlude={interlude} />
      ) : strategy === 'index' ? (
        <IndexStrategy projects={projects} interlude={interlude} />
      ) : (
        <CollageStrategy projects={projects} interlude={interlude} />
      )}
    </section>
  )
}

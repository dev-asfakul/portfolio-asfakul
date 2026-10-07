'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ImageReveal, Parallax, ScrollText, StaggerGroup, TextSplit } from '@/components/motion/primitives'
import type { About, SiteSettings, SocialLink } from '@/lib/cms/types'
import type { Identity } from '@/lib/brand'

const fallbackPrinciples = [
  ['The Site is the Proof', 'Craft is visible in every pixel, transition, and touch target.'],
  ['Typography Before Decoration', 'Structure hierarchy with weight, width, and optical size.'],
  ['Performance is an Ethical Choice', 'Fast websites respect battery, data, and cognitive load.'],
  ['Uncompromising Accessibility', 'Contrast, keyboard navigation, and reduced motion are designed in from the start.'],
]

export function AboutSections({ about, settings, identity, socials }: { about: About; settings: SiteSettings; identity: Identity; socials: SocialLink[] }) {
  const principles = about.principles?.length ? about.principles : fallbackPrinciples.map(([title, body], order) => ({ title, body, order }))
  const location = about.location || settings.location || 'Bangladesh'
  const biography = about.biography || 'Design and engineering are one practice: making useful things with care.'

  return (
    <>
      <main className="px-6 pb-24 md:px-12">
        <section className="mx-auto max-w-7xl border-b border-foreground/15 py-24 md:py-36">
          <p className="meta">About / {location}</p>
          <TextSplit text={about.headline || 'A considered practice for the web.'} by="words" as="h1" className="display mt-8 max-w-5xl text-5xl leading-none md:text-8xl" />
        </section>
        <section className="mx-auto grid max-w-7xl gap-12 border-b border-foreground/15 py-24 md:grid-cols-[0.7fr_1.3fr] md:py-36">
          <p className="meta">Story</p>
          <div className="grid gap-10 md:grid-cols-[1fr_0.8fr] md:items-start">
            <ScrollText text={biography} className="measure whitespace-pre-line text-lg leading-relaxed" />
            {about.profileImage?.url ? <ImageReveal className="aspect-[4/5] bg-surface" direction="center"><Parallax speed={0.16} className="h-full"><Image src={about.profileImage.url} alt={about.profileImage.alt || `${about.name || 'Portfolio owner'} portrait`} width={about.profileImage.width || 1200} height={about.profileImage.height || 1500} className="h-full w-full object-cover" /></Parallax></ImageReveal> : null}
          </div>
        </section>
        <section className="mx-auto max-w-7xl border-b border-foreground/15 py-24 md:py-36">
          <div className="grid gap-10 md:grid-cols-[0.7fr_1.3fr]"><p className="meta">Principles</p><h2 className="display text-4xl md:text-6xl">How the work is made.</h2></div>
          <StaggerGroup className="mt-12 grid gap-px border-y border-foreground/15 bg-foreground/15 md:grid-cols-2">{principles.map((item, index) => <article data-stagger key={`${item.title}-${index}`} className="bg-background p-6 md:p-10"><p className="meta text-muted-foreground">0{index + 1}</p><h3 className="mt-10 text-2xl">{item.title}</h3><p className="mt-5 leading-relaxed text-muted-foreground">{item.body || ('subtitle' in item ? item.subtitle : '')}</p></article>)}</StaggerGroup>
        </section>
        <section className="mx-auto max-w-7xl border-b border-foreground/15 py-24 md:py-36">
          <p className="meta">Experience &amp; Roles</p>
          <div className="mt-12 divide-y divide-foreground/15">{(about.experience || []).map((entry, index) => <article className="grid gap-4 py-8 md:grid-cols-[0.3fr_0.7fr]" key={`${entry.company}-${index}`}><p className="meta text-muted-foreground">{entry.period}</p><div><h2 className="text-2xl">{entry.role} <span className="text-muted-foreground">at {entry.company}</span></h2><p className="meta mt-3 text-muted-foreground">{entry.location}</p><p className="mt-5 max-w-xl leading-relaxed text-muted-foreground">{entry.summary}</p></div></article>)}</div>
        </section>
        <section className="mx-auto max-w-7xl py-24 md:py-36"><div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end"><div><p className="meta">Continue</p><h2 className="display mt-4 text-4xl md:text-6xl">Let&apos;s make something useful.</h2></div><div className="flex flex-wrap gap-5">{settings.resumeUrl ? <a className="meta border-b border-foreground pb-2" href={settings.resumeUrl} target="_blank" rel="noreferrer">{settings.resumeLabel || 'Download resume'}</a> : null}<Link className="meta border-b border-foreground pb-2" href="/#contact">Contact</Link></div></div>        </section>
      </main>
    </>

  )
}


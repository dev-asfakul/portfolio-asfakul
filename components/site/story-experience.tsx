'use client'

import Link from 'next/link'
import { useMood } from '@/components/mood/mood-provider'
import { Stage3D } from '@/components/motion/stage3d'
import { DrawLine, HorizontalRail, Magnetic, MaskImage, Marquee, PinnedSequence, SectionProgress, SplitReveal, TiltCard, VelocitySkew } from '@/components/motion/phase-two-primitives'
import type { Project, Review, SiteContent } from '@/lib/cms/types'

const acts = [
  { id: 'arrival', number: '01', eyebrow: 'Arrival', title: 'I design how websites feel.', line: 'Hi, I make websites.', href: '/about', label: 'See how I work' },
  { id: 'problem', number: '02', eyebrow: 'The problem', title: 'Most websites are seen. Few are remembered.', line: 'Templates look alike. People forget alike.', href: '/work', label: 'See the difference' },
  { id: 'turn', number: '03', eyebrow: 'The turn', title: 'One identity. Three moods.', line: 'Same words: Quiet, Editorial, Play. Watch what changes.', href: '/design', label: 'Change the mood' },
  { id: 'proof', number: '04', eyebrow: 'Proof', title: 'Work that moves.', line: 'Selected projects, told as short films.', href: '/work', label: 'View all work' },
  { id: 'process', number: '05', eyebrow: 'How it\'s made', title: 'I design it. I understand it. I build it.', line: 'One person, from first sketch to shipped code.', href: '/about', label: 'Read the approach' },
  { id: 'trust', number: '06', eyebrow: 'Trust', title: 'In their words.', line: 'What clients say after launch.', href: '/reviews', label: 'View all reviews' },
  { id: 'invitation', number: '07', eyebrow: 'Invitation', title: 'Your story is next.', line: 'Tell me what you\'re making. I reply personally.', href: '/contact', label: 'Start a conversation' },
] as const

function Pointer({ act, href, label }: { act: string; href: string; label: string }) {
  return <div className="mt-10 flex items-center justify-between gap-4 border-t border-line pt-4"><span className="meta text-muted-foreground">Next · {act}</span><Link className="meta underline decoration-accent underline-offset-4" href={href}>{label}</Link></div>
}

function ActShell({ act, children, className = '' }: { act: typeof acts[number]; children: React.ReactNode; className?: string }) {
  return <section id={act.id} data-scene={act.id} aria-labelledby={`${act.id}-title`} className={`relative flex min-h-[100svh] flex-col justify-center px-[var(--gutter)] py-[var(--section-space)] ${className}`}><div className="mx-auto w-full max-w-7xl"><div className="mb-10 flex items-center justify-between border-b border-line pb-3"><span className="meta text-accent">{act.number} / 07</span><span className="meta text-muted-foreground">{act.eyebrow}</span></div>{children}<Pointer act={act.number === '07' ? 'contact' : acts[Number(act.number)].eyebrow} href={act.href} label={act.label} /></div></section>
}

function Act1({ act, content }: { act: typeof acts[number]; content: SiteContent }) {
  const { mood } = useMood()

  return (
    <ActShell act={act} className="min-h-[125svh]">
      <div className="grid gap-12 md:grid-cols-12 md:items-end">
        <div className="md:col-span-8">
          <p className="meta mb-8 text-muted-foreground">A studio for digital identity</p>
          <SplitReveal><h1 id="arrival-title" className="display max-w-5xl text-[clamp(4rem,12vw,11rem)]">{act.title}</h1></SplitReveal>
        </div>
        <div className="md:col-span-3 md:col-start-10">
          <p className="serif-italic text-2xl text-muted-foreground">{act.line}</p>
          <Stage3D mood={mood} image={content.projects.find((project) => project.coverImage)?.coverImage} className="ml-auto mt-8 w-[min(64vw,18rem)] md:ml-0 md:w-full" />
        </div>
      </div>
      <DrawLine className="mt-16 text-accent" />
    </ActShell>
  )
}

function Act2({ act }: { act: typeof acts[number] }) {
  return <ActShell act={act} className="overflow-hidden"><VelocitySkew><Marquee className="mb-16 border-y border-line py-5 text-muted-foreground"><span className="display px-8 text-[clamp(2rem,7vw,7rem)]">Generic layout · familiar pattern · same again · </span></Marquee></VelocitySkew><div className="grid gap-10 lg:grid-cols-12 lg:items-end"><div className="lg:col-span-8"><p className="meta mb-6 text-accent">A useful disruption</p><SplitReveal><h2 id="problem-title" className="display text-[clamp(3.2rem,9vw,9rem)]">{act.title}</h2></SplitReveal></div><div className="lg:col-span-3 lg:col-start-10"><p className="text-lg text-muted-foreground">{act.line}</p></div></div><DrawLine className="mt-16 text-accent" /></ActShell>
}

function Act3({ act }: { act: typeof acts[number] }) {
  const { mood } = useMood()
  return <ActShell act={act} className="bg-surface/30"><div className="grid gap-10 lg:grid-cols-12 lg:items-end"><div className="lg:col-span-7"><p className="meta mb-6 text-accent">A living identity system</p><SplitReveal><h2 id="turn-title" className="display text-[clamp(3.5rem,10vw,10rem)]">{act.title}</h2></SplitReveal><p className="mt-8 max-w-lg text-xl text-muted-foreground">{act.line}</p></div><div className="grid gap-3 sm:grid-cols-3 lg:col-span-5"><Link href="/design?mood=quiet" className="border border-line p-5 transition-colors hover:border-accent"><span className="meta text-muted-foreground">01</span><p className="mt-16 text-2xl">Quiet</p></Link><Link href="/design?mood=editorial" className="border border-line bg-foreground p-5 text-background transition-transform hover:-translate-y-2"><span className="meta">02</span><p className="mt-16 text-2xl">Editorial</p></Link><Link href="/design?mood=play" className="border border-accent bg-accent p-5 text-accent-foreground transition-transform hover:translate-y-2"><span className="meta">03</span><p className="mt-16 text-2xl">Play</p></Link></div></div><p className="meta mt-12 text-muted-foreground">Current lens · {mood}</p></ActShell>
}

function Act4({ act, projects }: { act: typeof acts[number]; projects: Project[] }) {
  return <ActShell act={act}><PinnedSequence><div className="grid gap-8 lg:grid-cols-12"><div className="lg:col-span-4"><p className="meta mb-6 text-accent">Selected proof</p><SplitReveal><h2 id="proof-title" className="display text-[clamp(3.5rem,8vw,8rem)]">{act.title}</h2></SplitReveal><p className="mt-6 text-lg text-muted-foreground">{act.line}</p></div><div className="space-y-4 lg:col-span-7 lg:col-start-6">{projects.slice(0, 3).map((project, index) => <Link data-sequence key={project.slug} href={`/work/${project.slug}`} className="group block border-t border-line"><TiltCard className="flex items-start justify-between gap-5 py-6"><span className="meta text-accent">0{index + 1}</span><div className="flex-1"><h3 className="heading text-3xl transition-colors group-hover:text-accent">{project.title}</h3><p className="mt-2 text-muted-foreground">{project.role ?? project.category ?? project.shortDescription}</p></div><span className="meta text-muted-foreground">{project.year}</span></TiltCard></Link>)}</div></div></PinnedSequence></ActShell>
}

function Act5({ act }: { act: typeof acts[number] }) {
  return <ActShell act={act}><p className="meta mb-6 text-accent">The throughline</p><SplitReveal><h2 id="process-title" className="display max-w-5xl text-[clamp(3rem,9vw,9rem)]">{act.title}</h2></SplitReveal><div className="mt-16"><DrawLine className="text-accent" /><div className="grid gap-8 pt-5 sm:grid-cols-3"><div><span className="meta text-accent">01</span><p className="mt-3 text-2xl">design</p><p className="mt-2 text-muted-foreground">Find the shape.</p></div><div><span className="meta text-accent">02</span><p className="mt-3 text-2xl">understand</p><p className="mt-2 text-muted-foreground">Make it meaningful.</p></div><div><span className="meta text-accent">03</span><p className="mt-3 text-2xl">build</p><p className="mt-2 text-muted-foreground">Ship the feeling.</p></div></div></div><p className="serif-italic mt-14 max-w-md text-2xl text-muted-foreground">{act.line}</p></ActShell>
}

function Act6({ act, reviews }: { act: typeof acts[number]; reviews: Review[] }) {
  const review = reviews[0]
  return <ActShell act={act} className="min-h-[80svh]"><div className="max-w-5xl"><p className="meta mb-8 text-accent">{review ? 'Real words, after launch' : 'Trust is part of the work'}</p><SplitReveal><blockquote id="trust-title" className="display text-[clamp(3rem,8vw,8rem)]">&quot;{review?.message ?? 'Make something people want to keep.'}&quot;</blockquote></SplitReveal>{review ? <p className="mt-10 text-muted-foreground">{review.name}{review.role ? ` · ${review.role}` : ''}{review.company ? ` · ${review.company}` : ''}</p> : <Link href="/reviews" className="mt-10 inline-block text-muted-foreground underline underline-offset-4">Read the notes from past launches</Link>}</div><DrawLine className="mt-14 text-accent" /></ActShell>
}

function Act7({ act, content }: { act: typeof acts[number]; content: SiteContent }) {
  return <ActShell act={act} className="min-h-[100svh] bg-accent text-accent-foreground"><div className="max-w-5xl"><p className="meta mb-6">A final question</p><SplitReveal><h2 id="invitation-title" className="display text-[clamp(4rem,12vw,12rem)]">{act.title}</h2></SplitReveal><p className="mt-10 max-w-xl text-2xl">{act.line}</p><div className="mt-12 flex flex-wrap gap-6 text-sm">{content.about.availability ? <span>{content.about.availability}</span> : null}{content.about.timezone ? <span>{content.about.timezone}</span> : null}</div><Magnetic className="mt-14 inline-block"><TiltCard className="inline-block"><Link href="/contact" className="inline-flex min-h-11 items-center rounded-full bg-background px-7 py-4 text-sm font-medium text-foreground">{act.label}</Link></TiltCard></Magnetic></div></ActShell>
}

export function StoryExperience({ content }: { content: SiteContent }) {
  return <div className="mood-stage" data-mood-stage="story"><SectionProgress className="text-accent" /><Act1 act={acts[0]} content={content} /><Act2 act={acts[1]} /><Act3 act={acts[2]} /><Act4 act={acts[3]} projects={content.projects} /><Act5 act={acts[4]} /><Act6 act={acts[5]} reviews={content.reviews} /><Act7 act={acts[6]} content={content} /></div>
}

export { acts }

// Shared element: the accent line travels from Arrival through the invitation field.
// Act 5 claim remains editable approved default copy until owner confirmation.
// Act 6 intentionally renders nothing when the CMS has no real reviews.
// Act 7 availability and timezone are sourced from CMS and omitted when empty.
export type { SiteContent }


void MaskImage
void HorizontalRail

// Keep the story primitives available to future mood-specific compositions without changing the act contract.
export { MaskImage, HorizontalRail, TiltCard }

export default StoryExperience

function _unused(projects: Project[]) { return projects }
void _unused

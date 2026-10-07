'use client'

import { useMood } from '@/components/mood/mood-provider'
import { DrawLine, Counter, FlipGrid, HorizontalRail, Magnetic, MaskImage, Marquee, PinnedSequence, PrimitiveLabel, SectionProgress, SplitReveal, TiltCard, VelocitySkew } from './phase-two-primitives'

const moods = ['quiet', 'editorial', 'play'] as const

export function PhaseTwoShowcase() {
  const { mood } = useMood()
  return <main className="mx-auto max-w-[1400px] px-5 pb-32 pt-16 md:px-10">
    <SectionProgress />
    <header className="mb-20 max-w-3xl">
      <p className="font-mono text-xs uppercase tracking-[.22em] text-muted-foreground">Motion engine / {mood}</p>
      <h1 className="mt-6 text-5xl font-light tracking-[-.06em] md:text-8xl">Primitives, not decoration.</h1>
      <p className="mt-8 max-w-xl text-lg text-muted-foreground">Every movement is reusable, reversible, mood-aware, and safe to remove when motion is reduced.</p>
    </header>
    <div className="grid gap-px border border-foreground/20 bg-foreground/20 md:grid-cols-3">
      {moods.map((item) => <article key={item} className="bg-background p-6 md:p-8"><p className="font-mono text-xs uppercase tracking-[.18em]">{item}</p><SplitReveal className="mt-12 text-3xl"><PrimitiveLabel>{item === 'quiet' ? 'Weight' : item === 'editorial' ? 'Structure' : 'Energy'}</PrimitiveLabel></SplitReveal><DrawLine className="mt-8" /></article>)}
    </div>
    <section className="mt-24 grid gap-16 md:grid-cols-2">
      <div><p className="font-mono text-xs uppercase tracking-[.18em]">SplitReveal / MaskImage</p><MaskImage className="mt-6 aspect-[4/3] bg-foreground p-8 text-background"><div className="flex h-full items-end text-5xl tracking-[-.06em]">Reveal the edge.</div></MaskImage></div>
      <div><p className="font-mono text-xs uppercase tracking-[.18em]">Magnetic / TiltCard</p><Magnetic className="mt-6"><TiltCard className="border border-foreground/20 p-8"><h2 className="text-4xl tracking-[-.05em]">Move toward intent.</h2><p className="mt-16 text-muted-foreground">Hover on capable devices.</p></TiltCard></Magnetic></div>
    </section>
    <section className="mt-24"><p className="font-mono text-xs uppercase tracking-[.18em]">VelocitySkew / Marquee</p><VelocitySkew className="mt-8 border-y border-foreground/20 py-8 text-5xl tracking-[-.06em]"><Marquee>DESIGN × TECHNOLOGY — </Marquee></VelocitySkew></section>
    <section className="mt-24 grid gap-16 md:grid-cols-2"><PinnedSequence className="min-h-[70vh] border border-foreground/20 p-8"><p data-sequence className="text-4xl">01 / Frame</p><p data-sequence className="mt-32 text-4xl">02 / Shape</p><p data-sequence className="mt-32 text-4xl">03 / Signal</p></PinnedSequence><div><p className="font-mono text-xs uppercase tracking-[.18em]">HorizontalRail / FlipGrid</p><HorizontalRail className="mt-8"><FlipGrid className="grid grid-cols-3 gap-2 p-2">{Array.from({ length: 6 }, (_, i) => <div key={i} className="grid size-28 place-items-center bg-foreground text-background md:size-40">{String(i + 1).padStart(2, '0')}</div>)}</FlipGrid></HorizontalRail><p className="mt-12 text-7xl tracking-[-.08em]"><Counter value={94} />%</p></div></section>
  </main>
}

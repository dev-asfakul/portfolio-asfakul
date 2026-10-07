'use client'

import { useState, type CSSProperties } from 'react'
import { MoodProvider, useMood } from '@/components/mood/mood-provider'
import { ImageReveal, Parallax, Reveal, ScrollText, StaggerGroup, TextSplit } from '@/components/motion/primitives'
import { MOODS, MOOD_ORDER } from '@/lib/mood/moods'
import type { MoodId } from '@/lib/cms/types'

const tokenDefinitions = [
  ['background', 'Background'], ['surface', 'Surface'], ['foreground', 'Text'], ['muted', 'Muted'], ['line', 'Border'],
  ['accent', 'Accent'], ['accent-foreground', 'Accent text'], ['success', 'Success'], ['warning', 'Warning'], ['error', 'Error'], ['focus', 'Focus'],
] as const
const spacing = ['0.25rem', '0.5rem', '0.75rem', '1rem', '1.5rem', '2rem', '3rem', '5rem', '8rem']
const typeRoles = [
  ['Display', 'display', 'clamp(4rem, 12vw, 12rem)', 'Hero statements and dominant project titles.'],
  ['H1', 'heading text-[clamp(3rem,9vw,9rem)]', 'clamp(3rem, 9vw, 9rem)', 'Page-level titles.'],
  ['H2', 'heading text-[clamp(2rem,5vw,5rem)]', 'clamp(2rem, 5vw, 5rem)', 'Section titles and chapter markers.'],
  ['H3', 'heading text-[clamp(1.25rem,2vw,2rem)]', 'clamp(1.25rem, 2vw, 2rem)', 'Card and project subheadings.'],
  ['Body', 'text-[clamp(1rem,1.2vw,1.25rem)]', 'clamp(1rem, 1.2vw, 1.25rem)', 'Readable long-form copy.'],
  ['Label', 'meta', '0.6875rem', 'Controls, indexes, and metadata.'],
  ['Caption', 'text-xs text-muted', '0.75rem', 'Supporting context and image notes.'],
  ['Mono', 'mono text-xs', '0.6875rem', 'Technical values and system notes.'],
] as const
const motionSpecs = [
  ['Reveal', 'One-shot entrance', '0.8s', 'mood easing', 'A section earns attention once.'],
  ['StaggerGroup', 'Ordered children', '0.8s + stagger', 'mood easing', 'Related items arrive as a sequence.'],
  ['TextSplit', 'Character mask', '0.9s', 'expo.out', 'Dominant words become legible with intention.'],
  ['ScrollText', 'Scroll emphasis', 'scrub 1.2s', 'linear', 'Reading emphasis follows attention.'],
  ['Parallax', 'Depth shift', 'scrub 1.2s', 'linear', 'Images move less than the page.'],
  ['ImageReveal', 'Clip entrance', '1.0s', 'power3.out', 'The image is revealed, never dropped in.'],
] as const

function hexToRgb(value: string) {
  const hex = value.replace('#', '')
  if (hex.length !== 6) return null
  return [0, 2, 4].map((index) => Number.parseInt(hex.slice(index, index + 2), 16) / 255)
}
function luminance(value: string) {
  const rgb = hexToRgb(value)
  if (!rgb) return 0
  return rgb.reduce((sum, channel) => sum + (channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4) * [0.2126, 0.7152, 0.0722][rgb.indexOf(channel)], 0)
}
function contrastRatio(foreground: string, background: string) {
  const light = Math.max(luminance(foreground), luminance(background))
  const dark = Math.min(luminance(foreground), luminance(background))
  return ((light + 0.05) / (dark + 0.05)).toFixed(2)
}

function MoodControls() {
  const { mood, setMood, config } = useMood()
  return <div className="flex flex-wrap items-end justify-between gap-6 border-b border-line pb-8"><div><p className="meta mb-3 text-muted">Current mood</p><p className="display text-5xl md:text-7xl">{config.label}</p></div><div className="flex flex-wrap gap-2" role="group" aria-label="Mood preview">{MOOD_ORDER.map((id) => <button key={id} type="button" onClick={() => setMood(id)} aria-pressed={mood === id} className="meta border border-line px-3 py-2 transition-colors hover:border-accent hover:text-accent aria-pressed:bg-accent aria-pressed:text-accent-foreground">{MOODS[id].index} · {MOODS[id].label}</button>)}</div></div>
}

function TokenSwatches() {
  const { config } = useMood()
  return <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{tokenDefinitions.map(([token, label]) => { const value = config.tokens[token as keyof typeof config.tokens] ?? '#000000'; return <div key={token} className="border border-line p-4"><div className="flex items-center gap-4"><span className="size-12 shrink-0 border border-line" style={{ backgroundColor: value }} /><div className="min-w-0"><p className="meta">{label}</p><code className="text-xs text-muted">--{token}</code><p className="mono mt-2 text-xs">{value}</p></div></div><p className="caption mt-4 text-muted">Text / background: <strong className="text-foreground">{contrastRatio(config.tokens.foreground, value)}:1</strong> · Text / surface: <strong className="text-foreground">{contrastRatio(config.tokens.foreground, config.tokens.surface)}:1</strong></p></div> })}</div>
}

function MotionSpecimens() {
  const [replay, setReplay] = useState(0)
  return <div className="space-y-4"><div className="flex items-center justify-between border border-line bg-surface p-4"><p className="caption text-muted">Replay remounts every specimen.</p><button type="button" onClick={() => setReplay((value) => value + 1)} className="meta border border-accent px-4 py-2 text-accent hover:bg-accent hover:text-accent-foreground">Replay motion</button></div><StaggerGroup key={replay} className="grid gap-4 md:grid-cols-2">{motionSpecs.map(([name, role, duration, easing, purpose], index) => <Reveal key={name} className="border border-line p-6" delay={index * 0.08}><div className="flex items-start justify-between gap-4"><div><p className="meta text-accent">{name}</p><p className="mt-2 text-xl">{purpose}</p></div><span className="mono text-right text-xs text-muted">{duration}<br />{easing}</span></div>{name === 'TextSplit' ? <TextSplit text="Intentional entrance." className="mt-12 block text-4xl" /> : name === 'ScrollText' ? <ScrollText text="Attention moves through the sentence." className="mt-12 block max-w-md text-3xl" /> : name === 'Parallax' ? <Parallax className="mt-12 text-5xl" speed={0.12}>Depth / 012</Parallax> : name === 'ImageReveal' ? <ImageReveal className="mt-8 h-20 bg-surface" direction="center"><div className="h-full w-full bg-accent" /></ImageReveal> : <div data-stagger className="mt-12 h-12 w-2/3 bg-accent" />}</Reveal>)}</StaggerGroup></div>
}

function StateSpecimens() {
  return <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">{[['success', 'Saved'], ['warning', 'Review'], ['error', 'Blocked'], ['focus', 'Focused'], ['disabled', 'Disabled']].map(([state, label]) => <button key={state} type="button" disabled={state === 'disabled'} className={`border px-4 py-4 text-left text-sm ${state === 'disabled' ? 'cursor-not-allowed border-line text-muted opacity-50' : state === 'focus' ? 'border-focus outline outline-2 outline-offset-2 outline-focus' : `border-${state} text-${state}`}`}><span className="meta block">{state}</span><span className="mt-3 block">{label} control</span></button>)}</div>
}

function ReferenceContent() {
  const { config } = useMood()
  return <main className="min-h-screen bg-background text-foreground transition-colors duration-700"><header className="site-grid border-b border-line py-5"><div className="col-span-2 meta text-muted md:col-span-4">SIAM / DESIGN SYSTEM</div><div className="col-span-2 text-right meta text-muted md:col-span-8">Development reference surface</div></header><div className="mx-auto max-w-[1800px] space-y-24 px-[var(--gutter)] py-16 md:space-y-40 md:py-28"><section aria-labelledby="intro-title" className="max-w-5xl"><p className="meta mb-6 text-accent">Step 02 / Foundation</p><h1 id="intro-title" className="display max-w-5xl text-[clamp(4rem,14vw,13rem)]">A system with a point of view.</h1><p className="mt-8 max-w-2xl text-lg text-muted md:text-2xl">A live contract for palette, type, rhythm, mood, state, and motion.</p></section><MoodControls /><section aria-labelledby="mood-title"><div className="mb-8 flex items-baseline justify-between border-b border-line pb-4"><h2 id="mood-title" className="heading text-3xl">Same component / three moods</h2><span className="meta text-muted">01 / mood</span></div><div className="grid gap-4 md:grid-cols-3">{MOOD_ORDER.map((id) => <article key={id} data-mood={id} className="border border-line bg-background p-6 text-foreground transition-colors"><p className="meta text-muted">{MOODS[id].index} · {MOODS[id].descriptor}</p><h3 className="display mt-12 text-5xl">{MOODS[id].label}</h3><button type="button" className="mt-8 w-full border border-accent bg-accent px-4 py-3 text-left text-sm text-accent-foreground">View selected project <span className="float-right">↗</span></button></article>)}</div></section><section aria-labelledby="tokens-title"><div className="mb-8 flex items-baseline justify-between border-b border-line pb-4"><h2 id="tokens-title" className="heading text-3xl">Semantic tokens / {config.label}</h2><span className="meta text-muted">02 / palette</span></div><TokenSwatches /></section><section aria-labelledby="type-title"><div className="mb-8 flex items-baseline justify-between border-b border-line pb-4"><h2 id="type-title" className="heading text-3xl">Every type role</h2><span className="meta text-muted">03 / hierarchy</span></div><div className="space-y-10">{typeRoles.map(([role, className, size, usage]) => <div key={role} className="border-b border-line pb-6"><div className="mb-3 flex flex-wrap justify-between gap-4"><span className="meta text-accent">{role}</span><span className="mono text-xs text-muted">{size}</span></div><p className={`${className} text-foreground`}>{role === 'Display' ? 'A point of view.' : role === 'Body' ? 'Design is a system of choices made visible.' : role === 'Label' ? 'INDEX / 004 / SELECTED' : role === 'Caption' ? 'Caption / context follows the image.' : role === 'Mono' ? 'font-mono / 0.6875rem' : `${role} / editorial clarity`}</p><p className="caption mt-3 text-muted">{usage}</p></div>)}</div></section><section aria-labelledby="state-title"><div className="mb-8 flex items-baseline justify-between border-b border-line pb-4"><h2 id="state-title" className="heading text-3xl">State tokens</h2><span className="meta text-muted">04 / interaction</span></div><StateSpecimens /></section><section aria-labelledby="spacing-title"><div className="mb-8 flex items-baseline justify-between border-b border-line pb-4"><h2 id="spacing-title" className="heading text-3xl">Spacing rhythm</h2><span className="meta text-muted">05 / scale</span></div><div className="space-y-3">{spacing.map((step) => <div key={step} className="flex items-center gap-4"><span className="mono w-16 text-xs text-muted">{step}</span><span className="block h-3 bg-accent" style={{ width: step }} /></div>)}</div></section><section aria-labelledby="motion-title"><div className="mb-8 flex items-baseline justify-between border-b border-line pb-4"><h2 id="motion-title" className="heading text-3xl">Live motion specimens</h2><span className="meta text-muted">06 / behavior</span></div><MotionSpecimens /></section><footer className="border-t border-line pt-6"><p className="meta text-muted">Reference state / {config.label} / reduced motion supported</p></footer></div></main>
}

export function DesignReference() {
  const [mood] = useState<MoodId>('editorial')
  return <MoodProvider initialMood={mood} available={MOOD_ORDER}><ReferenceContent /></MoodProvider>
}

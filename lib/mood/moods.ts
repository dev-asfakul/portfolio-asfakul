import type { MoodId, MoodSettings } from '@/lib/cms/types'

export type ProjectStrategy = 'index' | 'sequence' | 'collage'
export type ReviewStrategy = 'list' | 'spotlight' | 'stack'
export type CapabilityStrategy = 'ledger' | 'split' | 'scatter'
export type HeroStrategy = 'still' | 'split' | 'stack'
export type MoodNav = 'minimal' | 'bar' | 'pill'
export type MoodCursor = 'dot' | 'crosshair' | 'blob'
export type MoodTransition = 'wipe' | 'fade' | 'bounce'

export interface MotionPreset {
  ease: string
  duration: number
  stagger: number
  scrub: number | boolean
  distance: number
  intensity: number
}

export interface MoodConfig {
  id: MoodId
  index: string
  label: string
  descriptor: string
  description: string
  tokens: {
    background: string
    foreground: string
    muted: string
    line: string
    accent: string
    accentForeground: string
    surface: string
  }
  layout: {
    hero: HeroStrategy
    projects: ProjectStrategy
    reviews: ReviewStrategy
    capabilities: CapabilityStrategy
  }
  fonts: { display: 'serif' | 'grotesk' | 'oversized'; body: 'sans' | 'serif' | 'mono' }
  nav: MoodNav
  cursor: MoodCursor
  heroVariant: HeroStrategy
  workVariant: ProjectStrategy
  aboutVariant: 'column' | 'two-up' | 'collage'
  contactVariant: 'inline' | 'form' | 'big-type'
  transition: MoodTransition
  grid: 'hidden' | 'visible' | 'animated'
  imageTreatment: 'soft' | 'framed' | 'cutout'
  memes: 'restrained' | 'integrated' | 'loud'
  motion: MotionPreset
}

export const MOODS: Record<MoodId, MoodConfig> = {
  quiet: {
    id: 'quiet',
    index: '01',
    label: 'Quiet',
    descriptor: 'Space · Restraint · Calm',
    description: 'Large whitespace, soft motion, and an index of work that lets each piece breathe.',
    tokens: {
      background: '#F2F0EB',
      foreground: '#1A1917',
      muted: '#7B776F',
      line: 'rgba(26,25,23,0.14)',
      accent: '#B2532E',
      accentForeground: '#F2F0EB',
      surface: '#E9E6DF',
    },
    layout: { hero: 'still', projects: 'index', reviews: 'list', capabilities: 'ledger' },
    fonts: { display: 'serif', body: 'sans' },
    nav: 'minimal', cursor: 'dot', heroVariant: 'still', workVariant: 'index', aboutVariant: 'column', contactVariant: 'inline', transition: 'wipe',
    grid: 'hidden',
    imageTreatment: 'soft',
    memes: 'restrained',
    motion: { ease: 'power2.out', duration: 1.2, stagger: 0.06, scrub: 1.2, distance: 24, intensity: 0.4 },
  },
  editorial: {
    id: 'editorial',
    index: '02',
    label: 'Editorial',
    descriptor: 'Grid · Type · Photography',
    description: 'A visible grid, huge serif display, and work presented as full-bleed chapters.',
    tokens: {
      background: '#0E0E0C',
      foreground: '#ECE8DF',
      muted: '#8C877C',
      line: 'rgba(236,232,223,0.12)',
      accent: '#FF4A1C',
      accentForeground: '#0E0E0C',
      surface: '#171714',
    },
    layout: { hero: 'split', projects: 'sequence', reviews: 'spotlight', capabilities: 'split' },
    fonts: { display: 'grotesk', body: 'serif' },
    nav: 'bar', cursor: 'crosshair', heroVariant: 'split', workVariant: 'sequence', aboutVariant: 'two-up', contactVariant: 'form', transition: 'fade',
    grid: 'visible',
    imageTreatment: 'framed',
    memes: 'integrated',
    motion: { ease: 'expo.out', duration: 1.1, stagger: 0.04, scrub: 0.8, distance: 60, intensity: 0.7 },
  },
  play: {
    id: 'play',
    index: '03',
    label: 'Play',
    descriptor: 'Energy · Characters · Surprise',
    description: 'Heavy type, collaged layers, characters that react, and a horizontal run through the work.',
    tokens: {
      background: '#2230FF',
      foreground: '#F6F4EE',
      muted: '#B6BCFF',
      line: 'rgba(246,244,238,0.22)',
      accent: '#E4FF3A',
      accentForeground: '#1A1E8F',
      surface: '#1B27D9',
    },
    layout: { hero: 'stack', projects: 'collage', reviews: 'stack', capabilities: 'scatter' },
    fonts: { display: 'oversized', body: 'mono' },
    nav: 'pill', cursor: 'blob', heroVariant: 'stack', workVariant: 'collage', aboutVariant: 'collage', contactVariant: 'big-type', transition: 'bounce',
    grid: 'animated',
    imageTreatment: 'cutout',
    memes: 'loud',
    motion: { ease: 'back.out(1.6)', duration: 0.9, stagger: 0.03, scrub: 0.5, distance: 90, intensity: 1 },
  },
}

export const MOOD_ORDER: MoodId[] = ['quiet', 'editorial', 'play']

export function isMoodId(value: unknown): value is MoodId {
  return typeof value === 'string' && value in MOODS
}

export function resolveMoods(settings: MoodSettings) {
  const enabled = (settings.enabledMoods?.length ? settings.enabledMoods : MOOD_ORDER).filter(isMoodId)
  const available = MOOD_ORDER.filter((m) => enabled.includes(m))
  const fallback = available[0] ?? 'editorial'
  const defaultMood = settings.defaultMood && available.includes(settings.defaultMood) ? settings.defaultMood : available.includes('editorial') ? 'editorial' : fallback
  const accents: Partial<Record<MoodId, string>> = {
    quiet: settings.quietAccent,
    editorial: settings.editorialAccent,
    play: settings.playAccent,
  }
  return { available: available.length ? available : MOOD_ORDER, defaultMood, accents }
}

export function moodStyleSheet(accents: Partial<Record<MoodId, string>>) {
  return MOOD_ORDER.filter((m) => accents[m] && /^#[0-9a-fA-F]{6}$/.test(accents[m]!))
    .map((m) => `[data-mood="${m}"]{--accent:${accents[m]};}`)
    .join('')
}

export const MOOD_COOKIE = 'siam-mood'

import 'server-only'
import { cache } from 'react'
import { findOne, getSingleton, listDocuments } from './repository'
import type {
  About,
  CharacterMoment,
  Meme,
  MoodSettings,
  Project,
  Review,
  SiteContent,
  SiteSettings,
  Skill,
  SocialLink,
} from './types'

export const getAbout = cache(async () => (await getSingleton<About>('about')) ?? {})
export const getSettings = cache(async () => (await getSingleton<SiteSettings>('settings')) ?? {})
export const getMoodSettings = cache(async () => (await getSingleton<MoodSettings>('moods')) ?? {})

export const getPublishedProjects = cache(() => listDocuments<Project>('projects', { status: 'published' }))

export const getProjectBySlug = cache((slug: string) =>
  findOne<Project>('projects', { slug, status: 'published' }),
)

export const getSiteContent = cache(async (): Promise<SiteContent> => {
  const [about, settings, moods, projects, reviews, skills, socials, memes, characters] = await Promise.all([
    getAbout(),
    getSettings(),
    getMoodSettings(),
    getPublishedProjects(),
    listDocuments<Review>('reviews', { status: 'active' }),
    listDocuments<Skill>('skills', { active: { $ne: false } }),
    listDocuments<SocialLink>('social_links', { visible: { $ne: false } }),
    listDocuments<Meme>('memes', { active: true, image: { $ne: null } }),
    listDocuments<CharacterMoment>('character_moments', { active: true }),
  ])
  return { about, settings, moods, projects, reviews, skills, socials, memes, characters }
})

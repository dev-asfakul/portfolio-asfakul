export type MoodId = 'quiet' | 'editorial' | 'play'
export type MoodScope = MoodId | 'all'

export interface MediaRef {
  publicId: string
  url: string
  width?: number
  height?: number
  alt?: string
}

interface Timestamps {
  id: string
  createdAt?: string
  updatedAt?: string
}

export interface Project extends Timestamps {
  title: string
  slug: string
  shortDescription?: string
  description?: string
  coverImage?: MediaRef | null
  gallery?: MediaRef[]
  year?: string
  category?: string
  role?: string
  client?: string
  technologies?: string[]
  services?: string[]
  featured?: boolean
  githubUrl?: string
  liveUrl?: string
  caseStudy?: string
  status?: 'draft' | 'published'
  order?: number
}

export interface Review extends Timestamps {
  name: string
  role?: string
  company?: string
  avatar?: MediaRef | null
  message: string
  date?: string
  rating?: number
  featured?: boolean
  status?: 'active' | 'inactive'
  order?: number
}

export interface Skill extends Timestamps {
  name: string
  category: 'design' | 'technology'
  description?: string
  active?: boolean
  order?: number
}

export interface SocialLink extends Timestamps {
  platform: string
  label?: string
  handle?: string
  url: string
  icon?: string
  visible?: boolean
  featured?: boolean
  order?: number
}

export type MemePlacement =
  | 'hero'
  | 'before-work'
  | 'between-projects'
  | 'after-work'
  | 'capabilities'
  | 'contact'
  | 'footer'

export interface Meme extends Timestamps {
  name: string
  image?: MediaRef | null
  altText: string
  caption?: string
  type?: 'image' | 'gif'
  placement: MemePlacement
  trigger?: 'section-entry' | 'scroll-progress' | 'pinned-pause' | 'hover'
  mood?: MoodScope
  animation?: 'fade' | 'pop' | 'slide' | 'rise' | 'wait'
  duration?: number
  active?: boolean
  order?: number
}

export type CharacterPlacement = 'hero' | 'statement' | 'before-work' | 'capabilities' | 'contact'

export interface CharacterMoment extends Timestamps {
  name: string
  frames: string[]
  placement: CharacterPlacement
  trigger?: 'scroll-progress' | 'section-entry' | 'loop'
  mood?: MoodScope
  active?: boolean
  order?: number
}

export interface MediaAsset extends Timestamps {
  publicId: string
  url: string
  width?: number
  height?: number
  format?: string
  bytes?: number
  alt?: string
  folder?: string
}

export interface ContactMessage extends Timestamps {
  name: string
  email: string
  projectType?: string
  message: string
  read?: boolean
  emailStatus?: 'sent' | 'failed' | 'skipped'
}

export interface About {
  name?: string
  shortName?: string
  headline?: string
  biography?: string
  profileImage?: MediaRef | null
  location?: string
  timezone?: string
  availability?: string
  availableForWork?: boolean
  email?: string
  phone?: string
  disciplines?: string[]
  gallery?: MediaRef[]
  experience?: Experience[]
  toolbox?: ToolboxGroup[]
  principles?: Principle[]
}

export interface Experience {
  company: string
  role: string
  period?: string
  location?: string
  summary?: string
  logo?: MediaRef | null
  order?: number
}

export interface ToolboxGroup {
  category: string
  items: string[]
  order?: number
}

export interface Principle {
  title: string
  subtitle?: string
  body?: string
  order?: number
}

export interface SiteSettings {
  siteTitle?: string
  authorNames?: string[]
  aboutInfo?: string
  contactLocation?: string
  legalText?: string
  privacyText?: string
  siteDescription?: string
  siteUrl?: string
  ogImage?: MediaRef | null
  keywords?: string[]
  twitterHandle?: string
  contactRecipient?: string
  contactFromName?: string
  footerNote?: string
  resumeUrl?: string
  resumeLabel?: string
  resumeUpdatedAt?: string
  availabilityLabel?: string
  availabilityStatus?: 'available' | 'booked' | 'open-to-enquiries'
  location?: string
  githubUrl?: string
  linkedinUrl?: string
}

export interface MoodSettings {
  defaultMood?: MoodId
  enabledMoods?: MoodId[]
  quietAccent?: string
  editorialAccent?: string
  playAccent?: string
}

export interface SiteContent {
  about: About
  settings: SiteSettings
  moods: MoodSettings
  projects: Project[]
  reviews: Review[]
  skills: Skill[]
  socials: SocialLink[]
  memes: Meme[]
  characters: CharacterMoment[]
}

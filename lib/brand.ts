import type { About } from '@/lib/cms/types'

/**
 * Structural identity used only until the About record is filled in the CMS.
 * Everything else (bio, projects, contacts, memes…) has no fallback by design.
 */
const IDENTITY = {
  name: 'ASFAKUL ISLAM SIAM',
  shortName: 'SIAM',
  role: 'Designer × Developer',
  disciplines: ['Digital Design', 'Creative Development', 'Interaction', 'Visual Systems', 'Experiments'],
}

export function resolveIdentity(about: About) {
  const name = (about.name || IDENTITY.name).trim()
  const parts = name.split(/\s+/)
  const first = parts[0] ?? name
  const last = parts.length > 1 ? parts[parts.length - 1] : ''
  return {
    fullName: name,
    publicName: last ? `${first} ${last}` : first,
    first,
    last,
    shortName: (about.shortName || last || IDENTITY.shortName).trim(),
    role: IDENTITY.role,
    disciplines: about.disciplines?.length ? about.disciplines : IDENTITY.disciplines,
  }
}

export type Identity = ReturnType<typeof resolveIdentity>

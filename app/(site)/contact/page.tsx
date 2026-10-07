import type { Metadata } from 'next'
import { Contact } from '@/components/site/contact'
import { getAbout, getSiteContent } from '@/lib/cms/queries'

export const metadata: Metadata = { title: 'Contact', description: 'Start a conversation about a thoughtful digital project.' }

export default async function ContactPage() {
  const [content, about] = await Promise.all([getSiteContent(), getAbout()])
  const meme = content.memes.find((item) => item.placement === 'contact')
  const glyph = content.characters.find((item) => item.placement === 'contact')
  return <Contact email={about.email} meme={meme} glyph={glyph} />
}

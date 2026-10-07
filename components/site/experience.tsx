'use client'

import { useMood } from '@/components/mood/mood-provider'
import { Capabilities } from '@/components/site/capabilities'
import { Contact } from '@/components/site/contact'
import { Footer } from '@/components/site/footer'
import { Hero } from '@/components/site/hero'
import { Pause } from '@/components/site/pause'
import { Reviews } from '@/components/site/reviews'
import { Statement } from '@/components/site/statement'
import { Work } from '@/components/site/work'
import { resolveIdentity } from '@/lib/brand'
import { pickCharacter, pickMeme } from '@/lib/mood/select'
import type { SiteContent } from '@/lib/cms/types'

/**
 * One source of content, re-composed per mood. Keying by mood remounts every scene
 * so each art direction builds its own ScrollTrigger choreography from scratch.
 */
export function Experience({ content }: { content: SiteContent }) {
  const { mood } = useMood()
  const identity = resolveIdentity(content.about)
  const { memes, characters } = content

  const pauseMeme = pickMeme(memes, 'before-work', mood)
  const pauseGlyph = pickCharacter(characters, 'before-work', mood)
  const showPause = content.projects.length > 0 && (pauseMeme || pauseGlyph)

  return (
    <div key={mood} className={`mood-stage mood-stage-${mood}`} data-mood-stage={mood} data-scroll-mode={mood === 'play' ? 'spatial' : mood === 'quiet' ? 'stillness' : 'longform'}>
      <div className="mood-stage__background" aria-hidden="true" />
      <div className="mood-stage__grain" aria-hidden="true" />
      <Hero identity={identity} about={content.about} glyph={pickCharacter(characters, 'hero', mood)} />
      <Statement about={content.about} identity={identity} socials={content.socials} glyph={pickCharacter(characters, 'statement', mood)} />
      {showPause ? <Pause meme={pauseMeme} glyph={pauseGlyph} /> : null}
      <Work projects={content.projects} interlude={pickMeme(memes, 'between-projects', mood)} />
      <Capabilities skills={content.skills} meme={pickMeme(memes, 'capabilities', mood)} glyph={pickCharacter(characters, 'capabilities', mood)} />
      <Reviews reviews={content.reviews} />
      <Contact email={content.about.email} meme={pickMeme(memes, 'contact', mood)} glyph={pickCharacter(characters, 'contact', mood)} />
      <Footer identity={identity} about={content.about} socials={content.socials} note={content.settings.footerNote} settings={content.settings} />
    </div>
  )
}

import { cookies } from 'next/headers'
import { MoodProvider } from '@/components/mood/mood-provider'
import { GridOverlay } from '@/components/site/grid-overlay'
import { SiteNav } from '@/components/site/site-nav'
import { Footer } from '@/components/site/footer'
import { MoodCursor } from '@/components/mood/mood-cursor'
import { resolveIdentity } from '@/lib/brand'
import { getMoodSettings, getSiteContent } from '@/lib/cms/queries'
import { isMoodId, MOOD_COOKIE, resolveMoods } from '@/lib/mood/moods'

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [cookieStore, content] = await Promise.all([cookies(), getSiteContent()])
  const { about, settings, moods: moodSettings, socials } = content
  const { available, defaultMood } = resolveMoods(moodSettings)
  const saved = cookieStore.get(MOOD_COOKIE)?.value
  const mood = isMoodId(saved) && available.includes(saved) ? saved : defaultMood
  const identity = resolveIdentity(about)

  return (
    <MoodProvider initialMood={mood} available={available}>
      <a href="#main" className="meta sr-only z-[70] bg-foreground px-3 py-2 text-background focus:not-sr-only focus:fixed focus:left-3 focus:top-3">
        Skip to content
      </a>
      <GridOverlay />
      <SiteNav shortName={identity.shortName} resumeUrl={settings.resumeUrl} resumeLabel={settings.resumeLabel} />
      <MoodCursor />
      <main id="main" className="relative pt-[var(--header-h)]">
        {children}
      </main>
      <Footer identity={identity} about={about} socials={socials} note={settings.footerNote} settings={settings} />
    </MoodProvider>
  )
}

import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Instrument_Serif, Inter_Tight, JetBrains_Mono } from 'next/font/google'
import { cookies } from 'next/headers'
import { resolveIdentity } from '@/lib/brand'
import { getAbout, getMoodSettings, getSettings } from '@/lib/cms/queries'
import { thumbnail } from '@/lib/media/image'
import { isMoodId, MOOD_COOKIE, MOODS, moodStyleSheet, resolveMoods } from '@/lib/mood/moods'
import './globals.css'
import { SmoothScroll } from '@/components/motion/smooth-scroll'
import { ScrollReset } from '@/components/motion/scroll-reset'
import { PerfOverlay } from '@/components/motion/perf-overlay'

const interTight = Inter_Tight({ subsets: ['latin'], variable: '--font-inter-tight', display: 'swap' })
const instrument = Instrument_Serif({ subsets: ['latin'], weight: '400', style: ['normal', 'italic'], variable: '--font-instrument', display: 'swap' })
const jetbrains = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains', display: 'swap' })

export async function generateMetadata(): Promise<Metadata> {
  const [settings, about] = await Promise.all([getSettings(), getAbout()])
  const identity = resolveIdentity(about)
  const title = settings.siteTitle || `${identity.publicName} — Designer × Developer`
  const description =
    settings.siteDescription || about.headline || `${identity.fullName} designs and builds digital experiences: interaction, visual systems and creative development.`
  const ogImage = settings.ogImage ? thumbnail(settings.ogImage, 1200).replace(/w_1200,h_1200/, 'w_1200,h_630') : undefined

  return {
    metadataBase: settings.siteUrl ? new URL(settings.siteUrl) : undefined,
    title: { default: title, template: `%s — ${identity.publicName}` },
    description,
    keywords: settings.keywords,
    authors: [{ name: identity.fullName }],
    creator: identity.fullName,
    alternates: { canonical: '/' },
    openGraph: {
      type: 'website',
      title,
      description,
      siteName: identity.publicName,
      images: ogImage ? [{ url: ogImage, width: 1200, height: 630 }] : undefined,
    },
    twitter: {
      card: ogImage ? 'summary_large_image' : 'summary',
      title,
      description,
      creator: settings.twitterHandle,
      images: ogImage ? [ogImage] : undefined,
    },
    robots: { index: true, follow: true },
  }
}

export const viewport: Viewport = {
  themeColor: '#0E0E0C',
  width: 'device-width',
  initialScale: 1,
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const [cookieStore, moodSettings] = await Promise.all([cookies(), getMoodSettings()])
  const { available, defaultMood, accents } = resolveMoods(moodSettings)
  const saved = cookieStore.get(MOOD_COOKIE)?.value
  const mood = isMoodId(saved) && available.includes(saved) ? saved : defaultMood
  const accentCss = moodStyleSheet(accents)

  return (
    <html lang="en" data-mood={mood} data-display-font={MOODS[mood].fonts.display} data-body-font={MOODS[mood].fonts.body} className={`${interTight.variable} ${instrument.variable} ${jetbrains.variable}`}>
      <body className="antialiased">
        {accentCss ? <style>{accentCss}</style> : null}
        <SmoothScroll />
        <ScrollReset />
        <PerfOverlay />
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}

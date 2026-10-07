import { AboutSections } from '@/components/site/public-sections'
import { getSiteContent } from '@/lib/cms/queries'
import { resolveIdentity } from '@/lib/brand'

export default async function AboutPage() {
  const content = await getSiteContent()
  return <AboutSections about={content.about} settings={content.settings} identity={resolveIdentity(content.about)} socials={content.socials} />
}

export async function generateMetadata() {
  const { about, settings } = await getSiteContent()
  return { title: `About — ${settings.siteTitle || about.name || 'Portfolio'}`, description: about.headline }
}

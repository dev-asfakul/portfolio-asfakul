import { StoryExperience } from '@/components/site/story-experience'
import { resolveIdentity } from '@/lib/brand'
import { getSiteContent } from '@/lib/cms/queries'

export default async function HomePage() {
  const content = await getSiteContent()
  const identity = resolveIdentity(content.about)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: identity.fullName,
    alternateName: [identity.publicName, identity.shortName],
    jobTitle: 'Designer & Developer',
    description: content.about.headline,
    url: content.settings.siteUrl,
    email: content.about.email ? `mailto:${content.about.email}` : undefined,
    image: content.about.profileImage?.url,
    address: content.about.location ? { '@type': 'PostalAddress', addressLocality: content.about.location } : undefined,
    sameAs: content.socials.map((s) => s.url),
    knowsAbout: content.skills.map((s) => s.name),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
      <StoryExperience content={content} />
    </>
  )
}

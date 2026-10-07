import type { Metadata } from 'next'
import { getSiteContent } from '@/lib/cms/queries'

export const metadata: Metadata = { title: 'Reviews', description: 'Kind words from people and teams I have worked with.' }

export default async function ReviewsPage() {
  const { reviews } = await getSiteContent()
  return (
    <section data-scene="reviews" className="site-grid gap-y-12 bg-background py-[var(--section-space)]">
      <p className="meta col-span-4 text-muted-foreground md:col-span-8 lg:col-span-12"><span className="text-foreground">(04)</span> Kind words</p>
      <h1 className="display col-span-4 text-[clamp(4rem,15vw,14rem)] md:col-span-8 lg:col-span-12">Reviews</h1>
      <div className="col-span-4 grid gap-0 border-t border-line md:col-span-8 lg:col-span-9 lg:col-start-4">
        {reviews.length ? reviews.map((review) => (
          <figure key={review.id} className="border-b border-line py-10">
            <blockquote className="heading max-w-3xl text-[clamp(2rem,5vw,4.5rem)] leading-[0.95]">“{review.message}”</blockquote>
            <figcaption className="meta mt-7 text-muted-foreground">{review.name}{review.role ? ` — ${review.role}` : ''}{review.company ? `, ${review.company}` : ''}</figcaption>
          </figure>
        )) : <p className="py-12 text-muted-foreground">Reviews will appear here as the archive grows.</p>}
      </div>
    </section>
  )
}

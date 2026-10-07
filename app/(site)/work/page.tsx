import type { Metadata } from 'next'
import Link from 'next/link'
import { getPublishedProjects } from '@/lib/cms/queries'

export const metadata: Metadata = { title: 'Work', description: 'A selected archive of projects and case studies.' }

export default async function WorkArchivePage() {
  const projects = await getPublishedProjects()
  return (
    <section data-scene="work-archive" className="site-grid gap-y-12 bg-background py-[var(--section-space)]">
      <p className="meta col-span-4 text-muted-foreground md:col-span-8 lg:col-span-12"><span className="text-foreground">(03)</span> Archive</p>
      <div className="col-span-4 md:col-span-8 lg:col-span-12">
        <h1 className="display text-[clamp(4rem,15vw,14rem)]">The work</h1>
        <p className="mt-6 max-w-xl text-muted-foreground">A living archive of design systems, digital products, and useful experiments.</p>
      </div>
      <ol className="col-span-4 border-t border-line md:col-span-8 lg:col-span-9 lg:col-start-4">
        {projects.length ? projects.map((project, index) => (
          <li key={project.id} className="border-b border-line py-7">
            <Link href={`/work/${project.slug}`} className="grid gap-3 md:grid-cols-[4rem_1fr_auto] md:items-baseline">
              <span className="meta text-muted-foreground">{String(index + 1).padStart(2, '0')}</span>
              <span><span className="heading text-3xl md:text-5xl">{project.title}</span>{project.shortDescription ? <span className="mt-2 block max-w-lg text-sm text-muted-foreground">{project.shortDescription}</span> : null}</span>
              <span className="meta text-muted-foreground">{project.year ?? project.category}</span>
            </Link>
          </li>
        )) : <li className="py-12 text-muted-foreground">The archive is being assembled. Check back soon.</li>}
      </ol>
    </section>
  )
}

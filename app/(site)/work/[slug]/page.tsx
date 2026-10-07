import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ProjectDetail } from '@/components/site/project-detail'
import { getProjectBySlug, getPublishedProjects } from '@/lib/cms/queries'
import { transformUrl } from '@/lib/media/image'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const project = await getProjectBySlug(slug)
  if (!project) return { title: 'Project not found' }
  const description = project.shortDescription || project.description
  const image = project.coverImage ? transformUrl(project.coverImage.url, 'c_fill,w_1200,h_630,g_auto,f_auto,q_auto') : undefined
  return {
    title: project.title,
    description,
    alternates: { canonical: `/work/${project.slug}` },
    openGraph: { title: project.title, description, type: 'article', images: image ? [{ url: image, width: 1200, height: 630 }] : undefined },
    twitter: { card: image ? 'summary_large_image' : 'summary', title: project.title, description, images: image ? [image] : undefined },
  }
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [project, all] = await Promise.all([getProjectBySlug(slug), getPublishedProjects()])
  if (!project) notFound()

  const index = Math.max(0, all.findIndex((p) => p.id === project.id))
  const next = all.length > 1 ? all[(index + 1) % all.length] : undefined

  return <ProjectDetail project={project} index={index} total={Math.max(all.length, 1)} next={next} />
}

import { notFound } from 'next/navigation'
import { AdminShell } from '@/components/admin/admin-shell'
import { CollectionEditor } from '@/components/admin/collection-editor'
import { collections, getCollectionDef } from '@/lib/cms/registry'
import { getDocument, getSingleton, listDocuments } from '@/lib/cms/repository'

export const dynamic = 'force-dynamic'

const aliases: Record<string, string> = {
  media: 'media',
  messages: 'contactMessages',
  capabilities: 'skills',
  'site-settings': 'settings',
  about: 'about',
  now: 'now',
  socials: 'socials',
}

export default async function AdminCollectionPage({ params }: { params: Promise<{ collection: string }> }) {
  const { collection: slug } = await params
  const key = aliases[slug] ?? slug
  const def = getCollectionDef(key)
  if (!def) notFound()

  const records = def.kind === 'singleton'
    ? [await getSingleton<Record<string, unknown>>(def.key)].filter((record): record is Record<string, unknown> => Boolean(record))
    : await listDocuments<Record<string, unknown>>(def.collection)

  return <AdminShell><div className="admin-page-head"><div><p className="meta text-accent">Studio / {def.group}</p><h1 className="display admin-page-title">{def.label}</h1></div><p className="admin-page-intro">{def.description}</p></div>{def.kind === 'singleton' ? <CollectionEditor def={def} record={records[0]} singleton /> : <div className="admin-record-list">{records.map((record) => <details key={String(record.id)} className="admin-record"><summary><span className="meta">{String(record[def.titleField ?? 'id'] ?? record.id)}</span><span>{String(record[def.subtitleField ?? ''] ?? '')}</span></summary><CollectionEditor def={def} record={record} /></details>)}<details className="admin-record" open><summary><span className="meta">NEW</span><span>Add {def.singular}</span></summary><CollectionEditor def={def} record={null} /></details></div>}</AdminShell>
}

export function generateStaticParams() { return collections.map((collection) => ({ collection: collection.key })) }

import { AdminShell } from '@/components/admin/admin-shell'
import { collections } from '@/lib/cms/registry'
import { countDocuments } from '@/lib/cms/repository'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  const counts = await Promise.all(
    collections.filter((collection) => collection.kind === 'list').map(async (collection) => ({
      key: collection.key,
      count: await countDocuments(collection.collection),
    })),
  )
  const countMap = new Map(counts.map((item) => [item.key, item.count]))

  return (
    <AdminShell>
      <div className="admin-page-head">
        <div>
          <p className="meta text-accent">Studio index / 00</p>
          <h1 className="display admin-page-title">The work<br /><em>behind</em> the work.</h1>
        </div>
        <p className="admin-page-intro">A calm control room for the archive, the atmosphere, and the messages that keep the public surface alive.</p>
      </div>

      <section className="admin-empty-scene" aria-labelledby="admin-empty-title">
        <div className="admin-empty-marker" aria-hidden="true">↘</div>
        <div>
          <p className="meta">CURRENT SCENE</p>
          <h2 id="admin-empty-title" className="heading text-3xl">Make one deliberate move.</h2>
          <p className="admin-empty-copy">Choose a section from the rail. The overview stays quiet until the archive asks for attention.</p>
        </div>
      </section>

      <section className="admin-inventory" aria-labelledby="inventory-title">
        <div className="admin-section-label">
          <p className="meta" id="inventory-title">Archive pulse</p>
          <span className="meta">LIVE / {new Date().getFullYear()}</span>
        </div>
        <div className="admin-inventory-list">
          {collections.filter((collection) => collection.kind === 'list').slice(0, 6).map((collection) => (
            <div key={collection.key} className="admin-inventory-row">
              <span className="meta">{collection.group}</span>
              <span>{collection.label}</span>
              <strong>{countMap.get(collection.key) ?? 0}</strong>
              <span className="meta">records</span>
            </div>
          ))}
        </div>
      </section>
    </AdminShell>
  )
}

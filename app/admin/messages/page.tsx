import { AdminShell } from '@/components/admin/admin-shell'
import { deleteMessage, retryMessage, setMessageRead } from '@/app/admin/actions'
import { listDocuments } from '@/lib/cms/repository'
import type { ContactMessage } from '@/lib/cms/types'

export const dynamic = 'force-dynamic'

export default async function MessagesPage() {
  const messages = await listDocuments<ContactMessage & { idempotencyKey?: string }>('contact_messages', {}, { createdAt: -1 })

  return (
    <AdminShell>
      <div className="admin-page-head">
        <div><p className="meta text-accent">Studio / Communication</p><h1 className="display admin-page-title">Contact inbox</h1></div>
        <p className="admin-page-intro">Every enquiry, safely recorded. Retry delivery when the outside world needs another nudge.</p>
      </div>
      <section className="admin-record-list" aria-label="Contact messages">
        {messages.length === 0 ? <p className="admin-empty-copy">No messages yet.</p> : messages.map((message) => (
          <article key={message.id} className="admin-record admin-message-card">
            <div className="admin-message-head">
              <div><p className="meta">{message.projectType || 'General enquiry'} · {message.createdAt ? new Date(message.createdAt).toLocaleDateString() : 'Undated'}</p><h2 className="heading text-2xl">{message.name}</h2><a className="meta text-muted-foreground underline-offset-4 hover:underline" href={`mailto:${message.email}`}>{message.email}</a></div>
              <div className="admin-message-status"><span className="meta">{message.emailStatus || 'pending'}</span><span className={message.read ? 'meta text-muted-foreground' : 'meta text-accent'}>{message.read ? 'read' : 'unread'}</span></div>
            </div>
            <p className="admin-message-body">{message.message}</p>
            <div className="admin-message-actions">
              <form action={async () => { 'use server'; await setMessageRead(message.id, !message.read) }}><button className="meta" type="submit">Mark {message.read ? 'unread' : 'read'}</button></form>
              {message.emailStatus !== 'sent' ? <form action={async () => { 'use server'; await retryMessage(message.id) }}><button className="meta text-accent" type="submit">Retry delivery ↗</button></form> : null}
              <form action={async () => { 'use server'; await deleteMessage(message.id) }}><button className="meta text-destructive" type="submit">Delete</button></form>
            </div>
          </article>
        ))}
      </section>
    </AdminShell>
  )
}

export function generateStaticParams() { return [] }

export const metadata = { title: 'Contact inbox' }

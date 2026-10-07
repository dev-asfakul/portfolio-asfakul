import 'server-only'

import { Resend } from 'resend'
import { env, requireService } from '@/lib/env'
import { AppError } from '@/lib/errors'

interface ContactEmail {
  to: string
  fromName?: string
  name: string
  email: string
  projectType?: string
  message: string
  idempotencyKey?: string
}

function escapeHtml(value: string) { return value.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!) }
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export async function sendContactEmail(payload: ContactEmail): Promise<'sent' | 'failed' | 'skipped'> {
  if (!payload.name.trim() || !payload.email.trim() || !payload.message.trim()) return 'failed'
  if (!payload.to) return 'skipped'
  try { requireService('email') } catch { return 'skipped' }
  const resend = new Resend(env.RESEND_API_KEY)
  const from = env.RESEND_FROM!
  const html = `<div style="font-family:ui-monospace,Menlo,monospace;font-size:14px;line-height:1.6;color:#111"><p style="text-transform:uppercase;letter-spacing:.12em;font-size:11px;color:#777">New enquiry</p><p><strong>${escapeHtml(payload.name)}</strong> &lt;${escapeHtml(payload.email)}&gt;</p>${payload.projectType ? `<p>Project type: ${escapeHtml(payload.projectType)}</p>` : ''}<p style="white-space:pre-wrap">${escapeHtml(payload.message)}</p></div>`
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 8_000)
    try {
      const { error } = await resend.emails.send({ from, to: payload.to, replyTo: payload.email, subject: `New enquiry from ${payload.name}`, html, headers: payload.idempotencyKey ? { 'Idempotency-Key': payload.idempotencyKey } : undefined }, { signal: controller.signal })
      if (!error) return 'sent'
      if (attempt === 2) throw new AppError('DEPENDENCY_UNAVAILABLE', 'Email delivery failed.', error)
    } catch (error) {
      if (attempt === 2) return 'failed'
    } finally { clearTimeout(timeout) }
    await wait(150 * 2 ** attempt + Math.floor(Math.random() * 100))
  }
  return 'failed'
}

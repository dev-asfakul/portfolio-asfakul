'use server'

import { createHash } from 'node:crypto'
import { headers } from 'next/headers'
import { contactSchema } from '@/lib/cms/validation'
import { getAbout, getSettings } from '@/lib/cms/queries'
import { getDb } from '@/lib/db/mongo'
import { sendContactEmail } from '@/lib/email/resend'
import { AppError } from '@/lib/errors'

export interface ContactState {
  status: 'idle' | 'success' | 'delayed' | 'error'
  message?: string
  fieldErrors?: Record<string, string[] | undefined>
}

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000
const RATE_LIMIT_MAX = 5

function requestKey(ip: string, idempotencyKey: string | undefined, data: { email: string; message: string }) {
  return idempotencyKey ?? createHash('sha256').update(`${ip}:${data.email}:${data.message}`).digest('hex')
}

export async function submitContact(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const parsed = contactSchema.safeParse({
    name: formData.get('name') ?? '',
    email: formData.get('email') ?? '',
    projectType: formData.get('projectType') ?? undefined,
    message: formData.get('message') ?? '',
    company: formData.get('company') ?? undefined,
    idempotencyKey: formData.get('idempotencyKey') ?? undefined,
  })

  if (!parsed.success) {
    return { status: 'error', message: 'A few details need another look.', fieldErrors: parsed.error.flatten().fieldErrors }
  }

  const ip = (await headers()).get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  let db
  try {
    db = await getDb()
    if (!db) throw new AppError('CONFIGURATION_ERROR', 'Contact storage is not configured.')
  } catch (error) {
    const safe = error instanceof AppError ? error : new AppError('DEPENDENCY_UNAVAILABLE', 'Message storage is temporarily unavailable.', error)
    return { status: 'error', message: safe.message }
  }

  const { company: _honeypot, idempotencyKey, ...data } = parsed.data
  const submissionKey = requestKey(ip, idempotencyKey, data)
  try {
    const existing = await db.collection('contact_messages').findOne({ idempotencyKey: submissionKey }, { projection: { _id: 1 } })
    if (existing) return { status: 'success', message: 'This message has already been received.' }

    const windowStart = new Date(Math.floor(Date.now() / RATE_LIMIT_WINDOW_MS) * RATE_LIMIT_WINDOW_MS)
    const rate = await db.collection('rate_limits').findOneAndUpdate(
      { key: `contact:${ip}`, windowStart },
      { $inc: { count: 1 }, $setOnInsert: { createdAt: new Date() } },
      { upsert: true, returnDocument: 'after', projection: { count: 1 } },
    )
    if ((rate?.count ?? 0) > RATE_LIMIT_MAX) return { status: 'error', message: 'Too many messages in a short time. Try again shortly.' }

    const [settings, about] = await Promise.all([getSettings(), getAbout()])
    const recipient = settings.contactRecipient || about.email || ''
    const now = new Date()
    let inserted
    try {
      inserted = await db.collection('contact_messages').insertOne({ ...data, idempotencyKey: submissionKey, read: false, emailStatus: 'failed', createdAt: now, updatedAt: now })
    } catch (error) {
      if ((error as { code?: number }).code === 11000) return { status: 'success', message: 'This message has already been received.' }
      throw new AppError('DEPENDENCY_UNAVAILABLE', 'Message storage is temporarily unavailable.', error)
    }

    let emailStatus: 'sent' | 'failed' | 'skipped' = 'failed'
    try {
      emailStatus = await sendContactEmail({ ...data, to: recipient, fromName: settings.contactFromName, idempotencyKey: submissionKey })
    } catch {
      emailStatus = 'failed'
    }

    await db.collection('contact_messages').updateOne(
      { _id: inserted.insertedId },
      { $set: { emailStatus: emailStatus === 'sent' ? 'sent' : 'delayed', updatedAt: new Date() } },
    )

    return emailStatus === 'sent'
      ? { status: 'success', message: 'Received. I read every message personally.' }
      : { status: 'delayed', message: 'Received. Email delivery is catching up.' }
  } catch (error) {
    const safe = error instanceof AppError ? error : new AppError('DEPENDENCY_UNAVAILABLE', 'Message storage is temporarily unavailable.', error)
    return { status: 'error', message: safe.message }
  }
}

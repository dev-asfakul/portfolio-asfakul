'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { requireAdmin, signOut } from '@/auth'
import { revokeSession } from '@/lib/auth/rate-limit'
import { getCollectionDef } from '@/lib/cms/registry'
import { getAbout, getSettings } from '@/lib/cms/queries'
import { sendContactEmail } from '@/lib/email/resend'
import type { ContactMessage } from '@/lib/cms/types'
import {
  deleteDocument,
  getDocument,
  insertDocument,
  moveDocument,
  saveSingleton,
  slugExists,
  updateDocument,
} from '@/lib/cms/repository'
import { buildSchema, mediaRecordSchema } from '@/lib/cms/validation'
import { destroyAsset, MEDIA_FOLDER, signUpload } from '@/lib/media/cloudinary'
import type { MediaAsset } from '@/lib/cms/types'

export type SaveResult = { ok: true; id?: string } | { ok: false; error: string; fieldErrors?: Record<string, string[]> }

const idSchema = z.string().regex(/^[a-f0-9]{24}$/i, 'Invalid id')

function refreshSite() {
  revalidatePath('/', 'layout')
}

function fail(error: unknown): SaveResult {
  return { ok: false, error: error instanceof Error ? error.message : 'Something went wrong' }
}

export async function saveEntry(collectionKey: string, id: string | null, payload: unknown): Promise<SaveResult> {
  try {
    await requireAdmin()
    const def = getCollectionDef(collectionKey)
    if (!def) return { ok: false, error: 'Unknown collection' }

    const parsed = buildSchema(def).safeParse(payload)
    if (!parsed.success) {
      return { ok: false, error: 'Please fix the highlighted fields.', fieldErrors: z.flattenError(parsed.error).fieldErrors as Record<string, string[]> }
    }
    const data = parsed.data as Record<string, unknown>

    if (def.kind === 'singleton') {
      await saveSingleton(def.key, data)
      refreshSite()
      return { ok: true }
    }

    if (typeof data.slug === 'string' && (await slugExists(def.collection, data.slug, id ?? undefined))) {
      return { ok: false, error: 'That slug is already used.', fieldErrors: { slug: ['Slug must be unique'] } }
    }

    if (id) {
      idSchema.parse(id)
      await updateDocument(def.collection, id, data)
      refreshSite()
      return { ok: true, id }
    }
    const newId = await insertDocument(def.collection, data)
    refreshSite()
    return { ok: true, id: newId }
  } catch (error) {
    return fail(error)
  }
}

export async function deleteEntry(collectionKey: string, id: string): Promise<SaveResult> {
  try {
    await requireAdmin()
    const def = getCollectionDef(collectionKey)
    if (!def || def.kind !== 'list') return { ok: false, error: 'Unknown collection' }
    await deleteDocument(def.collection, idSchema.parse(id))
    refreshSite()
    return { ok: true }
  } catch (error) {
    return fail(error)
  }
}

export async function moveEntry(collectionKey: string, id: string, direction: 'up' | 'down'): Promise<SaveResult> {
  try {
    await requireAdmin()
    const def = getCollectionDef(collectionKey)
    if (!def?.orderable) return { ok: false, error: 'Not orderable' }
    await moveDocument(def.collection, idSchema.parse(id), z.enum(['up', 'down']).parse(direction))
    refreshSite()
    return { ok: true }
  } catch (error) {
    return fail(error)
  }
}

export async function toggleEntry(collectionKey: string, id: string, field: string): Promise<SaveResult> {
  try {
    await requireAdmin()
    const def = getCollectionDef(collectionKey)
    const fieldDef = def?.fields.find((f) => f.name === field)
    if (!def || def.kind !== 'list' || !fieldDef) return { ok: false, error: 'Unknown field' }
    const doc = await getDocument<Record<string, unknown>>(def.collection, idSchema.parse(id))
    if (!doc) return { ok: false, error: 'Not found' }

    let value: unknown
    if (fieldDef.type === 'boolean') value = !doc[field]
    else if (field === 'status' && fieldDef.options?.length === 2) {
      const [a, b] = fieldDef.options.map((o) => o.value)
      value = doc[field] === a ? b : a
    } else return { ok: false, error: 'Field cannot be toggled' }

    await updateDocument(def.collection, id, { [field]: value })
    refreshSite()
    return { ok: true }
  } catch (error) {
    return fail(error)
  }
}

export async function getUploadSignature() {
  await requireAdmin()
  return signUpload(MEDIA_FOLDER)
}

export async function recordMedia(payload: unknown): Promise<SaveResult> {
  try {
    await requireAdmin()
    const data = mediaRecordSchema.parse(payload)
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME
    if (!cloudName || !data.url.startsWith(`https://res.cloudinary.com/${cloudName}/`)) {
      return { ok: false, error: 'Media must come from the configured Cloudinary account.' }
    }
    const id = await insertDocument('media', data)
    revalidatePath('/admin/media')
    return { ok: true, id }
  } catch (error) {
    return fail(error)
  }
}

export async function updateMediaAlt(id: string, alt: string): Promise<SaveResult> {
  try {
    await requireAdmin()
    await updateDocument('media', idSchema.parse(id), { alt: z.string().trim().max(300).parse(alt) })
    revalidatePath('/admin/media')
    return { ok: true }
  } catch (error) {
    return fail(error)
  }
}

export async function deleteMedia(id: string): Promise<SaveResult> {
  try {
    await requireAdmin()
    const asset = await getDocument<MediaAsset>('media', idSchema.parse(id))
    if (!asset) return { ok: false, error: 'Not found' }
    await destroyAsset(asset.publicId).catch((e) => console.error('[media] destroy failed', e))
    await deleteDocument('media', id)
    revalidatePath('/admin/media')
    return { ok: true }
  } catch (error) {
    return fail(error)
  }
}

export async function setMessageRead(id: string, read: boolean): Promise<SaveResult> {
  try {
    await requireAdmin()
    await updateDocument('contact_messages', idSchema.parse(id), { read: z.boolean().parse(read) })
    revalidatePath('/admin/messages')
    revalidatePath('/admin')
    return { ok: true }
  } catch (error) {
    return fail(error)
  }
}

export async function retryMessage(id: string): Promise<SaveResult> {
  try {
    await requireAdmin()
    const message = await getDocument<ContactMessage & { idempotencyKey?: string }>('contact_messages', idSchema.parse(id))
    if (!message) return { ok: false, error: 'Message not found.' }
    const [settings, about] = await Promise.all([getSettings(), getAbout()])
    const status = await sendContactEmail({
      to: settings.contactRecipient || about.email || '',
      fromName: settings.contactFromName,
      name: message.name,
      email: message.email,
      projectType: message.projectType,
      message: message.message,
      idempotencyKey: message.idempotencyKey ? `${message.idempotencyKey}:retry` : undefined,
    })
    await updateDocument('contact_messages', id, { emailStatus: status, updatedAt: new Date() })
    revalidatePath('/admin/messages')
    return status === 'sent' ? { ok: true } : { ok: false, error: status === 'skipped' ? 'Email service is not configured.' : 'Email delivery is still unavailable.' }
  } catch (error) {
    return fail(error)
  }
}

export async function deleteMessage(id: string): Promise<SaveResult> {
  try {
    await requireAdmin()
    await deleteDocument('contact_messages', idSchema.parse(id))
    revalidatePath('/admin/messages')
    revalidatePath('/admin')
    return { ok: true }
  } catch (error) {
    return fail(error)
  }
}

export async function logout() {
  await requireAdmin()
  await revokeSession('admin')
  await signOut({ redirectTo: '/admin/login' })
}

import 'server-only'

import { getDb } from '@/lib/db/mongo'
import { AppError } from '@/lib/errors'

const WINDOW_MS = 15 * 60 * 1000
const MAX_ATTEMPTS = 5

export async function consumeLoginAttempt(identifier: string): Promise<boolean> {
  const db = await getDb()
  if (!db) throw new AppError('DEPENDENCY_UNAVAILABLE', 'Authentication is temporarily unavailable.')

  const now = Date.now()
  const windowStart = Math.floor(now / WINDOW_MS) * WINDOW_MS
  const key = `login:${identifier}`
  const result = await db.collection<{ key: string; windowStart: number; count: number }>('rate_limits').findOneAndUpdate(
    { key, windowStart },
    { $inc: { count: 1 }, $setOnInsert: { key, windowStart } },
    { upsert: true, returnDocument: 'after' },
  )
  return (result?.count ?? MAX_ATTEMPTS + 1) <= MAX_ATTEMPTS
}

export async function clearSessionRevocation(sessionId: string) {
  const db = await getDb()
  if (!db) return
  await db.collection('revoked_sessions').deleteOne({ sessionId })
}

export async function revokeSession(sessionId: string) {
  const db = await getDb()
  if (!db) return
  await db.collection('revoked_sessions').updateOne(
    { sessionId },
    { $set: { sessionId, revokedAt: new Date() } },
    { upsert: true },
  )
}

export async function isSessionRevoked(sessionId: string) {
  const db = await getDb()
  if (!db) return false
  return Boolean(await db.collection('revoked_sessions').findOne({ sessionId }, { projection: { _id: 1 } }))
}

export { MAX_ATTEMPTS, WINDOW_MS }

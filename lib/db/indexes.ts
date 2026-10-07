import 'server-only'

import type { Db } from 'mongodb'

const indexes: Record<string, Array<{ key: Record<string, 1 | -1>; name: string; unique?: boolean }>> = {
  projects: [
    { key: { slug: 1 }, name: 'projects_slug_unique', unique: true },
    { key: { status: 1, featured: -1, order: 1 }, name: 'projects_public_order' },
  ],
  reviews: [{ key: { status: 1, featured: -1, order: 1 }, name: 'reviews_public_order' }],
  skills: [{ key: { active: 1, category: 1, order: 1 }, name: 'skills_active_order' }],
  socials: [{ key: { active: 1, order: 1 }, name: 'socials_active_order' }],
  memes: [{ key: { active: 1, placement: 1, order: 1 }, name: 'memes_active_placement_order' }],
  characters: [{ key: { active: 1, placement: 1, order: 1 }, name: 'characters_active_placement_order' }],
  contact_messages: [
    { key: { createdAt: -1 }, name: 'contact_messages_created_at' },
    { key: { idempotencyKey: 1 }, name: 'contact_messages_idempotency_unique', unique: true },
  ],
  rate_limits: [{ key: { key: 1, windowStart: 1 }, name: 'rate_limits_key_window_unique', unique: true }],
  revoked_sessions: [{ key: { sessionId: 1 }, name: 'revoked_sessions_id_unique', unique: true }],
  singletons: [{ key: { key: 1 }, name: 'singletons_key_unique', unique: true }],
}

export async function ensureIndexes(db: Db) {
  await Promise.all(
    Object.entries(indexes).map(([collection, definitions]) =>
      db.collection(collection).createIndexes(definitions),
    ),
  )
}

export { indexes }

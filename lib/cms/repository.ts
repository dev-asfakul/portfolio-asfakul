import 'server-only'
import { ObjectId, type Document, type Filter, type Sort } from 'mongodb'
import { getDb, getMongoClient } from '@/lib/db/mongo'
import { AppError } from '@/lib/errors'

type Doc = Record<string, unknown> & { id: string }

function serialize(doc: Document | null): Doc | null {
  if (!doc) return null
  const { _id, createdAt, updatedAt, ...rest } = doc
  return JSON.parse(
    JSON.stringify({
      ...rest,
      id: String(_id),
      createdAt: createdAt instanceof Date ? createdAt.toISOString() : createdAt,
      updatedAt: updatedAt instanceof Date ? updatedAt.toISOString() : updatedAt,
    }),
  ) as Doc
}

function toObjectId(id: string) {
  if (!ObjectId.isValid(id)) throw new AppError('INVALID_INPUT', 'Invalid document id.')
  return new ObjectId(id)
}

async function safely<T>(fallback: T, run: () => Promise<T>): Promise<T> {
  try {
    return await run()
  } catch (error) {
    if (process.env.NODE_ENV === 'production') throw new AppError('DEPENDENCY_UNAVAILABLE', 'CMS data is temporarily unavailable.', error)
    console.error('[cms] database read failed:', (error as Error).message)
    return fallback
  }
}

export async function listDocuments<T = Doc>(
  collection: string,
  filter: Filter<Document> = {},
  sort: Sort = { order: 1, createdAt: -1 },
  limit = 100,
  projection?: Document,
): Promise<T[]> {
  const db = await safely(null, getDb)
  if (!db) return []
  return safely([], async () => {
    const docs = await db.collection(collection).find(filter, projection ? { projection } : undefined).sort(sort).limit(Math.min(Math.max(limit, 1), 100)).toArray()
    return docs.map((d) => serialize(d) as unknown as T)
  })
}

export async function getDocument<T = Doc>(collection: string, id: string): Promise<T | null> {
  const db = await safely(null, getDb)
  if (!db || !ObjectId.isValid(id)) return null
  return safely(null, async () => serialize(await db.collection(collection).findOne({ _id: toObjectId(id) })) as T | null)
}

export async function findOne<T = Doc>(collection: string, filter: Filter<Document>): Promise<T | null> {
  const db = await safely(null, getDb)
  if (!db) return null
  return safely(null, async () => serialize(await db.collection(collection).findOne(filter)) as T | null)
}

export async function countDocuments(collection: string, filter: Filter<Document> = {}) {
  const db = await safely(null, getDb)
  if (!db) return 0
  return safely(0, () => db.collection(collection).countDocuments(filter))
}

async function requireDb() {
  try {
    const db = await getDb()
    if (!db) throw new AppError('CONFIGURATION_ERROR', 'CMS storage is not configured.')
    return db
  } catch (error) {
    if (error instanceof AppError) throw error
    throw new AppError('DEPENDENCY_UNAVAILABLE', 'CMS data is temporarily unavailable.', error)
  }
}

export async function insertDocument(collection: string, data: Record<string, unknown>) {
  const db = await requireDb()
  const last = await db.collection(collection).find().sort({ order: -1 }).limit(1).toArray()
  const order = typeof last[0]?.order === 'number' ? (last[0].order as number) + 1 : 0
  const now = new Date()
  const result = await db.collection(collection).insertOne({ ...data, order, createdAt: now, updatedAt: now })
  return String(result.insertedId)
}

export async function updateDocument(collection: string, id: string, data: Record<string, unknown>) {
  const db = await requireDb()
  await db.collection(collection).updateOne({ _id: toObjectId(id) }, { $set: { ...data, updatedAt: new Date() } })
}

export async function deleteDocument(collection: string, id: string) {
  const db = await requireDb()
  await db.collection(collection).deleteOne({ _id: toObjectId(id) })
}

export async function moveDocument(collection: string, id: string, direction: 'up' | 'down') {
  const db = await requireDb()
  const client = await getMongoClient()
  if (!client) throw new AppError('CONFIGURATION_ERROR', 'CMS storage is not configured.')

  const session = client.startSession()
  try {
    await session.withTransaction(async () => {
      const docs = await db.collection(collection).find({}, { session }).sort({ order: 1, createdAt: -1 }).toArray()
      const index = docs.findIndex((d) => String(d._id) === id)
      const target = direction === 'up' ? index - 1 : index + 1
      if (index < 0 || target < 0 || target >= docs.length) return
      const reordered = [...docs]
      ;[reordered[index], reordered[target]] = [reordered[target], reordered[index]]
      await db.collection(collection).bulkWrite(
        reordered.map((d, order) => ({ updateOne: { filter: { _id: d._id }, update: { $set: { order } } } })),
        { session },
      )
    })
  } finally {
    await session.endSession()
  }
}

export async function getSingleton<T>(key: string): Promise<T | null> {
  const db = await safely(null, getDb)
  if (!db) return null
  return safely(null, async () => {
    const doc = await db.collection('singletons').findOne({ key })
    if (!doc) return null
    const { _id, key: _k, ...rest } = doc
    return JSON.parse(JSON.stringify(rest)) as T
  })
}

export async function saveSingleton(key: string, data: Record<string, unknown>) {
  const db = await requireDb()
  await db
    .collection('singletons')
    .updateOne({ key }, { $set: { ...data, key, updatedAt: new Date() }, $setOnInsert: { createdAt: new Date() } }, { upsert: true })
}

export async function slugExists(collection: string, slug: string, exceptId?: string) {
  const db = await requireDb()
  const filter: Filter<Document> = { slug }
  if (exceptId) filter._id = { $ne: toObjectId(exceptId) }
  return (await db.collection(collection).countDocuments(filter)) > 0
}

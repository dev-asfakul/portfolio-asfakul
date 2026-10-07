import 'server-only'

import { MongoClient, type Db } from 'mongodb'
import { env } from '@/lib/env'
import { ensureIndexes } from '@/lib/db/indexes'

declare global {
  var __mongoClientPromise: Promise<MongoClient> | undefined
  var __mongoIndexesPromise: Promise<void> | undefined
}

function getClientPromise(): Promise<MongoClient> | null {
  const uri = env.MONGODB_URI
  if (!uri) return null
  if (!globalThis.__mongoClientPromise) {
    const client = new MongoClient(uri, { maxPoolSize: 10, serverSelectionTimeoutMS: 5000 })
    globalThis.__mongoClientPromise = client.connect().catch((error) => {
      globalThis.__mongoClientPromise = undefined
      throw error
    })
  }
  return globalThis.__mongoClientPromise
}

export async function getMongoClient(): Promise<MongoClient | null> {
  const promise = getClientPromise()
  return promise ? promise : null
}

export async function getDb(): Promise<Db | null> {
  const client = await getMongoClient()
  if (!client) return null
  const db = client.db(env.MONGODB_DB || 'asfakul-siam')
  if (!globalThis.__mongoIndexesPromise) {
    globalThis.__mongoIndexesPromise = ensureIndexes(db).catch((error) => {
      globalThis.__mongoIndexesPromise = undefined
      throw error
    })
  }
  await globalThis.__mongoIndexesPromise
  return db
}

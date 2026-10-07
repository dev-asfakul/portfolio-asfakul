import { MongoClient } from 'mongodb'
import { NextResponse } from 'next/server'

export async function GET() {
  const production = process.env.NODE_ENV === 'production'
  const uri = process.env.MONGODB_URI?.trim()
  const database = process.env.MONGODB_DB?.trim()
  const configured = Boolean(uri && database)
  let databaseReady = false

  if (uri && database) {
    const client = new MongoClient(uri, { serverSelectionTimeoutMS: 5000 })
    try {
      await client.connect()
      await client.db(database).command({ ping: 1 })
      databaseReady = true
    } catch {
      databaseReady = false
    } finally {
      await client.close().catch(() => undefined)
    }
  }

  const ready = production ? databaseReady : !configured || databaseReady
  return NextResponse.json(
    {
      status: ready ? 'ok' : 'degraded',
      liveness: { status: 'ok' },
      readiness: { status: ready ? 'ok' : 'unavailable', database: databaseReady },
    },
    { status: ready ? 200 : 503 },
  )
}

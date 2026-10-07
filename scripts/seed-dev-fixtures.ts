import { MongoClient } from 'mongodb'

const force = process.argv.includes('--force')
if (process.env.NODE_ENV === 'production' && !force) {
  throw new Error('Refusing to seed fixtures in production. Re-run with --force only when intentional.')
}

const connectionString = process.env.MONGODB_URI
const dbName = process.env.MONGODB_DB || 'asfakul-siam'
if (!connectionString) throw new Error('MONGODB_URI is required')

const fixtures = [
  {
    slug: 'paper-trail',
    title: 'Paper Trail',
    role: 'Design direction, interaction, front-end',
    year: '2025',
    status: 'draft',
    order: 10,
    coverImage: { publicId: 'fixture-paper-trail', url: 'https://images.unsplash.com/photo-1455390582262-044c634d6c63?auto=format&fit=crop&w=1800&q=80', alt: 'Paper and ink on a desk' },
  },
  {
    slug: 'signal-garden',
    title: 'Signal Garden',
    role: 'Creative direction, motion, prototyping',
    year: '2024',
    status: 'draft',
    order: 20,
    coverImage: { publicId: 'fixture-signal-garden', url: 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=1800&q=80', alt: 'A dark landscape with a signal of light' },
  },
  {
    slug: 'quiet-objects',
    title: 'Quiet Objects',
    role: 'Concept, design, creative technology',
    year: '2024',
    status: 'draft',
    order: 30,
    coverImage: { publicId: 'fixture-quiet-objects', url: 'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1800&q=80', alt: 'Quiet objects arranged in a minimal room' },
  },
] as const

async function main() {
  const client = new MongoClient(connectionString!, { serverSelectionTimeoutMS: 10_000 })
  await client.connect()
  try {
    const collection = client.db(dbName).collection('projects')
    const now = new Date()
    for (const fixture of fixtures) {
      await collection.updateOne(
        { slug: fixture.slug },
        { $set: { ...fixture, updatedAt: now }, $setOnInsert: { createdAt: now } },
        { upsert: true },
      )
    }
    console.log(`Seeded ${fixtures.length} idempotent dev fixtures in ${dbName}.projects`)
  } finally {
    await client.close()
  }
}

void main()

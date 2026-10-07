import { MongoMemoryReplSet } from 'mongodb-memory-server'
import type { MongoClient } from 'mongodb'
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('server-only', () => ({}))

let mongo: MongoMemoryReplSet
let repository: typeof import('@/lib/cms/repository')
let client: MongoClient
let projectSequence = 0

async function insertProject(data: Record<string, unknown>) {
  projectSequence += 1
  return repository.insertDocument('projects', { slug: `test-${projectSequence}`, ...data })
}

beforeAll(async () => {
  mongo = await MongoMemoryReplSet.create({ replSet: { count: 1 } })
  process.env.MONGODB_URI = mongo.getUri()
  process.env.MONGODB_DB = 'portfolio-tests'
  vi.resetModules()
  repository = await import('@/lib/cms/repository')
  const mongodb = await import('mongodb')
  client = new mongodb.MongoClient(mongo.getUri())
  await client.connect()
})

beforeEach(async () => {
  await client.db('portfolio-tests').collection('projects').deleteMany({})
  await client.db('portfolio-tests').collection('singletons').deleteMany({})
})

afterAll(async () => {
  await client?.close()
  await mongo?.stop()
})

describe('CMS repository integration', () => {
  it('inserts a document with timestamps', async () => {
    const id = await insertProject( { title: 'One' })
    const doc = await repository.getDocument<{ title: string }>('projects', id)
    expect(doc).toMatchObject({ id, title: 'One' })
    expect(doc).toHaveProperty('createdAt')
    expect(doc).toHaveProperty('updatedAt')
  })

  it('assigns the first order as zero', async () => {
    await insertProject( { title: 'First' })
    const doc = await repository.findOne<{ order: number }>('projects', { title: 'First' })
    expect(doc?.order).toBe(0)
  })

  it('increments order for later documents', async () => {
    await insertProject( { title: 'First' })
    await insertProject( { title: 'Second' })
    const docs = await repository.listDocuments<{ title: string; order: number }>('projects')
    expect(docs.map((doc) => doc.order).sort()).toEqual([0, 1])
  })

  it('lists documents using a filter', async () => {
    await insertProject( { title: 'Visible', published: true })
    await insertProject( { title: 'Hidden', published: false })
    const docs = await repository.listDocuments<{ title: string }>('projects', { published: true })
    expect(docs).toHaveLength(1)
    expect(docs[0]?.title).toBe('Visible')
  })

  it('sorts and limits list results', async () => {
    await insertProject( { title: 'A' })
    await insertProject( { title: 'B' })
    const docs = await repository.listDocuments<{ title: string }>('projects', {}, { title: 1 }, 1)
    expect(docs).toHaveLength(1)
    expect(docs[0]?.title).toBe('A')
  })

  it('applies projections to list results', async () => {
    await insertProject( { title: 'Public', secret: 'private' })
    const docs = await repository.listDocuments<{ title: string; secret?: string }>('projects', {}, { order: 1 }, 100, { title: 1 })
    expect(docs[0]).toMatchObject({ title: 'Public' })
    expect(docs[0]).not.toHaveProperty('secret')
  })

  it('returns null for an unknown document', async () => {
    const doc = await repository.getDocument('projects', '507f1f77bcf86cd799439011')
    expect(doc).toBeNull()
  })

  it('rejects invalid document ids on writes', async () => {
    await expect(repository.updateDocument('projects', 'bad-id', { title: 'Nope' })).rejects.toMatchObject({ code: 'INVALID_INPUT' })
  })

  it('updates a document and refreshes updatedAt', async () => {
    const id = await insertProject( { title: 'Before' })
    await repository.updateDocument('projects', id, { title: 'After' })
    const doc = await repository.getDocument<{ title: string }>('projects', id)
    expect(doc?.title).toBe('After')
  })

  it('deletes a document', async () => {
    const id = await insertProject( { title: 'Delete me' })
    await repository.deleteDocument('projects', id)
    expect(await repository.getDocument('projects', id)).toBeNull()
  })

  it('counts filtered documents', async () => {
    await insertProject( { published: true })
    await insertProject( { published: true })
    await insertProject( { published: false })
    expect(await repository.countDocuments('projects', { published: true })).toBe(2)
  })

  it('moves a document up atomically', async () => {
    const first = await insertProject( { title: 'First' })
    const second = await insertProject( { title: 'Second' })
    await repository.moveDocument('projects', second, 'up')
    const docs = await repository.listDocuments<{ id: string; title: string }>('projects')
    expect(docs.map((doc) => doc.id)).toEqual([second, first])
  })

  it('moves a document down atomically', async () => {
    const first = await insertProject( { title: 'First' })
    const second = await insertProject( { title: 'Second' })
    await repository.moveDocument('projects', first, 'down')
    const docs = await repository.listDocuments<{ title: string }>('projects')
    expect(docs.map((doc) => doc.title)).toEqual(['Second', 'First'])
  })

  it('does nothing when moving the first document up', async () => {
    const first = await insertProject( { title: 'First' })
    await insertProject( { title: 'Second' })
    await repository.moveDocument('projects', first, 'up')
    const docs = await repository.listDocuments<{ title: string }>('projects')
    expect(docs.map((doc) => doc.title)).toEqual(['First', 'Second'])
  })

  it('does nothing when moving the last document down', async () => {
    await insertProject( { title: 'First' })
    const second = await insertProject( { title: 'Second' })
    await repository.moveDocument('projects', second, 'down')
    const docs = await repository.listDocuments<{ title: string }>('projects')
    expect(docs.map((doc) => doc.title)).toEqual(['First', 'Second'])
  })

  it('saves and reads singleton data', async () => {
    await repository.saveSingleton('home', { title: 'Hello' })
    expect(await repository.getSingleton<{ title: string }>('home')).toEqual({ title: 'Hello', updatedAt: expect.any(String), createdAt: expect.any(String) })
  })

  it('updates an existing singleton instead of duplicating it', async () => {
    await repository.saveSingleton('home', { title: 'First' })
    await repository.saveSingleton('home', { title: 'Second' })
    expect(await repository.countDocuments('singletons', { key: 'home' })).toBe(1)
    expect(await repository.getSingleton<{ title: string }>('home')).toMatchObject({ title: 'Second' })
  })

  it('checks whether a slug exists', async () => {
    await insertProject( { slug: 'hello-world' })
    expect(await repository.slugExists('projects', 'hello-world')).toBe(true)
    expect(await repository.slugExists('projects', 'other')).toBe(false)
  })

  it('allows excluding a document when checking a slug', async () => {
    const id = await insertProject({ slug: 'hello-world' })
    expect(await repository.slugExists('projects', 'hello-world', id)).toBe(false)
  })

  it('returns null for an invalid document id', async () => {
    expect(await repository.getDocument('projects', 'not-an-object-id')).toBeNull()
  })

  it('returns null when a filtered document is absent', async () => {
    expect(await repository.findOne('projects', { title: 'Missing' })).toBeNull()
  })

  it('clamps a non-positive list limit to one', async () => {
    await insertProject({ title: 'Only result' })
    const docs = await repository.listDocuments('projects', {}, { order: 1 }, 0)
    expect(docs).toHaveLength(1)
  })

  it('clamps an oversized list limit to the repository maximum', async () => {
    await insertProject({ title: 'First result' })
    const docs = await repository.listDocuments('projects', {}, { order: 1 }, 1000)
    expect(docs).toHaveLength(1)
  })

  it('preserves custom fields during updates', async () => {
    const id = await insertProject({ title: 'Before', category: 'web' })
    await repository.updateDocument('projects', id, { title: 'After' })
    const doc = await repository.getDocument<{ title: string; category: string }>('projects', id)
    expect(doc).toMatchObject({ title: 'After', category: 'web' })
  })
})

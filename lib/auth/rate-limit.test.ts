import { describe, expect, it, vi } from 'vitest'
import { MAX_ATTEMPTS, WINDOW_MS, consumeLoginAttempt } from './rate-limit'

vi.mock('@/lib/db/mongo', () => ({
  getDb: vi.fn().mockResolvedValue(null),
}))

describe('login rate-limit policy', () => {
  it('allows five attempts per fifteen-minute window', () => {
    expect(MAX_ATTEMPTS).toBe(5)
    expect(WINDOW_MS).toBe(15 * 60 * 1000)
  })

  it('fails closed when the database is unavailable', async () => {
    await expect(consumeLoginAttempt('admin@example.com')).rejects.toMatchObject({
      code: 'DEPENDENCY_UNAVAILABLE',
    })
  })
})

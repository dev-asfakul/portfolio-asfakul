import { afterEach, describe, expect, it, vi } from 'vitest'

const originalHash = process.env.ADMIN_PASSWORD_HASH

afterEach(() => {
  if (originalHash === undefined) delete process.env.ADMIN_PASSWORD_HASH
  else process.env.ADMIN_PASSWORD_HASH = originalHash
  vi.resetModules()
})

describe('environment validation', () => {
  it('rejects a non-bcrypt admin password hash', async () => {
    process.env.ADMIN_PASSWORD_HASH = 'plaintext-password'
    vi.resetModules()

    await expect(import('./env')).rejects.toThrow('Invalid environment configuration.')
  })
})

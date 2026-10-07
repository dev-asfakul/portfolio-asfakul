import { afterEach, describe, expect, it, vi } from 'vitest'

const testEnv = process.env as Record<string, string | undefined>
const originalHash = testEnv.ADMIN_PASSWORD_HASH
const originalNodeEnv = testEnv.NODE_ENV
const originalBuildPhase = testEnv.NEXT_PHASE

afterEach(() => {
  if (originalHash === undefined) delete testEnv.ADMIN_PASSWORD_HASH
  else testEnv.ADMIN_PASSWORD_HASH = originalHash
  if (originalNodeEnv === undefined) delete testEnv.NODE_ENV
  else testEnv.NODE_ENV = originalNodeEnv
  if (originalBuildPhase === undefined) delete testEnv.NEXT_PHASE
  else testEnv.NEXT_PHASE = originalBuildPhase
  vi.resetModules()
})

describe('environment validation', () => {
  it('rejects a non-bcrypt admin password hash', async () => {
    process.env.ADMIN_PASSWORD_HASH = 'plaintext-password'
    vi.resetModules()

    await expect(import('./env')).rejects.toThrow('Invalid environment configuration.')
  })

  it('fails fast in production when required auth configuration is missing', async () => {
    testEnv.NODE_ENV = 'production'
    delete testEnv.AUTH_SECRET
    delete testEnv.NEXT_PHASE
    vi.resetModules()

    await expect(import('./env')).rejects.toThrow('Missing production environment variables:')
  })
})

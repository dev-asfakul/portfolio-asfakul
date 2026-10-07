import { beforeEach, describe, expect, it, vi } from 'vitest'

const send = vi.fn()

vi.mock('resend', () => ({
  Resend: class {
    emails = { send }
  },
}))

vi.mock('@/lib/env', () => ({
  env: { RESEND_API_KEY: 'test-key', RESEND_FROM: 'Studio <studio@example.com>' },
  requireService: vi.fn(),
}))

import { sendContactEmail } from './resend'

const payload = { to: 'owner@example.com', name: 'Ada Lovelace', email: 'ada@example.com', message: 'A valid project enquiry.' }

describe('sendContactEmail', () => {
  beforeEach(() => {
    send.mockReset()
    send.mockResolvedValue({ data: { id: 'email_1' }, error: null })
  })

  it('sends a valid contact email', async () => {
    await expect(sendContactEmail({ ...payload, idempotencyKey: 'idem-success-123456' })).resolves.toBe('sent')
    expect(send).toHaveBeenCalledTimes(1)
  })

  it('retries transient failures and succeeds', async () => {
    send.mockRejectedValueOnce(new Error('temporary')).mockResolvedValueOnce({ data: { id: 'email_2' }, error: null })
    await expect(sendContactEmail(payload)).resolves.toBe('sent')
    expect(send).toHaveBeenCalledTimes(2)
  })

  it('does not retry a permanent provider error after the bounded attempts', async () => {
    send.mockResolvedValue({ data: null, error: { message: 'invalid recipient' } })
    await expect(sendContactEmail(payload)).resolves.toBe('failed')
    expect(send).toHaveBeenCalledTimes(3)
  })

  it('passes the idempotency key on every provider attempt', async () => {
    await sendContactEmail({ ...payload, idempotencyKey: 'idem-duplicate-123456' })
    expect(send).toHaveBeenCalledWith(expect.objectContaining({ headers: { 'Idempotency-Key': 'idem-duplicate-123456' }}), expect.anything())
  })
})

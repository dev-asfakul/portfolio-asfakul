import { describe, expect, it } from 'vitest'
import { AppError, errorResponse, toSafeError } from '@/lib/errors'

describe('error contract', () => {
  it('keeps safe codes and messages', () => {
    const error = new AppError('INVALID_INPUT', 'Invalid request.')
    expect(toSafeError(error)).toMatchObject({ code: 'INVALID_INPUT', message: 'Invalid request.' })
    expect(errorResponse(error)).toEqual({ error: { code: 'INVALID_INPUT', message: 'Invalid request.', details: {} } })
  })

  it('does not expose unknown error details', () => {
    expect(errorResponse(new Error('secret stack'))).toEqual({ error: { code: 'INTERNAL_ERROR', message: 'Something went wrong.', details: {} } })
  })
})

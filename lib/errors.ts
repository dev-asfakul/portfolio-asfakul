export type AppErrorCode =
  | 'CONFIGURATION_ERROR'
  | 'INVALID_INPUT'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'DEPENDENCY_UNAVAILABLE'
  | 'INTERNAL_ERROR'
  | 'UNAUTHORIZED'

export class AppError extends Error {
  constructor(
    public readonly code: AppErrorCode,
    message: string,
    public readonly cause?: unknown,
  ) {
    super(message)
    this.name = 'AppError'
  }
}

export function toSafeError(error: unknown, fallback = 'Something went wrong.') {
  if (error instanceof AppError) return error
  return new AppError('INTERNAL_ERROR', fallback, error)
}

export function errorResponse(error: unknown, fallback = 'Something went wrong.') {
  const safe = toSafeError(error, fallback)
  return { error: { code: safe.code, message: safe.message, details: safe.cause instanceof Error ? {} : safe.cause ?? {} } }
}

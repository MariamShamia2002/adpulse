import type { ApiErrorBody } from '@/api/types'

export class ApiError extends Error {
  readonly status: number
  readonly body: unknown

  constructor(message: string, status: number, body: unknown = null) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.body = body
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError
}

/** Bad query/params (e.g. ?platform=bing) — show error.message. */
export function isValidationError(error: unknown): error is ApiError {
  return isApiError(error) && error.status === 400
}

export function isNotFoundError(error: unknown): error is ApiError {
  return isApiError(error) && error.status === 404
}

/** Resolve a user-facing message from a thrown error or an API response body. */
export function getErrorMessage(
  error: unknown,
  fallback = 'Something went wrong',
): string {
  if (isApiError(error)) {
    const fromBody = messageFromApiBody(error.body)
    if (fromBody) return fromBody
    if (error.message) return error.message
  }

  if (error instanceof Error && error.message) {
    return error.message
  }

  const fromRaw = messageFromApiBody(error)
  if (fromRaw) return fromRaw

  return fallback
}

function messageFromApiBody(value: unknown): string | undefined {
  if (!isApiErrorBody(value)) return undefined

  if (typeof value.message === 'string' && value.message !== '') {
    return value.message
  }

  const nested = value.error?.message
  if (typeof nested === 'string' && nested !== '') {
    return nested
  }

  return undefined
}

function isApiErrorBody(value: unknown): value is ApiErrorBody {
  return typeof value === 'object' && value !== null
}

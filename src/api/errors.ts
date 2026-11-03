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

/** Resolve a user-facing message from a thrown error or an API response body. */
export function getErrorMessage(
  error: unknown,
  fallback = 'Something went wrong',
): string {
  if (isApiError(error) && error.message) {
    return error.message
  }

  if (error instanceof Error && error.message) {
    return error.message
  }

  // Raw response body from the API: { message?: string }
  if (
    isApiErrorBody(error) &&
    typeof error.message === 'string' &&
    error.message !== ''
  ) {
    return error.message
  }

  return fallback
}

function isApiErrorBody(value: unknown): value is ApiErrorBody {
  return typeof value === 'object' && value !== null
}

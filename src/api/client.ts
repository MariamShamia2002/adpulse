import { ApiError, getErrorMessage } from '@/api/errors'

function getBaseUrl(): string {
  const baseUrl = import.meta.env.VITE_API_URL
  return baseUrl.replace(/\/$/, '')
}

async function parseBody(response: Response): Promise<unknown> {
  const contentType = response.headers.get('content-type') ?? ''

  if (contentType.includes('application/json')) {
    try {
      return await response.json()
    } catch {
      return null
    }
  }

  try {
    return await response.text()
  } catch {
    return null
  }
}

export async function apiGet<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  let response: Response

  try {
    response = await fetch(`${getBaseUrl()}${path}`, {
      ...init,
      method: 'GET',
      headers: {
        Accept: 'application/json',
        ...init?.headers,
      },
    })
  } catch {
    // status 0 = network failure (offline, DNS, CORS, etc.)
    throw new ApiError('Network request failed', 0)
  }

  const body = await parseBody(response)

  if (!response.ok) {
    throw new ApiError(
      getErrorMessage(body, `Request failed with status ${response.status}`),
      response.status,
      body,
    )
  }

  return body as T
}

/** Build an absolute URL for browser downloads (e.g. CSV export). */
export function getApiUrl(path: string): string {
  return `${getBaseUrl()}${path}`
}

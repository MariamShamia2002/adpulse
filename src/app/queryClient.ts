import { QueryClient } from '@tanstack/react-query'

import { isApiError } from '@/api/errors'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Don't retry on 4xx — only on transient errors (5xx, or status 0 for network failures)
      retry: (failureCount, error) => {
        if (isApiError(error) && error.status >= 400 && error.status < 500) {
          return false
        }

        return failureCount < 2
      },
      staleTime: 30_000,
    },
  },
})

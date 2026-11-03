import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Don't retry on 4xx — only on transient errors (5xx / network)
      retry: (failureCount, error) => {
        if (
          typeof error === 'object' &&
          error !== null &&
          'status' in error &&
          typeof (error as { status: number }).status === 'number' &&
          (error as { status: number }).status < 500
        ) {
          return false
        }

        return failureCount < 2
      },
      staleTime: 30_000,
    },
  },
})

import { useQuery } from '@tanstack/react-query'

import {
  fetchOverviewSummary,
  type OverviewFilters,
} from '@/features/overview/api/overviewApi'

export function overviewSummaryQueryKey(filters: OverviewFilters) {
  return [
    'overview',
    'summary',
    filters.from,
    filters.to,
    filters.platform,
    filters.compare,
  ] as const
}

export function useOverviewSummary(filters: OverviewFilters) {
  return useQuery({
    queryKey: overviewSummaryQueryKey(filters),
    queryFn: () => fetchOverviewSummary(filters),
  })
}

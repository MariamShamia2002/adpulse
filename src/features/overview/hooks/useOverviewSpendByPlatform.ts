import { useQuery } from '@tanstack/react-query'

import {
  fetchSpendByPlatform,
  type OverviewFilters,
} from '@/features/overview/api/overviewApi'

export function overviewSpendByPlatformQueryKey(filters: OverviewFilters) {
  return [
    'overview',
    'spend-by-platform',
    filters.from,
    filters.to,
    filters.platform,
  ] as const
}

export function useOverviewSpendByPlatform(filters: OverviewFilters) {
  return useQuery({
    queryKey: overviewSpendByPlatformQueryKey(filters),
    queryFn: () => fetchSpendByPlatform(filters),
  })
}

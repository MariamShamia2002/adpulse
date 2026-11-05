import { useQuery } from '@tanstack/react-query'

import {
  fetchConversionsByAge,
  type OverviewFilters,
} from '@/features/overview/api/overviewApi'

export function overviewConversionsByAgeQueryKey(
  filters: Pick<OverviewFilters, 'from' | 'to'>,
) {
  return ['overview', 'conversions-by-age', filters.from, filters.to] as const
}

export function useOverviewConversionsByAge(
  filters: Pick<OverviewFilters, 'from' | 'to'>,
) {
  return useQuery({
    queryKey: overviewConversionsByAgeQueryKey(filters),
    queryFn: () => fetchConversionsByAge(filters),
  })
}

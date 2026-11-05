import { useQuery } from '@tanstack/react-query'

import {
  fetchOverviewTimeseries,
  type OverviewFilters,
} from '@/features/overview/api/overviewApi'

export function overviewTimeseriesQueryKey(filters: OverviewFilters) {
  return [
    'overview',
    'timeseries',
    filters.from,
    filters.to,
    filters.platform,
    filters.compare,
  ] as const
}

export function useOverviewTimeseries(filters: OverviewFilters) {
  return useQuery({
    queryKey: overviewTimeseriesQueryKey(filters),
    queryFn: () => fetchOverviewTimeseries(filters),
  })
}

import { useQuery } from '@tanstack/react-query'

import {
  fetchCampaignsByRoas,
  type OverviewFilters,
} from '@/features/overview/api/overviewApi'

export function overviewCampaignsRoasQueryKey(filters: OverviewFilters) {
  return [
    'overview',
    'campaigns-roas',
    filters.from,
    filters.to,
    filters.platform,
    'roas',
    'desc',
    6,
  ] as const
}

export function useOverviewCampaignsRoas(filters: OverviewFilters) {
  return useQuery({
    queryKey: overviewCampaignsRoasQueryKey(filters),
    queryFn: () => fetchCampaignsByRoas(filters),
  })
}

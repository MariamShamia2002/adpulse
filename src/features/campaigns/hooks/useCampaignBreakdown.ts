import { useQuery } from '@tanstack/react-query'

import {
  fetchCampaignBreakdown,
  type CampaignDetailFilters,
} from '@/features/campaigns/api/campaignsApi'

export function campaignBreakdownQueryKey(
  id: string,
  filters: Pick<CampaignDetailFilters, 'from' | 'to'>,
) {
  return ['campaign', id, 'breakdown', filters.from, filters.to] as const
}

export function useCampaignBreakdown(
  id: string | undefined,
  filters: Pick<CampaignDetailFilters, 'from' | 'to'>,
) {
  return useQuery({
    queryKey: campaignBreakdownQueryKey(id ?? '', filters),
    queryFn: () => fetchCampaignBreakdown(id!, filters),
    enabled: Boolean(id),
  })
}

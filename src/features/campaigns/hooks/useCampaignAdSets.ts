import { useQuery } from '@tanstack/react-query'

import {
  fetchCampaignAdSets,
  type CampaignDetailFilters,
} from '@/features/campaigns/api/campaignsApi'

export function campaignAdSetsQueryKey(
  id: string,
  filters: Pick<CampaignDetailFilters, 'from' | 'to'>,
) {
  return ['campaign', id, 'adsets', filters.from, filters.to] as const
}

export function useCampaignAdSets(
  id: string | undefined,
  filters: Pick<CampaignDetailFilters, 'from' | 'to'>,
) {
  return useQuery({
    queryKey: campaignAdSetsQueryKey(id ?? '', filters),
    queryFn: () => fetchCampaignAdSets(id!, filters),
    enabled: Boolean(id),
  })
}

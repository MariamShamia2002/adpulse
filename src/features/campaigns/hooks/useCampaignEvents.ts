import { useQuery } from '@tanstack/react-query'

import {
  fetchCampaignEvents,
  type CampaignDetailFilters,
} from '@/features/campaigns/api/campaignsApi'

export function campaignEventsQueryKey(
  id: string,
  filters: Pick<CampaignDetailFilters, 'from' | 'to'>,
) {
  return ['campaign', id, 'events', filters.from, filters.to] as const
}

export function useCampaignEvents(
  id: string | undefined,
  filters: Pick<CampaignDetailFilters, 'from' | 'to'>,
) {
  return useQuery({
    queryKey: campaignEventsQueryKey(id ?? '', filters),
    queryFn: () => fetchCampaignEvents(id!, filters),
    enabled: Boolean(id),
  })
}

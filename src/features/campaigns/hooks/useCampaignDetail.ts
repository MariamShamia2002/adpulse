import { useQuery } from '@tanstack/react-query'

import {
  fetchCampaignDetail,
  type CampaignDetailFilters,
} from '@/features/campaigns/api/campaignsApi'

export function campaignDetailQueryKey(
  id: string,
  filters: CampaignDetailFilters,
) {
  return [
    'campaign',
    id,
    'detail',
    filters.from,
    filters.to,
    filters.compare,
  ] as const
}

export function useCampaignDetail(
  id: string | undefined,
  filters: CampaignDetailFilters,
) {
  return useQuery({
    queryKey: campaignDetailQueryKey(id ?? '', filters),
    queryFn: () => fetchCampaignDetail(id!, filters),
    enabled: Boolean(id),
  })
}

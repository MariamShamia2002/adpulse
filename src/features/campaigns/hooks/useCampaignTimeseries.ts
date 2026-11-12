import { useQuery } from '@tanstack/react-query'

import {
  fetchCampaignTimeseries,
  type CampaignDetailFilters,
} from '@/features/campaigns/api/campaignsApi'
import type { CampaignMetric } from '@/features/campaigns/schemas/campaignEnums'

export function campaignTimeseriesQueryKey(
  id: string,
  filters: CampaignDetailFilters,
  metric: CampaignMetric,
) {
  return [
    'campaign',
    id,
    'timeseries',
    filters.from,
    filters.to,
    filters.compare,
    metric,
  ] as const
}

export function useCampaignTimeseries(
  id: string | undefined,
  filters: CampaignDetailFilters,
  metric: CampaignMetric,
) {
  return useQuery({
    queryKey: campaignTimeseriesQueryKey(id ?? '', filters, metric),
    queryFn: () =>
      fetchCampaignTimeseries(id!, { ...filters, metric }),
    enabled: Boolean(id),
  })
}

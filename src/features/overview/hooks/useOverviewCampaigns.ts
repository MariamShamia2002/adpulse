import { useQuery } from '@tanstack/react-query'

import {
  fetchCampaigns,
  type CampaignsListParams,
} from '@/features/overview/api/overviewApi'

export function overviewCampaignsQueryKey(params: CampaignsListParams) {
  return [
    'overview',
    'campaigns',
    params.from,
    params.to,
    params.sort,
    params.dir,
    params.page,
    params.pageSize,
    params.q ?? '',
    params.platform ?? 'all',
  ] as const
}

export function useOverviewCampaigns(params: CampaignsListParams) {
  return useQuery({
    queryKey: overviewCampaignsQueryKey(params),
    queryFn: () => fetchCampaigns(params),
  })
}

import { apiGet } from '@/api/client'
import {
  campaignDetailSchema,
  type CampaignDetail,
} from '@/features/campaigns/schemas/campaignDetail'
import type { CampaignMetric } from '@/features/campaigns/schemas/campaignEnums'
import {
  campaignEventsSchema,
  campaignTimeseriesSchema,
  type CampaignEvents,
  type CampaignTimeseries,
} from '@/features/campaigns/schemas/campaignPerformance'

export type CampaignDetailFilters = {
  from: string
  to: string
  compare: boolean
}

function buildRangeParams(
  filters: CampaignDetailFilters,
  options?: { includeCompare?: boolean },
): URLSearchParams {
  const params = new URLSearchParams()
  params.set('from', filters.from)
  params.set('to', filters.to)

  if (options?.includeCompare !== false && filters.compare) {
    params.set('compare', 'true')
  }

  return params
}

export async function fetchCampaignDetail(
  id: string,
  filters: CampaignDetailFilters,
): Promise<CampaignDetail> {
  const params = buildRangeParams(filters)
  const data = await apiGet<unknown>(
    `/api/campaigns/${id}?${params.toString()}`,
  )
  const parsed = campaignDetailSchema.safeParse(data)
  if (!parsed.success) throw parsed.error
  return parsed.data
}

export async function fetchCampaignTimeseries(
  id: string,
  filters: CampaignDetailFilters & { metric: CampaignMetric },
): Promise<CampaignTimeseries> {
  const params = buildRangeParams(filters)
  params.set('metric', filters.metric)

  const data = await apiGet<unknown>(
    `/api/campaigns/${id}/timeseries?${params.toString()}`,
  )
  const parsed = campaignTimeseriesSchema.safeParse(data)
  if (!parsed.success) throw parsed.error
  return parsed.data
}

export async function fetchCampaignEvents(
  id: string,
  filters: Pick<CampaignDetailFilters, 'from' | 'to'>,
): Promise<CampaignEvents> {
  const params = new URLSearchParams()
  params.set('from', filters.from)
  params.set('to', filters.to)

  const data = await apiGet<unknown>(
    `/api/campaigns/${id}/events?${params.toString()}`,
  )
  const parsed = campaignEventsSchema.safeParse(data)
  if (!parsed.success) throw parsed.error
  return parsed.data
}

import { apiGet } from '@/api/client'
import {
  spendByPlatformSchema,
  type SpendByPlatform,
} from '@/features/overview/schemas/spendByPlatform'
import {
  overviewSummarySchema,
  type OverviewSummary,
} from '@/features/overview/schemas/summary'
import {
  overviewTimeseriesSchema,
  type OverviewTimeseries,
} from '@/features/overview/schemas/timeseries'

export type OverviewFilters = {
  from: string
  to: string
  platform: 'all' | 'meta' | 'google' | 'tiktok'
  compare: boolean
}

function buildOverviewParams(
  filters: OverviewFilters,
  options?: { includeCompare?: boolean },
): URLSearchParams {
  const params = new URLSearchParams()
  params.set('from', filters.from)
  params.set('to', filters.to)

  if (options?.includeCompare !== false && filters.compare) {
    params.set('compare', 'true')
  }

  if (filters.platform !== 'all') {
    params.set('platform', filters.platform)
  }

  return params
}

export async function fetchOverviewSummary(
  filters: OverviewFilters,
): Promise<OverviewSummary> {
  const params = buildOverviewParams(filters)
  const data = await apiGet<unknown>(
    `/api/overview/summary?${params.toString()}`,
  )
  const parsed = overviewSummarySchema.safeParse(data)
  if (!parsed.success) throw parsed.error
  return parsed.data
}

export async function fetchOverviewTimeseries(
  filters: OverviewFilters,
): Promise<OverviewTimeseries> {
  const params = buildOverviewParams(filters)
  const data = await apiGet<unknown>(
    `/api/overview/timeseries?${params.toString()}`,
  )
  const parsed = overviewTimeseriesSchema.safeParse(data)
  if (!parsed.success) throw parsed.error
  return parsed.data
}

export async function fetchSpendByPlatform(
  filters: OverviewFilters,
): Promise<SpendByPlatform> {
  const params = buildOverviewParams(filters, { includeCompare: false })
  const data = await apiGet<unknown>(
    `/api/overview/spend-by-platform?${params.toString()}`,
  )
  const parsed = spendByPlatformSchema.safeParse(data)
  if (!parsed.success) throw parsed.error
  return parsed.data
}

import { apiGet } from '@/api/client'
import {
  overviewSummarySchema,
  type OverviewSummary,
} from '@/features/overview/schemas/summary'

export type OverviewFilters = {
  from: string
  to: string
  platform: 'all' | 'meta' | 'google' | 'tiktok'
  compare: boolean
}

export async function fetchOverviewSummary(
  filters: OverviewFilters,
): Promise<OverviewSummary> {
  const params = new URLSearchParams()
  params.set('from', filters.from)
  params.set('to', filters.to)

  if (filters.compare) {
    params.set('compare', 'true')
  }

  if (filters.platform !== 'all') {
    params.set('platform', filters.platform)
  }

  const data = await apiGet<unknown>(
    `/api/overview/summary?${params.toString()}`,
  )

  const parsed = overviewSummarySchema.safeParse(data)
  if (!parsed.success) {
    throw parsed.error
  }

  return parsed.data
}

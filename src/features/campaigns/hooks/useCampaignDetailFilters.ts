import { useCallback, useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router'

import type { CampaignDetailFilters } from '@/features/campaigns/api/campaignsApi'
import type {
  CampaignMetric,
  CampaignTab,
} from '@/features/campaigns/schemas/campaignEnums'
import {
  campaignMetricSchema,
  campaignTabSchema,
} from '@/features/campaigns/schemas/campaignEnums'
import { useOverviewFilters } from '@/features/overview/hooks/useOverviewFilters'

const DEFAULT_METRIC: CampaignMetric = 'revenue'
const DEFAULT_TAB: CampaignTab = 'performance'

function parseMetric(value: string | null): CampaignMetric {
  const parsed = campaignMetricSchema.safeParse(value)
  return parsed.success ? parsed.data : DEFAULT_METRIC
}

function parseTab(value: string | null): CampaignTab {
  const parsed = campaignTabSchema.safeParse(value)
  return parsed.success ? parsed.data : DEFAULT_TAB
}

/**
 * Detail URL state: reuses overview from/to/compare, adds metric + tab.
 * Platform from overview is ignored for campaign detail API calls.
 */
export function useCampaignDetailFilters() {
  const {
    filters: overviewFilters,
    preset,
    setPreset,
    setCompare,
  } = useOverviewFilters()
  const [searchParams, setSearchParams] = useSearchParams()

  const filters: CampaignDetailFilters = useMemo(
    () => ({
      from: overviewFilters.from,
      to: overviewFilters.to,
      compare: overviewFilters.compare,
    }),
    [overviewFilters.compare, overviewFilters.from, overviewFilters.to],
  )

  const metric = parseMetric(searchParams.get('metric'))
  const tab = parseTab(searchParams.get('tab'))

  useEffect(() => {
    const hasMetric = searchParams.has('metric')
    const hasTab = searchParams.has('tab')
    if (hasMetric && hasTab) return

    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        if (!next.has('metric')) next.set('metric', DEFAULT_METRIC)
        if (!next.has('tab')) next.set('tab', DEFAULT_TAB)
        return next
      },
      { replace: true },
    )
  }, [searchParams, setSearchParams])

  const setMetric = useCallback(
    (nextMetric: CampaignMetric) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev)
          next.set('metric', nextMetric)
          return next
        },
        { replace: false },
      )
    },
    [setSearchParams],
  )

  const setTab = useCallback(
    (nextTab: CampaignTab) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev)
          next.set('tab', nextTab)
          return next
        },
        { replace: false },
      )
    },
    [setSearchParams],
  )

  return {
    filters,
    metric,
    tab,
    preset,
    setPreset,
    setCompare,
    setMetric,
    setTab,
  }
}

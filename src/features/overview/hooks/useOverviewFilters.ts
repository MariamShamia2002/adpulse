import { useCallback, useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router'

import type { OverviewFilters } from '@/features/overview/api/overviewApi'
import {
  getDefaultRange,
  getPresetRange,
  isValidDateRange,
  matchDatePreset,
  type DatePreset,
  type DateRange,
} from '@/features/overview/lib/dateRange'

const PLATFORMS = new Set(['all', 'meta', 'google', 'tiktok'])

function parsePlatform(
  value: string | null,
): OverviewFilters['platform'] {
  if (value && PLATFORMS.has(value)) {
    return value as OverviewFilters['platform']
  }
  return 'all'
}

function parseCompare(value: string | null): boolean {
  // Default on for a first visit (param absent). Explicit false must stay off.
  if (value === null) return true
  return value === 'true'
}

export function useOverviewFilters() {
  const [searchParams, setSearchParams] = useSearchParams()

  const filters: OverviewFilters = useMemo(() => {
    const defaults = getDefaultRange()
    const from = searchParams.get('from') ?? defaults.from
    const to = searchParams.get('to') ?? defaults.to

    if (isValidDateRange(from, to)) {
      return {
        from,
        to,
        platform: parsePlatform(searchParams.get('platform')),
        compare: parseCompare(searchParams.get('compare')),
      }
    }

    return {
      ...defaults,
      platform: parsePlatform(searchParams.get('platform')),
      compare: parseCompare(searchParams.get('compare')),
    }
  }, [searchParams])

  /** Matched preset, or null when the URL holds a custom range. */
  const preset: DatePreset | null = useMemo(
    () => matchDatePreset(filters.from, filters.to),
    [filters.from, filters.to],
  )

  // Seed default from/to/compare when missing or invalid
  useEffect(() => {
    const defaults = getDefaultRange()
    const from = searchParams.get('from')
    const to = searchParams.get('to')
    const hasCompare = searchParams.has('compare')
    const rangeIsValid =
      from != null && to != null && isValidDateRange(from, to)

    if (rangeIsValid && hasCompare) return

    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        if (!rangeIsValid) {
          next.set('from', defaults.from)
          next.set('to', defaults.to)
        }
        if (!next.has('compare')) {
          next.set('compare', 'true')
        }
        return next
      },
      { replace: true },
    )
  }, [searchParams, setSearchParams])

  const updateParams = useCallback(
    (patch: Partial<OverviewFilters>) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev)
          const nextFilters: OverviewFilters = {
            from: patch.from ?? filters.from,
            to: patch.to ?? filters.to,
            platform: patch.platform ?? filters.platform,
            compare: patch.compare ?? filters.compare,
          }

          next.set('from', nextFilters.from)
          next.set('to', nextFilters.to)

          if (nextFilters.platform === 'all') {
            next.delete('platform')
          } else {
            next.set('platform', nextFilters.platform)
          }

          // Always persist explicitly — omitting the param would re-default to true
          next.set('compare', nextFilters.compare ? 'true' : 'false')

          return next
        },
        { replace: false },
      )
    },
    [filters, setSearchParams],
  )

  const setPreset = useCallback(
    (value: DatePreset) => {
      updateParams(getPresetRange(value))
    },
    [updateParams],
  )

  const setDateRange = useCallback(
    (range: DateRange) => {
      if (!isValidDateRange(range.from, range.to)) return
      updateParams(range)
    },
    [updateParams],
  )

  const setPlatform = useCallback(
    (platform: OverviewFilters['platform']) => {
      updateParams({ platform })
    },
    [updateParams],
  )

  const setCompare = useCallback(
    (compare: boolean) => {
      updateParams({ compare })
    },
    [updateParams],
  )

  return {
    filters,
    preset,
    setPreset,
    setDateRange,
    setPlatform,
    setCompare,
  }
}

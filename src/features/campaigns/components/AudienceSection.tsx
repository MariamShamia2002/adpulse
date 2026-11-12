import { useMemo } from 'react'
import { getErrorMessage } from '@/api/errors'
import { AgeGenderChart } from '@/features/campaigns/components/AgeGenderChart'
import { BreakdownTable } from '@/features/campaigns/components/BreakdownTable'
import { useCampaignBreakdown } from '@/features/campaigns/hooks/useCampaignBreakdown'
import type { CampaignDetailFilters } from '@/features/campaigns/api/campaignsApi'
import { toAgeGenderBreakdownRows } from '@/features/campaigns/lib/ageGenderBreakdown'
import { formatCurrentRange } from '@/features/overview/lib/dateRange'
import { cn } from '@/lib/utils'

type AudienceSectionProps = {
  campaignId: string
  filters: Pick<CampaignDetailFilters, 'from' | 'to'>
  className?: string
}

/** Shared Audience block — used on Performance and Audience tabs. */
export function AudienceSection({ campaignId, filters, className }: AudienceSectionProps) {
  const query = useCampaignBreakdown(campaignId, filters)

  const rows = useMemo(() => {
    if (!query.data) return []
    return toAgeGenderBreakdownRows(query.data.rows)
  }, [query.data])

  const isEmpty = Boolean(query.data && query.data.rows.length === 0)

  const state = query.isPending
    ? 'loading'
    : query.isError
      ? 'error'
      : isEmpty
        ? 'empty'
        : 'ready'

  const errorMessage = query.isError ? getErrorMessage(query.error) : undefined
  const onRetry = () => {
    void query.refetch()
  }

  const rangeLabel = formatCurrentRange(filters.from, filters.to)

  return (
    <div
      className={cn(
        'grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(420px,1fr))]',
        className,
      )}
    >
      <AgeGenderChart
        data={rows}
        state={state}
        rangeLabel={rangeLabel}
        errorMessage={errorMessage}
        onRetry={onRetry}
      />
      <BreakdownTable
        data={rows}
        state={state}
        errorMessage={errorMessage}
        onRetry={onRetry}
      />
    </div>
  )
}

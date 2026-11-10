import { Link, useParams } from 'react-router'

import { getErrorMessage, isNotFoundError } from '@/api/errors'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { CampaignHeader } from '@/features/campaigns/components/CampaignHeader'
import { KpiStrip } from '@/features/campaigns/components/KpiStrip'
import { useCampaignDetail } from '@/features/campaigns/hooks/useCampaignDetail'
import { useCampaignDetailFilters } from '@/features/campaigns/hooks/useCampaignDetailFilters'
import { DateRangePicker } from '@/features/overview/components/DateRangePicker'
import {
  formatComparedRange,
  formatCurrentRange,
  previousPeriodRange,
} from '@/features/overview/lib/dateRange'
import { buildCampaignFilterSearch } from '@/features/overview/lib/campaignNav'
import { CardSkeleton } from '@/shared/components/CardSkeleton'
import { EmptyState } from '@/shared/components/EmptyState'
import { ErrorState } from '@/shared/components/ErrorState'

export default function CampaignDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { filters, preset, setPreset, setCompare } = useCampaignDetailFilters()
  const query = useCampaignDetail(id, filters)

  const previous = filters.compare
    ? previousPeriodRange(filters.from, filters.to)
    : null

  const rangeLabel =
    filters.compare && previous
      ? `${formatCurrentRange(filters.from, filters.to)} · compared with ${formatComparedRange(previous.from, previous.to)}`
      : formatCurrentRange(filters.from, filters.to)

  const detailSearch = buildCampaignFilterSearch(
    filters.from,
    filters.to,
    filters.compare,
  )

  if (!id) {
    return (
      <EmptyState
        title="Campaign not found"
        action={
          <Button nativeButton={false} render={<Link to="/" />} variant="outline" size="sm">
            Back to Overview
          </Button>
        }
      />
    )
  }

  if (query.isPending) {
    return (
      <div className="space-y-6">
        <CardSkeleton variant="kpi" className="h-24" />
        <div className="grid gap-3 [grid-template-columns:repeat(auto-fit,minmax(140px,1fr))]">
          {Array.from({ length: 6 }).map((_, index) => (
            <CardSkeleton key={index} variant="kpi" className="h-20" />
          ))}
        </div>
      </div>
    )
  }

  if (query.isError) {
    if (isNotFoundError(query.error)) {
      return (
        <EmptyState
          title={getErrorMessage(query.error, `Campaign ${id} not found`)}
          action={
            <Button nativeButton={false} render={<Link to="/" />} variant="outline" size="sm">
              Back to Overview
            </Button>
          }
        />
      )
    }

    return (
      <ErrorState
        message={getErrorMessage(query.error)}
        onRetry={() => {
          void query.refetch()
        }}
      />
    )
  }

  const campaign = query.data

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <CampaignHeader campaign={campaign} search={detailSearch} />

        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center xl:justify-end">
          <DateRangePicker preset={preset} onPresetChange={setPreset} />
          <div className="flex h-9 items-center gap-2 text-[13px] text-text-secondary">
            <Switch
              checked={filters.compare}
              onCheckedChange={setCompare}
              aria-labelledby="campaign-compare-label"
            />
            <span id="campaign-compare-label">Compare to previous period</span>
          </div>
        </div>
      </div>

      <p className="sr-only" aria-live="polite">
        Showing {rangeLabel}
      </p>

      <KpiStrip kpis={campaign.kpis} compare={filters.compare} />
    </div>
  )
}

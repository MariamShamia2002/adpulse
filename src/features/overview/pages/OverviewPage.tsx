import { getErrorMessage } from '@/api/errors'
import { FilterBar } from '@/features/overview/components/FilterBar'
import { KpiTile } from '@/features/overview/components/KpiTile'
import { useOverviewFilters } from '@/features/overview/hooks/useOverviewFilters'
import { useOverviewSummary } from '@/features/overview/hooks/useOverviewSummary'
import {
  formatComparedRange,
  formatCurrentRange,
  previousPeriodRange,
} from '@/features/overview/lib/dateRange'
import { CardSkeleton } from '@/shared/components/CardSkeleton'
import { EmptyState } from '@/shared/components/EmptyState'
import { ErrorState } from '@/shared/components/ErrorState'

export default function OverviewPage() {
  const {
    filters,
    preset,
    setPreset,
    setPlatform,
    setCompare,
  } = useOverviewFilters()

  const summaryQuery = useOverviewSummary(filters)

  const previous =
    summaryQuery.data?.previousRange ??
    (filters.compare
      ? previousPeriodRange(filters.from, filters.to)
      : null)

  const subtitle = filters.compare && previous
    ? `${formatCurrentRange(filters.from, filters.to)} · compared with ${formatComparedRange(previous.from, previous.to)}`
    : formatCurrentRange(filters.from, filters.to)

  const platformLabel =
    filters.platform === 'all'
      ? 'all platforms'
      : filters.platform.charAt(0).toUpperCase() + filters.platform.slice(1)

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-[-0.01em] text-text">
            Overview
          </h1>
          <p className="text-[13px] text-text-secondary">{subtitle}</p>
          <p className="sr-only" aria-live="polite">
            Showing {subtitle}, {platformLabel}
          </p>
        </div>

        <FilterBar
          filters={filters}
          preset={preset}
          onPresetChange={setPreset}
          onPlatformChange={setPlatform}
          onCompareChange={setCompare}
        />
      </div>

      <section aria-label="Key performance indicators">
        {summaryQuery.isPending ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="rounded-[12px] border border-border bg-surface px-5 py-[18px]"
              >
                <CardSkeleton variant="kpi" />
                <div className="mt-3 h-12 rounded bg-surface-muted" />
              </div>
            ))}
          </div>
        ) : null}

        {summaryQuery.isError ? (
          <div className="rounded-[12px] border border-border bg-surface px-5 py-[18px]">
            <ErrorState
              message={getErrorMessage(summaryQuery.error)}
              onRetry={() => {
                void summaryQuery.refetch()
              }}
            />
          </div>
        ) : null}

        {summaryQuery.isSuccess && summaryQuery.data.kpis.length === 0 ? (
          <div className="rounded-[12px] border border-border bg-surface px-5 py-[18px]">
            <EmptyState title="No data for this range." />
          </div>
        ) : null}

        {summaryQuery.isSuccess && summaryQuery.data.kpis.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {summaryQuery.data.kpis.map((kpi) => (
              <KpiTile
                key={kpi.key}
                kpi={kpi}
                compare={filters.compare}
              />
            ))}
          </div>
        ) : null}
      </section>
    </div>
  )
}

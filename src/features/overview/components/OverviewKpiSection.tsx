import { getErrorMessage } from '@/api/errors'
import type { OverviewFilters } from '@/features/overview/api/overviewApi'
import { KpiTile } from '@/features/overview/components/KpiTile'
import { useOverviewSummary } from '@/features/overview/hooks/useOverviewSummary'
import { CardSkeleton } from '@/shared/components/CardSkeleton'
import { EmptyState } from '@/shared/components/EmptyState'
import { ErrorState } from '@/shared/components/ErrorState'

const kpiGridClass =
  'grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(220px,1fr))]'

type OverviewKpiSectionProps = {
  filters: OverviewFilters
}

export function OverviewKpiSection({ filters }: OverviewKpiSectionProps) {
  const summaryQuery = useOverviewSummary(filters)

  return (
    <section aria-label="Key performance indicators">
      {summaryQuery.isPending ? (
        <div className={kpiGridClass}>
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
        <div className={kpiGridClass}>
          {summaryQuery.data.kpis.map((kpi) => (
            <KpiTile key={kpi.key} kpi={kpi} compare={filters.compare} />
          ))}
        </div>
      ) : null}
    </section>
  )
}

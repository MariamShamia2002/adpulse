import type { CampaignKpi } from '@/features/campaigns/schemas/campaignDetail'
import { cn } from '@/lib/utils'
import {
  formatCountCompact,
  formatCurrencyCompact,
  formatDelta,
  formatRatio,
} from '@/shared/utils/formatters'

type KpiStripProps = {
  kpis: CampaignKpi[]
  compare: boolean
}

function formatKpiValue(kpi: CampaignKpi): string {
  switch (kpi.unit) {
    case 'currency':
      return formatCurrencyCompact(kpi.current)
    case 'ratio':
      return formatRatio(kpi.current)
    case 'count':
      return formatCountCompact(kpi.current)
    case 'percent':
      return `${kpi.current.toFixed(2)}%`
    default:
      return String(kpi.current)
  }
}

function deltaDirection(deltaRatio: number): 'up' | 'down' | 'flat' {
  if (deltaRatio === 0) return 'flat'
  return deltaRatio > 0 ? 'up' : 'down'
}

/** Spend / CPA up is worse; other metrics up is better. */
function isDeltaPositive(key: string, direction: 'up' | 'down' | 'flat'): boolean {
  if (direction === 'flat') return true
  const upIsBad = key === 'spend' || key === 'cpa'
  return direction === 'up' ? !upIsBad : upIsBad
}

function KpiStripItem({ kpi, compare }: { kpi: CampaignKpi; compare: boolean }) {
  const showCompare =
    compare && kpi.previous != null && Number.isFinite(kpi.previous)

  const deltaRatio =
    showCompare && kpi.previous !== 0
      ? (kpi.current - kpi.previous!) / kpi.previous!
      : showCompare && kpi.previous === 0
        ? null
        : undefined

  const direction = deltaRatio == null ? 'flat' : deltaDirection(deltaRatio)
  const good = deltaRatio == null ? true : isDeltaPositive(kpi.key, direction)

  return (
    <article className="flex min-w-0 flex-col gap-1 px-4 py-3">
      <p className="text-[12px] font-medium text-text-secondary">{kpi.label}</p>
      <div className="flex flex-wrap items-end gap-2">
        <p className="text-[22px] font-bold tracking-[-0.02em] text-text tabular-nums">
          {formatKpiValue(kpi)}
        </p>
        {showCompare ? (
          <span
            className={cn(
              'mb-0.5 rounded-full px-2 py-0.5 text-[11px] font-medium tabular-nums',
              direction === 'flat' && 'bg-surface-muted text-text-secondary',
              direction !== 'flat' &&
                good &&
                'bg-status-good-bg text-status-good-fg',
              direction !== 'flat' &&
                !good &&
                'bg-status-critical-bg text-status-critical-fg',
            )}
          >
            {formatDelta(deltaRatio)}
          </span>
        ) : null}
      </div>
    </article>
  )
}

export function KpiStrip({ kpis, compare }: KpiStripProps) {
  if (kpis.length === 0) return null

  return (
    <section
      aria-label="Campaign key metrics"
      className="overflow-x-auto rounded-[12px] border border-border bg-surface"
    >
      <div className="grid min-w-[720px] grid-cols-6 divide-x divide-border">
        {kpis.map((kpi) => (
          <KpiStripItem key={kpi.key} kpi={kpi} compare={compare} />
        ))}
      </div>
    </section>
  )
}

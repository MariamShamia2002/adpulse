import { Line, LineChart } from 'recharts'

import {
  ChartContainer,
  type ChartConfig,
} from '@/components/ui/chart'
import type { OverviewKpi } from '@/features/overview/schemas/summary'
import { cn } from '@/lib/utils'
import {
  formatCountCompact,
  formatCurrencyCompact,
  formatDelta,
  formatRatio,
} from '@/shared/utils/formatters'

type KpiTileProps = {
  kpi: OverviewKpi
  compare: boolean
  className?: string
}

const KPI_COLORS: Record<string, string> = {
  spend: 'var(--series-2)',
  revenue: 'var(--series-1)',
  roas: 'var(--series-3)',
  conversions: 'var(--series-6)',
}

function formatKpiValue(kpi: OverviewKpi): string {
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

/** Spend up is worse; revenue / ROAS / conversions up is better. */
function isDeltaPositive(key: string, direction: 'up' | 'down' | 'flat'): boolean {
  if (direction === 'flat') return true
  const upIsGood = key !== 'spend'
  return direction === 'up' ? upIsGood : !upIsGood
}

export function KpiTile({ kpi, compare, className }: KpiTileProps) {
  const color = KPI_COLORS[kpi.key] ?? 'var(--series-1)'
  const showCompare =
    compare && kpi.previous != null && Number.isFinite(kpi.previous)

  const deltaRatio =
    showCompare && kpi.previous !== 0
      ? (kpi.current - kpi.previous!) / kpi.previous!
      : showCompare && kpi.previous === 0
        ? null
        : undefined

  const direction =
    deltaRatio == null ? 'flat' : deltaDirection(deltaRatio)
  const good = deltaRatio == null ? true : isDeltaPositive(kpi.key, direction)

  const chartData = kpi.series.map((point, index) => ({
    date: point.date,
    current: point.value,
    previous: kpi.previousSeries?.[index]?.value,
  }))

  const chartConfig = {
    current: { label: kpi.label, color },
    previous: { label: 'Previous', color: 'var(--previous)' },
  } satisfies ChartConfig

  return (
    <article
      className={cn(
        'flex flex-col gap-3 rounded-[12px] border border-border bg-surface px-5 py-[18px]',
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 space-y-1">
          <p className="text-[12px] font-medium text-text-secondary">
            {kpi.label}
          </p>
          <p
            className="text-[28px] font-bold tracking-[-0.02em] text-text tabular-nums"
            style={{ color }}
          >
            {formatKpiValue(kpi)}
          </p>
        </div>

        {showCompare ? (
          <span
            className={cn(
              'rounded-full px-2 py-0.5 text-[12px] font-medium tabular-nums',
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

      <div className="h-12 w-full" aria-hidden="true">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-12 w-full"
          initialDimension={{ width: 240, height: 48 }}
        >
          <LineChart data={chartData} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
            {showCompare && kpi.previousSeries ? (
              <Line
                type="monotone"
                dataKey="previous"
                stroke="var(--color-previous)"
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={false}
                isAnimationActive={false}
              />
            ) : null}
            <Line
              type="monotone"
              dataKey="current"
              stroke="var(--color-current)"
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ChartContainer>
      </div>
    </article>
  )
}

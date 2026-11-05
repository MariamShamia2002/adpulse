import { useMemo } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from 'recharts'

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import type { OverviewFilters } from '@/features/overview/api/overviewApi'
import { ChartCard } from '@/features/overview/components/ChartCard'
import { SeriesLegend } from '@/features/overview/components/SeriesLegend'
import type { SpendByPlatform } from '@/features/overview/schemas/spendByPlatform'
import {
  formatCurrency,
  formatCurrencyCompact,
} from '@/shared/utils/formatters'

type SpendByPlatformChartProps = {
  data: SpendByPlatform | undefined
  platform: OverviewFilters['platform']
  isPending: boolean
  isError: boolean
  errorMessage?: string
  onRetry: () => void
  rangeLabel: string
}

const chartConfig = {
  meta: { label: 'Meta', color: 'var(--series-1)' },
  google: { label: 'Google', color: 'var(--series-2)' },
  tiktok: { label: 'TikTok', color: 'var(--series-3)' },
} satisfies ChartConfig

function applyPlatformFilter(
  weeks: SpendByPlatform['weeks'],
  platform: OverviewFilters['platform'],
) {
  return weeks.map((week) => {
    const meta = platform === 'all' || platform === 'meta' ? week.meta : 0
    const google =
      platform === 'all' || platform === 'google' ? week.google : 0
    const tiktok =
      platform === 'all' || platform === 'tiktok' ? week.tiktok : 0

    return {
      ...week,
      meta,
      google,
      tiktok,
      total: meta + google + tiktok,
    }
  })
}

export function SpendByPlatformChart({
  data,
  platform,
  isPending,
  isError,
  errorMessage,
  onRetry,
  rangeLabel,
}: SpendByPlatformChartProps) {
  const chartData = useMemo(() => {
    if (!data) return []
    return applyPlatformFilter(data.weeks, platform)
  }, [data, platform])

  const isEmpty = Boolean(data && data.weeks.length === 0)

  const state = isPending
    ? 'loading'
    : isError
      ? 'error'
      : isEmpty
        ? 'empty'
        : 'ready'

  const legendItems = [
    { label: 'Meta', color: 'var(--series-1)' },
    { label: 'Google', color: 'var(--series-2)' },
    { label: 'TikTok', color: 'var(--series-3)' },
  ]

  return (
    <ChartCard
      title="Spend by platform"
      subtitle="Weekly, USD"
      state={state}
      errorMessage={errorMessage}
      onRetry={onRetry}
      legend={<SeriesLegend items={legendItems} />}
      chartHeight={240}
    >
      <ChartContainer
        config={chartConfig}
        className="aspect-auto h-[240px] w-full"
        role="img"
        aria-label={`Stacked bar chart of weekly spend by platform, ${rangeLabel}`}
        initialDimension={{ width: 640, height: 240 }}
      >
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 8, left: 0, bottom: 0 }}
          barCategoryGap="20%"
        >
          <CartesianGrid
            vertical={false}
            stroke="var(--grid)"
            strokeDasharray="0"
          />
          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
          />
          <YAxis
            tickFormatter={(value: number) => formatCurrencyCompact(value)}
            tickLine={false}
            axisLine={false}
            width={48}
            tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
            tickCount={5}
          />
          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent
                className="w-[170px] border-none bg-tooltip text-tooltip-text shadow-none [&_.text-muted-foreground]:text-tooltip-label"
                labelFormatter={(_, payload) => {
                  const label = payload?.[0]?.payload?.label as
                    | string
                    | undefined
                  return label ?? ''
                }}
                formatter={(value, name) => {
                  const amount =
                    typeof value === 'number'
                      ? formatCurrency(value)
                      : String(value)
                  const label =
                    name === 'meta'
                      ? 'Meta'
                      : name === 'google'
                        ? 'Google'
                        : name === 'tiktok'
                          ? 'TikTok'
                          : String(name)
                  return (
                    <div className="flex w-full items-center justify-between gap-4">
                      <span className="text-tooltip-label">{label}</span>
                      <span className="font-medium tabular-nums text-tooltip-text">
                        {amount}
                      </span>
                    </div>
                  )
                }}
              />
            }
          />
          <Bar
            dataKey="meta"
            stackId="spend"
            fill="var(--color-meta)"
            stroke="var(--surface)"
            strokeWidth={2}
            isAnimationActive={false}
          />
          <Bar
            dataKey="google"
            stackId="spend"
            fill="var(--color-google)"
            stroke="var(--surface)"
            strokeWidth={2}
            isAnimationActive={false}
          />
          <Bar
            dataKey="tiktok"
            stackId="spend"
            fill="var(--color-tiktok)"
            stroke="var(--surface)"
            strokeWidth={2}
            radius={[4, 4, 0, 0]}
            isAnimationActive={false}
          >
            <LabelList
              dataKey="total"
              position="top"
              formatter={(value) =>
                typeof value === 'number' ? formatCurrencyCompact(value) : ''
              }
              className="fill-text text-[11px] font-semibold"
            />
          </Bar>
        </BarChart>
      </ChartContainer>
    </ChartCard>
  )
}

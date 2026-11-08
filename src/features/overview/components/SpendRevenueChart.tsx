import { useMemo } from 'react'
import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from 'recharts'

import { getErrorMessage } from '@/api/errors'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import type { OverviewFilters } from '@/features/overview/api/overviewApi'
import { ChartCard } from '@/features/overview/components/ChartCard'
import { SeriesLegend } from '@/features/overview/components/SeriesLegend'
import { useOverviewTimeseries } from '@/features/overview/hooks/useOverviewTimeseries'
import { getFiveTickIndexes } from '@/features/overview/lib/chartTicks'
import {
  formatAxisDate,
  formatCurrency,
  formatCurrencyCompact,
  formatTooltipDate,
} from '@/shared/utils/formatters'

type SpendRevenueChartProps = {
  filters: OverviewFilters
  rangeLabel: string
}

const chartConfig = {
  revenue: {
    label: 'Revenue',
    color: 'var(--series-1)',
  },
  spend: {
    label: 'Spend',
    color: 'var(--series-2)',
  },
  previousRevenue: {
    label: 'Previous revenue',
    color: 'var(--previous)',
  },
} satisfies ChartConfig

export function SpendRevenueChart({
  filters,
  rangeLabel,
}: SpendRevenueChartProps) {
  const query = useOverviewTimeseries(filters)
  const data = query.data
  const compare = filters.compare

  const chartData = useMemo(() => {
    if (!data) return []

    return data.points.map((point, index) => ({
      date: point.date,
      revenue: point.revenue,
      spend: point.spend,
      previousRevenue: compare ? data.previous?.[index]?.revenue : undefined,
    }))
  }, [compare, data])

  const tickDates = useMemo(() => {
    const indexes = getFiveTickIndexes(chartData.length)
    return indexes
      .map((index) => chartData[index]?.date)
      .filter((date): date is string => Boolean(date))
  }, [chartData])

  const showPrevious = compare && Boolean(data?.previous?.length)
  const isEmpty = Boolean(data && data.points.length === 0)

  const state = query.isPending
    ? 'loading'
    : query.isError
      ? 'error'
      : isEmpty
        ? 'empty'
        : 'ready'

  const legendItems = [
    { label: 'Revenue', color: 'var(--series-1)' },
    { label: 'Spend', color: 'var(--series-2)' },
    ...(showPrevious
      ? [{ label: 'Previous revenue', color: 'var(--previous)', dashed: true }]
      : []),
  ]

  return (
    <ChartCard
      title="Spend vs revenue"
      subtitle="Daily, USD. Hover for values. Dashed line is the previous period."
      state={state}
      errorMessage={
        query.isError ? getErrorMessage(query.error) : undefined
      }
      onRetry={() => {
        void query.refetch()
      }}
      legend={<SeriesLegend items={legendItems} />}
      chartHeight={260}
    >
      <ChartContainer
        config={chartConfig}
        className="aspect-auto h-[260px] w-full"
        role="img"
        aria-label={`Line chart of daily revenue and spend, ${rangeLabel}`}
        initialDimension={{ width: 640, height: 260 }}
      >
        <LineChart
          data={chartData}
          margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
        >
          <CartesianGrid
            vertical={false}
            stroke="var(--grid)"
            strokeDasharray="0"
          />
          <XAxis
            dataKey="date"
            ticks={tickDates}
            tickFormatter={formatAxisDate}
            tickLine={false}
            axisLine={false}
            tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
            interval={0}
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
            cursor={{ stroke: 'var(--border-strong)', strokeWidth: 1 }}
            content={
              <ChartTooltipContent
                className="w-[170px] border-none bg-tooltip text-tooltip-text shadow-none [&_.text-muted-foreground]:text-tooltip-label"
                labelFormatter={(_, payload) => {
                  const date = payload?.[0]?.payload?.date as string | undefined
                  return date ? formatTooltipDate(date) : ''
                }}
                formatter={(value, name) => {
                  const amount =
                    typeof value === 'number'
                      ? formatCurrency(value)
                      : String(value)
                  const label =
                    name === 'previousRevenue'
                      ? 'Prev. revenue'
                      : name === 'revenue'
                        ? 'Revenue'
                        : name === 'spend'
                          ? 'Spend'
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
          {showPrevious ? (
            <Line
              type="monotone"
              dataKey="previousRevenue"
              stroke="var(--color-previousRevenue)"
              strokeWidth={2}
              strokeDasharray="4 4"
              dot={false}
              activeDot={{ r: 4, strokeWidth: 2, stroke: 'var(--surface)' }}
              isAnimationActive={false}
            />
          ) : null}
          <Line
            type="monotone"
            dataKey="spend"
            stroke="var(--color-spend)"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, strokeWidth: 2, stroke: 'var(--surface)' }}
            isAnimationActive={false}
          />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="var(--color-revenue)"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, strokeWidth: 2, stroke: 'var(--surface)' }}
            isAnimationActive={false}
          />
        </LineChart>
      </ChartContainer>
    </ChartCard>
  )
}

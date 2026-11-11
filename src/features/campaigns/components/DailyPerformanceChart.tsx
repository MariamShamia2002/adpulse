import { useMemo } from 'react'
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ReferenceLine,
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
import type { CampaignDetailFilters } from '@/features/campaigns/api/campaignsApi'
import { EventChipLabel } from '@/features/campaigns/components/EventChipLabel'
import { MetricSwitcher } from '@/features/campaigns/components/MetricSwitcher'
import { useCampaignEvents } from '@/features/campaigns/hooks/useCampaignEvents'
import { useCampaignTimeseries } from '@/features/campaigns/hooks/useCampaignTimeseries'
import {
  buildDailyPerformanceChartData,
  CURRENT_AREA_OPACITY,
} from '@/features/campaigns/lib/dailyPerformanceChart'
import { CAMPAIGN_METRIC_LABELS } from '@/features/campaigns/lib/campaignDetailLabels'
import { formatMetricByUnit } from '@/features/campaigns/lib/formatMetricByUnit'
import type { CampaignMetric } from '@/features/campaigns/schemas/campaignEnums'
import { ChartCard } from '@/features/overview/components/ChartCard'
import { SeriesLegend } from '@/features/overview/components/SeriesLegend'
import { getFiveTickIndexes } from '@/features/overview/lib/chartTicks'
import { formatAxisDate, formatTooltipDate } from '@/shared/utils/formatters'

type DailyPerformanceChartProps = {
  campaignId: string
  filters: CampaignDetailFilters
  metric: CampaignMetric
  onMetricChange: (metric: CampaignMetric) => void
  rangeLabel: string
}

/** Required by ChartContainer; series color/label come from tokens + tooltip. */
const chartConfig = {
  value: { color: 'var(--series-1)' },
} satisfies ChartConfig

export function DailyPerformanceChart({
  campaignId,
  filters,
  metric,
  onMetricChange,
  rangeLabel,
}: DailyPerformanceChartProps) {
  const timeseriesQuery = useCampaignTimeseries(campaignId, filters, metric)
  const eventsQuery = useCampaignEvents(campaignId, filters)

  const data = timeseriesQuery.data
  const unit = data?.unit ?? 'currency'
  const metricLabel = CAMPAIGN_METRIC_LABELS[metric]
  const compare = filters.compare

  const chartData = useMemo(() => {
    if (!data) return []
    return buildDailyPerformanceChartData(data, compare)
  }, [compare, data])

  const tickDates = useMemo(() => {
    const indexes = getFiveTickIndexes(chartData.length)
    return indexes
      .map((index) => chartData[index]?.date)
      .filter((date): date is string => Boolean(date))
  }, [chartData])

  const events = eventsQuery.data?.items ?? []
  const showPrevious = compare && Boolean(data?.previous?.length)
  const isEmpty = Boolean(data && data.points.length === 0)

  const state = timeseriesQuery.isPending
    ? 'loading'
    : timeseriesQuery.isError
      ? 'error'
      : isEmpty
        ? 'empty'
        : 'ready'

  const legendItems = [
    { label: metricLabel, color: 'var(--series-1)' },
    ...(showPrevious
      ? [{ label: 'Previous period', color: 'var(--previous-band)' }]
      : []),
  ]

  return (
    <ChartCard
      title="Daily performance"
      subtitle="One metric at a time. Grey band is the previous period (±6%)."
      state={state}
      errorMessage={
        timeseriesQuery.isError
          ? getErrorMessage(timeseriesQuery.error)
          : undefined
      }
      onRetry={() => {
        void timeseriesQuery.refetch()
      }}
      actions={
        <MetricSwitcher metric={metric} onMetricChange={onMetricChange} />
      }
      legend={<SeriesLegend items={legendItems} />}
      chartHeight={260}
    >
      <ChartContainer
        config={chartConfig}
        className="aspect-auto h-[260px] w-full"
        role="img"
        aria-label={`Daily ${metricLabel} performance chart, ${rangeLabel}`}
        initialDimension={{ width: 640, height: 260 }}
      >
        <ComposedChart
          data={chartData}
          margin={{ top: 28, right: 12, left: 0, bottom: 0 }}
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
            tickFormatter={(value: number) =>
              formatMetricByUnit(value, unit, true)
            }
            tickLine={false}
            axisLine={false}
            width={52}
            tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
            tickCount={5}
          />
          <ChartTooltip
            cursor={{ stroke: 'var(--border-strong)', strokeWidth: 1 }}
            content={
              <ChartTooltipContent
                className="w-[180px] border-none bg-tooltip text-tooltip-text shadow-none [&_.text-muted-foreground]:text-tooltip-label"
                labelFormatter={(_, payload) => {
                  const date = payload?.[0]?.payload?.date as string | undefined
                  return date ? formatTooltipDate(date) : ''
                }}
                formatter={(value, name) => {
                  if (name === 'previousBase' || name === 'previousBand') {
                    return null
                  }
                  const amount =
                    typeof value === 'number'
                      ? formatMetricByUnit(value, unit, false)
                      : String(value)
                  const label = name === 'previous' ? 'Previous' : metricLabel
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
          {/* Current metric: fill from chart bottom up to the line only. */}
          <Area
            type="monotone"
            dataKey="value"
            stroke="none"
            fill="var(--series-1)"
            fillOpacity={CURRENT_AREA_OPACITY}
            baseValue={0}
            isAnimationActive={false}
            activeDot={false}
            tooltipType="none"
          />
          {showPrevious ? (
            <>
              {/* Stacked ±6% band — spacer is transparent so it does not cover the fill. */}
              <Area
                type="linear"
                dataKey="previousBase"
                stackId="previous-band"
                stroke="none"
                fill="transparent"
                isAnimationActive={false}
                activeDot={false}
                tooltipType="none"
              />
              <Area
                type="linear"
                dataKey="previousBand"
                stackId="previous-band"
                stroke="none"
                fill="var(--previous-band)"
                fillOpacity={1}
                isAnimationActive={false}
                activeDot={false}
                tooltipType="none"
              />
              <Line
                type="linear"
                dataKey="previous"
                stroke="transparent"
                strokeWidth={0}
                dot={false}
                isAnimationActive={false}
                activeDot={false}
              />
            </>
          ) : null}
          <Line
            type="linear"
            dataKey="value"
            stroke="var(--series-1)"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, strokeWidth: 2, stroke: 'var(--surface)' }}
            isAnimationActive={false}
          />
          {events.map((event) => (
            <ReferenceLine
              key={event.id}
              x={event.date}
              stroke="var(--text-muted)"
              strokeDasharray="3 3"
              label={
                <EventChipLabel
                  value={`${event.label} · ${formatAxisDate(event.date)}`}
                />
              }
            />
          ))}
        </ComposedChart>
      </ChartContainer>
    </ChartCard>
  )
}

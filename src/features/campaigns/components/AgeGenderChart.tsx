import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from 'recharts'

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import type { AgeGenderBreakdownRow } from '@/features/campaigns/lib/ageGenderBreakdown'
import { ChartCard } from '@/features/overview/components/ChartCard'
import { SeriesLegend } from '@/features/overview/components/SeriesLegend'
import { formatCount } from '@/shared/utils/formatters'

const chartConfig = {
  women: { label: 'Women', color: 'var(--series-1)' },
  men: { label: 'Men', color: 'var(--series-2)' },
} satisfies ChartConfig

const legendItems = [
  { label: 'Women', color: 'var(--series-1)' },
  { label: 'Men', color: 'var(--series-2)' },
]

type AgeGenderChartProps = {
  data: AgeGenderBreakdownRow[]
  state: 'loading' | 'error' | 'empty' | 'ready'
  rangeLabel: string
  errorMessage?: string
  onRetry?: () => void
}

export function AgeGenderChart({
  data,
  state,
  rangeLabel,
  errorMessage,
  onRetry,
}: AgeGenderChartProps) {
  return (
    <ChartCard
      title="Conversions by age and gender"
      subtitle="Grouped bars for the selected range"
      state={state}
      errorMessage={errorMessage}
      onRetry={onRetry}
      legend={<SeriesLegend items={legendItems} marker="swatch" />}
      chartHeight={240}
    >
      <ChartContainer
        config={chartConfig}
        className="aspect-auto h-[240px] w-full"
        role="img"
        aria-label={`Grouped bar chart of conversions by age and gender, ${rangeLabel}`}
        initialDimension={{ width: 560, height: 240 }}
      >
        <BarChart
          data={data}
          margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
          barGap={2}
          barCategoryGap="28%"
        >
          <CartesianGrid
            vertical={false}
            stroke="var(--grid)"
            strokeDasharray="0"
          />
          <XAxis
            dataKey="age"
            tickLine={false}
            axisLine={false}
            tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
          />
          <YAxis
            tickFormatter={(value: number) => formatCount(value)}
            tickLine={false}
            axisLine={false}
            width={40}
            tickCount={5}
            tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
          />
          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent
                className="w-[170px] border-none bg-tooltip text-tooltip-text shadow-none [&_.text-muted-foreground]:text-tooltip-label"
                labelFormatter={(_, payload) => {
                  const age = payload?.[0]?.payload?.age as string | undefined
                  return age ?? ''
                }}
                formatter={(value, name) => {
                  const count =
                    typeof value === 'number' ? formatCount(value) : String(value)
                  const label =
                    name === 'women' ? 'Women' : name === 'men' ? 'Men' : String(name)
                  return (
                    <div className="flex w-full items-center justify-between gap-4">
                      <span className="text-tooltip-label">{label}</span>
                      <span className="font-medium tabular-nums text-tooltip-text">
                        {count}
                      </span>
                    </div>
                  )
                }}
              />
            }
          />
          <Bar
            dataKey="women"
            fill="var(--color-women)"
            radius={[4, 4, 0, 0]}
            isAnimationActive={false}
          />
          <Bar
            dataKey="men"
            fill="var(--color-men)"
            radius={[4, 4, 0, 0]}
            isAnimationActive={false}
          />
        </BarChart>
      </ChartContainer>
    </ChartCard>
  )
}

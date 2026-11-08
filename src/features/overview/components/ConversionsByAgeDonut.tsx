import { useMemo, useState } from 'react'
import { Cell, Pie, PieChart } from 'recharts'

import { getErrorMessage } from '@/api/errors'
import { ChartContainer, type ChartConfig } from '@/components/ui/chart'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { OverviewFilters } from '@/features/overview/api/overviewApi'
import { ChartCard } from '@/features/overview/components/ChartCard'
import { ConversionsByAgeLegend } from '@/features/overview/components/ConversionsByAgeLegend'
import { ConversionsByAgeTable } from '@/features/overview/components/ConversionsByAgeTable'
import { ConversionsByAgeTooltip } from '@/features/overview/components/ConversionsByAgeTooltip'
import { useOverviewConversionsByAge } from '@/features/overview/hooks/useOverviewConversionsByAge'
import { AGE_SERIES_COLORS } from '@/features/overview/lib/ageSeriesColors'
import { formatCount, formatPercentWhole } from '@/shared/utils/formatters'

type ConversionsByAgeDonutProps = {
  filters: Pick<OverviewFilters, 'from' | 'to'>
  rangeLabel: string
}

const chartConfig = {
  conversions: { label: 'Conversions' },
} satisfies ChartConfig

export function ConversionsByAgeDonut({
  filters,
  rangeLabel,
}: ConversionsByAgeDonutProps) {
  const [view, setView] = useState('chart')
  const query = useOverviewConversionsByAge(filters)
  const data = query.data

  const rows = data?.rows ?? []
  const isEmpty = Boolean(data && rows.length === 0)
  const state = query.isPending
    ? 'loading'
    : query.isError
      ? 'error'
      : isEmpty
        ? 'empty'
        : 'ready'

  const largest = useMemo(() => {
    const list = data?.rows
    if (!list || list.length === 0) return null
    return list.reduce((best, row) => (row.share > best.share ? row : best))
  }, [data?.rows])

  return (
    <Tabs value={view} onValueChange={setView}>
      <ChartCard
        title="Conversions by age"
        subtitle={
          data ? `Share of ${formatCount(data.total)} conversions in range` : undefined
        }
        state={state}
        errorMessage={
          query.isError ? getErrorMessage(query.error) : undefined
        }
        onRetry={() => {
          void query.refetch()
        }}
        chartHeight={240}
        actions={
          <TabsList aria-label="Conversions by age view">
            <TabsTrigger value="chart">Chart</TabsTrigger>
            <TabsTrigger value="table">Table</TabsTrigger>
          </TabsList>
        }
      >
        <TabsContent value="chart" className="outline-none">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:justify-center sm:gap-6">
            <div className="relative size-[200px] shrink-0">
              <ChartContainer
                config={chartConfig}
                className="aspect-square size-[200px]"
                role="img"
                aria-label={`Donut chart of conversions by age group, ${rangeLabel}`}
                initialDimension={{ width: 200, height: 200 }}
              >
                <PieChart>
                  <ConversionsByAgeTooltip />
                  <Pie
                    data={rows}
                    dataKey="conversions"
                    nameKey="age"
                    innerRadius={72}
                    outerRadius={98}
                    paddingAngle={1}
                    stroke="var(--surface)"
                    strokeWidth={2}
                    isAnimationActive={false}
                  >
                    {rows.map((row, index) => (
                      <Cell
                        key={row.age}
                        fill={AGE_SERIES_COLORS[index] ?? 'var(--series-1)'}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ChartContainer>
              {largest ? (
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
                  <p className="text-[11px] font-medium text-text-muted">{largest.age}</p>
                  <p className="text-lg font-semibold tabular-nums text-text">
                    {formatPercentWhole(largest.share)}
                  </p>
                </div>
              ) : null}
            </div>
            <ConversionsByAgeLegend rows={rows} />
          </div>
        </TabsContent>

        <TabsContent value="table" className="outline-none">
          <ConversionsByAgeTable rows={rows} />
        </TabsContent>
      </ChartCard>
    </Tabs>
  )
}

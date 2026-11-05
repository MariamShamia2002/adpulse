import { useMemo } from 'react'
import { Link } from 'react-router'
import { Bar, BarChart, Cell, LabelList, ReferenceLine, XAxis, YAxis } from 'recharts'
import type { BarRectangleItem } from 'recharts/types/cartesian/Bar'

import { ChartContainer, type ChartConfig } from '@/components/ui/chart'
import { ChartCard } from '@/features/overview/components/ChartCard'
import { RoasCampaignBarShape } from '@/features/overview/components/RoasCampaignBarShape'
import {
  ROAS_NAME_COLUMN_WIDTH,
  RoasCampaignNameTick,
} from '@/features/overview/components/RoasCampaignNameTick'
import { RoasCampaignTooltip } from '@/features/overview/components/RoasCampaignTooltip'
import { RoasTargetLabel } from '@/features/overview/components/RoasTargetLabel'
import { buildCampaignFilterSearch } from '@/features/overview/lib/campaignNav'
import type { CampaignListItem } from '@/features/overview/schemas/campaignsList'
import { formatRatio } from '@/shared/utils/formatters'

const ROAS_TARGET = 3

type RoasByCampaignChartProps = {
  data: CampaignListItem[] | undefined
  from: string
  to: string
  compare: boolean
  isPending: boolean
  isError: boolean
  errorMessage?: string
  onRetry: () => void
  rangeLabel: string
}

type ChartRow = CampaignListItem & { fill: string }

const chartConfig = {
  roas: { label: 'ROAS', color: 'var(--series-1)' },
} satisfies ChartConfig

export function RoasByCampaignChart({
  data,
  from,
  to,
  compare,
  isPending,
  isError,
  errorMessage,
  onRetry,
  rangeLabel,
}: RoasByCampaignChartProps) {
  const search = buildCampaignFilterSearch(from, to, compare)

  const chartData = useMemo<ChartRow[]>(() => {
    if (!data) return []
    return data.map((item) => ({
      ...item,
      fill: item.roas >= ROAS_TARGET ? 'var(--series-1)' : 'var(--series-1-soft)',
    }))
  }, [data])

  const xMax =
    chartData.length === 0
      ? ROAS_TARGET * 1.1
      : Math.max(...chartData.map((row) => row.roas)) * 1.1

  const isEmpty = Boolean(data && data.length === 0)
  const state = isPending ? 'loading' : isError ? 'error' : isEmpty ? 'empty' : 'ready'

  return (
    <ChartCard
      title="ROAS by campaign"
      subtitle="Top 6 by ROAS"
      state={state}
      errorMessage={errorMessage}
      onRetry={onRetry}
      chartHeight={240}
      actions={
        <Link
          to={{ pathname: '/', search, hash: 'campaigns' }}
          className="text-[13px] font-medium text-series-1 outline-none hover:underline focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-[var(--series-1)]"
        >
          View all
        </Link>
      }
    >
      <ChartContainer
        config={chartConfig}
        className="aspect-auto h-[240px] w-full"
        role="img"
        aria-label={`Horizontal bar chart of top campaigns by ROAS, ${rangeLabel}`}
        initialDimension={{ width: 640, height: 240 }}
      >
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 20, right: 48, left: 0, bottom: 4 }}
          barCategoryGap={2}
        >
          <XAxis type="number" domain={[0, xMax]} hide />
          <YAxis
            type="category"
            dataKey="name"
            width={ROAS_NAME_COLUMN_WIDTH}
            tickLine={false}
            axisLine={false}
            reversed
            interval={0}
            tick={(props) => (
              <RoasCampaignNameTick {...props} rows={chartData} search={search} />
            )}
          />
          <RoasCampaignTooltip />
          <ReferenceLine
            x={ROAS_TARGET}
            stroke="var(--text-muted)"
            strokeDasharray="4 4"
            label={<RoasTargetLabel />}
          />
          <Bar
            dataKey="roas"
            radius={[0, 4, 4, 0]}
            isAnimationActive={false}
            shape={(props) => (
              <RoasCampaignBarShape {...(props as BarRectangleItem)} search={search} />
            )}
          >
            {chartData.map((row) => (
              <Cell key={row.id} fill={row.fill} />
            ))}
            <LabelList
              dataKey="roas"
              position="right"
              formatter={(value) => (typeof value === 'number' ? formatRatio(value) : '')}
              className="fill-text text-[11px] font-semibold"
            />
          </Bar>
        </BarChart>
      </ChartContainer>
    </ChartCard>
  )
}

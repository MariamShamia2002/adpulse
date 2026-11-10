import {
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import type { CampaignListItem } from '@/features/overview/schemas/campaignsList'
import { formatCurrency, formatRatio } from '@/shared/utils/formatters'

function TooltipRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-tooltip-label">{label}</span>
      <span className="font-medium tabular-nums text-tooltip-text">{value}</span>
    </div>
  )
}

export function RoasCampaignTooltip() {
  return (
    <ChartTooltip
      cursor={false}
      content={
        <ChartTooltipContent
          className="w-[200px] border-none bg-tooltip text-tooltip-text shadow-none [&_.text-muted-foreground]:text-tooltip-label"
          labelFormatter={(_, payload) =>
            (payload?.[0]?.payload?.name as string | undefined) ?? ''
          }
          formatter={(_value, _name, item) => {
            const row = item?.payload as CampaignListItem | undefined
            if (!row) return null
            return (
              <div className="flex w-full flex-col gap-1">
                <TooltipRow label="ROAS" value={formatRatio(row.roas)} />
                <TooltipRow label="Spend" value={formatCurrency(row.spend)} />
                <TooltipRow label="Revenue" value={formatCurrency(row.revenue)} />
              </div>
            )
          }}
        />
      }
    />
  )
}

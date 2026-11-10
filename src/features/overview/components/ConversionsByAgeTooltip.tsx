import {
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { formatCount, formatPercent } from '@/shared/utils/formatters'

export function ConversionsByAgeTooltip() {
  return (
    <ChartTooltip
      content={
        <ChartTooltipContent
          className="w-[180px] border-none bg-tooltip text-tooltip-text shadow-none [&_.text-muted-foreground]:text-tooltip-label"
          nameKey="age"
          labelFormatter={(_, payload) =>
            (payload?.[0]?.payload?.age as string | undefined) ?? ''
          }
          formatter={(value, _name, item) => {
            const share = item?.payload?.share as number | undefined
            return (
              <div className="flex w-full flex-col gap-1">
                <div className="flex justify-between gap-4">
                  <span className="text-tooltip-label">Conversions</span>
                  <span className="font-medium tabular-nums">
                    {typeof value === 'number' ? formatCount(value) : String(value)}
                  </span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-tooltip-label">Share</span>
                  <span className="font-medium tabular-nums">
                    {share != null ? formatPercent(share) : '—'}
                  </span>
                </div>
              </div>
            )
          }}
        />
      }
    />
  )
}

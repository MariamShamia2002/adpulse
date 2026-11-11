import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { CAMPAIGN_METRIC_OPTIONS } from '@/features/campaigns/lib/campaignDetailLabels'
import type { CampaignMetric } from '@/features/campaigns/schemas/campaignEnums'
import { cn } from '@/lib/utils'

type MetricSwitcherProps = {
  metric: CampaignMetric
  onMetricChange: (metric: CampaignMetric) => void
}

export function MetricSwitcher({
  metric,
  onMetricChange,
}: MetricSwitcherProps) {
  return (
    <ToggleGroup
      value={[metric]}
      onValueChange={(values) => {
        const next = values[0] as CampaignMetric | undefined
        if (next) onMetricChange(next)
      }}
      variant="outline"
      spacing={0}
      className="h-9 border border-border-strong bg-surface"
      aria-label="Daily performance metric"
    >
      {CAMPAIGN_METRIC_OPTIONS.map(({ value, label }) => (
        <ToggleGroupItem
          key={value}
          value={value}
          className={cn(
            'h-9 rounded-none px-3 text-[13px] font-medium',
            'data-[state=on]:bg-text data-[state=on]:text-white',
          )}
        >
          {label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
}

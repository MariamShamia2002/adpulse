import { Switch } from '@/components/ui/switch'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import type { OverviewFilters } from '@/features/overview/api/overviewApi'
import { DateRangePicker } from '@/features/overview/components/DateRangePicker'
import { PLATFORM_LABELS } from '@/features/overview/lib/campaignLabels'
import type { DatePreset } from '@/features/overview/lib/dateRange'
import type { CampaignPlatform } from '@/features/overview/schemas/campaignsList'
import { cn } from '@/lib/utils'

type FilterBarProps = {
  filters: OverviewFilters
  preset: DatePreset
  onPresetChange: (preset: DatePreset) => void
  onPlatformChange: (platform: OverviewFilters['platform']) => void
  onCompareChange: (compare: boolean) => void
}

const PLATFORM_ORDER: CampaignPlatform[] = ['meta', 'google', 'tiktok']

const PLATFORMS: { value: OverviewFilters['platform']; label: string }[] = [
  { value: 'all', label: 'All' },
  ...PLATFORM_ORDER.map((value) => ({
    value,
    label: PLATFORM_LABELS[value],
  })),
]

export function FilterBar({
  filters,
  preset,
  onPresetChange,
  onPlatformChange,
  onCompareChange,
}: FilterBarProps) {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-center lg:justify-end">
      <DateRangePicker preset={preset} onPresetChange={onPresetChange} />

      <ToggleGroup
        value={[filters.platform]}
        onValueChange={(values) => {
          const next = values[0] as OverviewFilters['platform'] | undefined
          if (next) onPlatformChange(next)
        }}
        variant="outline"
        spacing={0}
        className="h-9 border border-border-strong bg-surface"
        aria-label="Platform filter"
      >
        {PLATFORMS.map(({ value, label }) => (
          <ToggleGroupItem
            key={value}
            value={value}
            className={cn(
              'h-9 rounded-none px-3 text-[13px] font-medium',
              'data-[pressed]:bg-text data-[pressed]:text-white',
              'data-[state=on]:bg-text data-[state=on]:text-white',
            )}
          >
            {label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>

      <div className="flex h-9 items-center gap-2 rounded-lg border border-border bg-surface px-2.5 text-[13px] font-medium text-text">
        <Switch
          checked={filters.compare}
          onCheckedChange={onCompareChange}
          aria-labelledby="compare-toggle-label"
        />
        <span id="compare-toggle-label">Compare</span>
      </div>
    </div>
  )
}

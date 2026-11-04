import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import type { DatePreset } from '@/features/overview/lib/dateRange'
import { cn } from '@/lib/utils'

type DateRangePickerProps = {
  preset: DatePreset
  onPresetChange: (preset: DatePreset) => void
}

const PRESETS: DatePreset[] = ['7d', '14d', '28d']

export function DateRangePicker({
  preset,
  onPresetChange,
}: DateRangePickerProps) {
  return (
    <ToggleGroup
      value={[preset]}
      onValueChange={(values) => {
        const next = values[0] as DatePreset | undefined
        if (next) onPresetChange(next)
      }}
      variant="outline"
      spacing={0}
      className="h-9 border border-border-strong bg-surface"
      aria-label="Date range preset"
    >
      {PRESETS.map((value) => (
        <ToggleGroupItem
          key={value}
          value={value}
          className={cn(
            'h-9 min-w-10 rounded-none px-3 text-[13px] font-medium',
            'data-[pressed]:bg-text data-[pressed]:text-white',
            'data-[state=on]:bg-text data-[state=on]:text-white',
          )}
        >
          {value}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
}

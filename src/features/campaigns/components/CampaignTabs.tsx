import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { CampaignTab } from '@/features/campaigns/schemas/campaignEnums'
import { campaignTabSchema } from '@/features/campaigns/schemas/campaignEnums'
import { cn } from '@/lib/utils'

const TAB_OPTIONS: { value: CampaignTab; label: string }[] = [
  { value: 'performance', label: 'Performance' },
  { value: 'adsets', label: 'Ad sets' },
  { value: 'audience', label: 'Audience' },
  { value: 'creatives', label: 'Creatives' },
]

type CampaignTabsProps = {
  tab: CampaignTab
  onTabChange: (tab: CampaignTab) => void
  className?: string
}

export function CampaignTabs({
  tab,
  onTabChange,
  className,
}: CampaignTabsProps) {
  function handleValueChange(nextValue: string | number | null) {
    const parsed = campaignTabSchema.safeParse(nextValue)
    if (parsed.success) onTabChange(parsed.data)
  }

  return (
    <Tabs value={tab} onValueChange={handleValueChange} className={className}>
      <TabsList
        variant="line"
        aria-label="Campaign detail sections"
        className={cn(
          // Shared baseline; active tab uses the same border edge via -mb-px + border-b-2.
          'h-10 w-full justify-start gap-0 rounded-none border-b border-border bg-transparent p-0',
        )}
      >
        {TAB_OPTIONS.map(({ value, label }) => (
          <TabsTrigger
            key={value}
            value={value}
            className={cn(
              'h-10 flex-none rounded-none bg-transparent px-4 shadow-none',
              'text-[13px] font-medium text-text-secondary',
              'hover:bg-transparent hover:text-text',
              'data-active:bg-transparent data-active:text-text data-active:shadow-none',
              // Active mark is a border on the shared baseline (not the default after: line).
              '-mb-px border-0 border-b-2 border-transparent data-active:border-series-1',
              // Disable shadcn line-variant after: indicator (defaults to black / offset).
              'after:hidden!',
            )}
          >
            {label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  )
}

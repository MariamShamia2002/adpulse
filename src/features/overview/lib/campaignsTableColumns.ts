import type { CampaignsSortKey } from '@/features/overview/hooks/useCampaignsTableParams'

export type CampaignsSortableColumn = {
  key: CampaignsSortKey
  label: string
  align?: 'left' | 'right'
}

export const CAMPAIGNS_TABLE_COLUMNS: CampaignsSortableColumn[] = [
  { key: 'name', label: 'Campaign' },
  { key: 'platform', label: 'Platform' },
  { key: 'status', label: 'Status' },
  { key: 'spend', label: 'Spend', align: 'right' },
  { key: 'revenue', label: 'Revenue', align: 'right' },
  { key: 'roas', label: 'ROAS', align: 'right' },
  { key: 'conversions', label: 'Conv.', align: 'right' },
  { key: 'cpa', label: 'CPA', align: 'right' },
]

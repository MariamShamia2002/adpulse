import type { CampaignDetailFilters } from '@/features/campaigns/api/campaignsApi'
import { AdSetsTable } from '@/features/campaigns/components/AdSetsTable'

type AdSetsSectionProps = {
  campaignId: string
  filters: Pick<CampaignDetailFilters, 'from' | 'to'>
}

/** Shared Ad sets block — used on Performance and Ad sets tabs. */
export function AdSetsSection({ campaignId, filters }: AdSetsSectionProps) {
  return <AdSetsTable campaignId={campaignId} filters={filters} />
}

import { format, parseISO } from 'date-fns'

import type { CampaignDetail } from '@/features/campaigns/schemas/campaignDetail'
import {
  PLATFORM_LABELS,
  STATUS_LABELS,
  statusDotClass,
} from '@/features/overview/lib/campaignLabels'

export { PLATFORM_LABELS, STATUS_LABELS, statusDotClass }

/** "leads" → "Leads objective" */
export function formatObjectiveLabel(objective: string): string {
  if (!objective) return 'Objective'
  const label = objective.charAt(0).toUpperCase() + objective.slice(1)
  return `${label} objective`
}

export function formatStartedLabel(startDate: string): string {
  return `started ${format(parseISO(startDate), 'MMM d')}`
}

export function formatCampaignMetaLine(campaign: CampaignDetail): string {
  const parts = [
    PLATFORM_LABELS[campaign.platform],
    formatObjectiveLabel(campaign.objective),
    `${campaign.adSetCount} ad set${campaign.adSetCount === 1 ? '' : 's'}`,
    formatStartedLabel(campaign.startDate),
  ]
  return parts.join(' · ')
}

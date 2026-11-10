import type {
  CampaignPlatform,
  CampaignStatus,
} from '@/features/overview/schemas/campaignsList'

export const PLATFORM_LABELS: Record<CampaignPlatform, string> = {
  google: 'Google',
  meta: 'Meta',
  tiktok: 'TikTok',
}

export const STATUS_LABELS: Record<CampaignStatus, string> = {
  active: 'Active',
  learning: 'Learning',
  paused: 'Paused',
  ended: 'Ended',
}

export function statusDotClass(status: CampaignStatus): string {
  switch (status) {
    case 'active':
      return 'bg-status-good'
    case 'learning':
      return 'bg-status-warning'
    case 'paused':
    case 'ended':
      return 'bg-status-paused'
  }
}

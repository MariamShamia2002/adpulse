import { Link } from 'react-router'

import type { CampaignDetail } from '@/features/campaigns/schemas/campaignDetail'
import {
  formatCampaignMetaLine,
  STATUS_LABELS,
  statusDotClass,
} from '@/features/campaigns/lib/campaignDetailLabels'
import { campaignsSectionTo } from '@/features/overview/lib/campaignNav'
import { cn } from '@/lib/utils'

type CampaignHeaderProps = {
  campaign: CampaignDetail
  search: string
}

export function CampaignHeader({ campaign, search }: CampaignHeaderProps) {
  return (
    <header className="space-y-3">
      <nav aria-label="Breadcrumb" className="text-[12px] text-text-secondary">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li>
            <Link to="/" className="hover:text-text hover:underline">
              Overview
            </Link>
          </li>
          <li aria-hidden className="text-text-muted">
            /
          </li>
          <li>
            <Link
              to={campaignsSectionTo(search)}
              className="hover:text-text hover:underline"
            >
              Campaigns
            </Link>
          </li>
          <li aria-hidden className="text-text-muted">
            /
          </li>
          <li className="font-medium text-text" aria-current="page">
            {campaign.name}
          </li>
        </ol>
      </nav>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 space-y-2">
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-[-0.01em] text-text">
              {campaign.name}
            </h1>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-2.5 py-1 text-[12px] font-medium text-text">
              <span
                aria-hidden
                className={cn(
                  'size-2 shrink-0 rounded-full',
                  statusDotClass(campaign.status),
                )}
              />
              {STATUS_LABELS[campaign.status]}
            </span>
          </div>
          <p className="text-[13px] text-text-secondary">
            {formatCampaignMetaLine(campaign)}
          </p>
        </div>
      </div>
    </header>
  )
}

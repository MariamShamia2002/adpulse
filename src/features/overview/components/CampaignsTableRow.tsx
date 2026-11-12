import { TableCell, TableRow } from '@/components/ui/table'
import { CampaignSparkline } from '@/features/overview/components/CampaignSparkline'
import {
  PLATFORM_LABELS,
  STATUS_LABELS,
  statusDotClass,
} from '@/features/overview/lib/campaignLabels'
import type { CampaignListItem } from '@/features/overview/schemas/campaignsList'
import { cn } from '@/lib/utils'
import {
  formatCount,
  formatCurrency,
  formatRatio,
} from '@/shared/utils/formatters'

type CampaignsTableRowProps = {
  campaign: CampaignListItem
  onOpen: (id: string) => void
}

export function CampaignsTableRow({ campaign, onOpen }: CampaignsTableRowProps) {
  return (
    <TableRow
      tabIndex={0}
      role="link"
      aria-label={`Open campaign ${campaign.name}`}
      className="h-12 cursor-pointer border-border outline-none focus-visible:bg-surface-muted focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--series-1)]"
      onClick={() => onOpen(campaign.id)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onOpen(campaign.id)
        }
      }}
    >
      <TableCell className="px-3 text-[13px] font-medium text-text">
        {campaign.name}
      </TableCell>
      <TableCell className="px-3 text-[13px] text-text">
        {PLATFORM_LABELS[campaign.platform]}
      </TableCell>
      <TableCell className="px-3 text-[13px] text-text">
        <span className="inline-flex items-center gap-1.5">
          <span
            aria-hidden
            className={cn(
              'size-2 shrink-0 rounded-full',
              statusDotClass(campaign.status),
            )}
          />
          {STATUS_LABELS[campaign.status]}
        </span>
      </TableCell>
      <TableCell className="px-3 text-right text-[13px] tabular-nums text-text">
        {formatCurrency(campaign.spend)}
      </TableCell>
      <TableCell className="px-3 text-right text-[13px] tabular-nums text-text">
        {formatCurrency(campaign.revenue)}
      </TableCell>
      <TableCell className="px-3 text-right text-[13px] font-semibold tabular-nums text-text">
        {formatRatio(campaign.roas)}
      </TableCell>
      <TableCell className="px-3 text-right text-[13px] tabular-nums text-text">
        {formatCount(campaign.conversions)}
      </TableCell>
      <TableCell className="px-3 text-right text-[13px] tabular-nums text-text">
        {formatCurrency(campaign.cpa, true)}
      </TableCell>
      <TableCell className="px-3">
        <div className="flex justify-end">
          <CampaignSparkline values={campaign.trend} />
        </div>
      </TableCell>
    </TableRow>
  )
}

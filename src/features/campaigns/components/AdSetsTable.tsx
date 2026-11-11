import { getErrorMessage } from '@/api/errors'
import { Progress } from '@/components/ui/progress'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { CampaignDetailFilters } from '@/features/campaigns/api/campaignsApi'
import { useCampaignAdSets } from '@/features/campaigns/hooks/useCampaignAdSets'
import type { CampaignAdSet } from '@/features/campaigns/schemas/campaignAdSets'
import { CardSkeleton } from '@/shared/components/CardSkeleton'
import { EmptyState } from '@/shared/components/EmptyState'
import { ErrorState } from '@/shared/components/ErrorState'
import {
  formatCount,
  formatCurrency,
  formatPercentWhole,
  formatRatio,
} from '@/shared/utils/formatters'

type AdSetsTableProps = {
  campaignId: string
  filters: Pick<CampaignDetailFilters, 'from' | 'to'>
}

function formatAudienceType(audienceType: string): string {
  if (!audienceType) return '—'
  return audienceType.charAt(0).toUpperCase() + audienceType.slice(1)
}

function SpendShareCell({ share }: { share: number }) {
  const clamped = Math.min(100, Math.max(0, share))

  return (
    <div className="flex min-w-[160px] items-center gap-2.5">
      <Progress
        value={clamped}
        aria-label={`Spend share ${formatPercentWhole(share)}`}
        className="min-w-0 flex-1 gap-0 [&_[data-slot=progress-track]]:h-1.5 [&_[data-slot=progress-track]]:bg-surface-muted [&_[data-slot=progress-indicator]]:bg-series-1"
      />
      <span className="w-12 shrink-0 text-right text-[13px] tabular-nums text-text">
        {formatPercentWhole(share)}
      </span>
    </div>
  )
}

function AdSetRow({ adSet }: { adSet: CampaignAdSet }) {
  return (
    <TableRow className="h-12 border-border">
      <TableCell className="px-3 text-[13px] font-medium text-text">
        {adSet.name}
      </TableCell>
      <TableCell className="px-3 text-[13px] text-text">
        {formatAudienceType(adSet.audienceType)}
      </TableCell>
      <TableCell className="px-3">
        <SpendShareCell share={adSet.share} />
      </TableCell>
      <TableCell className="px-3 text-right text-[13px] tabular-nums text-text">
        {formatCurrency(adSet.spend)}
      </TableCell>
      <TableCell className="px-3 text-right text-[13px] font-semibold tabular-nums text-text">
        {formatRatio(adSet.roas)}
      </TableCell>
      <TableCell className="px-3 text-right text-[13px] tabular-nums text-text">
        {formatCurrency(adSet.cpa, true)}
      </TableCell>
      <TableCell className="px-3 text-right text-[13px] tabular-nums text-text">
        {formatCount(adSet.conversions)}
      </TableCell>
    </TableRow>
  )
}

export function AdSetsTable({ campaignId, filters }: AdSetsTableProps) {
  const query = useCampaignAdSets(campaignId, filters)
  const items = query.data?.items ?? []
  const isEmpty = Boolean(query.data && items.length === 0)

  return (
    <section
      aria-label="Ad sets"
      className="flex flex-col gap-4 rounded-[12px] border border-border bg-surface p-5"
    >
      <div className="space-y-1">
        <h2 className="text-[15px] font-semibold text-text">Ad sets</h2>
        <p className="text-[12px] font-medium text-text-secondary">
          Spend share and efficiency inside this campaign for the selected range
        </p>
      </div>

      {query.isPending ? <CardSkeleton variant="table" className="py-6" /> : null}

      {query.isError ? (
        <ErrorState
          message={getErrorMessage(query.error)}
          onRetry={() => {
            void query.refetch()
          }}
        />
      ) : null}

      {query.isSuccess && isEmpty ? (
        <EmptyState title="No ad sets for this range." className="py-10" />
      ) : null}

      {query.isSuccess && !isEmpty ? (
        <div className="overflow-x-auto">
          <Table className="min-w-[520px]">
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="px-3 text-[12px] font-medium text-text-secondary">
                  Ad Set
                </TableHead>
                <TableHead className="px-3 text-[12px] font-medium text-text-secondary">
                  Audience
                </TableHead>
                <TableHead className="px-3 text-[12px] font-medium text-text-secondary">
                  Spend Share
                </TableHead>
                <TableHead className="px-3 text-right text-[12px] font-medium text-text-secondary">
                  Spend
                </TableHead>
                <TableHead className="px-3 text-right text-[12px] font-medium text-text-secondary">
                  ROAS
                </TableHead>
                <TableHead className="px-3 text-right text-[12px] font-medium text-text-secondary">
                  CPA
                </TableHead>
                <TableHead className="px-3 text-right text-[12px] font-medium text-text-secondary">
                  Conversions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((adSet) => (
                <AdSetRow key={adSet.id} adSet={adSet} />
              ))}
            </TableBody>
          </Table>
        </div>
      ) : null}
    </section>
  )
}

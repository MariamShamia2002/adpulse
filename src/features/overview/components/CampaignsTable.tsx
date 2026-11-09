import { Search } from 'lucide-react'
import { useNavigate } from 'react-router'

import { getErrorMessage } from '@/api/errors'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { OverviewFilters } from '@/features/overview/api/overviewApi'
import { CampaignSparkline } from '@/features/overview/components/CampaignSparkline'
import {
  useCampaignsTableParams,
  type CampaignsSortKey,
} from '@/features/overview/hooks/useCampaignsTableParams'
import { useOverviewCampaigns } from '@/features/overview/hooks/useOverviewCampaigns'
import {
  PLATFORM_LABELS,
  STATUS_LABELS,
  statusDotClass,
} from '@/features/overview/lib/campaignLabels'
import {
  buildCampaignFilterSearch,
  campaignDetailTo,
} from '@/features/overview/lib/campaignNav'
import { cn } from '@/lib/utils'
import { CardSkeleton } from '@/shared/components/CardSkeleton'
import { EmptyState } from '@/shared/components/EmptyState'
import { ErrorState } from '@/shared/components/ErrorState'
import {
  formatCount,
  formatCurrency,
  formatRatio,
} from '@/shared/utils/formatters'

type CampaignsTableProps = {
  filters: OverviewFilters
}

type SortableColumn = {
  key: CampaignsSortKey
  label: string
  align?: 'left' | 'right'
}

const COLUMNS: SortableColumn[] = [
  { key: 'name', label: 'Campaign' },
  { key: 'platform', label: 'Platform' },
  { key: 'status', label: 'Status' },
  { key: 'spend', label: 'Spend', align: 'right' },
  { key: 'revenue', label: 'Revenue', align: 'right' },
  { key: 'roas', label: 'ROAS', align: 'right' },
  { key: 'conversions', label: 'Conv.', align: 'right' },
  { key: 'cpa', label: 'CPA', align: 'right' },
]

export function CampaignsTable({ filters }: CampaignsTableProps) {
  const navigate = useNavigate()
  const {
    params,
    sort,
    dir,
    page,
    pageSize,
    searchInput,
    setSearchInput,
    setSort,
    setPage,
  } = useCampaignsTableParams()

  const query = useOverviewCampaigns({
    from: filters.from,
    to: filters.to,
    platform: filters.platform,
    ...params,
  })

  const data = query.data
  const items = data?.items ?? []
  const total = data?.total ?? 0
  const isEmpty = Boolean(data && items.length === 0)

  const rangeStart = total === 0 ? 0 : (page - 1) * pageSize + 1
  const rangeEnd = Math.min(page * pageSize, total)
  const canPrev = page > 1
  const canNext = rangeEnd < total

  const detailSearch = buildCampaignFilterSearch(
    filters.from,
    filters.to,
    filters.compare,
  )

  function openCampaign(id: string) {
    void navigate(campaignDetailTo(id, detailSearch))
  }

  return (
    <section
      id="campaigns"
      className="flex flex-col gap-4 rounded-[12px] border border-border bg-surface p-5"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <h2 className="text-[15px] font-semibold text-text">Campaigns</h2>
          <p className="text-[12px] font-medium text-text-secondary">
            Click a column to sort, a row to open the drill-down
          </p>
        </div>

        <div className="relative w-full sm:max-w-[240px]">
          <Search
            className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-text-muted"
            aria-hidden
          />
          <Input
            type="search"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Search campaigns"
            aria-label="Search campaigns"
            className="h-9 border-border bg-surface pl-8 text-[13px]"
          />
        </div>
      </div>

      {query.isPending ? (
        <CardSkeleton variant="table" className="py-6" />
      ) : null}

      {query.isError ? (
        <ErrorState
          message={getErrorMessage(query.error)}
          onRetry={() => {
            void query.refetch()
          }}
        />
      ) : null}

      {query.isSuccess && isEmpty ? (
        <EmptyState title="No campaigns match this filter." className="py-10" />
      ) : null}

      {query.isSuccess && !isEmpty ? (
        <>
          <div className="overflow-x-auto">
            <Table className="min-w-[820px]">
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  {COLUMNS.map((column) => {
                    const isActive = sort === column.key
                    const ariaSort = isActive
                      ? dir === 'asc'
                        ? 'ascending'
                        : 'descending'
                      : 'none'

                    return (
                      <TableHead
                        key={column.key}
                        aria-sort={ariaSort}
                        className={cn(
                          'h-11 px-3 text-[11px] font-semibold tracking-wide text-text-muted uppercase',
                          column.align === 'right' && 'text-right',
                        )}
                      >
                        <button
                          type="button"
                          onClick={() => setSort(column.key)}
                          className={cn(
                            'inline-flex items-center gap-1 rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-[var(--series-1)]',
                            column.align === 'right' && 'w-full justify-end',
                          )}
                        >
                          {column.label}
                          {isActive ? (
                            <span aria-hidden>{dir === 'asc' ? '▴' : '▾'}</span>
                          ) : null}
                        </button>
                      </TableHead>
                    )
                  })}
                  <TableHead className="h-11 px-3 text-right text-[11px] font-semibold tracking-wide text-text-muted uppercase">
                    Trend
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {items.map((campaign) => (
                  <TableRow
                    key={campaign.id}
                    tabIndex={0}
                    role="link"
                    aria-label={`Open campaign ${campaign.name}`}
                    className="h-12 cursor-pointer border-border outline-none focus-visible:bg-surface-muted focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--series-1)]"
                    onClick={() => openCampaign(campaign.id)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault()
                        openCampaign(campaign.id)
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
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[12px] text-text-secondary">
              Showing {rangeStart}–{rangeEnd} of {formatCount(total)} campaigns
            </p>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={!canPrev}
                onClick={() => setPage(page - 1)}
              >
                Previous
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={!canNext}
                onClick={() => setPage(page + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </>
      ) : null}
    </section>
  )
}

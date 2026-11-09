import { Search } from 'lucide-react'
import { useNavigate } from 'react-router'

import { getErrorMessage } from '@/api/errors'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody } from '@/components/ui/table'
import type { OverviewFilters } from '@/features/overview/api/overviewApi'
import { CampaignsTableHeader } from '@/features/overview/components/CampaignsTableHeader'
import { CampaignsTableRow } from '@/features/overview/components/CampaignsTableRow'
import { useCampaignsTableParams } from '@/features/overview/hooks/useCampaignsTableParams'
import { useOverviewCampaigns } from '@/features/overview/hooks/useOverviewCampaigns'
import {
  buildCampaignFilterSearch,
  CAMPAIGNS_SECTION_ID,
  campaignDetailTo,
} from '@/features/overview/lib/campaignNav'
import { cn } from '@/lib/utils'
import { CardSkeleton } from '@/shared/components/CardSkeleton'
import { EmptyState } from '@/shared/components/EmptyState'
import { ErrorState } from '@/shared/components/ErrorState'
import { formatCount } from '@/shared/utils/formatters'

type CampaignsTableProps = {
  filters: OverviewFilters
}

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

  const items = query.data?.items ?? []
  const total = query.data?.total ?? 0
  const isEmpty = Boolean(query.data && items.length === 0)
  const rangeStart = total === 0 ? 0 : (page - 1) * pageSize + 1
  const rangeEnd = Math.min(page * pageSize, total)

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
      id={CAMPAIGNS_SECTION_ID}
      className="flex scroll-mt-6 flex-col gap-4 rounded-[12px] border border-border bg-surface p-5"
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

      {query.isPending ? <CardSkeleton variant="table" className="py-6" /> : null}

      {query.isError && !query.data ? (
        <ErrorState
          message={getErrorMessage(query.error)}
          onRetry={() => {
            void query.refetch()
          }}
        />
      ) : null}

      {!query.isPending && isEmpty ? (
        <EmptyState title="No campaigns match this filter." className="py-10" />
      ) : null}

      {!query.isPending && !isEmpty ? (
        <>
          <div
            className={cn('overflow-x-auto', query.isFetching && 'opacity-60')}
            aria-busy={query.isFetching || undefined}
          >
            <Table className="min-w-[820px]">
              <CampaignsTableHeader sort={sort} dir={dir} onSort={setSort} />
              <TableBody>
                {items.map((campaign) => (
                  <CampaignsTableRow
                    key={campaign.id}
                    campaign={campaign}
                    onOpen={openCampaign}
                  />
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
                disabled={page <= 1 || query.isFetching}
                onClick={() => setPage(page - 1)}
              >
                Previous
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={rangeEnd >= total || query.isFetching}
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

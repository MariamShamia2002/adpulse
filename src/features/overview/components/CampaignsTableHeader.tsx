import { TableHead, TableHeader, TableRow } from '@/components/ui/table'
import type {
  CampaignsSortDir,
  CampaignsSortKey,
} from '@/features/overview/hooks/useCampaignsTableParams'
import { CAMPAIGNS_TABLE_COLUMNS } from '@/features/overview/lib/campaignsTableColumns'
import { cn } from '@/lib/utils'

type CampaignsTableHeaderProps = {
  sort: CampaignsSortKey
  dir: CampaignsSortDir
  onSort: (key: CampaignsSortKey) => void
}

export function CampaignsTableHeader({
  sort,
  dir,
  onSort,
}: CampaignsTableHeaderProps) {
  return (
    <TableHeader>
      <TableRow className="hover:bg-transparent">
        {CAMPAIGNS_TABLE_COLUMNS.map((column) => {
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
                onClick={() => onSort(column.key)}
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
  )
}

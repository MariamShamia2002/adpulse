import { useHref, useLinkClickHandler } from 'react-router'

import { campaignDetailTo } from '@/features/overview/lib/campaignNav'
import type { CampaignListItem } from '@/features/overview/schemas/campaignsList'

export const ROAS_NAME_COLUMN_WIDTH = 200

type RoasCampaignNameTickProps = {
  x?: string | number
  y?: string | number
  index?: number
  rows: CampaignListItem[]
  search: string
}

export function RoasCampaignNameTick({
  x = 0,
  y = 0,
  index = 0,
  rows,
  search,
}: RoasCampaignNameTickProps) {
  const item = rows[index]
  const to = campaignDetailTo(item?.id ?? '', search)
  const href = useHref(to)
  const handleClick = useLinkClickHandler(to)

  if (!item) return null

  return (
    <foreignObject
      x={Number(x) - ROAS_NAME_COLUMN_WIDTH}
      y={Number(y) - 12}
      width={ROAS_NAME_COLUMN_WIDTH}
      height={24}
    >
      <a
        href={href}
        onClick={handleClick}
        className="flex h-full items-center justify-end truncate pr-2 text-right text-[13px] text-text outline-none hover:underline focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-[var(--series-1)]"
        title={item.name}
      >
        {item.name}
      </a>
    </foreignObject>
  )
}

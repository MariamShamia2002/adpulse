import { useHref, useLinkClickHandler } from 'react-router'

import { campaignDetailTo } from '@/features/overview/lib/campaignNav'
import type { CampaignListItem } from '@/features/overview/schemas/campaignsList'

export const ROAS_NAME_COLUMN_WIDTH = 200
const TICK_HEIGHT = 36

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
      y={Number(y) - TICK_HEIGHT / 2}
      width={ROAS_NAME_COLUMN_WIDTH}
      height={TICK_HEIGHT}
    >
      <div className="box-border flex h-full w-full items-center justify-end px-2">
        <a
          href={href}
          onClick={handleClick}
          className="line-clamp-2 text-right text-[13px] leading-tight text-text outline-none hover:underline focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-[var(--series-1)]"
          title={item.name}
        >
          {item.name}
        </a>
      </div>
    </foreignObject>
  )
}

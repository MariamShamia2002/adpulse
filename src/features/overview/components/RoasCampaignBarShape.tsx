import { useHref, useLinkClickHandler } from 'react-router'
import type { BarRectangleItem } from 'recharts/types/cartesian/Bar'

import { campaignDetailTo } from '@/features/overview/lib/campaignNav'
import type { CampaignListItem } from '@/features/overview/schemas/campaignsList'

type ChartRow = CampaignListItem & { fill: string }

interface RoasCampaignBarShapeProps extends BarRectangleItem {
  search: string
}

/** Horizontal bar with 4px radius only on the data (right) end. */
function rightRoundedBarPath(
  x: number,
  y: number,
  width: number,
  height: number,
  radius = 4,
): string {
  const r = Math.min(radius, height / 2, width / 2)
  if (r <= 0) {
    return `M${x},${y} h${width} v${height} h${-width} Z`
  }

  return [
    `M${x},${y}`,
    `H${x + width - r}`,
    `Q${x + width},${y} ${x + width},${y + r}`,
    `V${y + height - r}`,
    `Q${x + width},${y + height} ${x + width - r},${y + height}`,
    `H${x}`,
    'Z',
  ].join(' ')
}

export function RoasCampaignBarShape(props: RoasCampaignBarShapeProps) {
  const { x = 0, y = 0, width = 0, height = 0, fill, payload, search } = props
  const item = payload as ChartRow | undefined
  const to = campaignDetailTo(item?.id ?? '', search)
  const href = useHref(to)
  const handleClick = useLinkClickHandler(to)

  if (!item) return null

  return (
    <a
      href={href}
      onClick={handleClick}
      aria-label={`View campaign ${item.name}`}
      className="outline-none focus-visible:[&_path]:stroke-2 focus-visible:[&_path]:stroke-[var(--series-1)]"
    >
      <path
        d={rightRoundedBarPath(
          Number(x),
          Number(y),
          Math.max(Number(width), 0),
          Math.max(Number(height), 0),
        )}
        fill={fill}
        stroke="var(--surface)"
        strokeWidth={2}
      />
    </a>
  )
}

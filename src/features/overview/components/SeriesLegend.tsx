import { cn } from '@/lib/utils'

export type SeriesLegendItem = {
  label: string
  color: string
  dashed?: boolean
}

type SeriesLegendProps = {
  items: SeriesLegendItem[]
  /** Line charts use `line` (default); bar charts use `swatch`. */
  marker?: 'line' | 'swatch'
  className?: string
}

export function SeriesLegend({
  items,
  marker = 'line',
  className,
}: SeriesLegendProps) {
  if (items.length < 2) return null

  return (
    <ul
      className={cn(
        'flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] font-medium text-text-secondary',
        className,
      )}
    >
      {items.map((item) => (
        <li key={item.label} className="flex items-center gap-1.5">
          <span
            aria-hidden
            className={cn(
              'inline-block shrink-0',
              marker === 'swatch'
                ? 'size-2.5 rounded-[2px]'
                : 'h-0.5 w-3',
            )}
            style={
              marker === 'swatch'
                ? { backgroundColor: item.color }
                : {
                    backgroundColor: item.dashed ? 'transparent' : item.color,
                    backgroundImage: item.dashed
                      ? `repeating-linear-gradient(90deg, ${item.color} 0 3px, transparent 3px 5px)`
                      : undefined,
                  }
            }
          />
          {item.label}
        </li>
      ))}
    </ul>
  )
}

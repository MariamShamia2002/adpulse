import { cn } from '@/lib/utils'

export type SeriesLegendItem = {
  label: string
  color: string
  dashed?: boolean
}

type SeriesLegendProps = {
  items: SeriesLegendItem[]
  className?: string
}

export function SeriesLegend({ items, className }: SeriesLegendProps) {
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
            className="inline-block h-0.5 w-3 shrink-0"
            style={{
              backgroundColor: item.dashed ? 'transparent' : item.color,
              backgroundImage: item.dashed
                ? `repeating-linear-gradient(90deg, ${item.color} 0 3px, transparent 3px 5px)`
                : undefined,
            }}
          />
          {item.label}
        </li>
      ))}
    </ul>
  )
}

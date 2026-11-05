import { AGE_SERIES_COLORS } from '@/features/overview/lib/ageSeriesColors'
import type { ConversionsByAgeRow } from '@/features/overview/schemas/conversionsByAge'
import { formatCount, formatPercentWhole } from '@/shared/utils/formatters'

type ConversionsByAgeLegendProps = {
  rows: ConversionsByAgeRow[]
}

export function ConversionsByAgeLegend({ rows }: ConversionsByAgeLegendProps) {
  return (
    <ul className="flex min-w-[160px] flex-col gap-2 text-[12px]">
      {rows.map((row, index) => (
        <li key={row.age} className="flex items-center gap-2">
          <span
            aria-hidden
            className="size-2.5 shrink-0 rounded-sm"
            style={{ backgroundColor: AGE_SERIES_COLORS[index] ?? 'var(--series-1)' }}
          />
          <span className="min-w-0 flex-1 truncate font-medium text-text">{row.age}</span>
          <span className="tabular-nums text-text-secondary">
            {formatCount(row.conversions)}
          </span>
          <span className="w-9 text-right tabular-nums text-text-muted">
            {formatPercentWhole(row.share)}
          </span>
        </li>
      ))}
    </ul>
  )
}

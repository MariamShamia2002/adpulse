import type { ConversionsByAgeRow } from '@/features/overview/schemas/conversionsByAge'
import { formatCount, formatPercentWhole } from '@/shared/utils/formatters'

type ConversionsByAgeTableProps = {
  rows: ConversionsByAgeRow[]
}

export function ConversionsByAgeTable({ rows }: ConversionsByAgeTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[320px] border-collapse text-left text-[13px]">
        <thead>
          <tr className="border-b border-border text-[12px] text-text-muted">
            <th scope="col" className="py-2 pr-3 font-medium">
              Age group
            </th>
            <th scope="col" className="py-2 pr-3 text-right font-medium">
              Conversions
            </th>
            <th scope="col" className="py-2 text-right font-medium">
              Share
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.age} className="border-b border-border last:border-b-0">
              <td className="py-2.5 pr-3 font-medium text-text">{row.age}</td>
              <td className="py-2.5 pr-3 text-right tabular-nums text-text">
                {formatCount(row.conversions)}
              </td>
              <td className="py-2.5 text-right tabular-nums text-text">
                {formatPercentWhole(row.share)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

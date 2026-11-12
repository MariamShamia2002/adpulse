import type { AgeGenderBreakdownRow } from '@/features/campaigns/lib/ageGenderBreakdown'
import { ChartCard } from '@/features/overview/components/ChartCard'
import { formatCount } from '@/shared/utils/formatters'

type BreakdownTableProps = {
  data: AgeGenderBreakdownRow[]
  state: 'loading' | 'error' | 'empty' | 'ready'
  errorMessage?: string
  onRetry?: () => void
}

export function BreakdownTable({
  data,
  state,
  errorMessage,
  onRetry,
}: BreakdownTableProps) {
  return (
    <ChartCard
      title="Breakdown table"
      subtitle="Same data as the chart, for screen readers and copy-paste"
      state={state}
      errorMessage={errorMessage}
      onRetry={onRetry}
      chartHeight={240}
    >
      <div className="overflow-x-auto">
        <table className="w-full min-w-[280px] border-collapse text-left text-[13px]">
          <thead>
            <tr className="border-b border-border text-[11px] font-semibold uppercase tracking-wide text-text-muted">
              <th scope="col" className="py-2.5 pr-3 font-semibold">
                Age
              </th>
              <th scope="col" className="py-2.5 pr-3 text-right font-semibold">
                Women
              </th>
              <th scope="col" className="py-2.5 pr-3 text-right font-semibold">
                Men
              </th>
              <th scope="col" className="py-2.5 text-right font-semibold">
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr
                key={row.age}
                className="h-11 border-b border-border last:border-b-0"
              >
                <td className="pr-3 text-text">{row.age}</td>
                <td className="pr-3 text-right tabular-nums text-text">
                  {formatCount(row.women)}
                </td>
                <td className="pr-3 text-right tabular-nums text-text">
                  {formatCount(row.men)}
                </td>
                <td className="text-right font-semibold tabular-nums text-text">
                  {formatCount(row.total)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ChartCard>
  )
}

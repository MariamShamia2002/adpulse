import type { CampaignKpiUnit } from '@/features/campaigns/schemas/campaignDetail'
import {
  formatCount,
  formatCountCompact,
  formatCurrency,
  formatCurrencyCompact,
  formatPercent,
  formatRatio,
} from '@/shared/utils/formatters'

export function formatMetricByUnit(
  value: number,
  unit: CampaignKpiUnit,
  compact: boolean,
): string {
  switch (unit) {
    case 'currency':
      return compact ? formatCurrencyCompact(value) : formatCurrency(value, true)
    case 'ratio':
      return formatRatio(value)
    case 'percent':
      return compact ? formatPercent(value, true) : `${value.toFixed(2)}%`
    case 'count':
      return compact ? formatCountCompact(value) : formatCount(value)
    default:
      return String(value)
  }
}

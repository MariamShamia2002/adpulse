import type { CampaignTimeseries } from '@/features/campaigns/schemas/campaignPerformance'

export const PREVIOUS_BAND_FACTOR = 0.06
export const CURRENT_AREA_OPACITY = 0.1

export type DailyPerformanceChartRow = {
  date: string
  value: number
  previous: number | undefined
  /** Transparent stack spacer up to previous −6%. */
  previousBase: number | undefined
  /** Stacked band height (previous ±6%). */
  previousBand: number | undefined
}

export function buildDailyPerformanceChartData(
  data: CampaignTimeseries,
  compare: boolean,
): DailyPerformanceChartRow[] {
  return data.points.map((point, index) => {
    const previousValue = compare ? data.previous?.[index]?.value : undefined
    if (previousValue == null) {
      return {
        date: point.date,
        value: point.value,
        previous: undefined,
        previousBase: undefined,
        previousBand: undefined,
      }
    }

    const previousLow = previousValue * (1 - PREVIOUS_BAND_FACTOR)
    const previousHigh = previousValue * (1 + PREVIOUS_BAND_FACTOR)

    return {
      date: point.date,
      value: point.value,
      previous: previousValue,
      previousBase: previousLow,
      previousBand: previousHigh - previousLow,
    }
  })
}

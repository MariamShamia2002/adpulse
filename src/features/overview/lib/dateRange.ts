import {
  differenceInCalendarDays,
  format,
  parseISO,
  subDays,
} from 'date-fns'

export type DatePreset = '7d' | '14d' | '28d'

export type DateRange = {
  from: string
  to: string
}

const PRESET_DAYS: Record<DatePreset, number> = {
  '7d': 7,
  '14d': 14,
  '28d': 28,
}

export function toApiDate(date: Date): string {
  return format(date, 'yyyy-MM-dd')
}

/** Last N days ending yesterday (inclusive). */
export function getPresetRange(preset: DatePreset, today = new Date()): DateRange {
  const to = subDays(today, 1)
  const from = subDays(to, PRESET_DAYS[preset] - 1)
  return { from: toApiDate(from), to: toApiDate(to) }
}

export function getDefaultRange(today = new Date()): DateRange {
  return getPresetRange('7d', today)
}

export function matchDatePreset(
  from: string,
  to: string,
  today = new Date(),
): DatePreset | null {
  for (const preset of Object.keys(PRESET_DAYS) as DatePreset[]) {
    const range = getPresetRange(preset, today)
    if (range.from === from && range.to === to) {
      return preset
    }
  }
  return null
}

export function previousPeriodRange(from: string, to: string): DateRange {
  const start = parseISO(from)
  const end = parseISO(to)
  const length = differenceInCalendarDays(end, start) + 1
  const prevTo = subDays(start, 1)
  const prevFrom = subDays(prevTo, length - 1)
  return { from: toApiDate(prevFrom), to: toApiDate(prevTo) }
}

/** Oct 22, 2026 – Oct 28, 2026 */
export function formatCurrentRange(from: string, to: string): string {
  return `${format(parseISO(from), 'MMM d, yyyy')} \u2013 ${format(parseISO(to), 'MMM d, yyyy')}`
}

/** Oct 15 – Oct 21 */
export function formatComparedRange(from: string, to: string): string {
  return `${format(parseISO(from), 'MMM d')} \u2013 ${format(parseISO(to), 'MMM d')}`
}

import { format, parseISO } from 'date-fns'

const currencyFull = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

const currencyExact = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 2,
})

const countFull = new Intl.NumberFormat('en-US')

const percentFull = new Intl.NumberFormat('en-US', {
  style: 'percent',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

const percentCompact = new Intl.NumberFormat('en-US', {
  style: 'percent',
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
})

function compactNumber(value: number): string {
  const abs = Math.abs(value)

  if (abs >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(abs >= 10_000_000 ? 0 : 2).replace(/\.?0+$/, '')}M`
  }

  if (abs >= 1_000) {
    return `${(value / 1_000).toFixed(abs >= 10_000 ? 0 : 1).replace(/\.0$/, '')}k`
  }

  return countFull.format(value)
}

/** Full currency for tables and tooltips: $186,940 */
export function formatCurrency(value: number, exact = false): string {
  return (exact ? currencyExact : currencyFull).format(value)
}

/** Compact currency for KPI values and axis ticks: $187k, $1.2M, $934 */
export function formatCurrencyCompact(value: number): string {
  const abs = Math.abs(value)

  if (abs >= 1_000_000) {
    return `$${compactNumber(value)}`
  }

  if (abs >= 1_000) {
    return `$${compactNumber(value)}`
  }

  return currencyFull.format(value)
}

/** Full count: 2,418 */
export function formatCount(value: number): string {
  return countFull.format(value)
}

/** Compact count: 2.4k, 4.81M */
export function formatCountCompact(value: number): string {
  return compactNumber(value)
}

/** Ratio with multiplication sign: 3.88× */
export function formatRatio(value: number): string {
  return `${value.toFixed(2)}\u00D7`
}

/** Percent: 2.14% full, 2.1% compact */
export function formatPercent(value: number, compact = false): string {
  const ratio = value > 1 || value < -1 ? value / 100 : value
  return (compact ? percentCompact : percentFull).format(ratio)
}

/**
 * Delta percent: +14.8%, −2.1% (U+2212), — when previous is 0.
 * Pass the already-computed ratio (current − previous) / previous.
 */
export function formatDelta(deltaRatio: number | null | undefined): string {
  if (deltaRatio == null || !Number.isFinite(deltaRatio)) {
    return '\u2014'
  }

  const pct = deltaRatio * 100
  const sign = pct > 0 ? '+' : pct < 0 ? '\u2212' : ''
  return `${sign}${Math.abs(pct).toFixed(1)}%`
}

/** Axis tick date: Oct 8 */
export function formatAxisDate(isoDate: string): string {
  return format(parseISO(isoDate), 'MMM d')
}

/** Header range: Oct 1 – Oct 28, 2026 */
export function formatDateRange(from: string, to: string): string {
  const start = parseISO(from)
  const end = parseISO(to)

  if (start.getFullYear() === end.getFullYear()) {
    return `${format(start, 'MMM d')} \u2013 ${format(end, 'MMM d, yyyy')}`
  }

  return `${format(start, 'MMM d, yyyy')} \u2013 ${format(end, 'MMM d, yyyy')}`
}

/** Tooltip date: Oct 19, 2026 */
export function formatTooltipDate(isoDate: string): string {
  return format(parseISO(isoDate), 'MMM d, yyyy')
}

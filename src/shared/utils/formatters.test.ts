import { describe, expect, it } from 'vitest'

import {
  formatAxisDate,
  formatCount,
  formatCountCompact,
  formatCurrency,
  formatCurrencyCompact,
  formatDateRange,
  formatDelta,
  formatPercent,
  formatPercentWhole,
  formatRatio,
  formatTooltipDate,
} from '@/shared/utils/formatters'

describe('formatCurrency', () => {
  it('formats whole dollars by default', () => {
    expect(formatCurrency(186940)).toBe('$186,940')
  })

  it('formats exact cents when exact is true', () => {
    expect(formatCurrency(12.5, true)).toBe('$12.50')
  })
})

describe('formatCurrencyCompact', () => {
  it('keeps small values as full currency', () => {
    expect(formatCurrencyCompact(934)).toBe('$934')
  })

  it('compacts thousands and millions', () => {
    expect(formatCurrencyCompact(187000)).toBe('$187k')
    expect(formatCurrencyCompact(1_200_000)).toBe('$1.2M')
  })
})

describe('formatCount', () => {
  it('formats with grouping', () => {
    expect(formatCount(2418)).toBe('2,418')
  })
})

describe('formatCountCompact', () => {
  it('compacts thousands and millions', () => {
    expect(formatCountCompact(2400)).toBe('2.4k')
    expect(formatCountCompact(4_810_000)).toBe('4.81M')
  })

  it('leaves small counts uncompacted', () => {
    expect(formatCountCompact(42)).toBe('42')
  })
})

describe('formatRatio', () => {
  it('formats with two decimals and a multiplication sign', () => {
    expect(formatRatio(3.876)).toBe('3.88\u00D7')
  })
})

describe('formatPercent', () => {
  it('treats values above 1 as percent points', () => {
    expect(formatPercent(2.14)).toBe('2.14%')
    expect(formatPercent(2.14, true)).toBe('2.1%')
  })

  it('treats values within -1..1 as ratios', () => {
    expect(formatPercent(0.25)).toBe('25.00%')
    expect(formatPercent(0.25, true)).toBe('25.0%')
  })
})

describe('formatPercentWhole', () => {
  it('rounds to a whole percent', () => {
    expect(formatPercentWhole(30)).toBe('30%')
    expect(formatPercentWhole(0.3)).toBe('30%')
  })
})

describe('formatDelta', () => {
  it('formats positive and negative ratios', () => {
    expect(formatDelta(0.148)).toBe('+14.8%')
    expect(formatDelta(-0.021)).toBe('\u22122.1%')
  })

  it('formats zero without a sign', () => {
    expect(formatDelta(0)).toBe('0.0%')
  })

  it('returns an em dash for nullish or non-finite values', () => {
    expect(formatDelta(null)).toBe('\u2014')
    expect(formatDelta(undefined)).toBe('\u2014')
    expect(formatDelta(Number.NaN)).toBe('\u2014')
  })
})

describe('formatAxisDate', () => {
  it('formats as month and day', () => {
    expect(formatAxisDate('2026-10-08')).toBe('Oct 8')
  })
})

describe('formatDateRange', () => {
  it('omits the start year when both dates share a year', () => {
    expect(formatDateRange('2026-10-01', '2026-10-28')).toBe(
      'Oct 1 \u2013 Oct 28, 2026',
    )
  })

  it('includes both years when they differ', () => {
    expect(formatDateRange('2025-12-20', '2026-01-05')).toBe(
      'Dec 20, 2025 \u2013 Jan 5, 2026',
    )
  })
})

describe('formatTooltipDate', () => {
  it('formats as month, day, and year', () => {
    expect(formatTooltipDate('2026-10-19')).toBe('Oct 19, 2026')
  })
})

import { describe, expect, it } from 'vitest'

import { formatMetricByUnit } from '@/features/campaigns/lib/formatMetricByUnit'

describe('formatMetricByUnit', () => {
  it('formats currency full and compact', () => {
    expect(formatMetricByUnit(1869.4, 'currency', false)).toBe('$1,869.40')
    expect(formatMetricByUnit(187000, 'currency', true)).toBe('$187k')
  })

  it('formats ratio with the multiplication sign', () => {
    expect(formatMetricByUnit(3.876, 'ratio', false)).toBe('3.88\u00D7')
    expect(formatMetricByUnit(3.876, 'ratio', true)).toBe('3.88\u00D7')
  })

  it('formats percent full and compact', () => {
    expect(formatMetricByUnit(2.14, 'percent', false)).toBe('2.14%')
    expect(formatMetricByUnit(2.14, 'percent', true)).toBe('2.1%')
  })

  it('formats count full and compact', () => {
    expect(formatMetricByUnit(2418, 'count', false)).toBe('2,418')
    expect(formatMetricByUnit(2400, 'count', true)).toBe('2.4k')
  })
})

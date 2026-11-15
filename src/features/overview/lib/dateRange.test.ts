import { describe, expect, it } from 'vitest'

import {
  formatComparedRange,
  formatCurrentRange,
  getDefaultRange,
  getLatestSelectableDate,
  getPresetRange,
  isValidApiDate,
  isValidDateRange,
  matchDatePreset,
  previousPeriodRange,
  toApiDate,
} from '@/features/overview/lib/dateRange'

/** Fixed local calendar day to keep date math timezone-stable. */
const TODAY = new Date(2026, 10, 12) // 12 Nov 2026

describe('toApiDate', () => {
  it('formats a Date as YYYY-MM-DD', () => {
    expect(toApiDate(new Date(2026, 9, 5))).toBe('2026-10-05')
  })
})

describe('isValidApiDate', () => {
  it('accepts a real calendar date', () => {
    expect(isValidApiDate('2026-10-05')).toBe(true)
  })

  it('rejects wrong shape', () => {
    expect(isValidApiDate('2026/10/05')).toBe(false)
    expect(isValidApiDate('10-05-2026')).toBe(false)
    expect(isValidApiDate('')).toBe(false)
  })

  it('rejects impossible calendar dates', () => {
    expect(isValidApiDate('2026-02-30')).toBe(false)
    expect(isValidApiDate('2026-13-01')).toBe(false)
  })
})

describe('isValidDateRange', () => {
  it('accepts from ≤ to', () => {
    expect(isValidDateRange('2026-10-01', '2026-10-07')).toBe(true)
    expect(isValidDateRange('2026-10-01', '2026-10-01')).toBe(true)
  })

  it('rejects from > to', () => {
    expect(isValidDateRange('2026-10-07', '2026-10-01')).toBe(false)
  })

  it('rejects invalid endpoints', () => {
    expect(isValidDateRange('nope', '2026-10-01')).toBe(false)
    expect(isValidDateRange('2026-10-01', '2026-02-30')).toBe(false)
  })
})

describe('getLatestSelectableDate', () => {
  it('returns yesterday relative to today', () => {
    expect(toApiDate(getLatestSelectableDate(TODAY))).toBe('2026-11-11')
  })
})

describe('getPresetRange', () => {
  it('returns inclusive last 7 days ending yesterday', () => {
    expect(getPresetRange('7d', TODAY)).toEqual({
      from: '2026-11-05',
      to: '2026-11-11',
    })
  })

  it('returns inclusive last 14 days ending yesterday', () => {
    expect(getPresetRange('14d', TODAY)).toEqual({
      from: '2026-10-29',
      to: '2026-11-11',
    })
  })

  it('returns inclusive last 28 days ending yesterday', () => {
    expect(getPresetRange('28d', TODAY)).toEqual({
      from: '2026-10-15',
      to: '2026-11-11',
    })
  })
})

describe('getDefaultRange', () => {
  it('matches the 7d preset', () => {
    expect(getDefaultRange(TODAY)).toEqual(getPresetRange('7d', TODAY))
  })
})

describe('matchDatePreset', () => {
  it('matches each preset for the given today', () => {
    expect(matchDatePreset('2026-11-05', '2026-11-11', TODAY)).toBe('7d')
    expect(matchDatePreset('2026-10-29', '2026-11-11', TODAY)).toBe('14d')
    expect(matchDatePreset('2026-10-15', '2026-11-11', TODAY)).toBe('28d')
  })

  it('returns null for a custom range', () => {
    expect(matchDatePreset('2026-10-01', '2026-10-10', TODAY)).toBeNull()
  })
})

describe('previousPeriodRange', () => {
  it('returns the equal-length window ending the day before from', () => {
    expect(previousPeriodRange('2026-11-05', '2026-11-11')).toEqual({
      from: '2026-10-29',
      to: '2026-11-04',
    })
  })

  it('handles a single-day range', () => {
    expect(previousPeriodRange('2026-11-11', '2026-11-11')).toEqual({
      from: '2026-11-10',
      to: '2026-11-10',
    })
  })
})

describe('formatCurrentRange', () => {
  it('formats with month, day, and year', () => {
    expect(formatCurrentRange('2026-10-22', '2026-10-28')).toBe(
      'Oct 22, 2026 \u2013 Oct 28, 2026',
    )
  })
})

describe('formatComparedRange', () => {
  it('formats with month and day only', () => {
    expect(formatComparedRange('2026-10-15', '2026-10-21')).toBe(
      'Oct 15 \u2013 Oct 21',
    )
  })
})

import { describe, expect, it } from 'vitest'

import { getFiveTickIndexes } from '@/features/overview/lib/chartTicks'

describe('getFiveTickIndexes', () => {
  it('returns an empty list for non-positive lengths', () => {
    expect(getFiveTickIndexes(0)).toEqual([])
    expect(getFiveTickIndexes(-3)).toEqual([])
  })

  it('returns [0] for a single point', () => {
    expect(getFiveTickIndexes(1)).toEqual([0])
  })

  it('returns every index when length is at most five', () => {
    expect(getFiveTickIndexes(2)).toEqual([0, 1])
    expect(getFiveTickIndexes(5)).toEqual([0, 1, 2, 3, 4])
  })

  it('returns first, quarter, mid, three-quarter, and last for longer series', () => {
    expect(getFiveTickIndexes(9)).toEqual([0, 2, 4, 6, 8])
    expect(getFiveTickIndexes(29)).toEqual([0, 7, 14, 21, 28])
  })
})

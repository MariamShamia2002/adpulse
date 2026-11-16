import { describe, expect, it, vi } from 'vitest'

import {
  CAMPAIGNS_SECTION_ID,
  buildCampaignFilterSearch,
  campaignDetailTo,
  campaignsSectionTo,
  scrollToCampaignsSection,
} from '@/features/overview/lib/campaignNav'

describe('buildCampaignFilterSearch', () => {
  it('builds from, to, and compare=true', () => {
    expect(buildCampaignFilterSearch('2026-10-01', '2026-10-28', true)).toBe(
      'from=2026-10-01&to=2026-10-28&compare=true',
    )
  })

  it('builds compare=false when compare is off', () => {
    expect(buildCampaignFilterSearch('2026-10-01', '2026-10-07', false)).toBe(
      'from=2026-10-01&to=2026-10-07&compare=false',
    )
  })
})

describe('campaignDetailTo', () => {
  it('points at the campaign detail path with the given search', () => {
    expect(
      campaignDetailTo('cmp_1', 'from=2026-10-01&to=2026-10-07&compare=true'),
    ).toEqual({
      pathname: '/campaigns/cmp_1',
      search: 'from=2026-10-01&to=2026-10-07&compare=true',
    })
  })
})

describe('campaignsSectionTo', () => {
  it('points at overview with the campaigns hash', () => {
    expect(campaignsSectionTo('from=2026-10-01&to=2026-10-07&compare=false')).toEqual({
      pathname: '/',
      search: 'from=2026-10-01&to=2026-10-07&compare=false',
      hash: CAMPAIGNS_SECTION_ID,
    })
  })
})

describe('scrollToCampaignsSection', () => {
  it('scrolls the campaigns section into view when present', () => {
    const scrollIntoView = vi.fn()
    const getElementById = vi.fn().mockReturnValue({ scrollIntoView })
    vi.stubGlobal('document', { getElementById })

    scrollToCampaignsSection()

    expect(getElementById).toHaveBeenCalledWith(CAMPAIGNS_SECTION_ID)
    expect(scrollIntoView).toHaveBeenCalledWith({
      behavior: 'smooth',
      block: 'start',
    })

    vi.unstubAllGlobals()
  })

  it('does nothing when the section is missing', () => {
    const getElementById = vi.fn().mockReturnValue(null)
    vi.stubGlobal('document', { getElementById })

    expect(() => scrollToCampaignsSection()).not.toThrow()
    expect(getElementById).toHaveBeenCalledWith(CAMPAIGNS_SECTION_ID)

    vi.unstubAllGlobals()
  })
})

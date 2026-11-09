import { createSearchParams, type To } from 'react-router'

/** Overview Campaigns table section; used by nav + ROAS "View all". */
export const CAMPAIGNS_SECTION_ID = 'campaigns'

export function buildCampaignFilterSearch(
  from: string,
  to: string,
  compare: boolean,
): string {
  return createSearchParams({
    from,
    to,
    compare: compare ? 'true' : 'false',
  }).toString()
}

export function campaignDetailTo(id: string, search: string): To {
  return { pathname: `/campaigns/${id}`, search }
}

export function campaignsSectionTo(search: string): To {
  return { pathname: '/', search, hash: CAMPAIGNS_SECTION_ID }
}

export function scrollToCampaignsSection() {
  document
    .getElementById(CAMPAIGNS_SECTION_ID)
    ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

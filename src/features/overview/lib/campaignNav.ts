import { createSearchParams, type To } from 'react-router'

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

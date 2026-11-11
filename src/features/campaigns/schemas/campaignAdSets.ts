import { z } from 'zod'

const campaignAdSetSchema = z.object({
  id: z.string(),
  name: z.string(),
  audienceType: z.string(),
  spend: z.number(),
  share: z.number(),
  roas: z.number(),
  cpa: z.number(),
  conversions: z.number(),
})

export const campaignAdSetsSchema = z.object({
  items: z.array(campaignAdSetSchema),
})

export type CampaignAdSet = z.infer<typeof campaignAdSetSchema>
export type CampaignAdSets = z.infer<typeof campaignAdSetsSchema>

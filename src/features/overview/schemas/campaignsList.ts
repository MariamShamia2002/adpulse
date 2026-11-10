import { z } from 'zod'

const campaignPlatformSchema = z.enum(['meta', 'google', 'tiktok'])
const campaignStatusSchema = z.enum(['active', 'paused', 'learning', 'ended'])

const campaignListItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  platform: campaignPlatformSchema,
  status: campaignStatusSchema,
  spend: z.number(),
  revenue: z.number(),
  roas: z.number(),
  conversions: z.number(),
  cpa: z.number(),
  trend: z.array(z.number()),
})

export const campaignsListSchema = z.object({
  items: z.array(campaignListItemSchema),
  page: z.number(),
  pageSize: z.number(),
  total: z.number(),
})

export type CampaignsList = z.infer<typeof campaignsListSchema>
export type CampaignListItem = z.infer<typeof campaignListItemSchema>
export type CampaignPlatform = z.infer<typeof campaignPlatformSchema>
export type CampaignStatus = z.infer<typeof campaignStatusSchema>

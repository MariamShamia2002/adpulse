import { z } from 'zod'

const campaignBreakdownRowSchema = z.object({
  age: z.string(),
  gender: z.string(),
  impressions: z.number(),
  clicks: z.number(),
  spend: z.number(),
  conversions: z.number(),
  revenue: z.number(),
})

export const campaignBreakdownSchema = z.object({
  dimension: z.string(),
  rows: z.array(campaignBreakdownRowSchema),
})

export type CampaignBreakdownRow = z.infer<typeof campaignBreakdownRowSchema>
export type CampaignBreakdown = z.infer<typeof campaignBreakdownSchema>

import { z } from 'zod'

export const campaignPlatformSchema = z.enum(['meta', 'google', 'tiktok'])
export const campaignStatusSchema = z.enum(['active', 'paused', 'learning', 'ended'])

export const campaignMetricSchema = z.enum([
  'spend',
  'revenue',
  'roas',
  'ctr',
  'cpa',
])

export const campaignTabSchema = z.enum([
  'performance',
  'adsets',
  'audience',
  'creatives',
])

export type CampaignPlatform = z.infer<typeof campaignPlatformSchema>
export type CampaignStatus = z.infer<typeof campaignStatusSchema>
export type CampaignMetric = z.infer<typeof campaignMetricSchema>
export type CampaignTab = z.infer<typeof campaignTabSchema>

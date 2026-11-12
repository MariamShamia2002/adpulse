import { z } from 'zod'

import { campaignMetricSchema } from '@/features/campaigns/schemas/campaignEnums'

const kpiUnitSchema = z.enum(['currency', 'ratio', 'count', 'percent'])

const timeseriesPointSchema = z.object({
  date: z.string(),
  value: z.number(),
})

export const campaignTimeseriesSchema = z.object({
  metric: campaignMetricSchema,
  unit: kpiUnitSchema,
  points: z.array(timeseriesPointSchema),
  previous: z.array(timeseriesPointSchema).optional(),
})

const campaignEventSchema = z.object({
  id: z.number(),
  date: z.string(),
  type: z.string(),
  label: z.string(),
  detail: z.record(z.string(), z.unknown()).optional(),
})

export const campaignEventsSchema = z.object({
  items: z.array(campaignEventSchema),
})

export type CampaignTimeseries = z.infer<typeof campaignTimeseriesSchema>
export type CampaignTimeseriesPoint = z.infer<typeof timeseriesPointSchema>
export type CampaignEvent = z.infer<typeof campaignEventSchema>
export type CampaignEvents = z.infer<typeof campaignEventsSchema>

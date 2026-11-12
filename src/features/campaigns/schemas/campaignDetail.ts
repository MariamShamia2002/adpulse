import { z } from 'zod'

import {
  campaignPlatformSchema,
  campaignStatusSchema,
} from '@/features/campaigns/schemas/campaignEnums'

const dateRangeSchema = z.object({
  from: z.string(),
  to: z.string(),
})

const kpiUnitSchema = z.enum(['currency', 'ratio', 'count', 'percent'])

const campaignKpiSchema = z.object({
  key: z.string(),
  label: z.string(),
  unit: kpiUnitSchema,
  current: z.number(),
  previous: z.number().optional(),
})

export const campaignDetailSchema = z.object({
  id: z.string(),
  name: z.string(),
  platform: campaignPlatformSchema,
  objective: z.string(),
  status: campaignStatusSchema,
  startDate: z.string(),
  endDate: z.string().nullable(),
  dailyBudget: z.number(),
  adSetCount: z.number(),
  range: dateRangeSchema,
  kpis: z.array(campaignKpiSchema),
  previousRange: dateRangeSchema.optional(),
})

export type CampaignDetail = z.infer<typeof campaignDetailSchema>
export type CampaignKpi = z.infer<typeof campaignKpiSchema>
export type CampaignKpiUnit = z.infer<typeof kpiUnitSchema>

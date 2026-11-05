import { z } from 'zod'

const seriesPointSchema = z.object({
  date: z.string(),
  value: z.number(),
})

const dateRangeSchema = z.object({
  from: z.string(),
  to: z.string(),
})

const kpiUnitSchema = z.enum(['currency', 'ratio', 'count', 'percent'])

const kpiSchema = z.object({
  key: z.string(),
  label: z.string(),
  unit: kpiUnitSchema,
  current: z.number(),
  series: z.array(seriesPointSchema),
  previous: z.number().optional(),
  previousSeries: z.array(seriesPointSchema).optional(),
})

export const overviewSummarySchema = z.object({
  range: dateRangeSchema,
  kpis: z.array(kpiSchema),
  previousRange: dateRangeSchema.optional(),
})

export type OverviewSummary = z.infer<typeof overviewSummarySchema>
export type OverviewKpi = z.infer<typeof kpiSchema>
export type SeriesPoint = z.infer<typeof seriesPointSchema>
export type KpiUnit = z.infer<typeof kpiUnitSchema>

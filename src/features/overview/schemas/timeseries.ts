import { z } from 'zod'

const timeseriesPointSchema = z.object({
  date: z.string(),
  spend: z.number(),
  revenue: z.number(),
})

export const overviewTimeseriesSchema = z.object({
  points: z.array(timeseriesPointSchema),
  previous: z.array(timeseriesPointSchema).optional(),
})

export type OverviewTimeseries = z.infer<typeof overviewTimeseriesSchema>
export type TimeseriesPoint = z.infer<typeof timeseriesPointSchema>

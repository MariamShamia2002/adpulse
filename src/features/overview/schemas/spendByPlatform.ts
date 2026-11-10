import { z } from 'zod'

const weekSchema = z.object({
  weekStart: z.string(),
  label: z.string(),
  partial: z.boolean(),
  meta: z.number(),
  google: z.number(),
  tiktok: z.number(),
})

export const spendByPlatformSchema = z.object({
  platforms: z.array(z.string()),
  weeks: z.array(weekSchema),
})

export type SpendByPlatform = z.infer<typeof spendByPlatformSchema>
export type SpendByPlatformWeek = z.infer<typeof weekSchema>

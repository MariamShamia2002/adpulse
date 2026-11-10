import { z } from 'zod'

const conversionsByAgeRowSchema = z.object({
  age: z.string(),
  conversions: z.number(),
  share: z.number(),
})

export const conversionsByAgeSchema = z.object({
  total: z.number(),
  rows: z.array(conversionsByAgeRowSchema),
})

export type ConversionsByAge = z.infer<typeof conversionsByAgeSchema>
export type ConversionsByAgeRow = z.infer<typeof conversionsByAgeRowSchema>

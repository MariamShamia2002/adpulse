import type { CampaignBreakdownRow } from '@/features/campaigns/schemas/campaignBreakdown'

export interface AgeGenderBreakdownRow {
  age: string
  women: number
  men: number
  total: number
}

/** Collapse age×gender API rows into one record per age (API order). */
export function toAgeGenderBreakdownRows(
  rows: CampaignBreakdownRow[],
): AgeGenderBreakdownRow[] {
  const order: string[] = []
  const byAge = new Map<string, AgeGenderBreakdownRow>()

  for (const row of rows) {
    let entry = byAge.get(row.age)
    if (!entry) {
      entry = { age: row.age, women: 0, men: 0, total: 0 }
      byAge.set(row.age, entry)
      order.push(row.age)
    }

    if (row.gender === 'female') {
      entry.women += row.conversions
    } else if (row.gender === 'male') {
      entry.men += row.conversions
    }

    entry.total += row.conversions
  }

  return order.map((age) => byAge.get(age)!)
}

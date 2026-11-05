/** Five evenly spaced indexes: first, quarter, mid, three-quarter, last. */
export function getFiveTickIndexes(length: number): number[] {
  if (length <= 0) return []
  if (length === 1) return [0]
  if (length <= 5) {
    return Array.from({ length }, (_, index) => index)
  }

  return [
    0,
    Math.round((length - 1) / 4),
    Math.round((length - 1) / 2),
    Math.round((3 * (length - 1)) / 4),
    length - 1,
  ]
}

type CampaignSparklineProps = {
  values: number[]
  className?: string
}

const WIDTH = 120
const HEIGHT = 24
const STROKE = 'var(--series-1)'

/** Decorative 120×24 sparkline from campaign `trend` (7-day ROAS). */
export function CampaignSparkline({ values, className }: CampaignSparklineProps) {
  if (values.length === 0) {
    return (
      <svg
        width={WIDTH}
        height={HEIGHT}
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        aria-hidden="true"
        className={className}
      />
    )
  }

  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min || 1
  const stepX = values.length > 1 ? WIDTH / (values.length - 1) : 0

  const points = values
    .map((value, index) => {
      const x = values.length > 1 ? index * stepX : WIDTH / 2
      const y = HEIGHT - ((value - min) / range) * (HEIGHT - 4) - 2
      return `${x},${y}`
    })
    .join(' ')

  return (
    <svg
      width={WIDTH}
      height={HEIGHT}
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      aria-hidden="true"
      className={className}
    >
      <polyline
        fill="none"
        stroke={STROKE}
        strokeWidth={1.5}
        strokeLinejoin="round"
        strokeLinecap="round"
        points={points}
      />
    </svg>
  )
}

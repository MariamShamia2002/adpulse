type EventChipLabelProps = {
  viewBox?: { x?: number; y?: number }
  value?: string
}

/** Small chip label for campaign event ReferenceLines. */
export function EventChipLabel({ viewBox, value }: EventChipLabelProps) {
  if (!value) return null

  const x = (viewBox?.x ?? 0) + 8
  const y = (viewBox?.y ?? 0) + 6
  const width = Math.min(220, Math.max(96, value.length * 6.4 + 16))

  return (
    <g transform={`translate(${x}, ${y})`}>
      <rect
        width={width}
        height={20}
        rx={4}
        ry={4}
        fill="var(--surface)"
        stroke="var(--border)"
        strokeWidth={1}
      />
      <text
        x={8}
        y={13.5}
        fill="var(--text-secondary)"
        fontSize={10}
        fontWeight={500}
      >
        {value}
      </text>
    </g>
  )
}

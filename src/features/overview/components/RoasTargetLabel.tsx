type RoasTargetLabelProps = {
  viewBox?: { x?: number; y?: number }
}

/** Keeps "target 3.0×" on one line above the reference line. */
export function RoasTargetLabel({ viewBox }: RoasTargetLabelProps) {
  if (viewBox?.x == null || viewBox?.y == null) return null

  return (
    <text
      x={viewBox.x}
      y={viewBox.y - 6}
      textAnchor="middle"
      fill="var(--text-muted)"
      fontSize={11}
      className="pointer-events-none"
    >
      target 3.0×
    </text>
  )
}

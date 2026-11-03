import { cn } from '@/lib/utils'

type CardSkeletonProps = {
  className?: string
  /** Chart plot area vs short table bars */
  variant?: 'chart' | 'table' | 'kpi'
}

export function CardSkeleton({
  className,
  variant = 'chart',
}: CardSkeletonProps) {
  if (variant === 'kpi') {
    return (
      <div
        role="status"
        aria-label="Loading"
        className={cn('space-y-3', className)}
      >
        <div className="h-3 w-20 rounded bg-surface-muted" />
        <div className="h-7 w-28 rounded bg-surface-muted" />
        <span className="sr-only">Loading</span>
      </div>
    )
  }

  if (variant === 'table') {
    return (
      <div
        role="status"
        aria-label="Loading"
        className={cn('space-y-3', className)}
      >
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-3 rounded bg-surface-muted"
            style={{ width: `${72 - index * 10}%` }}
          />
        ))}
        <span className="sr-only">Loading</span>
      </div>
    )
  }

  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn('h-[260px] w-full rounded bg-surface-muted', className)}
    >
      <span className="sr-only">Loading</span>
    </div>
  )
}

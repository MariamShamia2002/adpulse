import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'
import { CardSkeleton } from '@/shared/components/CardSkeleton'
import { EmptyState } from '@/shared/components/EmptyState'
import { ErrorState } from '@/shared/components/ErrorState'

type ChartCardProps = {
  title: string
  subtitle?: string
  legend?: ReactNode
  state: 'loading' | 'error' | 'empty' | 'ready'
  errorMessage?: string
  onRetry?: () => void
  children: ReactNode
  className?: string
  chartHeight?: number
}

export function ChartCard({
  title,
  subtitle,
  legend,
  state,
  errorMessage,
  onRetry,
  children,
  className,
  chartHeight = 260,
}: ChartCardProps) {
  return (
    <section
      className={cn(
        'flex flex-col gap-4 rounded-[12px] border border-border bg-surface p-5',
        className,
      )}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <h2 className="text-[15px] font-semibold text-text">{title}</h2>
          {subtitle ? (
            <p className="text-[12px] font-medium text-text-secondary">
              {subtitle}
            </p>
          ) : null}
        </div>
        {legend && state === 'ready' ? legend : null}
      </div>

      <div style={{ minHeight: chartHeight }}>
        {state === 'loading' ? (
          <CardSkeleton
            variant="chart"
            className="w-full"
          />
        ) : null}

        {state === 'error' ? (
          <ErrorState
            message={errorMessage ?? 'Something went wrong'}
            onRetry={onRetry}
            className="justify-center py-10"
          />
        ) : null}

        {state === 'empty' ? (
          <EmptyState
            title="No data for this range."
            className="justify-center py-10"
          />
        ) : null}

        {state === 'ready' ? children : null}
      </div>
    </section>
  )
}

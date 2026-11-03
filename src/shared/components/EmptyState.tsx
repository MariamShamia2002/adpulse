import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

type EmptyStateProps = {
  title: string
  description?: string
  action?: ReactNode
  className?: string
}

export function EmptyState({
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      role="status"
      className={cn(
        'flex flex-col items-start justify-center gap-2 py-8 text-left',
        className,
      )}
    >
      <p className="text-[13px] font-medium text-text">{title}</p>
      {description ? (
        <p className="text-[13px] text-text-secondary">{description}</p>
      ) : null}
      {action}
    </div>
  )
}

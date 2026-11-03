import { AlertCircle } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type ErrorStateProps = {
  title?: string
  message: string
  onRetry?: () => void
  className?: string
}

export function ErrorState({
  title = 'Something went wrong',
  message,
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn(
        'flex flex-col items-start justify-center gap-3 py-8 text-left',
        className,
      )}
    >
      <div className="flex items-start gap-2">
        <AlertCircle
          className="mt-0.5 size-4 shrink-0 text-status-critical"
          aria-hidden
        />
        <div className="space-y-1">
          <p className="text-[13px] font-medium text-text">{title}</p>
          <p className="text-[13px] text-text-secondary">{message}</p>
        </div>
      </div>
      {onRetry ? (
        <Button type="button" variant="outline" size="sm" onClick={onRetry}>
          Retry
        </Button>
      ) : null}
    </div>
  )
}

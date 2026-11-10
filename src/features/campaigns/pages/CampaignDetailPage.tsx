import { useQuery } from '@tanstack/react-query'
import { Link, useParams } from 'react-router'

import { apiGet } from '@/api/client'
import { getErrorMessage, isNotFoundError } from '@/api/errors'
import { Button } from '@/components/ui/button'
import { CardSkeleton } from '@/shared/components/CardSkeleton'
import { EmptyState } from '@/shared/components/EmptyState'
import { ErrorState } from '@/shared/components/ErrorState'

export default function CampaignDetailPage() {
  const { id } = useParams<{ id: string }>()

  const query = useQuery({
    queryKey: ['campaign', id],
    queryFn: () => apiGet<unknown>(`/api/campaigns/${id}`),
    enabled: Boolean(id),
  })

  if (!id) {
    return (
      <EmptyState
        title="Campaign not found"
        action={
          <Button nativeButton={false} render={<Link to="/" />} variant="outline" size="sm">
            Back to Overview
          </Button>
        }
      />
    )
  }

  if (query.isPending) {
    return (
      <div className="rounded-[12px] border border-border bg-surface p-5">
        <CardSkeleton variant="kpi" />
      </div>
    )
  }

  if (query.isError) {
    if (isNotFoundError(query.error)) {
      return (
        <EmptyState
          title={getErrorMessage(query.error, `Campaign ${id} not found`)}
          action={
            <Button nativeButton={false} render={<Link to="/" />} variant="outline" size="sm">
              Back to Overview
            </Button>
          }
        />
      )
    }

    return (
      <ErrorState
        message={getErrorMessage(query.error)}
        onRetry={() => {
          void query.refetch()
        }}
      />
    )
  }

  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-bold tracking-[-0.01em] text-text">
        Campaign detail
      </h1>
      <p className="text-[13px] text-text-secondary">
        Campaign <span className="font-medium text-text">{id}</span> will render
        here.
      </p>
    </div>
  )
}

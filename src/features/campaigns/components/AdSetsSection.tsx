import { EmptyState } from '@/shared/components/EmptyState'

/** Shared Ad sets block — used on Performance and Ad sets tabs. */
export function AdSetsSection() {
  return (
    <section
      aria-label="Ad sets"
      className="rounded-[12px] border border-border bg-surface p-5"
    >
      <div className="space-y-1">
        <h2 className="text-[15px] font-semibold text-text">Ad sets</h2>
        <p className="text-[12px] font-medium text-text-secondary">
          Spend share and efficiency by ad set
        </p>
      </div>
      <EmptyState
        title="Ad set performance will appear here."
        className="py-10"
      />
    </section>
  )
}

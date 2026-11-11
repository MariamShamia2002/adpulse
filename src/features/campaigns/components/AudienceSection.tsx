import { EmptyState } from '@/shared/components/EmptyState'

/** Shared Audience block — used on Performance and Audience tabs. */
export function AudienceSection() {
  return (
    <section
      aria-label="Audience"
      className="rounded-[12px] border border-border bg-surface p-5"
    >
      <div className="space-y-1">
        <h2 className="text-[15px] font-semibold text-text">Audience</h2>
        <p className="text-[12px] font-medium text-text-secondary">
          Breakdown of performance by audience
        </p>
      </div>
      <EmptyState
        title="Audience insights will appear here."
        className="py-10"
      />
    </section>
  )
}

import { EmptyState } from '@/shared/components/EmptyState'

export function CreativesEmptyState() {
  return (
    <section
      aria-label="Creatives"
      className="rounded-[12px] border border-border bg-surface p-5"
    >
      <div className="space-y-1">
        <h2 className="text-[15px] font-semibold text-text">Creatives</h2>
        <p className="text-[12px] font-medium text-text-secondary">
          Creative assets for this campaign
        </p>
      </div>
      <EmptyState
        title="No creatives for this campaign."
        description="Creative reporting is not available for this campaign yet."
        className="py-10"
      />
    </section>
  )
}

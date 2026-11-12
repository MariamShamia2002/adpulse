import { ImageIcon } from 'lucide-react'

/** Intentional empty state — creative reporting is out of scope for v1. */
export function CreativesEmptyState() {
  return (
    <section
      aria-label="Creatives"
      className="flex min-h-[280px] flex-col items-center justify-center rounded-[12px] border border-border bg-surface p-5"
    >
      <div
        role="status"
        className="flex max-w-md flex-col items-center gap-3 text-center"
      >
        <ImageIcon
          aria-hidden
          className="size-8 text-text-muted"
          strokeWidth={1.5}
        />
        <div className="space-y-1.5">
          <h2 className="text-[15px] font-semibold text-text">No creatives yet</h2>
          <p className="text-[13px] text-text-secondary">
            Creative-level reporting is out of scope for the first release. This
            tab shows the empty state the frontend should render.
          </p>
        </div>
      </div>
    </section>
  )
}

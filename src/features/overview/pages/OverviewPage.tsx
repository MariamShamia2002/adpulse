import { CampaignsTable } from '@/features/overview/components/CampaignsTable'
import { ConversionsByAgeDonut } from '@/features/overview/components/ConversionsByAgeDonut'
import { FilterBar } from '@/features/overview/components/FilterBar'
import { OverviewKpiSection } from '@/features/overview/components/OverviewKpiSection'
import { RoasByCampaignChart } from '@/features/overview/components/RoasByCampaignChart'
import { SpendByPlatformChart } from '@/features/overview/components/SpendByPlatformChart'
import { SpendRevenueChart } from '@/features/overview/components/SpendRevenueChart'
import { useOverviewFilters } from '@/features/overview/hooks/useOverviewFilters'
import {
  formatComparedRange,
  formatCurrentRange,
  previousPeriodRange,
} from '@/features/overview/lib/dateRange'

const chartGridClass =
  'grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(420px,1fr))]'

export default function OverviewPage() {
  const {
    filters,
    setPlatform,
    setCompare,
  } = useOverviewFilters()

  const previous = filters.compare
    ? previousPeriodRange(filters.from, filters.to)
    : null

  const subtitle = filters.compare && previous
    ? `${formatCurrentRange(filters.from, filters.to)} · compared with ${formatComparedRange(previous.from, previous.to)}`
    : formatCurrentRange(filters.from, filters.to)

  const platformLabel =
    filters.platform === 'all'
      ? 'all platforms'
      : filters.platform.charAt(0).toUpperCase() + filters.platform.slice(1)

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-[-0.01em] text-text">
            Overview
          </h1>
          <p className="text-[13px] text-text-secondary">{subtitle}</p>
          <p className="sr-only" aria-live="polite">
            Showing {subtitle}, {platformLabel}
          </p>
        </div>

        <FilterBar
          filters={filters}
          onPlatformChange={setPlatform}
          onCompareChange={setCompare}
        />
      </div>

      <OverviewKpiSection filters={filters} />

      <section aria-label="Overview charts" className={chartGridClass}>
        <SpendRevenueChart filters={filters} rangeLabel={subtitle} />
        <SpendByPlatformChart filters={filters} rangeLabel={subtitle} />
      </section>

      <section aria-label="Campaign and audience charts" className={chartGridClass}>
        <RoasByCampaignChart filters={filters} rangeLabel={subtitle} />
        <ConversionsByAgeDonut filters={filters} rangeLabel={subtitle} />
      </section>

      <CampaignsTable filters={filters} />
    </div>
  )
}

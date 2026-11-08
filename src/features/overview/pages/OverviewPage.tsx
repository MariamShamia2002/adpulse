import { getErrorMessage } from '@/api/errors'
import { ConversionsByAgeDonut } from '@/features/overview/components/ConversionsByAgeDonut'
import { FilterBar } from '@/features/overview/components/FilterBar'
import { OverviewKpiSection } from '@/features/overview/components/OverviewKpiSection'
import { RoasByCampaignChart } from '@/features/overview/components/RoasByCampaignChart'
import { SpendByPlatformChart } from '@/features/overview/components/SpendByPlatformChart'
import { SpendRevenueChart } from '@/features/overview/components/SpendRevenueChart'
import { useOverviewCampaignsRoas } from '@/features/overview/hooks/useOverviewCampaignsRoas'
import { useOverviewConversionsByAge } from '@/features/overview/hooks/useOverviewConversionsByAge'
import { useOverviewFilters } from '@/features/overview/hooks/useOverviewFilters'
import { useOverviewSpendByPlatform } from '@/features/overview/hooks/useOverviewSpendByPlatform'
import { useOverviewTimeseries } from '@/features/overview/hooks/useOverviewTimeseries'
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
    preset,
    setPreset,
    setPlatform,
    setCompare,
  } = useOverviewFilters()

  const timeseriesQuery = useOverviewTimeseries(filters)
  const spendByPlatformQuery = useOverviewSpendByPlatform(filters)
  const campaignsRoasQuery = useOverviewCampaignsRoas(filters)
  const conversionsByAgeQuery = useOverviewConversionsByAge(filters)

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
          preset={preset}
          onPresetChange={setPreset}
          onPlatformChange={setPlatform}
          onCompareChange={setCompare}
        />
      </div>

      <OverviewKpiSection filters={filters} />

      <section aria-label="Overview charts" className={chartGridClass}>
        <SpendRevenueChart
          data={timeseriesQuery.data}
          compare={filters.compare}
          isPending={timeseriesQuery.isPending}
          isError={timeseriesQuery.isError}
          errorMessage={
            timeseriesQuery.isError
              ? getErrorMessage(timeseriesQuery.error)
              : undefined
          }
          onRetry={() => {
            void timeseriesQuery.refetch()
          }}
          rangeLabel={subtitle}
        />
        <SpendByPlatformChart
          data={spendByPlatformQuery.data}
          platform={filters.platform}
          isPending={spendByPlatformQuery.isPending}
          isError={spendByPlatformQuery.isError}
          errorMessage={
            spendByPlatformQuery.isError
              ? getErrorMessage(spendByPlatformQuery.error)
              : undefined
          }
          onRetry={() => {
            void spendByPlatformQuery.refetch()
          }}
          rangeLabel={subtitle}
        />
      </section>

      <section aria-label="Campaign and audience charts" className={chartGridClass}>
        <RoasByCampaignChart
          data={campaignsRoasQuery.data?.items}
          from={filters.from}
          to={filters.to}
          compare={filters.compare}
          isPending={campaignsRoasQuery.isPending}
          isError={campaignsRoasQuery.isError}
          errorMessage={
            campaignsRoasQuery.isError
              ? getErrorMessage(campaignsRoasQuery.error)
              : undefined
          }
          onRetry={() => {
            void campaignsRoasQuery.refetch()
          }}
          rangeLabel={subtitle}
        />
        <ConversionsByAgeDonut
          data={conversionsByAgeQuery.data}
          isPending={conversionsByAgeQuery.isPending}
          isError={conversionsByAgeQuery.isError}
          errorMessage={
            conversionsByAgeQuery.isError
              ? getErrorMessage(conversionsByAgeQuery.error)
              : undefined
          }
          onRetry={() => {
            void conversionsByAgeQuery.refetch()
          }}
          rangeLabel={subtitle}
        />
      </section>
    </div>
  )
}

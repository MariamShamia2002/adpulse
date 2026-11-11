import { Download } from 'lucide-react'
import { Link, useParams } from 'react-router'

import { getErrorMessage, isNotFoundError } from '@/api/errors'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { getCampaignExportCsvUrl } from '@/features/campaigns/api/campaignsApi'
import { AdSetsSection } from '@/features/campaigns/components/AdSetsSection'
import { AudienceSection } from '@/features/campaigns/components/AudienceSection'
import { CampaignHeader } from '@/features/campaigns/components/CampaignHeader'
import { CampaignTabs } from '@/features/campaigns/components/CampaignTabs'
import { CreativesEmptyState } from '@/features/campaigns/components/CreativesEmptyState'
import { DailyPerformanceChart } from '@/features/campaigns/components/DailyPerformanceChart'
import { KpiStrip } from '@/features/campaigns/components/KpiStrip'
import { useCampaignDetail } from '@/features/campaigns/hooks/useCampaignDetail'
import { useCampaignDetailFilters } from '@/features/campaigns/hooks/useCampaignDetailFilters'
import type { CampaignTab } from '@/features/campaigns/schemas/campaignEnums'
import { DateRangePicker } from '@/features/overview/components/DateRangePicker'
import {
  formatComparedRange,
  formatCurrentRange,
  previousPeriodRange,
} from '@/features/overview/lib/dateRange'
import { buildCampaignFilterSearch } from '@/features/overview/lib/campaignNav'
import { CardSkeleton } from '@/shared/components/CardSkeleton'
import { EmptyState } from '@/shared/components/EmptyState'
import { ErrorState } from '@/shared/components/ErrorState'

export default function CampaignDetailPage() {
  const { id } = useParams<{ id: string }>()
  const {
    filters,
    metric,
    tab,
    preset,
    setPreset,
    setCompare,
    setMetric,
    setTab,
  } = useCampaignDetailFilters()
  const query = useCampaignDetail(id, filters)

  const previous = filters.compare
    ? previousPeriodRange(filters.from, filters.to)
    : null

  const rangeLabel =
    filters.compare && previous
      ? `${formatCurrentRange(filters.from, filters.to)} · compared with ${formatComparedRange(previous.from, previous.to)}`
      : formatCurrentRange(filters.from, filters.to)

  const detailSearch = buildCampaignFilterSearch(
    filters.from,
    filters.to,
    filters.compare,
  )

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
      <div className="space-y-6">
        <CardSkeleton variant="kpi" className="h-24" />
        <div className="grid gap-3 [grid-template-columns:repeat(auto-fit,minmax(140px,1fr))]">
          {Array.from({ length: 6 }).map((_, index) => (
            <CardSkeleton key={index} variant="kpi" className="h-20" />
          ))}
        </div>
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

  const campaign = query.data

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <CampaignHeader campaign={campaign} search={detailSearch} />

        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center xl:justify-end">
          <DateRangePicker preset={preset} onPresetChange={setPreset} />
          <div className="flex h-9 items-center gap-2 rounded-lg border border-border bg-surface px-2.5 text-[13px] font-medium text-text">
            <Switch
              checked={filters.compare}
              onCheckedChange={setCompare}
              aria-labelledby="campaign-compare-label"
            />
            <span id="campaign-compare-label">Compare</span>
          </div>
          <a
            href={getCampaignExportCsvUrl(id, filters)}
            download
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border bg-surface px-2.5 text-[13px] font-medium text-text outline-none hover:bg-surface-muted focus-visible:ring-2 focus-visible:ring-[var(--series-1)]"
          >
            <Download className="size-4 shrink-0" aria-hidden />
            Export CSV
          </a>
        </div>
      </div>

      <p className="sr-only" aria-live="polite">
        Showing {rangeLabel}
      </p>

      <CampaignTabs tab={tab} onTabChange={setTab} />

      <KpiStrip kpis={campaign.kpis} compare={filters.compare} />

      <TabPanel
        tab={tab}
        campaignId={id}
        filters={filters}
        metric={metric}
        onMetricChange={setMetric}
        rangeLabel={rangeLabel}
      />
    </div>
  )
}

type TabPanelProps = {
  tab: CampaignTab
  campaignId: string
  filters: ReturnType<typeof useCampaignDetailFilters>['filters']
  metric: ReturnType<typeof useCampaignDetailFilters>['metric']
  onMetricChange: ReturnType<typeof useCampaignDetailFilters>['setMetric']
  rangeLabel: string
}

function TabPanel({
  tab,
  campaignId,
  filters,
  metric,
  onMetricChange,
  rangeLabel,
}: TabPanelProps) {
  if (tab === 'creatives') {
    return <CreativesEmptyState />
  }

  if (tab === 'adsets') {
    return <AdSetsSection campaignId={campaignId} filters={filters} />
  }

  if (tab === 'audience') {
    return <AudienceSection />
  }

  return (
    <div className="space-y-6">
      <DailyPerformanceChart
        campaignId={campaignId}
        filters={filters}
        metric={metric}
        onMetricChange={onMetricChange}
        rangeLabel={rangeLabel}
      />
      <AdSetsSection campaignId={campaignId} filters={filters} />
      <AudienceSection />
    </div>
  )
}

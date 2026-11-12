import { useMemo, useState } from 'react'
import { CalendarDays } from 'lucide-react'
import { type DateRange } from 'react-day-picker'
import { parseISO } from 'date-fns'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { useOverviewFilters } from '@/features/overview/hooks/useOverviewFilters'
import {
  formatComparedRange,
  getLatestSelectableDate,
  toApiDate,
  type DatePreset,
} from '@/features/overview/lib/dateRange'
import { cn } from '@/lib/utils'

const PRESETS: DatePreset[] = ['7d', '14d', '28d']

export function DateRangePicker() {
  const { filters, preset, setPreset, setDateRange } = useOverviewFilters()
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState<DateRange | undefined>()
  /** After a full range is shown, the next click starts a new `from`. */
  const [awaitingStart, setAwaitingStart] = useState(true)

  const committedRange = useMemo(
    () => ({
      from: parseISO(filters.from),
      to: parseISO(filters.to),
    }),
    [filters.from, filters.to],
  )

  const selected = draft ?? committedRange
  const latestSelectable = getLatestSelectableDate()
  const rangeLabel = formatComparedRange(filters.from, filters.to)

  return (
    <div className="flex flex-wrap items-center gap-2">
      <ToggleGroup
        value={preset ? [preset] : []}
        onValueChange={(values) => {
          const next = values[0] as DatePreset | undefined
          if (next) setPreset(next)
        }}
        variant="outline"
        spacing={0}
        className="h-9 border border-border-strong bg-surface"
        aria-label="Date range preset"
      >
        {PRESETS.map((value) => (
          <ToggleGroupItem
            key={value}
            value={value}
            className={cn(
              'h-9 min-w-10 rounded-none px-3 text-[13px] font-medium',
              'data-[pressed]:bg-text data-[pressed]:text-white',
              'data-[state=on]:bg-text data-[state=on]:text-white',
            )}
          >
            {value}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>

      <Popover
        open={open}
        onOpenChange={(next) => {
          setOpen(next)
          if (next) {
            setDraft(committedRange)
            setAwaitingStart(true)
          } else {
            setDraft(undefined)
            setAwaitingStart(true)
          }
        }}
      >
        <PopoverTrigger
          render={
            <Button
              type="button"
              variant="outline"
              className="h-9 gap-1.5 border-border-strong bg-surface px-2.5 text-[13px] font-medium text-text"
            />
          }
        >
          <CalendarDays className="size-4 shrink-0 text-text-muted" aria-hidden />
          <span className="tabular-nums">{rangeLabel}</span>
          <span className="sr-only">Choose custom date range</span>
        </PopoverTrigger>
        <PopoverContent
          align="end"
          className="w-auto border border-border bg-surface p-0 shadow-none ring-1 ring-border"
        >
          <p className="border-b border-border px-3 py-2 text-[12px] text-text-secondary">
            {awaitingStart
              ? 'Select start date'
              : 'Select end date'}
          </p>
          <Calendar
            mode="range"
            numberOfMonths={2}
            selected={selected}
            defaultMonth={selected.from}
            onSelect={(_range, selectedDay) => {
              if (awaitingStart) {
                setDraft({ from: selectedDay, to: undefined })
                setAwaitingStart(false)
                return
              }

              const from = selected.from
              if (!from) {
                setDraft({ from: selectedDay, to: undefined })
                return
              }

              // Keep chronological order if end is clicked before start.
              const [start, end] =
                selectedDay < from ? [selectedDay, from] : [from, selectedDay]

              setDateRange({
                from: toApiDate(start),
                to: toApiDate(end),
              })
              setOpen(false)
              setDraft(undefined)
              setAwaitingStart(true)
            }}
            disabled={{ after: latestSelectable }}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}

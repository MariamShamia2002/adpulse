import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router'

const TEXT_SORTS = new Set(['name', 'platform', 'status'])
const NUMERIC_SORTS = new Set([
  'spend',
  'revenue',
  'roas',
  'conversions',
  'cpa',
])
const ALL_SORTS = new Set([...TEXT_SORTS, ...NUMERIC_SORTS])

export type CampaignsSortKey =
  | 'name'
  | 'platform'
  | 'status'
  | 'spend'
  | 'revenue'
  | 'roas'
  | 'conversions'
  | 'cpa'

export type CampaignsSortDir = 'asc' | 'desc'

const DEFAULT_SORT: CampaignsSortKey = 'roas'
const DEFAULT_DIR: CampaignsSortDir = 'desc'
const DEFAULT_PAGE = 1
const DEFAULT_PAGE_SIZE = 10

function parseSort(value: string | null): CampaignsSortKey {
  if (value && ALL_SORTS.has(value)) {
    return value as CampaignsSortKey
  }
  return DEFAULT_SORT
}

function parseDir(
  value: string | null,
  sort: CampaignsSortKey,
): CampaignsSortDir {
  if (value === 'asc' || value === 'desc') return value
  return TEXT_SORTS.has(sort) ? 'asc' : 'desc'
}

function parsePage(value: string | null): number {
  const page = Number(value)
  return Number.isFinite(page) && page >= 1 ? Math.floor(page) : DEFAULT_PAGE
}

function defaultDirForSort(sort: CampaignsSortKey): CampaignsSortDir {
  return TEXT_SORTS.has(sort) ? 'asc' : 'desc'
}

export function useCampaignsTableParams() {
  const [searchParams, setSearchParams] = useSearchParams()

  const sort = parseSort(searchParams.get('sort'))
  const dir = parseDir(searchParams.get('dir'), sort)
  const page = parsePage(searchParams.get('page'))
  const q = searchParams.get('q') ?? ''
  const pageSize = DEFAULT_PAGE_SIZE

  // Seed default sort/dir into the URL when missing
  useEffect(() => {
    const hasSort = searchParams.has('sort')
    const hasDir = searchParams.has('dir')
    if (hasSort && hasDir) return

    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        if (!next.has('sort')) next.set('sort', DEFAULT_SORT)
        if (!next.has('dir')) next.set('dir', DEFAULT_DIR)
        return next
      },
      { replace: true },
    )
  }, [searchParams, setSearchParams])

  const [searchInput, setSearchInput] = useState(q)
  const [prevQ, setPrevQ] = useState(q)

  // Keep the input in sync when `q` changes from the URL (e.g. back/forward).
  if (q !== prevQ) {
    setPrevQ(q)
    setSearchInput(q)
  }

  useEffect(() => {
    const handle = window.setTimeout(() => {
      const nextQ = searchInput.trim()
      const currentQ = (searchParams.get('q') ?? '').trim()
      if (nextQ === currentQ) return

      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev)
          if (nextQ) next.set('q', nextQ)
          else next.delete('q')
          next.set('page', '1')
          return next
        },
        { replace: false },
      )
    }, 300)

    return () => window.clearTimeout(handle)
  }, [searchInput, searchParams, setSearchParams])

  const setSort = useCallback(
    (nextSort: CampaignsSortKey) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev)
          const currentSort = parseSort(prev.get('sort'))
          const currentDir = parseDir(prev.get('dir'), currentSort)

          if (nextSort === currentSort) {
            next.set('dir', currentDir === 'asc' ? 'desc' : 'asc')
          } else {
            next.set('sort', nextSort)
            next.set('dir', defaultDirForSort(nextSort))
          }

          next.set('page', '1')
          return next
        },
        { replace: false },
      )
    },
    [setSearchParams],
  )

  const setPage = useCallback(
    (nextPage: number) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev)
          next.set('page', String(Math.max(1, nextPage)))
          return next
        },
        { replace: false },
      )
    },
    [setSearchParams],
  )

  const params = useMemo(
    () => ({
      sort,
      dir,
      page,
      pageSize,
      q: q.trim() || undefined,
    }),
    [sort, dir, page, pageSize, q],
  )

  return {
    params,
    sort,
    dir,
    page,
    pageSize,
    q,
    searchInput,
    setSearchInput,
    setSort,
    setPage,
  }
}

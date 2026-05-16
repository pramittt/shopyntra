import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  fetchSearchResults,
  getPriceBounds,
  RESULTS_PER_PAGE,
  sortKey,
  stableFiltersKey,
  withPriceRange,
  type FacetMultiple,
  type IActiveFilter,
  type IPriceRange,
  type ISearchFacet,
  type ISearchProduct,
  type ISearchResponse,
  type ISortSelection,
} from '../api/searchApi'
import { loadRecentSearchTerms, recordRecentSearchTerm } from '../lib/recentSearches'
import { rememberSearchSessionCache, sessionCacheKey } from '../lib/sessionCache'

function computeFilterToggle(
  prev: IActiveFilter[],
  field: string,
  value: string,
  multiple: FacetMultiple,
): IActiveFilter[] {
  if (multiple === 'single') {
    const without = prev.filter((f) => f.field !== field)
    const had = prev.some((f) => f.field === field && f.value === value)
    if (had) return without
    return [...without, { field, value }]
  }
  const had = prev.some((f) => f.field === field && f.value === value)
  if (had) return prev.filter((f) => !(f.field === field && f.value === value))
  return [...prev, { field, value }]
}

function dedupeAppend(prev: ISearchProduct[], more: ISearchProduct[]): ISearchProduct[] {
  const seen = new Set(prev.map((p) => p.id))
  const next = [...prev]
  for (const r of more) {
    if (!seen.has(r.id)) {
      seen.add(r.id)
      next.push(r)
    }
  }
  return next
}

export function useProductSearch(topNavId: string) {
  const [inputValue, setInputValue] = useState('')
  const [submittedQuery, setSubmittedQuery] = useState<string | null>(null)
  const [activeFilters, setActiveFilters] = useState<IActiveFilter[]>([])
  const [sortSelection, setSortSelection] = useState<ISortSelection | null>(null)

  const [data, setData] = useState<ISearchResponse | null>(null)
  const [results, setResults] = useState<ISearchProduct[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [recentSearches, setRecentSearches] = useState<string[]>(loadRecentSearchTerms)

  const fetchAbortRef = useRef<AbortController | null>(null)
  const lastFetchedQueryRef = useRef<string | null>(null)
  const searchSessionCacheRef = useRef(new Map<string, ISearchResponse>())
  const activeFiltersRef = useRef<IActiveFilter[]>([])
  const sortSelectionRef = useRef<ISortSelection | null>(null)
  const appendInFlightRef = useRef(false)
  const facetCatalogRef = useRef<ISearchFacet[]>([])
  const [priceBounds, setPriceBounds] = useState<IPriceRange | null>(null)

  const applyResponse = useCallback((res: ISearchResponse): ISearchResponse => {
    if (res.facets?.length) {
      facetCatalogRef.current = res.facets
    }
    const facets = res.facets?.length ? res.facets : facetCatalogRef.current
    const priceFacet = facets.find((f) => f.field === 'price')
    if (priceFacet) {
      setPriceBounds(getPriceBounds(priceFacet))
    }
    return facets.length ? { ...res, facets } : res
  }, [])

  const runSearchWith = useCallback(
    async (q: string, requestPage: number, append: boolean) => {
      if (append && appendInFlightRef.current) return
      if (append) appendInFlightRef.current = true

      try {
        const filters = activeFiltersRef.current
        const sort = sortSelectionRef.current
        const cacheKey = sessionCacheKey(q, requestPage, sortKey(sort), stableFiltersKey(filters))

        if (!append) {
          fetchAbortRef.current?.abort()
        }
        const controller = new AbortController()
        fetchAbortRef.current = controller

        const cached = searchSessionCacheRef.current.get(cacheKey)
        if (cached !== undefined) {
          lastFetchedQueryRef.current = q
          const merged = applyResponse(cached)
          setData(merged)
          setError(null)
          if (append) {
            setResults((prev) => dedupeAppend(prev, merged.results))
          } else {
            setResults(merged.results)
          }
          setLoading(false)
          setLoadingMore(false)
          if (requestPage === 1) {
            setRecentSearches(recordRecentSearchTerm(q))
          }
          return
        }

        if (!append) {
          if (lastFetchedQueryRef.current !== q) {
            lastFetchedQueryRef.current = q
          }
          setLoading(true)
          setResults([])
        } else {
          setLoadingMore(true)
        }
        setError(null)

        try {
          const res = await fetchSearchResults({
            query: q,
            page: requestPage,
            resultsPerPage: RESULTS_PER_PAGE,
            filters,
            sort,
            signal: controller.signal,
          })
          const merged = applyResponse(res)
          setData(merged)
          rememberSearchSessionCache(searchSessionCacheRef.current, cacheKey, merged)
          if (append) {
            setResults((prev) => dedupeAppend(prev, merged.results))
          } else {
            setResults(merged.results)
          }
          if (requestPage === 1) {
            setRecentSearches(recordRecentSearchTerm(q))
          }
        } catch (err: unknown) {
          if (err instanceof DOMException && err.name === 'AbortError') return
          setError(err instanceof Error ? err.message : 'Something went wrong')
          if (!append) {
            setData(null)
            setResults([])
          }
        } finally {
          if (!controller.signal.aborted) {
            setLoading(false)
            setLoadingMore(false)
          }
        }
      } finally {
        if (append) appendInFlightRef.current = false
      }
    },
    [applyResponse],
  )

  const startSearch = useCallback(
    (raw: string) => {
      const q = raw.trim()
      if (!q) return
      activeFiltersRef.current = []
      sortSelectionRef.current = null
      facetCatalogRef.current = []
      setPriceBounds(null)
      setActiveFilters([])
      setSortSelection(null)
      setInputValue(q)
      setSubmittedQuery(q)
      setData(null)
      void runSearchWith(q, 1, false)
    },
    [runSearchWith],
  )

  const runSearch = useCallback(() => {
    startSearch(inputValue)
  }, [inputValue, startSearch])

  const toggleFilter = useCallback(
    (field: string, value: string, multiple: FacetMultiple) => {
      if (!submittedQuery) return
      const next = computeFilterToggle(activeFiltersRef.current, field, value, multiple)
      activeFiltersRef.current = next
      setActiveFilters(next)
      void runSearchWith(submittedQuery, 1, false)
      requestAnimationFrame(() => {
        document.getElementById(topNavId)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      })
    },
    [submittedQuery, runSearchWith, topNavId],
  )

  const clearFilters = useCallback(() => {
    if (!submittedQuery) return
    activeFiltersRef.current = []
    setActiveFilters([])
    void runSearchWith(submittedQuery, 1, false)
    requestAnimationFrame(() => {
      document.getElementById(topNavId)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }, [submittedQuery, runSearchWith, topNavId])

  const setPriceRange = useCallback(
    (range: IPriceRange | null, bounds: IPriceRange) => {
      if (!submittedQuery) return
      const next = withPriceRange(activeFiltersRef.current, range, bounds)
      activeFiltersRef.current = next
      setActiveFilters(next)
      void runSearchWith(submittedQuery, 1, false)
      requestAnimationFrame(() => {
        document.getElementById(topNavId)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      })
    },
    [submittedQuery, runSearchWith, topNavId],
  )

  const selectSort = useCallback(
    (sort: ISortSelection | null) => {
      if (!submittedQuery) return
      sortSelectionRef.current = sort
      setSortSelection(sort)
      void runSearchWith(submittedQuery, 1, false)
      requestAnimationFrame(() => {
        document.getElementById(topNavId)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      })
    },
    [submittedQuery, runSearchWith, topNavId],
  )

  const hasMore = useMemo(() => {
    if (!data?.pagination) return false
    return data.pagination.currentPage < data.pagination.totalPages
  }, [data])

  const loadMore = useCallback(() => {
    if (!submittedQuery || loading || loadingMore || !hasMore || !data) return
    const nextPage = data.pagination.currentPage + 1
    void runSearchWith(submittedQuery, nextPage, true)
  }, [submittedQuery, loading, loadingMore, hasMore, data, runSearchWith])

  useEffect(() => {
    activeFiltersRef.current = activeFilters
  }, [activeFilters])

  useEffect(() => {
    sortSelectionRef.current = sortSelection
  }, [sortSelection])

  const totalResults = data?.pagination?.totalResults ?? 0

  const skeletonCount = RESULTS_PER_PAGE

  return {
    inputValue,
    setInputValue,
    submittedQuery,
    data,
    loading,
    loadingMore,
    error,
    recentSearches,
    runSearch,
    startSearch,
    results,
    skeletonCount,
    activeFilters,
    priceBounds,
    toggleFilter,
    clearFilters,
    setPriceRange,
    sortSelection,
    selectSort,
    hasMore,
    loadMore,
    totalResults,
  }
}

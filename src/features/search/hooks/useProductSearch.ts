import { useCallback, useMemo, useRef, useState } from 'react'
import { fetchSearchResults, type SearchPagination, type SearchResponse } from '../api/searchApi'
import { loadRecentSearchTerms, recordRecentSearchTerm } from '../lib/recentSearches'
import { rememberSearchSessionCache, sessionCacheKey } from '../lib/sessionCache'

export function useProductSearch(topNavId: string) {
  const [inputValue, setInputValue] = useState('')
  const [submittedQuery, setSubmittedQuery] = useState<string | null>(null)
  const [page, setPage] = useState(1)

  const [data, setData] = useState<SearchResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [recentSearches, setRecentSearches] = useState<string[]>(loadRecentSearchTerms)

  const fetchAbortRef = useRef<AbortController | null>(null)
  const lastFetchedQueryRef = useRef<string | null>(null)
  const searchSessionCacheRef = useRef(new Map<string, SearchResponse>())

  const load = useCallback(async (q: string, p: number) => {
    fetchAbortRef.current?.abort()
    const controller = new AbortController()
    fetchAbortRef.current = controller

    const key = sessionCacheKey(q, p)
    const cached = searchSessionCacheRef.current.get(key)
    if (cached !== undefined) {
      lastFetchedQueryRef.current = q
      rememberSearchSessionCache(searchSessionCacheRef.current, key, cached)
      setData(cached)
      setError(null)
      setLoading(false)
      if (p === 1) {
        setRecentSearches(recordRecentSearchTerm(q))
      }
      return
    }

    if (lastFetchedQueryRef.current !== q) {
      setData(null)
      lastFetchedQueryRef.current = q
    }

    setLoading(true)
    setError(null)
    try {
      const res = await fetchSearchResults({
        query: q,
        page: p,
        signal: controller.signal,
      })
      setData(res)
      rememberSearchSessionCache(searchSessionCacheRef.current, key, res)
      if (p === 1) {
        setRecentSearches(recordRecentSearchTerm(q))
      }
    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === 'AbortError') return
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setData(null)
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false)
      }
    }
  }, [])

  const startSearch = useCallback(
    (raw: string) => {
      const q = raw.trim()
      if (!q) return
      setInputValue(q)
      setSubmittedQuery(q)
      setPage(1)
      void load(q, 1)
    },
    [load],
  )

  const runSearch = useCallback(() => {
    startSearch(inputValue)
  }, [inputValue, startSearch])

  const onPageChange = useCallback(
    (next: number) => {
      if (!submittedQuery) return
      setPage(next)
      void load(submittedQuery, next)
      requestAnimationFrame(() => {
        document.getElementById(topNavId)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      })
    },
    [submittedQuery, load, topNavId],
  )

  const pagination = useMemo((): SearchPagination | null => {
    if (!data?.pagination) return null
    if (loading) {
      return { ...data.pagination, currentPage: page }
    }
    return data.pagination
  }, [data, loading, page])

  const results = data?.results ?? []
  const skeletonCount = data?.pagination?.perPage ?? 12

  return {
    inputValue,
    setInputValue,
    submittedQuery,
    data,
    loading,
    error,
    recentSearches,
    runSearch,
    startSearch,
    onPageChange,
    pagination,
    results,
    skeletonCount,
  }
}

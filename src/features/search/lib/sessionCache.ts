import type { ISearchResponse } from '../api/types'

export const SEARCH_SESSION_CACHE_MAX = 40

export function sessionCacheKey(
  query: string,
  page: number,
  sort: string,
  filtersKey: string,
): string {
  return `${query.trim().toLowerCase()}\u0000${page}\u0000${sort}\u0000${filtersKey}`
}

export function rememberSearchSessionCache(
  cache: Map<string, ISearchResponse>,
  key: string,
  value: ISearchResponse,
) {
  cache.delete(key)
  cache.set(key, value)
  while (cache.size > SEARCH_SESSION_CACHE_MAX) {
    const oldest = cache.keys().next().value as string | undefined
    if (oldest === undefined) break
    cache.delete(oldest)
  }
}

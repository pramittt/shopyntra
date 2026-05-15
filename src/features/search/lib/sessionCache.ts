import type { SearchResponse } from '../api/searchApi'

export const SEARCH_SESSION_CACHE_MAX = 40

export function sessionCacheKey(query: string, page: number): string {
  return `${query.trim().toLowerCase()}\u0000${page}`
}

export function rememberSearchSessionCache(
  cache: Map<string, SearchResponse>,
  key: string,
  value: SearchResponse,
) {
  cache.delete(key)
  cache.set(key, value)
  while (cache.size > SEARCH_SESSION_CACHE_MAX) {
    const oldest = cache.keys().next().value as string | undefined
    if (oldest === undefined) break
    cache.delete(oldest)
  }
}

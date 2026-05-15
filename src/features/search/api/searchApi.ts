export const SEARCH_SITE_ID = 'scmq7n'

export interface SearchProduct {
  id: string
  name?: string
  thumbnailImageUrl?: string
  price?: string | number
  msrp?: string | number
  on_sale?: string[]
}

export interface SearchPagination {
  totalResults: number
  begin: number
  end: number
  currentPage: number
  totalPages: number
  previousPage: number
  nextPage: number
  perPage: number
}

export interface SearchResponse {
  results: SearchProduct[]
  pagination: SearchPagination
}

export function buildSearchUrl(params: { query: string; page: number }): string {
  const search = new URLSearchParams({
    siteId: SEARCH_SITE_ID,
    q: params.query,
    resultsFormat: 'native',
    page: String(params.page),
  })
  return `https://${SEARCH_SITE_ID}.a.searchspring.io/api/search/search.json?${search}`
}

export async function fetchSearchResults(params: {
  query: string
  page: number
  signal?: AbortSignal
}): Promise<SearchResponse> {
  const url = buildSearchUrl(params)
  const res = await fetch(url, { signal: params.signal })
  if (!res.ok) {
    throw new Error(`Search failed (${res.status})`)
  }
  return res.json() as Promise<SearchResponse>
}

export function parseAmount(value: string | number | undefined): number | null {
  if (value === undefined || value === null || value === '') return null
  const n = typeof value === 'number' ? value : Number.parseFloat(String(value))
  return Number.isFinite(n) ? n : null
}

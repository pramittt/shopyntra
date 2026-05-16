import type {
  IActiveFilter,
  IPriceRange,
  ISearchFacet,
  ISearchProduct,
  ISearchResponse,
  ISortSelection,
} from './types'

export * from './types'

export const SEARCH_SITE_ID = 'scmq7n'

export const RESULTS_PER_PAGE = 48

export function parseQuantityAvailable(
  value: string[] | string | number | undefined,
): number | null {
  if (value === undefined || value === null) return null
  const raw = Array.isArray(value) ? value[0] : value
  const n = typeof raw === 'number' ? raw : Number.parseInt(String(raw), 10)
  return Number.isFinite(n) ? n : null
}

export function isLowStock(quantity: number | null): boolean {
  return quantity !== null && quantity > 0 && quantity < 5
}

export function getProductSizes(product: ISearchProduct): string[] {
  const sizes = product.size_dress ?? product.size ?? product.size_universal
  if (!sizes?.length) return []
  return [...new Set(sizes.map((s) => s.trim()).filter(Boolean))]
}

const SIZE_WORD_TO_ABBREV: Record<string, string> = {
  small: 'S',
  medium: 'M',
  large: 'L',
  'x-small': 'XS',
  xsmall: 'XS',
  'extra small': 'XS',
  'x-large': 'XL',
  xlarge: 'XL',
  'extra large': 'XL',
  'xx-large': 'XXL',
  xxlarge: 'XXL',
  'extra extra large': 'XXL',
  xl: 'XL',
  xs: 'XS',
  xxl: 'XXL',
  sm: 'S',
  md: 'M',
  lg: 'L',
  'one size': 'OS',
  onesize: 'OS',
}

export function abbreviateSizeLabel(raw: string): string {
  const key = raw.trim().toLowerCase().replace(/\s+/g, ' ')
  return SIZE_WORD_TO_ABBREV[key] ?? raw.trim()
}

const PRICE_LOW_FIELD = 'price.low'
const PRICE_HIGH_FIELD = 'price.high'

export function getPriceBounds(facet: ISearchFacet): IPriceRange {
  let min = Number.POSITIVE_INFINITY
  let max = Number.NEGATIVE_INFINITY
  for (const v of facet.values) {
    if (v.type !== 'range') continue
    const low = v.low === '*' ? 0 : Number.parseFloat(v.low ?? '')
    const high = v.high === '*' ? NaN : Number.parseFloat(v.high ?? '')
    if (Number.isFinite(low)) min = Math.min(min, low)
    if (Number.isFinite(high)) max = Math.max(max, high)
  }
  if (!Number.isFinite(min)) min = 0
  if (!Number.isFinite(max) || max <= min) max = min + 150
  return { low: min, high: max }
}

export function parsePriceRangeFromFilters(filters: IActiveFilter[]): IPriceRange | null {
  const lowF = filters.find((f) => f.field === PRICE_LOW_FIELD)
  const highF = filters.find((f) => f.field === PRICE_HIGH_FIELD)
  if (!lowF && !highF) return null
  const low = lowF ? Number.parseFloat(lowF.value) : 0
  const high = highF ? Number.parseFloat(highF.value) : 150
  if (!Number.isFinite(low) || !Number.isFinite(high)) return null
  return { low, high }
}

export function stripPriceFilters(filters: IActiveFilter[]): IActiveFilter[] {
  return filters.filter((f) => f.field !== PRICE_LOW_FIELD && f.field !== PRICE_HIGH_FIELD)
}

export function withPriceRange(
  filters: IActiveFilter[],
  range: IPriceRange | null,
  bounds: IPriceRange,
): IActiveFilter[] {
  const base = stripPriceFilters(filters)
  if (!range) return base
  if (range.low <= bounds.low && range.high >= bounds.high) return base
  return [
    ...base,
    { field: PRICE_LOW_FIELD, value: String(Math.round(range.low)) },
    { field: PRICE_HIGH_FIELD, value: String(Math.round(range.high)) },
  ]
}

export function buildSearchUrl(params: {
  query: string
  page: number
  resultsPerPage?: number
  filters?: IActiveFilter[]
  sort?: ISortSelection | null
}): string {
  const search = new URLSearchParams({
    siteId: SEARCH_SITE_ID,
    q: params.query,
    resultsFormat: 'native',
    page: String(params.page),
  })
  search.set('resultsPerPage', String(params.resultsPerPage ?? RESULTS_PER_PAGE))
  for (const { field, value } of params.filters ?? []) {
    search.append(`filter.${field}`, value)
  }
  if (params.sort) {
    search.set(`sort.${params.sort.field}`, params.sort.direction)
  }
  return `https://${SEARCH_SITE_ID}.a.searchspring.io/api/search/search.json?${search}`
}

export async function fetchSearchResults(params: {
  query: string
  page: number
  resultsPerPage?: number
  filters?: IActiveFilter[]
  sort?: ISortSelection | null
  signal?: AbortSignal
}): Promise<ISearchResponse> {
  const url = buildSearchUrl(params)
  const res = await fetch(url, { signal: params.signal })
  if (!res.ok) {
    throw new Error(`Search failed (${res.status})`)
  }
  return res.json() as Promise<ISearchResponse>
}

export function parseAmount(value: string | number | undefined): number | null {
  if (value === undefined || value === null || value === '') return null
  const n = typeof value === 'number' ? value : Number.parseFloat(String(value))
  return Number.isFinite(n) ? n : null
}

export function stableFiltersKey(filters: IActiveFilter[]): string {
  if (filters.length === 0) return ''
  return [...filters]
    .sort((a, b) => a.field.localeCompare(b.field) || a.value.localeCompare(b.value))
    .map((f) => `${f.field}=${f.value}`)
    .join('|')
}

export function sortKey(sort: ISortSelection | null): string {
  if (!sort) return ''
  return `${sort.field}:${sort.direction}`
}

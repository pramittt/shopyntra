export interface ISearchProductBadge {
  tag?: string
  value?: string
}

export interface ISearchProduct {
  id: string
  name?: string
  thumbnailImageUrl?: string
  imageUrl?: string
  price?: string | number
  msrp?: string | number
  on_sale?: string[]
  brand?: string
  description?: string
  url?: string
  sku?: string
  badges?: ISearchProductBadge[]
  quantity_available?: string[]
  size?: string[]
  size_dress?: string[]
  size_universal?: string[]
}

export interface ISearchPagination {
  totalResults: number
  begin: number
  end: number
  currentPage: number
  totalPages: number
  previousPage: number
  nextPage: number
  perPage: number
}

export type FacetMultiple = 'single' | 'multiple' | 'multiple-union'

export interface IFacetValue {
  active?: boolean
  type?: string
  value: string
  label: string
  count: number
  low?: string
  high?: string
}

export interface IPriceRange {
  low: number
  high: number
}

export interface ISearchFacet {
  field: string
  label: string
  type: string
  multiple?: FacetMultiple
  values: IFacetValue[]
}

export interface ISortOption {
  field: string
  direction: 'asc' | 'desc'
  label: string
  active?: number
}

export interface ISearchSorting {
  options: ISortOption[]
}

export interface IActiveFilter {
  field: string
  value: string
}

export interface ISearchResponse {
  results: ISearchProduct[]
  pagination: ISearchPagination
  facets?: ISearchFacet[]
  sorting?: ISearchSorting
}

export interface ISortSelection {
  field: string
  direction: 'asc' | 'desc'
}

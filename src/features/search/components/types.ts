import type {
  FacetMultiple,
  IActiveFilter,
  IPriceRange,
  ISearchFacet,
  ISortOption,
  ISortSelection,
} from '../api/types'

export interface IFacetPanelProps {
  facets: ISearchFacet[] | undefined
  priceBounds: IPriceRange | null
  activeFilters: IActiveFilter[]
  onToggle: (field: string, value: string, multiple: FacetMultiple) => void
  onPriceCommit: (range: IPriceRange | null, bounds: IPriceRange) => void
  onClearAll: () => void
  variant?: 'dropdown' | 'sheet'
}

export interface ISortSelectProps {
  options: ISortOption[] | undefined
  value: ISortSelection | null
  onChange: (sort: ISortSelection | null) => void
  loadedCount: number
  totalResults: number
  disabled?: boolean
  variant?: 'inline' | 'sheet'
  showMeta?: boolean
  onSelect?: () => void
  className?: string
}

export interface IPriceRangeFilterProps {
  bounds: IPriceRange
  value: IPriceRange | null
  onCommit: (range: IPriceRange | null) => void
}

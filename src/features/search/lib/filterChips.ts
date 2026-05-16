import {
  parsePriceRangeFromFilters,
  type FacetMultiple,
  type IActiveFilter,
  type IPriceRange,
  type ISearchFacet,
} from '../api/searchApi'

export interface IFilterChip {
  id: string
  label: string
  field: string
  value: string
  multiple: FacetMultiple
}

function facetMultiple(f: ISearchFacet | undefined): FacetMultiple {
  if (!f) return 'single'
  return f.multiple === 'multiple' || f.multiple === 'multiple-union' ? 'multiple' : 'single'
}

export function buildFilterChips(
  activeFilters: IActiveFilter[],
  facets: ISearchFacet[] | undefined,
  priceBounds: IPriceRange | null,
): IFilterChip[] {
  const chips: IFilterChip[] = []
  const priceRange = parsePriceRangeFromFilters(activeFilters)

  if (priceRange && priceBounds) {
    chips.push({
      id: 'price',
      label: `$${Math.round(priceRange.low)} – $${Math.round(priceRange.high)}`,
      field: 'price',
      value: '',
      multiple: 'single',
    })
  }

  for (const f of activeFilters) {
    if (f.field === 'price.low' || f.field === 'price.high') continue
    const facet = facets?.find((x) => x.field === f.field)
    const facetValue = facet?.values.find((v) => v.value === f.value)
    const facetLabel = facet?.label ?? f.field
    const valueLabel = facetValue?.label ?? f.value
    chips.push({
      id: `${f.field}\u0000${f.value}`,
      label: `${facetLabel}: ${valueLabel}`,
      field: f.field,
      value: f.value,
      multiple: facetMultiple(facet),
    })
  }

  return chips
}

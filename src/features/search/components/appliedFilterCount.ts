import type { IFacetPanelProps } from './types'

export function appliedFilterCount(activeFilters: IFacetPanelProps['activeFilters']): number {
  const facetCount = activeFilters.filter((f) => !f.field.startsWith('price.')).length
  const hasPrice = activeFilters.some((f) => f.field.startsWith('price.'))
  return facetCount + (hasPrice ? 1 : 0)
}

import {
  parsePriceRangeFromFilters,
  type FacetMultiple,
  type ISearchFacet,
} from '../api/searchApi'
import { cn } from '../../../lib/cn'
import { FacetSection } from './FacetSection'
import { PriceRangeFilter } from './PriceRangeFilter'
import type { IFacetPanelProps } from './types'
import styles from './FacetPanel.module.css'

const HIDDEN_FACETS = new Set(['color'])

function facetMultiple(f: ISearchFacet): FacetMultiple {
  return f.multiple === 'multiple' || f.multiple === 'multiple-union' ? 'multiple' : 'single'
}

export function FacetPanel({
  facets,
  priceBounds,
  activeFilters,
  onToggle,
  onPriceCommit,
  onClearAll,
  variant = 'dropdown',
}: IFacetPanelProps) {
  const facetList = facets ?? []
  const hasFacets = facetList.length > 0
  const hasActiveFilters = activeFilters.length > 0
  if (!hasFacets && !hasActiveFilters && !priceBounds) return null

  const isActive = (field: string, value: string) =>
    activeFilters.some((a) => a.field === field && a.value === value)

  const priceValue = parsePriceRangeFromFilters(activeFilters)

  return (
    <div
      className={cn(
        styles.panel,
        variant === 'sheet' && styles.panelSheet,
        variant === 'dropdown' && styles.panelDropdown,
      )}
    >
      <ClearAllButton disabled={!hasActiveFilters} onClear={onClearAll} />
      {priceBounds ? (
        <PriceFacetSection
          bounds={priceBounds}
          value={priceValue}
          onCommit={(range) => onPriceCommit(range, priceBounds)}
        />
      ) : null}
      {facetList.map((facet) => (
        <FacetPanelItem
          key={facet.field}
          facet={facet}
          isActive={isActive}
          onToggle={onToggle}
        />
      ))}
    </div>
  )
}

function ClearAllButton({ disabled, onClear }: { disabled: boolean; onClear: () => void }) {
  return (
    <button type="button" className={styles.clearBtn} disabled={disabled} onClick={onClear}>
      Clear all
    </button>
  )
}

function PriceFacetSection({
  bounds,
  value,
  onCommit,
}: {
  bounds: NonNullable<IFacetPanelProps['priceBounds']>
  value: ReturnType<typeof parsePriceRangeFromFilters>
  onCommit: (range: Parameters<IFacetPanelProps['onPriceCommit']>[0]) => void
}) {
  return (
    <div className={styles.facet}>
      <h3 className={styles.facetLabel}>Price</h3>
      <PriceRangeFilter bounds={bounds} value={value} onCommit={onCommit} />
    </div>
  )
}

function FacetPanelItem({
  facet,
  isActive,
  onToggle,
}: {
  facet: ISearchFacet
  isActive: (field: string, value: string) => boolean
  onToggle: IFacetPanelProps['onToggle']
}) {
  if (facet.field === 'price') return null
  if (HIDDEN_FACETS.has(facet.field)) return null

  return (
    <FacetSection facet={facet} multiple={facetMultiple(facet)} isActive={isActive} onToggle={onToggle} />
  )
}

import {
  parsePriceRangeFromFilters,
  type FacetMultiple,
  type ISearchFacet,
} from '../api/searchApi'
import { colorSwatchHex, swatchNeedsBorder } from '../lib/colorSwatch'
import { cn } from '../../../lib/cn'
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
      <button
        type="button"
        className={styles.clearBtn}
        disabled={!hasActiveFilters}
        onClick={onClearAll}
      >
        Clear all
      </button>

      {priceBounds ? (
        <div className={styles.facet}>
          <h3 className={styles.facetLabel}>Price</h3>
          <PriceRangeFilter
            bounds={priceBounds}
            value={priceValue}
            onCommit={(range) => onPriceCommit(range, priceBounds)}
          />
        </div>
      ) : null}

      {facetList.map((facet) => {
        if (facet.field === 'price') return null
        if (HIDDEN_FACETS.has(facet.field)) return null
        const mult = facetMultiple(facet)
        const isColorFacet = facet.type === 'palette' || /^color/i.test(facet.field)

        return (
          <div key={facet.field} className={styles.facet}>
            <h3 className={styles.facetLabel}>{facet.label}</h3>
            <ul className={cn(styles.values, isColorFacet && styles.colorValues)}>
              {facet.values.map((v) => {
                const active = isActive(facet.field, v.value)
                const hex = colorSwatchHex(v.label)
                return (
                  <li key={`${facet.field}-${v.value}`}>
                    <button
                      type="button"
                      className={cn(
                        styles.valueBtn,
                        active && styles.valueBtnActive,
                        isColorFacet && styles.colorBtn,
                      )}
                      onClick={() => onToggle(facet.field, v.value, mult)}
                    >
                      <span className={styles.valueLabel}>
                        {isColorFacet ? (
                          <>
                            <span
                              className={cn(
                                styles.swatch,
                                swatchNeedsBorder(v.label) && styles.swatchBorder,
                              )}
                              style={{ backgroundColor: hex }}
                              aria-hidden
                            />
                            {v.label}
                          </>
                        ) : (
                          v.label
                        )}
                      </span>
                      <span className={styles.count}>{v.count}</span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
        )
      })}
    </div>
  )
}

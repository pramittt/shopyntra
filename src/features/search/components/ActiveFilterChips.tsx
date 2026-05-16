import { buildFilterChips } from '../lib/filterChips'
import {
  type FacetMultiple,
  type IActiveFilter,
  type IPriceRange,
  type ISearchFacet,
} from '../api/searchApi'
import styles from './ActiveFilterChips.module.css'

export interface IActiveFilterChipsProps {
  activeFilters: IActiveFilter[]
  facets: ISearchFacet[] | undefined
  priceBounds: IPriceRange | null
  onToggle: (field: string, value: string, multiple: FacetMultiple) => void
  onPriceCommit: (range: IPriceRange | null, bounds: IPriceRange) => void
  onClearAll: () => void
}

export function ActiveFilterChips({
  activeFilters,
  facets,
  priceBounds,
  onToggle,
  onPriceCommit,
  onClearAll,
}: IActiveFilterChipsProps) {
  const chips = buildFilterChips(activeFilters, facets, priceBounds)
  if (chips.length === 0) return null

  return (
    <div className={styles.bar}>
      <ul className={styles.list}>
        {chips.map((chip) => (
          <li key={chip.id}>
            <button
              type="button"
              className={styles.chip}
              onClick={() => {
                if (chip.id === 'price' && priceBounds) {
                  onPriceCommit(null, priceBounds)
                  return
                }
                onToggle(chip.field, chip.value, chip.multiple)
              }}
            >
              <span>{chip.label}</span>
              <span className={styles.remove} aria-hidden>
                ×
              </span>
            </button>
          </li>
        ))}
      </ul>
      {chips.length > 1 ? (
        <button type="button" className={styles.clearAll} onClick={onClearAll}>
          Clear all
        </button>
      ) : null}
    </div>
  )
}

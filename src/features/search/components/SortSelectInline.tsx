import type { ISortOption, ISortSelection } from '../api/searchApi'
import { cn } from '../../../lib/cn'
import { isRelevanceSort, optionKey, parseSortKey } from './sortSelectUtils'
import styles from './SortSelect.module.css'

interface ISortSelectInlineProps {
  options?: ISortOption[]
  value: ISortSelection | null
  disabled?: boolean
  loadedCount: number
  totalResults: number
  showMeta?: boolean
  className?: string
  onChange: (sort: ISortSelection | null) => void
}

export function SortSelectInline({
  options,
  value,
  disabled,
  loadedCount,
  totalResults,
  showMeta = true,
  className,
  onChange,
}: ISortSelectInlineProps) {
  const selectableOptions = options?.filter((o) => !isRelevanceSort(o)) ?? []
  const selectValue = value ? optionKey(value.field, value.direction) : ''

  return (
    <div className={cn(styles.row, className)}>
      <label className={styles.label} htmlFor="searchspring-sort">
        Sort
      </label>
      <select
        id="searchspring-sort"
        className={styles.select}
        value={selectValue}
        disabled={disabled || !options?.length}
        onChange={(e) => onChange(parseSortKey(e.target.value))}
      >
        <option value="">Best match</option>
        {selectableOptions.map((o) => (
          <option key={optionKey(o.field, o.direction)} value={optionKey(o.field, o.direction)}>
            {o.label}
          </option>
        ))}
      </select>
      {showMeta && totalResults > 0 ? (
        <span className={styles.meta}>
          Showing {loadedCount} of {totalResults}
        </span>
      ) : null}
    </div>
  )
}

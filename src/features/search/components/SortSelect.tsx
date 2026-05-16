import type { ISortOption, ISortSelection } from '../api/searchApi'
import { cn } from '../../../lib/cn'
import type { ISortSelectProps } from './types'
import styles from './SortSelect.module.css'

function optionKey(field: string, direction: string): string {
  return `${field}\u0000${direction}`
}

function parseKey(key: string): ISortSelection | null {
  if (!key) return null
  const i = key.indexOf('\u0000')
  if (i < 0) return null
  const field = key.slice(0, i)
  const direction = key.slice(i + 1) as ISortSelection['direction']
  if (direction !== 'asc' && direction !== 'desc') return null
  return { field, direction }
}

function isSelected(value: ISortSelection | null, option: ISortOption): boolean {
  if (!value) return false
  return value.field === option.field && value.direction === option.direction
}

function isRelevanceSort(o: ISortOption): boolean {
  return o.field === 'relevance'
}

export function SortSelect({
  options,
  value,
  onChange,
  loadedCount,
  totalResults,
  disabled,
  variant = 'inline',
  showMeta = true,
  onSelect,
  className,
}: ISortSelectProps) {
  const selectableOptions = options?.filter((o) => !isRelevanceSort(o)) ?? []
  const selectValue = value ? optionKey(value.field, value.direction) : ''

  const apply = (sort: ISortSelection | null) => {
    onChange(sort)
    onSelect?.()
  }

  if (variant === 'sheet') {
    return (
      <ul className={styles.sheetList}>
        <li>
          <button
            type="button"
            className={cn(styles.sheetOption, !value && styles.sheetOptionActive)}
            disabled={disabled}
            onClick={() => apply(null)}
          >
            Best match
          </button>
        </li>
        {selectableOptions.map((o) => (
          <li key={optionKey(o.field, o.direction)}>
            <button
              type="button"
              className={cn(styles.sheetOption, isSelected(value, o) && styles.sheetOptionActive)}
              disabled={disabled}
              onClick={() => apply({ field: o.field, direction: o.direction })}
            >
              {o.label}
            </button>
          </li>
        ))}
      </ul>
    )
  }

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
        onChange={(e) => onChange(parseKey(e.target.value))}
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

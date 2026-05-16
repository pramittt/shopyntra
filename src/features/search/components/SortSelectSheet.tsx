import type { ISortOption, ISortSelection } from '../api/searchApi'
import { cn } from '../../../lib/cn'
import { isRelevanceSort, isSelected, optionKey } from './sortSelectUtils'
import styles from './SortSelect.module.css'

interface ISortSelectSheetProps {
  options?: ISortOption[]
  value: ISortSelection | null
  disabled?: boolean
  onApply: (sort: ISortSelection | null) => void
}

export function SortSelectSheet({ options, value, disabled, onApply }: ISortSelectSheetProps) {
  const selectableOptions = options?.filter((o) => !isRelevanceSort(o)) ?? []

  return (
    <ul className={styles.sheetList}>
      <li>
        <button
          type="button"
          className={cn(styles.sheetOption, !value && styles.sheetOptionActive)}
          disabled={disabled}
          onClick={() => onApply(null)}
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
            onClick={() => onApply({ field: o.field, direction: o.direction })}
          >
            {o.label}
          </button>
        </li>
      ))}
    </ul>
  )
}

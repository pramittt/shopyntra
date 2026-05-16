import { CloseIcon } from '../../../components/CloseIcon/CloseIcon'
import { cn } from '../../../lib/cn'
import styles from './ResultsToolbar.module.css'

interface IResultsToolbarControlsProps {
  canFilter: boolean
  filterCount: number
  filterOpen: boolean
  sortOpen: boolean
  sortLabel: string
  sortDisabled: boolean
  controlsDisabled?: boolean
  showMeta: boolean
  loadedCount: number
  totalResults: number
  onToggleFilter: () => void
  onToggleSort: () => void
}

export function ResultsToolbarControls({
  canFilter,
  filterCount,
  filterOpen,
  sortOpen,
  sortLabel,
  sortDisabled,
  controlsDisabled,
  showMeta,
  loadedCount,
  totalResults,
  onToggleFilter,
  onToggleSort,
}: IResultsToolbarControlsProps) {
  return (
    <div className={styles.controls}>
      <div className={styles.leftActions}>
        {canFilter ? (
          <FilterTrigger
            open={filterOpen}
            filterCount={filterCount}
            disabled={controlsDisabled}
            onClick={onToggleFilter}
          />
        ) : null}
        <SortTrigger
          open={sortOpen}
          sortLabel={sortLabel}
          disabled={controlsDisabled || sortDisabled}
          onClick={onToggleSort}
        />
      </div>
      {showMeta ? (
        <span className={styles.meta}>
          Showing {loadedCount} of {totalResults}
        </span>
      ) : null}
    </div>
  )
}

function FilterTrigger({
  open,
  filterCount,
  disabled,
  onClick,
}: {
  open: boolean
  filterCount: number
  disabled?: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      className={cn(styles.trigger, open && styles.triggerOpen)}
      disabled={disabled}
      aria-expanded={open}
      aria-label={open ? 'Close filters' : 'Open filters'}
      onClick={onClick}
    >
      {open ? <CloseIcon size={16} className={styles.triggerIcon} /> : null}
      Filter
      {filterCount > 0 && !open ? <span className={styles.badge}>{filterCount}</span> : null}
    </button>
  )
}

function SortTrigger({
  open,
  sortLabel,
  disabled,
  onClick,
}: {
  open: boolean
  sortLabel: string
  disabled?: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      className={cn(styles.trigger, open && styles.triggerOpen)}
      disabled={disabled}
      aria-expanded={open}
      aria-label={open ? 'Close sort' : `Sort: ${sortLabel}`}
      onClick={onClick}
    >
      {open ? <CloseIcon size={16} className={styles.triggerIcon} /> : null}
      Sort: {sortLabel}
    </button>
  )
}

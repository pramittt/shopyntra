import { useState } from 'react'
import { CloseIcon } from '../../../components/CloseIcon/CloseIcon'
import { LeftSidePanel } from '../../../components/LeftSidePanel/LeftSidePanel'
import { cn } from '../../../lib/cn'
import { getSortLabel } from '../lib/sortLabel'
import { ActiveFilterChips } from './ActiveFilterChips'
import { FacetPanel } from './FacetPanel'
import { SortSelect } from './SortSelect'
import type { IFacetPanelProps, ISortSelectProps } from './types'
import styles from './ResultsToolbar.module.css'

type Panel = 'filter' | 'sort' | null

export interface IResultsToolbarProps {
  id?: string
  facetPanel: Omit<IFacetPanelProps, 'variant'>
  sort: ISortSelectProps
  controlsDisabled?: boolean
}

function appliedFilterCount(activeFilters: IFacetPanelProps['activeFilters']): number {
  const facetCount = activeFilters.filter((f) => !f.field.startsWith('price.')).length
  const hasPrice = activeFilters.some((f) => f.field.startsWith('price.'))
  return facetCount + (hasPrice ? 1 : 0)
}

export function ResultsToolbar({ id, facetPanel, sort, controlsDisabled }: IResultsToolbarProps) {
  const [panel, setPanel] = useState<Panel>(null)
  const filterCount = appliedFilterCount(facetPanel.activeFilters)
  const sortLabel = getSortLabel(sort.value, sort.options)
  const facetList = facetPanel.facets ?? []
  const canFilter =
    facetList.length > 0 ||
    facetPanel.priceBounds !== null ||
    facetPanel.activeFilters.length > 0

  return (
    <div className={styles.sticky} id={id}>
      <div className={styles.controls}>
        <div className={styles.leftActions}>
          {canFilter ? (
            <button
              type="button"
              className={cn(styles.trigger, panel === 'filter' && styles.triggerOpen)}
              disabled={controlsDisabled}
              aria-expanded={panel === 'filter'}
              aria-label={panel === 'filter' ? 'Close filters' : 'Open filters'}
              onClick={() => setPanel((p) => (p === 'filter' ? null : 'filter'))}
            >
              {panel === 'filter' ? <CloseIcon size={16} className={styles.triggerIcon} /> : null}
              Filter
              {filterCount > 0 && panel !== 'filter' ? (
                <span className={styles.badge}>{filterCount}</span>
              ) : null}
            </button>
          ) : null}
          <button
            type="button"
            className={cn(styles.trigger, panel === 'sort' && styles.triggerOpen)}
            disabled={controlsDisabled || !sort.options?.length}
            aria-expanded={panel === 'sort'}
            aria-label={panel === 'sort' ? 'Close sort' : `Sort: ${sortLabel}`}
            onClick={() => setPanel((p) => (p === 'sort' ? null : 'sort'))}
          >
            {panel === 'sort' ? <CloseIcon size={16} className={styles.triggerIcon} /> : null}
            Sort: {sortLabel}
          </button>
        </div>
        {sort.showMeta !== false && sort.totalResults > 0 ? (
          <span className={styles.meta}>
            Showing {sort.loadedCount} of {sort.totalResults}
          </span>
        ) : null}
      </div>

      <ActiveFilterChips
        activeFilters={facetPanel.activeFilters}
        facets={facetPanel.facets}
        priceBounds={facetPanel.priceBounds}
        onToggle={facetPanel.onToggle}
        onPriceCommit={facetPanel.onPriceCommit}
        onClearAll={facetPanel.onClearAll}
      />

      <LeftSidePanel open={panel === 'filter'} title="Filter" onClose={() => setPanel(null)}>
        <FacetPanel {...facetPanel} variant="sheet" />
      </LeftSidePanel>

      <LeftSidePanel open={panel === 'sort'} title="Sort by" onClose={() => setPanel(null)}>
        <SortSelect
          {...sort}
          variant="sheet"
          showMeta={false}
          onSelect={() => setPanel(null)}
        />
      </LeftSidePanel>
    </div>
  )
}

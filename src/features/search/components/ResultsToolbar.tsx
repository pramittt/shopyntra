import { useState } from 'react'
import { LeftSidePanel } from '../../../components/LeftSidePanel/LeftSidePanel'
import { appliedFilterCount } from './appliedFilterCount'
import { ActiveFilterChips } from './ActiveFilterChips'
import { FacetPanel } from './FacetPanel'
import { ResultsToolbarControls } from './ResultsToolbarControls'
import { SortSelect } from './SortSelect'
import { getSortLabel } from '../lib/sortLabel'
import type { IFacetPanelProps, ISortSelectProps } from './types'
import styles from './ResultsToolbar.module.css'

type Panel = 'filter' | 'sort' | null

export interface IResultsToolbarProps {
  id?: string
  facetPanel: Omit<IFacetPanelProps, 'variant'>
  sort: ISortSelectProps
  controlsDisabled?: boolean
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
      <ResultsToolbarControls
        canFilter={canFilter}
        filterCount={filterCount}
        filterOpen={panel === 'filter'}
        sortOpen={panel === 'sort'}
        sortLabel={sortLabel}
        sortDisabled={!sort.options?.length}
        controlsDisabled={controlsDisabled}
        showMeta={sort.showMeta !== false && sort.totalResults > 0}
        loadedCount={sort.loadedCount}
        totalResults={sort.totalResults}
        onToggleFilter={() => setPanel((p) => (p === 'filter' ? null : 'filter'))}
        onToggleSort={() => setPanel((p) => (p === 'sort' ? null : 'sort'))}
      />

      <ActiveFilterChips
        activeFilters={facetPanel.activeFilters}
        facets={facetPanel.facets}
        priceBounds={facetPanel.priceBounds}
        onToggle={facetPanel.onToggle}
        onPriceCommit={facetPanel.onPriceCommit}
        onClearAll={facetPanel.onClearAll}
      />

      <ToolbarPanels panel={panel} facetPanel={facetPanel} sort={sort} onClose={() => setPanel(null)} />
    </div>
  )
}

function ToolbarPanels({
  panel,
  facetPanel,
  sort,
  onClose,
}: {
  panel: Panel
  facetPanel: Omit<IFacetPanelProps, 'variant'>
  sort: ISortSelectProps
  onClose: () => void
}) {
  return (
    <>
      <LeftSidePanel open={panel === 'filter'} title="Filter" onClose={onClose}>
        <FacetPanel {...facetPanel} variant="sheet" />
      </LeftSidePanel>
      <LeftSidePanel open={panel === 'sort'} title="Sort by" onClose={onClose}>
        <SortSelect {...sort} variant="sheet" showMeta={false} onSelect={onClose} />
      </LeftSidePanel>
    </>
  )
}

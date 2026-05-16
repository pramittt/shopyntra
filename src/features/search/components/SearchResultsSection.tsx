import type { RefObject } from 'react'
import { ProductGrid } from '../../../components/ProductGrid/ProductGrid'
import type { ISearchProduct } from '../api/searchApi'
import type { IFacetPanelProps, ISortSelectProps } from './types'
import { ResultsToolbar } from './ResultsToolbar'
import styles from '../SearchPage.module.css'

interface ISearchResultsSectionProps {
  topNavId: string
  facetPanel: Omit<IFacetPanelProps, 'variant'>
  sort: ISortSelectProps
  controlsDisabled: boolean
  loading: boolean
  loadingMore: boolean
  skeletonCount: number
  results: ISearchProduct[]
  sentinelRef: RefObject<HTMLDivElement | null>
  hasMore: boolean
  submittedQuery: string
  showEmptyResults: boolean
}

export function SearchResultsSection({
  topNavId,
  facetPanel,
  sort,
  controlsDisabled,
  loading,
  loadingMore,
  skeletonCount,
  results,
  sentinelRef,
  hasMore,
  submittedQuery,
  showEmptyResults,
}: ISearchResultsSectionProps) {
  return (
    <div className={styles.results}>
      <ResultsToolbar
        id={topNavId}
        facetPanel={facetPanel}
        sort={sort}
        controlsDisabled={controlsDisabled}
      />
      <ProductGrid
        loading={loading && !loadingMore}
        loadingMore={loadingMore}
        skeletonCount={skeletonCount}
        products={results}
      />
      <div ref={sentinelRef} className={styles.sentinel} aria-hidden />
      <ResultsFooter
        loading={loading}
        hasMore={hasMore}
        resultsCount={results.length}
        submittedQuery={submittedQuery}
        showEmptyResults={showEmptyResults}
      />
    </div>
  )
}

function ResultsFooter({
  loading,
  hasMore,
  resultsCount,
  submittedQuery,
  showEmptyResults,
}: {
  loading: boolean
  hasMore: boolean
  resultsCount: number
  submittedQuery: string
  showEmptyResults: boolean
}) {
  if (!loading && !hasMore && resultsCount > 0) {
    return <p className={styles.endHint}>That&apos;s everything we found</p>
  }
  if (showEmptyResults) {
    return <p className={styles.empty}>No products found for &ldquo;{submittedQuery}&rdquo;.</p>
  }
  return null
}

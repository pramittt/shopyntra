import { useId, useRef } from 'react'
import { QuickSearch } from '../../components/QuickSearch/QuickSearch'
import { SearchForm } from '../../components/SearchForm/SearchForm'
import { SearchPageHeader } from './components/SearchPageHeader'
import { SearchResultsSection } from './components/SearchResultsSection'
import { useInfiniteScroll } from './hooks/useInfiniteScroll'
import { useProductSearch } from './hooks/useProductSearch'
import styles from './SearchPage.module.css'

export function SearchPage() {
  const formId = useId()
  const topNavId = `${formId}-results-top`
  const sentinelRef = useRef<HTMLDivElement | null>(null)

  const search = useProductSearch(topNavId)

  useInfiniteScroll(sentinelRef, Boolean(search.submittedQuery && search.hasMore), search.loadMore)

  const facetPanelProps = {
    facets: search.data?.facets,
    priceBounds: search.priceBounds,
    activeFilters: search.activeFilters,
    onToggle: search.toggleFilter,
    onPriceCommit: search.setPriceRange,
    onClearAll: search.clearFilters,
  }

  return (
    <main className={styles.main}>
      <SearchPageHeader />

      <SearchFormSection
        formId={formId}
        inputValue={search.inputValue}
        setInputValue={search.setInputValue}
        runSearch={search.runSearch}
        recentSearches={search.recentSearches}
        startSearch={search.startSearch}
      />

      {search.error ? (
        <p className={styles.error} role="alert">
          {search.error}
        </p>
      ) : null}

      {search.submittedQuery ? (
        <SearchResultsSection
          topNavId={topNavId}
          facetPanel={facetPanelProps}
          sort={{
            options: search.data?.sorting?.options,
            value: search.sortSelection,
            onChange: search.selectSort,
            loadedCount: search.results.length,
            totalResults: search.totalResults,
            disabled: search.loading && !search.loadingMore,
          }}
          controlsDisabled={search.loading && !search.loadingMore}
          loading={search.loading}
          loadingMore={search.loadingMore}
          skeletonCount={search.skeletonCount}
          results={search.results}
          sentinelRef={sentinelRef}
          hasMore={search.hasMore}
          submittedQuery={search.submittedQuery}
          showEmptyResults={!search.loading && Boolean(search.data) && search.results.length === 0}
        />
      ) : (
        <p className={styles.hint}>Type something above and hit Search.</p>
      )}
    </main>
  )
}

function SearchFormSection({
  formId,
  inputValue,
  setInputValue,
  runSearch,
  recentSearches,
  startSearch,
}: {
  formId: string
  inputValue: string
  setInputValue: (v: string) => void
  runSearch: () => void
  recentSearches: string[]
  startSearch: (q: string) => void
}) {
  return (
    <div className={styles.searchStack}>
      <SearchForm formId={formId} value={inputValue} onChange={setInputValue} onSubmit={runSearch} />
      <QuickSearch keywords={recentSearches} onPick={startSearch} />
    </div>
  )
}

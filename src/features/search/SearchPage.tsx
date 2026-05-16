import { useEffect, useId, useRef } from 'react'
import { ProductGrid } from '../../components/ProductGrid/ProductGrid'
import { QuickSearch } from '../../components/QuickSearch/QuickSearch'
import { SearchForm } from '../../components/SearchForm/SearchForm'
import { ResultsToolbar } from './components/ResultsToolbar'
import { useProductSearch } from './hooks/useProductSearch'
import styles from './SearchPage.module.css'

export function SearchPage() {
  const formId = useId()
  const topNavId = `${formId}-results-top`
  const sentinelRef = useRef<HTMLDivElement | null>(null)

  const {
    inputValue,
    setInputValue,
    submittedQuery,
    loading,
    loadingMore,
    error,
    data,
    recentSearches,
    runSearch,
    startSearch,
    results,
    skeletonCount,
    activeFilters,
    priceBounds,
    toggleFilter,
    clearFilters,
    setPriceRange,
    sortSelection,
    selectSort,
    hasMore,
    loadMore,
    totalResults,
  } = useProductSearch(topNavId)

  useEffect(() => {
    const node = sentinelRef.current
    if (!node || !submittedQuery || !hasMore) return

    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) loadMore()
      },
      { root: null, rootMargin: '280px 0px', threshold: 0 },
    )
    obs.observe(node)
    return () => obs.disconnect()
  }, [submittedQuery, hasMore, loadMore, loading, results.length])

  const facetPanelProps = {
    facets: data?.facets,
    priceBounds,
    activeFilters,
    onToggle: toggleFilter,
    onPriceCommit: setPriceRange,
    onClearAll: clearFilters,
  }

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <h1 className={styles.title}>What are you looking for?</h1>
        <p className={styles.subtitle}>Dresses, shoes, brands — start with a search.</p>
      </header>

      <div className={styles.searchStack}>
        <SearchForm
          formId={formId}
          value={inputValue}
          onChange={setInputValue}
          onSubmit={runSearch}
        />
        <QuickSearch keywords={recentSearches} onPick={startSearch} />
      </div>

      {error ? (
        <p className={styles.error} role="alert">
          {error}
        </p>
      ) : null}

      {submittedQuery ? (
        <div className={styles.results}>
          <ResultsToolbar
            id={topNavId}
            facetPanel={facetPanelProps}
            sort={{
              options: data?.sorting?.options,
              value: sortSelection,
              onChange: selectSort,
              loadedCount: results.length,
              totalResults,
              disabled: loading && !loadingMore,
            }}
            controlsDisabled={loading && !loadingMore}
          />

          <ProductGrid
            loading={loading && !loadingMore}
            loadingMore={loadingMore}
            skeletonCount={skeletonCount}
            products={results}
          />

          <div ref={sentinelRef} className={styles.sentinel} aria-hidden />

          {!loading && !hasMore && results.length > 0 ? (
            <p className={styles.endHint}>That&apos;s everything we found</p>
          ) : null}

          {!loading && data && results.length === 0 ? (
            <p className={styles.empty}>No products found for &ldquo;{submittedQuery}&rdquo;.</p>
          ) : null}
        </div>
      ) : (
        <p className={styles.hint}>Type something above and hit Search.</p>
      )}
    </main>
  )
}

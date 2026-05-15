import { useId } from 'react'
import { PaginationBar } from '../../components/PaginationBar/PaginationBar'
import { ProductGrid } from '../../components/ProductGrid/ProductGrid'
import { QuickSearch } from '../../components/QuickSearch/QuickSearch'
import { SearchForm } from '../../components/SearchForm/SearchForm'
import { SEARCH_SITE_ID } from './api/searchApi'
import { useProductSearch } from './hooks/useProductSearch'
import styles from './SearchPage.module.css'

export function SearchPage() {
  const formId = useId()
  const topNavId = `${formId}-pagination-top`
  const bottomNavId = `${formId}-pagination-bottom`

  const {
    inputValue,
    setInputValue,
    submittedQuery,
    loading,
    error,
    data,
    recentSearches,
    runSearch,
    startSearch,
    onPageChange,
    pagination,
    results,
    skeletonCount,
  } = useProductSearch(topNavId)

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <h1 className={styles.title}>Search products</h1>
        <p className={styles.subtitle}>
          Demo catalog · Search API · site <code>{SEARCH_SITE_ID}</code>
        </p>
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
        <>
          <PaginationBar
            idPrefix={topNavId}
            pagination={pagination}
            busy={loading}
            onPageChange={onPageChange}
          />

          <ProductGrid loading={loading} skeletonCount={skeletonCount} products={results} />

          {!loading && data && results.length === 0 ? (
            <p className={styles.empty}>No products found for &ldquo;{submittedQuery}&rdquo;.</p>
          ) : null}

          <PaginationBar
            idPrefix={bottomNavId}
            pagination={pagination}
            busy={loading}
            onPageChange={onPageChange}
          />
        </>
      ) : (
        <p className={styles.hint}>Enter a search term and press Enter or click Search.</p>
      )}
    </main>
  )
}

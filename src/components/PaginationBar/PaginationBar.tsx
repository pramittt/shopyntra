import type { SearchPagination } from '../../features/search/api/searchApi'
import { cn } from '../../lib/cn'
import styles from './PaginationBar.module.css'

function buildPageWindow(current: number, total: number, radius = 2): number[] {
  if (total < 1) return []
  const lo = Math.max(1, current - radius)
  const hi = Math.min(total, current + radius)
  const pages: number[] = []
  for (let p = lo; p <= hi; p += 1) pages.push(p)
  return pages
}

export type PaginationBarProps = {
  pagination: SearchPagination | null
  busy: boolean
  onPageChange: (page: number) => void
  idPrefix: string
}

export function PaginationBar({ pagination, busy, onPageChange, idPrefix }: PaginationBarProps) {
  if (!pagination || pagination.totalPages < 1) return null

  const { currentPage, totalPages } = pagination
  const pages = buildPageWindow(currentPage, totalPages)
  const showPrev = currentPage > 1
  const showNext = currentPage < totalPages

  return (
    <nav className={styles.nav} aria-label="Search results pages" id={idPrefix}>
      <div className={styles.edge}>
        {showPrev ? (
          <button
            type="button"
            className={styles.navBtn}
            disabled={busy}
            onClick={() => onPageChange(currentPage - 1)}
          >
            Previous
          </button>
        ) : null}
      </div>
      <ul className={styles.pages}>
        {pages.map((p) => (
          <li key={p}>
            {p === currentPage ? (
              <span className={styles.current} aria-current="page">
                {p}
              </span>
            ) : (
              <button
                type="button"
                className={styles.pageBtn}
                disabled={busy}
                onClick={() => onPageChange(p)}
              >
                {p}
              </button>
            )}
          </li>
        ))}
      </ul>
      <div className={cn(styles.edge, styles.edgeEnd)}>
        {showNext ? (
          <button
            type="button"
            className={styles.navBtn}
            disabled={busy}
            onClick={() => onPageChange(currentPage + 1)}
          >
            Next
          </button>
        ) : null}
      </div>
    </nav>
  )
}

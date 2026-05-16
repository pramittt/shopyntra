import type { IQuickSearchProps } from './types'
import styles from './QuickSearch.module.css'

export function QuickSearch({ keywords, onPick }: IQuickSearchProps) {
  if (keywords.length === 0) return null

  return (
    <section className={styles.section} aria-label="Recent quick searches">
      <h2 className={styles.heading}>Recent searches</h2>
      <ul className={styles.list}>
        {keywords.map((keyword) => (
          <li key={keyword}>
            <button type="button" className={styles.chip} onClick={() => onPick(keyword)}>
              {keyword}
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}

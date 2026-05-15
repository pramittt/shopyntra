import styles from './QuickSearch.module.css'

export type QuickSearchProps = {
  keywords: string[]
  onPick: (keyword: string) => void
}

export function QuickSearch({ keywords, onPick }: QuickSearchProps) {
  if (keywords.length === 0) return null

  return (
    <section className={styles.section} aria-label="Recent quick searches">
      <h2 className={styles.heading}>Quick search</h2>
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

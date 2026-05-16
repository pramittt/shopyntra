import styles from '../SearchPage.module.css'

export function SearchPageHeader() {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>What are you looking for?</h1>
      <p className={styles.subtitle}>Dresses, shoes, brands — start with a search.</p>
    </header>
  )
}

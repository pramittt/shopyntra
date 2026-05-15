import styles from './AppNav.module.css'

export function AppNav() {
  return (
    <header className={styles.nav} role="banner">
      <span className={styles.brand}>shopyntra</span>
    </header>
  )
}

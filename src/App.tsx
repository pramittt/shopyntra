import { AppNav } from './components/AppNav/AppNav'
import { SearchPage } from './features/search/SearchPage'
import styles from './App.module.css'

export default function App() {
  return (
    <div className={styles.shell}>
      <AppNav />
      <SearchPage />
    </div>
  )
}

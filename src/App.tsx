import { AppNav } from './components/AppNav/AppNav'
import { CartSidePanel } from './components/CartSidePanel/CartSidePanel'
import { CartSnackbar } from './components/CartSnackbar/CartSnackbar'
import { WishlistSidePanel } from './components/WishlistSidePanel/WishlistSidePanel'
import { CartProvider } from './context/CartContext'
import { WishlistProvider } from './context/WishlistContext'
import { SearchPage } from './features/search/SearchPage'
import styles from './App.module.css'

export default function App() {
  return (
    <CartProvider>
      <WishlistProvider>
        <div className={styles.shell}>
          <AppNav />
          <SearchPage />
          <CartSidePanel />
          <WishlistSidePanel />
          <CartSnackbar />
        </div>
      </WishlistProvider>
    </CartProvider>
  )
}

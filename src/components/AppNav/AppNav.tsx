import { useCart } from '../../context/CartContext'
import { useWishlist } from '../../context/WishlistContext'
import { CartNavIcon, WishlistNavIcon } from './AppNavIcons'
import { NavIconButton } from './NavIconButton'
import styles from './AppNav.module.css'

export function AppNav() {
  const { itemCount, openCart, closeCart } = useCart()
  const { wishlistCount, openWishlist, closeWishlist } = useWishlist()

  return (
    <header className={styles.nav} role="banner">
      <span className={styles.brand}>shopyntra</span>
      <div className={styles.actions}>
        <NavIconButton
          label={`Wishlist, ${wishlistCount} items`}
          count={wishlistCount}
          onClick={() => {
            closeCart()
            openWishlist()
          }}
        >
          <WishlistNavIcon />
        </NavIconButton>
        <NavIconButton
          label={`Shopping bag, ${itemCount} items`}
          count={itemCount}
          onClick={() => {
            closeWishlist()
            openCart()
          }}
        >
          <CartNavIcon />
        </NavIconButton>
      </div>
    </header>
  )
}

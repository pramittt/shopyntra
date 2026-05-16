import { useCart } from '../../context/CartContext'
import { useWishlist } from '../../context/WishlistContext'
import styles from './AppNav.module.css'

export function AppNav() {
  const { itemCount, openCart, closeCart } = useCart()
  const { wishlistCount, openWishlist, closeWishlist } = useWishlist()

  return (
    <header className={styles.nav} role="banner">
      <span className={styles.brand}>shopyntra</span>
      <div className={styles.actions}>
        <button
          type="button"
          className={styles.iconBtn}
          aria-label={`Wishlist, ${wishlistCount} items`}
          onClick={() => {
            closeCart()
            openWishlist()
          }}
        >
          <svg
            className={styles.wishlistNavIcon}
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden
          >
            <path
              d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
              stroke="currentColor"
              strokeWidth="1.65"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {wishlistCount > 0 ? (
            <span className={styles.badge} aria-hidden>
              {wishlistCount > 99 ? '99+' : wishlistCount}
            </span>
          ) : null}
        </button>
        <button
          type="button"
          className={styles.iconBtn}
          aria-label={`Shopping bag, ${itemCount} items`}
          onClick={() => {
            closeWishlist()
            openCart()
          }}
        >
          <svg
            className={styles.cartIcon}
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden
          >
            <path
              d="M6 7h15l-1.5 9h-12L6 7Zm0 0L5 3H2"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M9 20.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm7.5 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"
              fill="currentColor"
            />
          </svg>
          {itemCount > 0 ? (
            <span className={styles.badge} aria-hidden>
              {itemCount > 99 ? '99+' : itemCount}
            </span>
          ) : null}
        </button>
      </div>
    </header>
  )
}

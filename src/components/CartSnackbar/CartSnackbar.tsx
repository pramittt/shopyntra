import { useCart } from '../../context/CartContext'
import styles from './CartSnackbar.module.css'

export function CartSnackbar() {
  const { snackbar, dismissSnackbar } = useCart()

  if (!snackbar) return null

  return (
    <div className={styles.wrap} role="status" aria-live="polite">
      <div className={styles.bar}>
        <span className={styles.message}>{snackbar}</span>
        <button
          type="button"
          className={styles.dismiss}
          aria-label="Dismiss"
          onClick={dismissSnackbar}
        >
          ×
        </button>
      </div>
    </div>
  )
}

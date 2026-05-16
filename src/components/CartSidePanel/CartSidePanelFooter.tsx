import styles from './CartSidePanel.module.css'

interface ICartSidePanelFooterProps {
  subtotal: number
  onClear: () => void
}

export function CartSidePanelFooter({ subtotal, onClear }: ICartSidePanelFooterProps) {
  return (
    <div className={styles.footer}>
      <div className={styles.subtotalRow}>
        <span>Subtotal</span>
        <span className={styles.subtotal}>${subtotal.toFixed(2)}</span>
      </div>
      <button type="button" className={styles.checkout}>
        Checkout
      </button>
      <button type="button" className={styles.clearLink} onClick={onClear}>
        Clear bag
      </button>
    </div>
  )
}

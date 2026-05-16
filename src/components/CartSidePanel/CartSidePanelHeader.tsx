import type { RefObject } from 'react'
import styles from './CartSidePanel.module.css'

interface ICartSidePanelHeaderProps {
  titleId: string
  closeRef: RefObject<HTMLButtonElement | null>
  onClose: () => void
}

export function CartSidePanelHeader({ titleId, closeRef, onClose }: ICartSidePanelHeaderProps) {
  return (
    <div className={styles.header}>
      <h2 id={titleId} className={styles.title}>
        Bag
      </h2>
      <button
        ref={closeRef}
        type="button"
        className={styles.close}
        aria-label="Close"
        onClick={onClose}
      >
        ×
      </button>
    </div>
  )
}

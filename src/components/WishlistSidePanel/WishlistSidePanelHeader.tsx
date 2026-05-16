import type { RefObject } from 'react'
import styles from './WishlistSidePanel.module.css'

interface IWishlistSidePanelHeaderProps {
  titleId: string
  closeRef: RefObject<HTMLButtonElement | null>
  onClose: () => void
}

export function WishlistSidePanelHeader({ titleId, closeRef, onClose }: IWishlistSidePanelHeaderProps) {
  return (
    <div className={styles.header}>
      <h2 id={titleId} className={styles.title}>
        Wishlist
      </h2>
      <button ref={closeRef} type="button" className={styles.close} aria-label="Close" onClick={onClose}>
        ×
      </button>
    </div>
  )
}

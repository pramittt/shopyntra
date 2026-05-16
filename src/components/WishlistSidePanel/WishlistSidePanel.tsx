import { useId, useRef } from 'react'
import {
  abbreviateSizeLabel,
  getProductSizes,
} from '../../features/search/api/searchApi'
import { useBodyScrollLock } from '../../lib/useBodyScrollLock'
import { WishlistLineItem } from './WishlistLineItem'
import { WishlistSidePanelHeader } from './WishlistSidePanelHeader'
import { useWishlistSidePanel } from './useWishlistSidePanel'
import styles from './WishlistSidePanel.module.css'

export function WishlistSidePanel() {
  const titleId = useId()
  const closeRef = useRef<HTMLButtonElement>(null)
  const {
    entries,
    isOpen,
    closeWishlist,
    pickMoveForId,
    onMoveToBag,
    onPickSizeMove,
    onRemove,
  } = useWishlistSidePanel()

  useBodyScrollLock(isOpen, closeWishlist, closeRef)

  if (!isOpen) return null

  return (
    <>
      <button type="button" className={styles.backdrop} aria-label="Close wishlist" onClick={closeWishlist} />
      <aside className={styles.panel} role="dialog" aria-modal="true" aria-labelledby={titleId}>
        <WishlistSidePanelHeader titleId={titleId} closeRef={closeRef} onClose={closeWishlist} />
        <WishlistSidePanelBody
          entries={entries}
          pickMoveForId={pickMoveForId}
          onMoveToBag={onMoveToBag}
          onPickSizeMove={onPickSizeMove}
          onRemove={onRemove}
        />
      </aside>
    </>
  )
}

function WishlistSidePanelBody({
  entries,
  pickMoveForId,
  onMoveToBag,
  onPickSizeMove,
  onRemove,
}: {
  entries: ReturnType<typeof useWishlistSidePanel>['entries']
  pickMoveForId: string | null
  onMoveToBag: ReturnType<typeof useWishlistSidePanel>['onMoveToBag']
  onPickSizeMove: ReturnType<typeof useWishlistSidePanel>['onPickSizeMove']
  onRemove: ReturnType<typeof useWishlistSidePanel>['onRemove']
}) {
  if (entries.length === 0) {
    return <p className={styles.empty}>No saved items yet</p>
  }

  return (
    <ul className={styles.list}>
      {entries.map(({ productId, product }) => {
        const sizes = [...new Set(getProductSizes(product).map(abbreviateSizeLabel))]
        const showSizePick = pickMoveForId === productId && sizes.length > 0

        return (
          <WishlistLineItem
            key={productId}
            product={product}
            showSizePick={showSizePick}
            onMoveToBag={() => onMoveToBag(productId, product)}
            onRemove={() => onRemove(productId)}
            onPickSize={(size) => onPickSizeMove(productId, product, size)}
          />
        )
      })}
    </ul>
  )
}

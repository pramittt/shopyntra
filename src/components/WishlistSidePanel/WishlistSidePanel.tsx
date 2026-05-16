import { useEffect, useId, useRef, useState } from 'react'
import {
  abbreviateSizeLabel,
  getProductSizes,
  parseAmount,
  type ISearchProduct,
} from '../../features/search/api/searchApi'
import { useCart } from '../../context/CartContext'
import { useWishlist } from '../../context/WishlistContext'
import styles from './WishlistSidePanel.module.css'

export function WishlistSidePanel() {
  const titleId = useId()
  const closeRef = useRef<HTMLButtonElement>(null)
  const [pickMoveForId, setPickMoveForId] = useState<string | null>(null)
  const { addItem } = useCart()
  const {
    entries,
    isOpen,
    closeWishlist,
    removeFromWishlist,
  } = useWishlist()

  useEffect(() => {
    if (!isOpen) {
      setPickMoveForId(null)
      return
    }
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeWishlist()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [isOpen, closeWishlist])

  if (!isOpen) return null

  const onMoveToBag = (productId: string, product: ISearchProduct) => {
    const sizes = [...new Set(getProductSizes(product).map(abbreviateSizeLabel))]
    if (sizes.length === 0) {
      addItem(product)
      removeFromWishlist(productId)
      setPickMoveForId(null)
      return
    }
    setPickMoveForId((cur) => (cur === productId ? null : productId))
  }

  const onPickSizeMove = (productId: string, product: ISearchProduct, size: string) => {
    addItem(product, { size })
    removeFromWishlist(productId)
    setPickMoveForId(null)
  }

  return (
    <>
      <button
        type="button"
        className={styles.backdrop}
        aria-label="Close wishlist"
        onClick={closeWishlist}
      />
      <aside
        className={styles.panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <div className={styles.header}>
          <h2 id={titleId} className={styles.title}>
            Wishlist
          </h2>
          <button
            ref={closeRef}
            type="button"
            className={styles.close}
            aria-label="Close"
            onClick={closeWishlist}
          >
            ×
          </button>
        </div>

        {entries.length === 0 ? (
          <p className={styles.empty}>No saved items yet</p>
        ) : (
          <ul className={styles.list}>
            {entries.map(({ productId, product }) => {
              const img = product.imageUrl ?? product.thumbnailImageUrl
              const unit = parseAmount(product.price)
              const sizes = [
                ...new Set(getProductSizes(product).map(abbreviateSizeLabel)),
              ]
              const showSizePick = pickMoveForId === productId && sizes.length > 0

              return (
                <li key={productId} className={styles.line}>
                  <div className={styles.thumb}>
                    {img ? (
                      <img src={img} alt="" width={64} height={80} />
                    ) : (
                      <div className={styles.thumbPlaceholder} aria-hidden />
                    )}
                  </div>
                  <div className={styles.lineBody}>
                    <p className={styles.lineName}>{product.name ?? 'Untitled'}</p>
                    <p className={styles.linePrice}>
                      {unit !== null ? `$${unit.toFixed(2)}` : String(product.price ?? '—')}
                    </p>
                    <div className={styles.actions}>
                      <button
                        type="button"
                        className={styles.moveBtn}
                        onClick={() => onMoveToBag(productId, product)}
                      >
                        {showSizePick ? 'Cancel' : 'Move to bag'}
                      </button>
                      <button
                        type="button"
                        className={styles.removeBtn}
                        onClick={() => {
                          removeFromWishlist(productId)
                          setPickMoveForId((id) => (id === productId ? null : id))
                        }}
                      >
                        Remove
                      </button>
                    </div>
                    {showSizePick ? (
                      <div className={styles.sizeBlock}>
                        <span className={styles.sizeLabel}>Select size</span>
                        <div className={styles.sizeRow}>
                          {sizes.map((size) => (
                            <button
                              key={size}
                              type="button"
                              className={styles.sizeChip}
                              onClick={() => onPickSizeMove(productId, product, size)}
                            >
                              {size}
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : null}
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </aside>
    </>
  )
}

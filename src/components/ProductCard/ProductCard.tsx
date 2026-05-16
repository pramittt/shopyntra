import { useEffect, useRef, useState, type MouseEvent as ReactMouseEvent } from 'react'
import {
  abbreviateSizeLabel,
  getProductSizes,
  isLowStock,
  parseAmount,
  parseQuantityAvailable,
} from '../../features/search/api/searchApi'
import { useCart } from '../../context/CartContext'
import { useWishlist } from '../../context/WishlistContext'
import { cn } from '../../lib/cn'
import { truncateWithEllipsis } from '../../lib/truncate'
import type { IProductCardProps } from './types'
import styles from './ProductCard.module.css'

export function ProductCard({ product }: IProductCardProps) {
  const { addItem } = useCart()
  const { toggleWishlist, isInWishlist } = useWishlist()
  const [pickSizesOpen, setPickSizesOpen] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)
  const saved = isInWishlist(product.id)

  const price = parseAmount(product.price)
  const msrp = parseAmount(product.msrp)
  const showMsrp = msrp !== null && price !== null && msrp > price
  const showSaleTag = product.on_sale?.includes('Yes') === true
  const imageSrc = product.imageUrl ?? product.thumbnailImageUrl
  const quantity = parseQuantityAvailable(product.quantity_available)
  const showFewLeft = isLowStock(quantity)
  const sizes = [...new Set(getProductSizes(product).map(abbreviateSizeLabel))]
  const hasSizes = sizes.length > 0

  useEffect(() => {
    if (!pickSizesOpen) return
    let removeDoc: (() => void) | undefined
    const t = window.setTimeout(() => {
      const onDoc = (e: globalThis.MouseEvent) => {
        if (!wrapRef.current?.contains(e.target as Node)) setPickSizesOpen(false)
      }
      document.addEventListener('click', onDoc)
      removeDoc = () => document.removeEventListener('click', onDoc)
    }, 0)
    return () => {
      clearTimeout(t)
      removeDoc?.()
    }
  }, [pickSizesOpen])

  useEffect(() => {
    if (!pickSizesOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setPickSizesOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [pickSizesOpen])

  const onQuickAddClick = (e: ReactMouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (!hasSizes) {
      addItem(product)
      return
    }
    setPickSizesOpen((o) => !o)
  }

  const onSizePick = (size: string) => {
    addItem(product, { size })
    setPickSizesOpen(false)
  }

  const onWishlistClick = (e: ReactMouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()
    toggleWishlist(product)
  }

  return (
    <article className={styles.card}>
      <div ref={wrapRef} className={styles.imageWrap}>
        {showSaleTag ? (
          <span className={styles.saleTag}>
            <span className={styles.saleTagText}>Sale</span>
          </span>
        ) : null}
        {imageSrc ? (
          <img
            src={imageSrc}
            alt=""
            className={styles.image}
            loading="lazy"
            width={200}
            height={200}
          />
        ) : (
          <div className={styles.placeholder} aria-hidden />
        )}

        <button
          type="button"
          className={cn(styles.wishlistBtn, saved && styles.wishlistBtnSaved)}
          aria-label={saved ? 'Remove from wishlist' : 'Add to wishlist'}
          aria-pressed={saved}
          onClick={onWishlistClick}
        >
          <svg
            className={styles.wishlistIcon}
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden
          >
            <path
              d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <button
          type="button"
          className={cn(styles.quickAddBtn, pickSizesOpen && styles.quickAddBtnActive)}
          aria-label="Add to bag"
          aria-expanded={hasSizes ? pickSizesOpen : undefined}
          onClick={onQuickAddClick}
        >
          <span className={styles.quickAddInner}>
            <svg
              className={styles.quickAddBag}
              width="18"
              height="18"
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
            <span className={styles.plusMark} aria-hidden>
              +
            </span>
          </span>
        </button>

        {hasSizes && pickSizesOpen ? (
          <div className={styles.sizePickOverlay} role="dialog" aria-label="Select size">
            <span className={styles.sizePickTitle}>Select size</span>
            <div className={styles.sizePickRow}>
              {sizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  className={styles.sizePickChip}
                  onClick={(e) => {
                    e.stopPropagation()
                    onSizePick(size)
                  }}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        ) : null}
      </div>
      {product.brand ? <p className={styles.brand}>{product.brand}</p> : null}
      <h2 className={styles.name}>{product.name ?? 'Untitled'}</h2>
      {product.description ? (
        <p className={styles.description}>{truncateWithEllipsis(product.description)}</p>
      ) : null}
      <p className={styles.price}>
        <span className={styles.priceAmount}>
          {showMsrp ? (
            <>
              <span className={styles.msrp}>${msrp}</span>{' '}
            </>
          ) : null}
          <span className={cn(showMsrp && styles.sale)}>${product.price ?? '—'}</span>
        </span>
        {showFewLeft ? <span className={styles.fewLeft}>Only few left</span> : null}
      </p>
    </article>
  )
}

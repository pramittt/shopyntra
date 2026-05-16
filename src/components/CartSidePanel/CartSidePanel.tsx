import { useEffect, useId, useRef } from 'react'
import { parseAmount } from '../../features/search/api/searchApi'
import { useCart } from '../../context/CartContext'
import { useWishlist } from '../../context/WishlistContext'
import { cartLineToSearchProduct } from '../../lib/cartLineToProduct'
import styles from './CartSidePanel.module.css'

export function CartSidePanel() {
  const titleId = useId()
  const closeRef = useRef<HTMLButtonElement>(null)
  const {
    items,
    isOpen,
    closeCart,
    removeLine,
    setLineQuantity,
    subtotal,
    clearCart,
    showSnackbar,
  } = useCart()
  const { upsertWishlistProduct } = useWishlist()

  useEffect(() => {
    if (!isOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeCart()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [isOpen, closeCart])

  if (!isOpen) return null

  return (
    <>
      <button type="button" className={styles.backdrop} aria-label="Close cart" onClick={closeCart} />
      <aside
        className={styles.panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <div className={styles.header}>
          <h2 id={titleId} className={styles.title}>
            Bag
          </h2>
          <button
            ref={closeRef}
            type="button"
            className={styles.close}
            aria-label="Close"
            onClick={closeCart}
          >
            ×
          </button>
        </div>

        {items.length === 0 ? (
          <p className={styles.empty}>Your bag is empty</p>
        ) : (
          <>
            <ul className={styles.list}>
              {items.map((line) => {
                const img = line.imageUrl ?? line.thumbnailImageUrl
                const unit = parseAmount(line.price)
                const lineTotal =
                  unit !== null ? unit * line.quantity : null
                return (
                  <li key={line.lineId} className={styles.line}>
                    <div className={styles.thumb}>
                      {img ? (
                        <img src={img} alt="" width={64} height={80} />
                      ) : (
                        <div className={styles.thumbPlaceholder} aria-hidden />
                      )}
                    </div>
                    <div className={styles.lineBody}>
                      <p className={styles.lineName}>{line.name}</p>
                      {line.size ? (
                        <p className={styles.lineSize}>Size: {line.size}</p>
                      ) : null}
                      <p className={styles.linePrice}>
                        {lineTotal !== null
                          ? `$${lineTotal.toFixed(2)}`
                          : String(line.price)}
                      </p>
                      <div className={styles.qtyRow}>
                        <button
                          type="button"
                          className={styles.qtyBtn}
                          aria-label="Decrease quantity"
                          onClick={() =>
                            line.quantity <= 1
                              ? removeLine(line.lineId)
                              : setLineQuantity(line.lineId, line.quantity - 1)
                          }
                        >
                          −
                        </button>
                        <span className={styles.qty}>{line.quantity}</span>
                        <button
                          type="button"
                          className={styles.qtyBtn}
                          aria-label="Increase quantity"
                          onClick={() =>
                            setLineQuantity(line.lineId, line.quantity + 1)
                          }
                        >
                          +
                        </button>
                        <button
                          type="button"
                          className={styles.remove}
                          onClick={() => removeLine(line.lineId)}
                        >
                          Remove
                        </button>
                      </div>
                      <button
                        type="button"
                        className={styles.moveWishlist}
                        onClick={() => {
                          upsertWishlistProduct(cartLineToSearchProduct(line))
                          removeLine(line.lineId)
                          showSnackbar('Saved for later')
                        }}
                      >
                        <svg
                          className={styles.moveWishlistIcon}
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden
                        >
                          <path
                            d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        Move to wishlist
                      </button>
                    </div>
                  </li>
                )
              })}
            </ul>
            <div className={styles.footer}>
              <div className={styles.subtotalRow}>
                <span>Subtotal</span>
                <span className={styles.subtotal}>${subtotal.toFixed(2)}</span>
              </div>
              <button type="button" className={styles.checkout}>
                Checkout
              </button>
              <button type="button" className={styles.clearLink} onClick={clearCart}>
                Clear bag
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  )
}

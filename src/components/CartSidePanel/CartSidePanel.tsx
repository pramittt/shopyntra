import { useId, useRef } from 'react'
import { useCart } from '../../context/CartContext'
import { useWishlist } from '../../context/WishlistContext'
import { useBodyScrollLock } from '../../lib/useBodyScrollLock'
import { CartSidePanelHeader } from './CartSidePanelHeader'
import { cartLineToSearchProduct } from '../../lib/cartLineToProduct'
import { CartSidePanelList } from './CartSidePanelList'
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

  useBodyScrollLock(isOpen, closeCart, closeRef)

  if (!isOpen) return null

  return (
    <>
      <button type="button" className={styles.backdrop} aria-label="Close cart" onClick={closeCart} />
      <aside className={styles.panel} role="dialog" aria-modal="true" aria-labelledby={titleId}>
        <CartSidePanelHeader titleId={titleId} closeRef={closeRef} onClose={closeCart} />
        <CartSidePanelBody
          items={items}
          subtotal={subtotal}
          removeLine={removeLine}
          setLineQuantity={setLineQuantity}
          clearCart={clearCart}
          upsertWishlistProduct={upsertWishlistProduct}
          showSnackbar={showSnackbar}
        />
      </aside>
    </>
  )
}

function CartSidePanelBody({
  items,
  subtotal,
  removeLine,
  setLineQuantity,
  clearCart,
  upsertWishlistProduct,
  showSnackbar,
}: {
  items: ReturnType<typeof useCart>['items']
  subtotal: number
  removeLine: (lineId: string) => void
  setLineQuantity: (lineId: string, quantity: number) => void
  clearCart: () => void
  upsertWishlistProduct: ReturnType<typeof useWishlist>['upsertWishlistProduct']
  showSnackbar: (message: string) => void
}) {
  if (items.length === 0) {
    return <p className={styles.empty}>Your bag is empty</p>
  }

  return (
    <CartSidePanelList
      items={items}
      subtotal={subtotal}
      onRemoveLine={removeLine}
      onSetQuantity={setLineQuantity}
      onClear={clearCart}
      onMoveToWishlist={(line) => {
        upsertWishlistProduct(cartLineToSearchProduct(line))
        removeLine(line.lineId)
        showSnackbar('Saved for later')
      }}
    />
  )
}

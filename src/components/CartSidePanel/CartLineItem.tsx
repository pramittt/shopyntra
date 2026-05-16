import { parseAmount } from '../../features/search/api/searchApi'
import type { ICartLineItem } from '../../context/types'
import { MoveToWishlistIcon } from './CartSidePanelIcons'
import styles from './CartSidePanel.module.css'

interface ICartLineItemProps {
  line: ICartLineItem
  onDecrease: () => void
  onIncrease: () => void
  onRemove: () => void
  onMoveToWishlist: () => void
}

export function CartLineItem({
  line,
  onDecrease,
  onIncrease,
  onRemove,
  onMoveToWishlist,
}: ICartLineItemProps) {
  const img = line.imageUrl ?? line.thumbnailImageUrl
  const unit = parseAmount(line.price)
  const lineTotal = unit !== null ? unit * line.quantity : null

  return (
    <li className={styles.line}>
      <LineThumbnail imageUrl={img} />
      <div className={styles.lineBody}>
        <p className={styles.lineName}>{line.name}</p>
        {line.size ? <p className={styles.lineSize}>Size: {line.size}</p> : null}
        <p className={styles.linePrice}>
          {lineTotal !== null ? `$${lineTotal.toFixed(2)}` : String(line.price)}
        </p>
        <QuantityControls
          quantity={line.quantity}
          onDecrease={onDecrease}
          onIncrease={onIncrease}
          onRemove={onRemove}
        />
        <button type="button" className={styles.moveWishlist} onClick={onMoveToWishlist}>
          <MoveToWishlistIcon />
          Move to wishlist
        </button>
      </div>
    </li>
  )
}

function LineThumbnail({ imageUrl }: { imageUrl?: string }) {
  return (
    <div className={styles.thumb}>
      {imageUrl ? (
        <img src={imageUrl} alt="" width={64} height={80} />
      ) : (
        <div className={styles.thumbPlaceholder} aria-hidden />
      )}
    </div>
  )
}

function QuantityControls({
  quantity,
  onDecrease,
  onIncrease,
  onRemove,
}: {
  quantity: number
  onDecrease: () => void
  onIncrease: () => void
  onRemove: () => void
}) {
  return (
    <div className={styles.qtyRow}>
      <button type="button" className={styles.qtyBtn} aria-label="Decrease quantity" onClick={onDecrease}>
        −
      </button>
      <span className={styles.qty}>{quantity}</span>
      <button type="button" className={styles.qtyBtn} aria-label="Increase quantity" onClick={onIncrease}>
        +
      </button>
      <button type="button" className={styles.remove} onClick={onRemove}>
        Remove
      </button>
    </div>
  )
}

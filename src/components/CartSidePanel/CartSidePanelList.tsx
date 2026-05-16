import type { ICartLineItem } from '../../context/types'
import { CartLineItem } from './CartLineItem'
import { CartSidePanelFooter } from './CartSidePanelFooter'
import styles from './CartSidePanel.module.css'

interface ICartSidePanelListProps {
  items: ICartLineItem[]
  subtotal: number
  onRemoveLine: (lineId: string) => void
  onSetQuantity: (lineId: string, quantity: number) => void
  onClear: () => void
  onMoveToWishlist: (line: ICartLineItem) => void
}

export function CartSidePanelList({
  items,
  subtotal,
  onRemoveLine,
  onSetQuantity,
  onClear,
  onMoveToWishlist,
}: ICartSidePanelListProps) {
  return (
    <>
      <ul className={styles.list}>
        {items.map((line) => (
          <CartLineItem
            key={line.lineId}
            line={line}
            onDecrease={() =>
              line.quantity <= 1
                ? onRemoveLine(line.lineId)
                : onSetQuantity(line.lineId, line.quantity - 1)
            }
            onIncrease={() => onSetQuantity(line.lineId, line.quantity + 1)}
            onRemove={() => onRemoveLine(line.lineId)}
            onMoveToWishlist={() => onMoveToWishlist(line)}
          />
        ))}
      </ul>
      <CartSidePanelFooter subtotal={subtotal} onClear={onClear} />
    </>
  )
}

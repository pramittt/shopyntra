import {
  abbreviateSizeLabel,
  getProductSizes,
  parseAmount,
  type ISearchProduct,
} from '../../features/search/api/searchApi'
import styles from './WishlistSidePanel.module.css'

interface IWishlistLineItemProps {
  product: ISearchProduct
  showSizePick: boolean
  onMoveToBag: () => void
  onRemove: () => void
  onPickSize: (size: string) => void
}

export function WishlistLineItem({
  product,
  showSizePick,
  onMoveToBag,
  onRemove,
  onPickSize,
}: IWishlistLineItemProps) {
  const img = product.imageUrl ?? product.thumbnailImageUrl
  const unit = parseAmount(product.price)
  const sizes = [...new Set(getProductSizes(product).map(abbreviateSizeLabel))]

  return (
    <li className={styles.line}>
      <LineThumbnail imageUrl={img} />
      <div className={styles.lineBody}>
        <p className={styles.lineName}>{product.name ?? 'Untitled'}</p>
        <p className={styles.linePrice}>
          {unit !== null ? `$${unit.toFixed(2)}` : String(product.price ?? '—')}
        </p>
        <LineActions
          showSizePick={showSizePick}
          onMoveToBag={onMoveToBag}
          onRemove={onRemove}
        />
        {showSizePick ? (
          <SizePicker sizes={sizes} onPickSize={onPickSize} />
        ) : null}
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

function LineActions({
  showSizePick,
  onMoveToBag,
  onRemove,
}: {
  showSizePick: boolean
  onMoveToBag: () => void
  onRemove: () => void
}) {
  return (
    <div className={styles.actions}>
      <button type="button" className={styles.moveBtn} onClick={onMoveToBag}>
        {showSizePick ? 'Cancel' : 'Move to bag'}
      </button>
      <button type="button" className={styles.removeBtn} onClick={onRemove}>
        Remove
      </button>
    </div>
  )
}

function SizePicker({
  sizes,
  onPickSize,
}: {
  sizes: string[]
  onPickSize: (size: string) => void
}) {
  return (
    <div className={styles.sizeBlock}>
      <span className={styles.sizeLabel}>Select size</span>
      <div className={styles.sizeRow}>
        {sizes.map((size) => (
          <button key={size} type="button" className={styles.sizeChip} onClick={() => onPickSize(size)}>
            {size}
          </button>
        ))}
      </div>
    </div>
  )
}

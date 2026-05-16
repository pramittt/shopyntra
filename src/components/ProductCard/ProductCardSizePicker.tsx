import styles from './ProductCard.module.css'

interface IProductCardSizePickerProps {
  sizes: string[]
  onSizePick: (size: string) => void
}

export function ProductCardSizePicker({ sizes, onSizePick }: IProductCardSizePickerProps) {
  return (
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
  )
}

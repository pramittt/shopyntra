import { cn } from '../../lib/cn'
import { QuickAddBagIcon, WishlistHeartIcon } from './ProductCardIcons'
import { ProductCardSizePicker } from './ProductCardSizePicker'
import styles from './ProductCard.module.css'

interface IProductCardImageProps {
  wrapRef: React.RefObject<HTMLDivElement | null>
  imageSrc?: string
  showSaleTag: boolean
  saved: boolean
  pickSizesOpen: boolean
  hasSizes: boolean
  sizes: string[]
  onWishlistClick: (e: React.MouseEvent<HTMLButtonElement>) => void
  onQuickAddClick: (e: React.MouseEvent<HTMLButtonElement>) => void
  onSizePick: (size: string) => void
}

export function ProductCardImage({
  wrapRef,
  imageSrc,
  showSaleTag,
  saved,
  pickSizesOpen,
  hasSizes,
  sizes,
  onWishlistClick,
  onQuickAddClick,
  onSizePick,
}: IProductCardImageProps) {
  return (
    <div ref={wrapRef} className={styles.imageWrap}>
      {showSaleTag ? <SaleTag /> : null}
      <ProductMedia imageSrc={imageSrc} />
      <WishlistButton saved={saved} onClick={onWishlistClick} />
      <QuickAddButton
        pickSizesOpen={pickSizesOpen}
        hasSizes={hasSizes}
        onClick={onQuickAddClick}
      />
      {hasSizes && pickSizesOpen ? (
        <ProductCardSizePicker sizes={sizes} onSizePick={onSizePick} />
      ) : null}
    </div>
  )
}

function SaleTag() {
  return (
    <span className={styles.saleTag}>
      <span className={styles.saleTagText}>Sale</span>
    </span>
  )
}

function ProductMedia({ imageSrc }: { imageSrc?: string }) {
  if (imageSrc) {
    return (
      <img
        src={imageSrc}
        alt=""
        className={styles.image}
        loading="lazy"
        width={200}
        height={200}
      />
    )
  }
  return <div className={styles.placeholder} aria-hidden />
}

function WishlistButton({
  saved,
  onClick,
}: {
  saved: boolean
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void
}) {
  return (
    <button
      type="button"
      className={cn(styles.wishlistBtn, saved && styles.wishlistBtnSaved)}
      aria-label={saved ? 'Remove from wishlist' : 'Add to wishlist'}
      aria-pressed={saved}
      onClick={onClick}
    >
      <WishlistHeartIcon />
    </button>
  )
}

function QuickAddButton({
  pickSizesOpen,
  hasSizes,
  onClick,
}: {
  pickSizesOpen: boolean
  hasSizes: boolean
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void
}) {
  return (
    <button
      type="button"
      className={cn(styles.quickAddBtn, pickSizesOpen && styles.quickAddBtnActive)}
      aria-label="Add to bag"
      aria-expanded={hasSizes ? pickSizesOpen : undefined}
      onClick={onClick}
    >
      <span className={styles.quickAddInner}>
        <QuickAddBagIcon />
        <span className={styles.plusMark} aria-hidden>
          +
        </span>
      </span>
    </button>
  )
}

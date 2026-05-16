import type { IProductCardProps } from './types'
import { ProductCardDetails } from './ProductCardDetails'
import { ProductCardImage } from './ProductCardImage'
import { useProductCard } from './useProductCard'
import styles from './ProductCard.module.css'

export function ProductCard({ product }: IProductCardProps) {
  const card = useProductCard(product)

  return (
    <article className={styles.card}>
      <ProductCardImage
        wrapRef={card.wrapRef}
        imageSrc={card.imageSrc}
        showSaleTag={card.showSaleTag}
        saved={card.saved}
        pickSizesOpen={card.pickSizesOpen}
        hasSizes={card.hasSizes}
        sizes={card.sizes}
        onWishlistClick={card.onWishlistClick}
        onQuickAddClick={card.onQuickAddClick}
        onSizePick={card.onSizePick}
      />
      <ProductCardDetails
        product={product}
        showMsrp={card.showMsrp}
        msrp={card.msrp}
        showFewLeft={card.showFewLeft}
      />
    </article>
  )
}

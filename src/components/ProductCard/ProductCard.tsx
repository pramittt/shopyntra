import { parseAmount, type SearchProduct } from '../../features/search/api/searchApi'
import { cn } from '../../lib/cn'
import styles from './ProductCard.module.css'

export type ProductCardProps = {
  product: SearchProduct
}

export function ProductCard({ product }: ProductCardProps) {
  const price = parseAmount(product.price)
  const msrp = parseAmount(product.msrp)
  const showMsrp = msrp !== null && price !== null && msrp > price
  const showSaleTag = product.on_sale?.includes('Yes') === true

  return (
    <article className={styles.card}>
      <div className={styles.imageWrap}>
        {showSaleTag ? (
          <span className={styles.saleTag}>
            <span className={styles.saleTagText}>Sale</span>
          </span>
        ) : null}
        {product.thumbnailImageUrl ? (
          <img
            src={product.thumbnailImageUrl}
            alt=""
            className={styles.image}
            loading="lazy"
            width={200}
            height={200}
          />
        ) : (
          <div className={styles.placeholder} aria-hidden />
        )}
      </div>
      <h2 className={styles.name}>{product.name ?? 'Untitled'}</h2>
      <p className={styles.price}>
        {showMsrp ? (
          <>
            <span className={styles.msrp}>${msrp}</span>{' '}
          </>
        ) : null}
        <span className={cn(showMsrp && styles.sale)}>${product.price ?? '—'}</span>
      </p>
    </article>
  )
}

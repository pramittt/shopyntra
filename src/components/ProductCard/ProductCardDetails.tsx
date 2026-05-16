import { cn } from '../../lib/cn'
import { truncateWithEllipsis } from '../../lib/truncate'
import type { ISearchProduct } from '../../features/search/api/types'
import styles from './ProductCard.module.css'

interface IProductCardDetailsProps {
  product: ISearchProduct
  showMsrp: boolean
  msrp: number | null
  showFewLeft: boolean
}

export function ProductCardDetails({ product, showMsrp, msrp, showFewLeft }: IProductCardDetailsProps) {
  return (
    <>
      {product.brand ? <p className={styles.brand}>{product.brand}</p> : null}
      <h2 className={styles.name}>{product.name ?? 'Untitled'}</h2>
      {product.description ? (
        <p className={styles.description}>{truncateWithEllipsis(product.description)}</p>
      ) : null}
      <PriceBlock product={product} showMsrp={showMsrp} msrp={msrp} showFewLeft={showFewLeft} />
    </>
  )
}

function PriceBlock({
  product,
  showMsrp,
  msrp,
  showFewLeft,
}: IProductCardDetailsProps) {
  return (
    <p className={styles.price}>
      <span className={styles.priceAmount}>
        {showMsrp && msrp !== null ? (
          <>
            <span className={styles.msrp}>${msrp}</span>{' '}
          </>
        ) : null}
        <span className={cn(showMsrp && styles.sale)}>${product.price ?? '—'}</span>
      </span>
      {showFewLeft ? <span className={styles.fewLeft}>Only few left</span> : null}
    </p>
  )
}

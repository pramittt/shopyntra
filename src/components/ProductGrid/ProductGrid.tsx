import { cn } from '../../lib/cn'
import { ProductCard } from '../ProductCard/ProductCard'
import { ProductSkeletonCard } from '../ProductSkeletonCard/ProductSkeletonCard'
import { VisuallyHidden } from '../VisuallyHidden/VisuallyHidden'
import type { IProductGridProps } from './types'
import styles from './ProductGrid.module.css'

export function ProductGrid({ loading, loadingMore, skeletonCount, products }: IProductGridProps) {
  if (loading) {
    return (
      <div className={styles.loader} role="status" aria-live="polite">
        <VisuallyHidden>Loading results</VisuallyHidden>
        <ul className={cn(styles.grid, styles.skeletonGrid)} aria-hidden>
          {Array.from({ length: skeletonCount }, (_, i) => (
            <li key={`sk-${i}`}>
              <ProductSkeletonCard index={i} />
            </li>
          ))}
        </ul>
      </div>
    )
  }

  return (
    <div className={styles.wrap}>
      <ul className={styles.grid}>
        {products.map((product) => (
          <li key={product.id}>
            <ProductCard product={product} />
          </li>
        ))}
      </ul>
      {loadingMore ? (
        <ul className={cn(styles.grid, styles.moreSkeleton)} aria-hidden>
          {Array.from({ length: 6 }, (_, i) => (
            <li key={`msk-${i}`}>
              <ProductSkeletonCard index={i + 100} />
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}

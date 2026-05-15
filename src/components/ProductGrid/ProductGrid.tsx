import type { SearchProduct } from '../../features/search/api/searchApi'
import { cn } from '../../lib/cn'
import { ProductCard } from '../ProductCard/ProductCard'
import { ProductSkeletonCard } from '../ProductSkeletonCard/ProductSkeletonCard'
import { VisuallyHidden } from '../VisuallyHidden/VisuallyHidden'
import styles from './ProductGrid.module.css'

export type ProductGridProps = {
  loading: boolean
  skeletonCount: number
  products: SearchProduct[]
}

export function ProductGrid({ loading, skeletonCount, products }: ProductGridProps) {
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
    <ul className={styles.grid}>
      {products.map((product) => (
        <li key={product.id}>
          <ProductCard product={product} />
        </li>
      ))}
    </ul>
  )
}

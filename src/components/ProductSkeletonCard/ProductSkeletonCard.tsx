import type { CSSProperties } from 'react'
import { cn } from '../../lib/cn'
import styles from './ProductSkeletonCard.module.css'

export type ProductSkeletonCardProps = {
  index: number
}

export function ProductSkeletonCard({ index }: ProductSkeletonCardProps) {
  return (
    <article
      className={styles.card}
      style={{ '--sk-delay': `${index * 48}ms` } as CSSProperties}
      aria-hidden
    >
      <div className={styles.image} />
      <div className={styles.body}>
        <div className={cn(styles.line, styles.lineLg)} />
        <div className={cn(styles.line, styles.lineMd)} />
        <div className={cn(styles.line, styles.lineSm)} />
      </div>
    </article>
  )
}

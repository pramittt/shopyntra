import { cn } from '../../lib/cn'
import type { IVisuallyHiddenProps } from './types'
import styles from './VisuallyHidden.module.css'

export function VisuallyHidden({ children, as = 'span', htmlFor, className }: IVisuallyHiddenProps) {
  const Tag = as
  return (
    <Tag className={cn(styles.root, className)} htmlFor={htmlFor}>
      {children}
    </Tag>
  )
}

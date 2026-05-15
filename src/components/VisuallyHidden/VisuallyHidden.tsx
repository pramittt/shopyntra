import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'
import styles from './VisuallyHidden.module.css'

type VisuallyHiddenProps = {
  children: ReactNode
  as?: 'span' | 'label'
  htmlFor?: string
  className?: string
}

export function VisuallyHidden({ children, as = 'span', htmlFor, className }: VisuallyHiddenProps) {
  const Tag = as
  return (
    <Tag className={cn(styles.root, className)} htmlFor={htmlFor}>
      {children}
    </Tag>
  )
}

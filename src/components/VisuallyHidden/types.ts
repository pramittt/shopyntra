import type { ReactNode } from 'react'

export interface IVisuallyHiddenProps {
  children: ReactNode
  as?: 'span' | 'label'
  htmlFor?: string
  className?: string
}

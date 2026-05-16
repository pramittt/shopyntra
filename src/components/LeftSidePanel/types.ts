import type { ReactNode } from 'react'

export interface ILeftSidePanelProps {
  open: boolean
  title: string
  onClose: () => void
  children: ReactNode
}

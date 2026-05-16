import type { ReactNode } from 'react'

export interface IBottomSheetProps {
  open: boolean
  title: string
  onClose: () => void
  children: ReactNode
}

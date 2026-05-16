import type { ReactNode } from 'react'
import styles from './AppNav.module.css'

interface INavIconButtonProps {
  label: string
  count: number
  onClick: () => void
  children: ReactNode
}

export function NavIconButton({ label, count, onClick, children }: INavIconButtonProps) {
  return (
    <button type="button" className={styles.iconBtn} aria-label={label} onClick={onClick}>
      {children}
      {count > 0 ? (
        <span className={styles.badge} aria-hidden>
          {count > 99 ? '99+' : count}
        </span>
      ) : null}
    </button>
  )
}

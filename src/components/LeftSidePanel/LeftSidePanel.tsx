import { useEffect, useId, useRef } from 'react'
import { createPortal } from 'react-dom'
import { CloseIcon } from '../CloseIcon/CloseIcon'
import type { ILeftSidePanelProps } from './types'
import styles from './LeftSidePanel.module.css'

export function LeftSidePanel({ open, title, onClose, children }: ILeftSidePanelProps) {
  const titleId = useId()
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  if (!open) return null

  return createPortal(
    <>
      <button type="button" className={styles.backdrop} aria-label={`Close ${title}`} onClick={onClose} />
      <aside
        className={styles.panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <div className={styles.header}>
          <h2 id={titleId} className={styles.title}>
            {title}
          </h2>
          <button
            ref={closeRef}
            type="button"
            className={styles.close}
            aria-label="Close"
            onClick={onClose}
          >
            <CloseIcon size={20} className={styles.closeIcon} />
          </button>
        </div>
        <div className={styles.body}>{children}</div>
      </aside>
    </>,
    document.body,
  )
}

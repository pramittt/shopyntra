import { useId, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useBodyScrollLock } from '../../lib/useBodyScrollLock'
import { LeftSidePanelHeader } from './LeftSidePanelHeader'
import type { ILeftSidePanelProps } from './types'
import styles from './LeftSidePanel.module.css'

export function LeftSidePanel({ open, title, onClose, children }: ILeftSidePanelProps) {
  const titleId = useId()
  const closeRef = useRef<HTMLButtonElement>(null)

  useBodyScrollLock(open, onClose, closeRef)

  if (!open) return null

  return createPortal(
    <>
      <button type="button" className={styles.backdrop} aria-label={`Close ${title}`} onClick={onClose} />
      <aside className={styles.panel} role="dialog" aria-modal="true" aria-labelledby={titleId}>
        <LeftSidePanelHeader titleId={titleId} title={title} closeRef={closeRef} onClose={onClose} />
        <div className={styles.body}>{children}</div>
      </aside>
    </>,
    document.body,
  )
}

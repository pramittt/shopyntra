import type { RefObject } from 'react'
import { CloseIcon } from '../CloseIcon/CloseIcon'
import styles from './LeftSidePanel.module.css'

interface ILeftSidePanelHeaderProps {
  titleId: string
  title: string
  closeRef: RefObject<HTMLButtonElement | null>
  onClose: () => void
}

export function LeftSidePanelHeader({ titleId, title, closeRef, onClose }: ILeftSidePanelHeaderProps) {
  return (
    <div className={styles.header}>
      <h2 id={titleId} className={styles.title}>
        {title}
      </h2>
      <button ref={closeRef} type="button" className={styles.close} aria-label="Close" onClick={onClose}>
        <CloseIcon size={20} className={styles.closeIcon} />
      </button>
    </div>
  )
}

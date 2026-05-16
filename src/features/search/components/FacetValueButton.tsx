import type { FacetMultiple } from '../api/searchApi'
import { colorSwatchHex, swatchNeedsBorder } from '../lib/colorSwatch'
import { cn } from '../../../lib/cn'
import styles from './FacetPanel.module.css'

interface IFacetValueButtonProps {
  field: string
  label: string
  value: string
  count: number
  active: boolean
  isColorFacet: boolean
  multiple: FacetMultiple
  onToggle: (field: string, value: string, multiple: FacetMultiple) => void
}

export function FacetValueButton({
  field,
  label,
  value,
  count,
  active,
  isColorFacet,
  multiple,
  onToggle,
}: IFacetValueButtonProps) {
  const hex = colorSwatchHex(label)

  return (
    <button
      type="button"
      className={cn(styles.valueBtn, active && styles.valueBtnActive, isColorFacet && styles.colorBtn)}
      onClick={() => onToggle(field, value, multiple)}
    >
      <span className={styles.valueLabel}>
        {isColorFacet ? <ColorSwatchLabel label={label} hex={hex} /> : label}
      </span>
      <span className={styles.count}>{count}</span>
    </button>
  )
}

function ColorSwatchLabel({ label, hex }: { label: string; hex: string }) {
  return (
    <>
      <span
        className={cn(styles.swatch, swatchNeedsBorder(label) && styles.swatchBorder)}
        style={{ backgroundColor: hex }}
        aria-hidden
      />
      {label}
    </>
  )
}

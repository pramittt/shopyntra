import type { FacetMultiple, ISearchFacet } from '../api/searchApi'
import { cn } from '../../../lib/cn'
import { FacetValueButton } from './FacetValueButton'
import styles from './FacetPanel.module.css'

interface IFacetSectionProps {
  facet: ISearchFacet
  multiple: FacetMultiple
  isActive: (field: string, value: string) => boolean
  onToggle: (field: string, value: string, multiple: FacetMultiple) => void
}

export function FacetSection({ facet, multiple, isActive, onToggle }: IFacetSectionProps) {
  const isColorFacet = facet.type === 'palette' || /^color/i.test(facet.field)

  return (
    <div className={styles.facet}>
      <h3 className={styles.facetLabel}>{facet.label}</h3>
      <ul className={cn(styles.values, isColorFacet && styles.colorValues)}>
        {facet.values.map((v) => (
          <li key={`${facet.field}-${v.value}`}>
            <FacetValueButton
              field={facet.field}
              label={v.label}
              value={v.value}
              count={v.count}
              active={isActive(facet.field, v.value)}
              isColorFacet={isColorFacet}
              multiple={multiple}
              onToggle={onToggle}
            />
          </li>
        ))}
      </ul>
    </div>
  )
}

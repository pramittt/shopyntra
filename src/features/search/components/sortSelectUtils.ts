import type { ISortOption, ISortSelection } from '../api/searchApi'

export function optionKey(field: string, direction: string): string {
  return `${field}\u0000${direction}`
}

export function parseSortKey(key: string): ISortSelection | null {
  if (!key) return null
  const i = key.indexOf('\u0000')
  if (i < 0) return null
  const field = key.slice(0, i)
  const direction = key.slice(i + 1) as ISortSelection['direction']
  if (direction !== 'asc' && direction !== 'desc') return null
  return { field, direction }
}

export function isSelected(value: ISortSelection | null, option: ISortOption): boolean {
  if (!value) return false
  return value.field === option.field && value.direction === option.direction
}

export function isRelevanceSort(o: ISortOption): boolean {
  return o.field === 'relevance'
}

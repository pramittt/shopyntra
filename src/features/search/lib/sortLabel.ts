import type { ISortOption, ISortSelection } from '../api/searchApi'

export function getSortLabel(
  value: ISortSelection | null,
  options: ISortOption[] | undefined,
): string {
  if (!value) return 'Best match'
  const match = options?.find(
    (o) => o.field === value.field && o.direction === value.direction,
  )
  return match?.label ?? 'Best match'
}

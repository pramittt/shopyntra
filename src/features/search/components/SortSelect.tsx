import { SortSelectInline } from './SortSelectInline'
import { SortSelectSheet } from './SortSelectSheet'
import type { ISortSelectProps } from './types'

export function SortSelect({
  options,
  value,
  onChange,
  loadedCount,
  totalResults,
  disabled,
  variant = 'inline',
  showMeta = true,
  onSelect,
  className,
}: ISortSelectProps) {
  const apply = (sort: Parameters<typeof onChange>[0]) => {
    onChange(sort)
    onSelect?.()
  }

  if (variant === 'sheet') {
    return (
      <SortSelectSheet options={options} value={value} disabled={disabled} onApply={apply} />
    )
  }

  return (
    <SortSelectInline
      options={options}
      value={value}
      disabled={disabled}
      loadedCount={loadedCount}
      totalResults={totalResults}
      showMeta={showMeta}
      className={className}
      onChange={onChange}
    />
  )
}

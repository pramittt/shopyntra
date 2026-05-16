import type { ISearchPagination } from '../../features/search/api/types'

export interface IPaginationBarProps {
  pagination: ISearchPagination | null
  busy: boolean
  onPageChange: (page: number) => void
  idPrefix: string
}

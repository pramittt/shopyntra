import type { ISearchProduct } from '../../features/search/api/types'

export interface IProductGridProps {
  loading: boolean
  loadingMore: boolean
  skeletonCount: number
  products: ISearchProduct[]
}

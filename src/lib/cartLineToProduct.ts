import type { ICartLineItem } from '../context/types'
import type { ISearchProduct } from '../features/search/api/types'

export function cartLineToSearchProduct(line: ICartLineItem): ISearchProduct {
  return {
    id: line.productId,
    name: line.name,
    price: line.price,
    thumbnailImageUrl: line.thumbnailImageUrl,
    imageUrl: line.imageUrl,
    ...(line.size ? { size: [line.size] } : {}),
  }
}

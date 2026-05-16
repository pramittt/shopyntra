import type { ISearchProduct } from '../features/search/api/types'

export interface ICartLineItem {
  lineId: string
  productId: string
  size?: string
  name: string
  price: string | number
  thumbnailImageUrl?: string
  imageUrl?: string
  quantity: number
}

export interface ICartContextValue {
  items: ICartLineItem[]
  isOpen: boolean
  snackbar: string | null
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void
  showSnackbar: (message: string) => void
  dismissSnackbar: () => void
  addItem: (
    product: ISearchProduct,
    options?: { size?: string; quantity?: number },
  ) => void
  removeLine: (lineId: string) => void
  setLineQuantity: (lineId: string, quantity: number) => void
  clearCart: () => void
  itemCount: number
  subtotal: number
}

export interface IWishlistEntry {
  productId: string
  product: ISearchProduct
}

export interface IWishlistContextValue {
  entries: IWishlistEntry[]
  isOpen: boolean
  openWishlist: () => void
  closeWishlist: () => void
  addToWishlist: (product: ISearchProduct) => void
  upsertWishlistProduct: (product: ISearchProduct) => void
  removeFromWishlist: (productId: string) => void
  toggleWishlist: (product: ISearchProduct) => void
  isInWishlist: (productId: string) => boolean
  wishlistCount: number
}

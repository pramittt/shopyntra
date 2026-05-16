import { useEffect, useState } from 'react'
import {
  abbreviateSizeLabel,
  getProductSizes,
  type ISearchProduct,
} from '../../features/search/api/searchApi'
import { useCart } from '../../context/CartContext'
import { useWishlist } from '../../context/WishlistContext'

export function useWishlistSidePanel() {
  const [pickMoveForId, setPickMoveForId] = useState<string | null>(null)
  const { addItem } = useCart()
  const { entries, isOpen, closeWishlist, removeFromWishlist } = useWishlist()

  useEffect(() => {
    if (!isOpen) setPickMoveForId(null)
  }, [isOpen])

  const onMoveToBag = (productId: string, product: ISearchProduct) => {
    const sizes = [...new Set(getProductSizes(product).map(abbreviateSizeLabel))]
    if (sizes.length === 0) {
      addItem(product)
      removeFromWishlist(productId)
      setPickMoveForId(null)
      return
    }
    setPickMoveForId((cur) => (cur === productId ? null : productId))
  }

  const onPickSizeMove = (productId: string, product: ISearchProduct, size: string) => {
    addItem(product, { size })
    removeFromWishlist(productId)
    setPickMoveForId(null)
  }

  const onRemove = (productId: string) => {
    removeFromWishlist(productId)
    setPickMoveForId((id) => (id === productId ? null : id))
  }

  return {
    entries,
    isOpen,
    closeWishlist,
    pickMoveForId,
    onMoveToBag,
    onPickSizeMove,
    onRemove,
  }
}

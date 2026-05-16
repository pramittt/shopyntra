import { useEffect, useRef, useState, type MouseEvent as ReactMouseEvent } from 'react'
import {
  abbreviateSizeLabel,
  getProductSizes,
  isLowStock,
  parseAmount,
  parseQuantityAvailable,
} from '../../features/search/api/searchApi'
import type { ISearchProduct } from '../../features/search/api/types'
import { useCart } from '../../context/CartContext'
import { useWishlist } from '../../context/WishlistContext'

export function useProductCard(product: ISearchProduct) {
  const { addItem } = useCart()
  const { toggleWishlist, isInWishlist } = useWishlist()
  const [pickSizesOpen, setPickSizesOpen] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)
  const saved = isInWishlist(product.id)

  const price = parseAmount(product.price)
  const msrp = parseAmount(product.msrp)
  const showMsrp = msrp !== null && price !== null && msrp > price
  const showSaleTag = product.on_sale?.includes('Yes') === true
  const imageSrc = product.imageUrl ?? product.thumbnailImageUrl
  const quantity = parseQuantityAvailable(product.quantity_available)
  const showFewLeft = isLowStock(quantity)
  const sizes = [...new Set(getProductSizes(product).map(abbreviateSizeLabel))]
  const hasSizes = sizes.length > 0

  useEffect(() => {
    if (!pickSizesOpen) return
    let removeDoc: (() => void) | undefined
    const t = window.setTimeout(() => {
      const onDoc = (e: globalThis.MouseEvent) => {
        if (!wrapRef.current?.contains(e.target as Node)) setPickSizesOpen(false)
      }
      document.addEventListener('click', onDoc)
      removeDoc = () => document.removeEventListener('click', onDoc)
    }, 0)
    return () => {
      clearTimeout(t)
      removeDoc?.()
    }
  }, [pickSizesOpen])

  useEffect(() => {
    if (!pickSizesOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setPickSizesOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [pickSizesOpen])

  const onQuickAddClick = (e: ReactMouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (!hasSizes) {
      addItem(product)
      return
    }
    setPickSizesOpen((o) => !o)
  }

  const onSizePick = (size: string) => {
    addItem(product, { size })
    setPickSizesOpen(false)
  }

  const onWishlistClick = (e: ReactMouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()
    toggleWishlist(product)
  }

  return {
    wrapRef,
    saved,
    showSaleTag,
    imageSrc,
    sizes,
    hasSizes,
    pickSizesOpen,
    showMsrp,
    msrp,
    price,
    showFewLeft,
    onQuickAddClick,
    onSizePick,
    onWishlistClick,
  }
}

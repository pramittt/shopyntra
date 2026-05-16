import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import type { ISearchProduct } from '../features/search/api/types'
import {
  abbreviateSizeLabel,
  getProductSizes,
  parseAmount,
} from '../features/search/api/searchApi'
import type { ICartContextValue, ICartLineItem } from './types'

const STORAGE_KEY = 'shopyntra-cart'
const SNACKBAR_MS = 3200

export type { ICartLineItem } from './types'

function makeCartLineId(productId: string, size: string | undefined): string {
  return size ? `${productId}\u0000${size}` : productId
}

const CartContext = createContext<ICartContextValue | null>(null)

function normalizeLine(raw: unknown): ICartLineItem | null {
  if (typeof raw !== 'object' || raw === null) return null
  const r = raw as Partial<ICartLineItem>
  if (typeof r.productId !== 'string' || typeof r.quantity !== 'number') return null
  const size = typeof r.size === 'string' ? r.size : undefined
  const lineId =
    typeof r.lineId === 'string' ? r.lineId : makeCartLineId(r.productId, size)
  return {
    lineId,
    productId: r.productId,
    size,
    name: typeof r.name === 'string' ? r.name : 'Untitled',
    price: r.price ?? '—',
    thumbnailImageUrl: r.thumbnailImageUrl,
    imageUrl: r.imageUrl,
    quantity: r.quantity,
  }
}

function loadStoredItems(): ICartLineItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return []
    return parsed.map(normalizeLine).filter((x): x is ICartLineItem => x !== null)
  } catch {
    return []
  }
}

function persistItems(items: ICartLineItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch {}
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ICartLineItem[]>(() =>
    typeof window !== 'undefined' ? loadStoredItems() : [],
  )
  const [isOpen, setIsOpen] = useState(false)
  const [snackbar, setSnackbar] = useState<string | null>(null)
  const snackbarTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const dismissSnackbar = useCallback(() => {
    if (snackbarTimerRef.current) {
      clearTimeout(snackbarTimerRef.current)
      snackbarTimerRef.current = null
    }
    setSnackbar(null)
  }, [])

  const showSnackbar = useCallback((message: string) => {
    if (snackbarTimerRef.current) clearTimeout(snackbarTimerRef.current)
    setSnackbar(message)
    snackbarTimerRef.current = setTimeout(() => {
      setSnackbar(null)
      snackbarTimerRef.current = null
    }, SNACKBAR_MS)
  }, [])

  useEffect(
    () => () => {
      if (snackbarTimerRef.current) clearTimeout(snackbarTimerRef.current)
    },
    [],
  )

  useEffect(() => {
    persistItems(items)
  }, [items])

  const openCart = useCallback(() => setIsOpen(true), [])
  const closeCart = useCallback(() => setIsOpen(false), [])
  const toggleCart = useCallback(() => setIsOpen((o) => !o), [])

  const addItem = useCallback(
    (product: ISearchProduct, options?: { size?: string; quantity?: number }) => {
      const sizes = getProductSizes(product).map(abbreviateSizeLabel)
      const hasSizes = sizes.length > 0
      const picked = options?.size?.trim()
      if (hasSizes) {
        if (!picked || !sizes.includes(picked)) {
          showSnackbar('Pick a size first')
          return
        }
      }

      const sizeForLine = hasSizes ? picked : undefined
      const lineId = makeCartLineId(product.id, sizeForLine)
      const lineQty = Math.max(1, Math.floor(options?.quantity ?? 1))

      setItems((prev) => {
        const i = prev.findIndex((l) => l.lineId === lineId)
        if (i >= 0) {
          const next = [...prev]
          next[i] = { ...next[i]!, quantity: next[i]!.quantity + lineQty }
          return next
        }
        return [
          ...prev,
          {
            lineId,
            productId: product.id,
            size: sizeForLine,
            name: product.name ?? 'Untitled',
            price: product.price ?? '—',
            thumbnailImageUrl: product.thumbnailImageUrl,
            imageUrl: product.imageUrl,
            quantity: lineQty,
          },
        ]
      })
      showSnackbar(hasSizes ? `Size ${picked} added` : 'Added to your bag')
    },
    [showSnackbar],
  )

  const removeLine = useCallback((lineId: string) => {
    setItems((prev) => prev.filter((l) => l.lineId !== lineId))
  }, [])

  const setLineQuantity = useCallback((lineId: string, quantity: number) => {
    if (quantity < 1) {
      setItems((prev) => prev.filter((l) => l.lineId !== lineId))
      return
    }
    const q = Math.floor(quantity)
    setItems((prev) =>
      prev.map((l) => (l.lineId === lineId ? { ...l, quantity: q } : l)),
    )
  }, [])

  const clearCart = useCallback(() => setItems([]), [])

  const itemCount = useMemo(
    () => items.reduce((acc, l) => acc + l.quantity, 0),
    [items],
  )

  const subtotal = useMemo(
    () =>
      items.reduce((acc, l) => {
        const p = parseAmount(l.price)
        return acc + (p !== null ? p * l.quantity : 0)
      }, 0),
    [items],
  )

  const value = useMemo(
    () => ({
      items,
      isOpen,
      snackbar,
      openCart,
      closeCart,
      toggleCart,
      showSnackbar,
      dismissSnackbar,
      addItem,
      removeLine,
      setLineQuantity,
      clearCart,
      itemCount,
      subtotal,
    }),
    [
      items,
      isOpen,
      snackbar,
      openCart,
      closeCart,
      toggleCart,
      showSnackbar,
      dismissSnackbar,
      addItem,
      removeLine,
      setLineQuantity,
      clearCart,
      itemCount,
      subtotal,
    ],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { ISearchProduct } from '../features/search/api/types'
import { useCart } from './CartContext'
import type { IWishlistContextValue, IWishlistEntry } from './types'

const STORAGE_KEY = 'shopyntra-wishlist'

export type { IWishlistEntry } from './types'

const WishlistContext = createContext<IWishlistContextValue | null>(null)

function loadStored(): IWishlistEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return []
    return parsed
      .map((row): IWishlistEntry | null => {
        if (typeof row !== 'object' || row === null) return null
        const r = row as Partial<IWishlistEntry>
        if (typeof r.productId !== 'string' || !r.product || typeof r.product !== 'object')
          return null
        const p = r.product as ISearchProduct
        if (typeof p.id !== 'string') return null
        return { productId: r.productId, product: p }
      })
      .filter((x): x is IWishlistEntry => x !== null)
  } catch {
    return []
  }
}

function persist(entries: IWishlistEntry[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
  } catch {}
}

function WishlistProviderInner({ children }: { children: ReactNode }) {
  const { showSnackbar, closeCart } = useCart()
  const [entries, setEntries] = useState<IWishlistEntry[]>(() =>
    typeof window !== 'undefined' ? loadStored() : [],
  )
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    persist(entries)
  }, [entries])

  const openWishlist = useCallback(() => {
    closeCart()
    setIsOpen(true)
  }, [closeCart])

  const closeWishlist = useCallback(() => setIsOpen(false), [])

  const addToWishlist = useCallback(
    (product: ISearchProduct) => {
      let added = false
      setEntries((prev) => {
        if (prev.some((e) => e.productId === product.id)) return prev
        added = true
        return [...prev, { productId: product.id, product }]
      })
      if (added) showSnackbar('Added to wishlist')
    },
    [showSnackbar],
  )

  const upsertWishlistProduct = useCallback((product: ISearchProduct) => {
    setEntries((prev) => {
      const i = prev.findIndex((e) => e.productId === product.id)
      if (i < 0) return [...prev, { productId: product.id, product }]
      const next = [...prev]
      next[i] = { productId: product.id, product }
      return next
    })
  }, [])

  const removeFromWishlist = useCallback((productId: string) => {
      setEntries((prev) => prev.filter((e) => e.productId !== productId))
  }, [])

  const toggleWishlist = useCallback(
    (product: ISearchProduct) => {
      let added = false
      setEntries((prev) => {
        const exists = prev.some((e) => e.productId === product.id)
        if (exists) return prev.filter((e) => e.productId !== product.id)
        added = true
        return [...prev, { productId: product.id, product }]
      })
      if (added) showSnackbar('Added to wishlist')
    },
    [showSnackbar],
  )

  const isInWishlist = useCallback(
    (productId: string) => entries.some((e) => e.productId === productId),
    [entries],
  )

  const wishlistCount = entries.length

  const value = useMemo(
    () => ({
      entries,
      isOpen,
      openWishlist,
      closeWishlist,
      addToWishlist,
      upsertWishlistProduct,
      removeFromWishlist,
      toggleWishlist,
      isInWishlist,
      wishlistCount,
    }),
    [
      entries,
      isOpen,
      openWishlist,
      closeWishlist,
      addToWishlist,
      upsertWishlistProduct,
      removeFromWishlist,
      toggleWishlist,
      isInWishlist,
      wishlistCount,
    ],
  )

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  return <WishlistProviderInner>{children}</WishlistProviderInner>
}

export function useWishlist() {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider')
  return ctx
}

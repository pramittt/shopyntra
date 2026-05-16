import { useEffect, type RefObject } from 'react'

export function useInfiniteScroll(
  sentinelRef: RefObject<HTMLDivElement | null>,
  enabled: boolean,
  onLoadMore: () => void,
) {
  useEffect(() => {
    const node = sentinelRef.current
    if (!node || !enabled) return

    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) onLoadMore()
      },
      { root: null, rootMargin: '280px 0px', threshold: 0 },
    )
    obs.observe(node)
    return () => obs.disconnect()
  }, [sentinelRef, enabled, onLoadMore])
}

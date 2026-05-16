import { useCallback, useEffect, useRef, useState } from 'react'
import type { IPriceRangeFilterProps } from './types'
import styles from './PriceRangeFilter.module.css'

const COMMIT_DEBOUNCE_MS = 350

function pct(value: number, min: number, max: number): number {
  if (max <= min) return 0
  return ((value - min) / (max - min)) * 100
}

function readSliderPair(
  minEl: HTMLInputElement | null,
  maxEl: HTMLInputElement | null,
  fallbackLow: number,
  fallbackHigh: number,
): { low: number; high: number } {
  const lo = Number(minEl?.value ?? fallbackLow)
  const hi = Number(maxEl?.value ?? fallbackHigh)
  return { low: lo, high: hi }
}

export function PriceRangeFilter({ bounds, value, onCommit }: IPriceRangeFilterProps) {
  const { low: min, high: max } = bounds
  const [low, setLow] = useState(value?.low ?? min)
  const [high, setHigh] = useState(value?.high ?? max)
  const minInputRef = useRef<HTMLInputElement>(null)
  const maxInputRef = useRef<HTMLInputElement>(null)
  const draggingRef = useRef(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const onCommitRef = useRef(onCommit)
  onCommitRef.current = onCommit

  useEffect(() => {
    if (draggingRef.current) return
    setLow(value?.low ?? min)
    setHigh(value?.high ?? max)
  }, [value, min, max])

  useEffect(
    () => () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    },
    [],
  )

  const commitRange = useCallback(
    (lo: number, hi: number) => {
      if (!Number.isFinite(lo) || !Number.isFinite(hi)) return
      const nextLow = Math.min(lo, hi)
      const nextHigh = Math.max(lo, hi)
      if (nextLow <= min && nextHigh >= max) {
        onCommitRef.current(null)
      } else {
        onCommitRef.current({ low: nextLow, high: nextHigh })
      }
    },
    [min, max],
  )

  const scheduleCommit = useCallback(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      debounceRef.current = null
      const { low: lo, high: hi } = readSliderPair(
        minInputRef.current,
        maxInputRef.current,
        low,
        high,
      )
      commitRange(lo, hi)
    }, COMMIT_DEBOUNCE_MS)
  }, [commitRange, low, high])

  const flushCommit = useCallback(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
      debounceRef.current = null
    }
    const { low: lo, high: hi } = readSliderPair(
      minInputRef.current,
      maxInputRef.current,
      low,
      high,
    )
    commitRange(lo, hi)
  }, [commitRange, low, high])

  const onMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const pair = readSliderPair(minInputRef.current, maxInputRef.current, low, high)
    const nextLow = Math.min(Number(e.target.value), pair.high)
    setLow(nextLow)
    scheduleCommit()
  }

  const onMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const pair = readSliderPair(minInputRef.current, maxInputRef.current, low, high)
    const nextHigh = Math.max(Number(e.target.value), pair.low)
    setHigh(nextHigh)
    scheduleCommit()
  }

  const fillLeft = pct(low, min, max)
  const fillWidth = pct(high, min, max) - fillLeft

  return (
    <div className={styles.wrap}>
      <p className={styles.values}>
        <span>${low}</span>
        <span>${high}</span>
      </p>
      <div className={styles.trackWrap}>
        <div className={styles.track} aria-hidden />
        <div
          className={styles.fill}
          style={{ left: `${fillLeft}%`, width: `${fillWidth}%` }}
          aria-hidden
        />
        <input
          ref={minInputRef}
          type="range"
          className={`${styles.range} ${styles.rangeMin}`}
          min={min}
          max={max}
          step={1}
          value={low}
          aria-label="Minimum price"
          onPointerDown={() => {
            draggingRef.current = true
          }}
          onChange={onMinChange}
          onPointerUp={() => {
            draggingRef.current = false
            flushCommit()
          }}
          onKeyUp={flushCommit}
        />
        <input
          ref={maxInputRef}
          type="range"
          className={`${styles.range} ${styles.rangeMax}`}
          min={min}
          max={max}
          step={1}
          value={high}
          aria-label="Maximum price"
          onPointerDown={() => {
            draggingRef.current = true
          }}
          onChange={onMaxChange}
          onPointerUp={() => {
            draggingRef.current = false
            flushCommit()
          }}
          onKeyUp={flushCommit}
        />
      </div>
      <p className={styles.hint}>Slide to filter by price</p>
    </div>
  )
}

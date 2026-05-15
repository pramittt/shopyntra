const RECENT_SEARCH_STORAGE_KEY = 'shopyntra_recent_searches'
const RECENT_SEARCH_LIMIT = 5

export function loadRecentSearchTerms(): string[] {
  try {
    const raw = localStorage.getItem(RECENT_SEARCH_STORAGE_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed
      .filter((x): x is string => typeof x === 'string')
      .map((x) => x.trim())
      .filter(Boolean)
      .slice(0, RECENT_SEARCH_LIMIT)
  } catch {
    return []
  }
}

export function recordRecentSearchTerm(term: string): string[] {
  const t = term.trim()
  if (!t) return loadRecentSearchTerms()
  const prev = loadRecentSearchTerms()
  const next = [t, ...prev.filter((x) => x.toLowerCase() !== t.toLowerCase())].slice(
    0,
    RECENT_SEARCH_LIMIT,
  )
  try {
    localStorage.setItem(RECENT_SEARCH_STORAGE_KEY, JSON.stringify(next))
  } catch {
    /* ignore quota / private mode */
  }
  return next
}

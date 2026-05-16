const SWATCH: Record<string, string> = {
  beige: '#d4b896',
  black: '#282c3f',
  blue: '#2563eb',
  brown: '#8b5a2b',
  coral: '#ff7f6e',
  cream: '#fff8e7',
  gray: '#9ca3af',
  grey: '#9ca3af',
  green: '#16a34a',
  ivory: '#fffff0',
  mint: '#98d4bb',
  navy: '#1e3a5f',
  orange: '#f97316',
  pink: '#ff3f6c',
  purple: '#9333ea',
  red: '#dc2626',
  rust: '#b7410e',
  tan: '#d2b48c',
  white: '#f8fafc',
  yellow: '#eab308',
  aqua: '#22d3ee',
}

export function colorSwatchHex(name: string): string {
  const key = name.trim().toLowerCase()
  return SWATCH[key] ?? '#c4c5ce'
}

export function swatchNeedsBorder(name: string): boolean {
  const key = name.trim().toLowerCase()
  return key === 'white' || key === 'ivory' || key === 'cream' || key === 'yellow'
}

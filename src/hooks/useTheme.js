import { useEffect, useState } from 'react'

const STORAGE_KEY = 'deadlift-theme'
const DEFAULT_THEME = 'dark'

function readStoredTheme() {
  try {
    return localStorage.getItem(STORAGE_KEY) || DEFAULT_THEME
  } catch {
    return DEFAULT_THEME
  }
}

/** Persists to localStorage (per-device, per-browser) and applies data-theme to
 * <html> so CSS can key off it. Default is dark regardless of OS preference. */
export function useTheme() {
  const [theme, setTheme] = useState(readStoredTheme)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    try {
      localStorage.setItem(STORAGE_KEY, theme)
    } catch {
      // localStorage unavailable (private mode, blocked) — theme still works for
      // this load, just won't persist across reloads.
    }
  }, [theme])

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))
  return { theme, toggleTheme }
}

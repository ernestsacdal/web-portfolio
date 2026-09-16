'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { flushSync } from 'react-dom'

type Theme = 'light' | 'dark'

/** Viewport point the switch animation should expand from — normally the toggle button. */
export interface ThemeOrigin {
  x: number
  y: number
}

interface ThemeContextType {
  theme: Theme
  toggleTheme: (origin?: ThemeOrigin) => void
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'dark',
  toggleTheme: () => {},
})

const REVEAL_MS = 550
const FALLBACK_FADE_MS = 350

/** Radius needed for a circle at (x, y) to cover the whole viewport. */
function coverRadius({ x, y }: ThemeOrigin): number {
  return Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y))
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark')

  // On mount, restore theme from sessionStorage (persists across reloads,
  // resets to dark when the tab is closed). Deliberately not animated.
  useEffect(() => {
    const saved = sessionStorage.getItem('theme') as Theme | null
    if (saved === 'light' || saved === 'dark') {
      setTheme(saved)
    }
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  const toggleTheme = (origin?: ThemeOrigin) => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark'
    sessionStorage.setItem('theme', next)

    const root = document.documentElement
    // Flip the class synchronously so a view transition snapshots the new
    // theme; the effect above re-applies the same class harmlessly afterwards.
    const apply = () => {
      root.classList.toggle('dark', next === 'dark')
      flushSync(() => setTheme(next))
    }

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) {
      apply()
      return
    }

    // No View Transitions, or no point to expand from: crossfade every
    // colour together for a moment instead.
    if (typeof document.startViewTransition !== 'function' || !origin) {
      root.classList.add('theme-fade')
      apply()
      window.setTimeout(() => root.classList.remove('theme-fade'), FALLBACK_FADE_MS)
      return
    }

    // Circular reveal of the new theme, expanding from the toggle button.
    const transition = document.startViewTransition(apply)
    transition.ready.then(() => {
      const r = coverRadius(origin)
      root.animate(
        {
          clipPath: [
            `circle(0px at ${origin.x}px ${origin.y}px)`,
            `circle(${r}px at ${origin.x}px ${origin.y}px)`,
          ],
        },
        {
          duration: REVEAL_MS,
          easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
          pseudoElement: '::view-transition-new(root)',
        },
      )
    })
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)

"use client"

import * as React from "react"

type ColorTheme = "default" | "purple" | "green" | "amber" | "rose"

interface ColorThemeContextType {
  colorTheme: ColorTheme
  setColorTheme: (theme: ColorTheme) => void
}

const ColorThemeContext = React.createContext<ColorThemeContextType>({
  colorTheme: "default",
  setColorTheme: () => {},
})

export function useColorTheme() {
  return React.useContext(ColorThemeContext)
}

export function ColorThemeProvider({ children }: { children: React.ReactNode }) {
  const [colorTheme, setColorTheme] = React.useState<ColorTheme>("default")
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem("color-theme") as ColorTheme | null
    if (stored) {
      setColorTheme(stored)
    }
  }, [])

  React.useEffect(() => {
    if (!mounted) return
    const html = document.documentElement
    html.classList.remove("theme-purple", "theme-green", "theme-amber", "theme-rose")
    if (colorTheme !== "default") {
      html.classList.add(`theme-${colorTheme}`)
    }
    localStorage.setItem("color-theme", colorTheme)
  }, [colorTheme, mounted])

  return (
    <ColorThemeContext.Provider value={{ colorTheme, setColorTheme }}>
      {children}
    </ColorThemeContext.Provider>
  )
}

"use client"

import { useTheme } from "next-themes"
import { useColorTheme } from "@/components/color-theme-provider"
import { Sun, Moon } from "lucide-react"
import { cn } from "@/lib/utils"

const colorThemes = [
  {
    id: "default" as const,
    label: "Azul",
    lightColor: "bg-blue-500",
    darkColor: "bg-blue-400",
  },
  {
    id: "purple" as const,
    label: "Morado",
    lightColor: "bg-violet-500",
    darkColor: "bg-violet-400",
  },
  {
    id: "green" as const,
    label: "Verde",
    lightColor: "bg-emerald-500",
    darkColor: "bg-emerald-400",
  },
  {
    id: "amber" as const,
    label: "Ambar",
    lightColor: "bg-amber-500",
    darkColor: "bg-amber-400",
  },
  {
    id: "rose" as const,
    label: "Rosa",
    lightColor: "bg-rose-500",
    darkColor: "bg-rose-400",
  },
]

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()
  const { colorTheme, setColorTheme } = useColorTheme()

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="mb-3 text-sm font-medium text-muted-foreground">Modo</h3>
        <div className="flex gap-3">
          <button
            onClick={() => setTheme("light")}
            className={cn(
              "flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-all",
              theme === "light"
                ? "border-primary bg-primary text-primary-foreground shadow-sm"
                : "border-border bg-card text-card-foreground hover:bg-accent"
            )}
          >
            <Sun className="h-4 w-4" />
            Claro
          </button>
          <button
            onClick={() => setTheme("dark")}
            className={cn(
              "flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-all",
              theme === "dark"
                ? "border-primary bg-primary text-primary-foreground shadow-sm"
                : "border-border bg-card text-card-foreground hover:bg-accent"
            )}
          >
            <Moon className="h-4 w-4" />
            Oscuro
          </button>
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-medium text-muted-foreground">Color de acento</h3>
        <div className="flex gap-3">
          {colorThemes.map((ct) => (
            <button
              key={ct.id}
              onClick={() => setColorTheme(ct.id)}
              className={cn(
                "group flex flex-col items-center gap-1.5"
              )}
              title={ct.label}
            >
              <div
                className={cn(
                  "h-10 w-10 rounded-full transition-all",
                  ct.lightColor,
                  colorTheme === ct.id
                    ? "ring-2 ring-foreground ring-offset-2 ring-offset-background scale-110"
                    : "hover:scale-105"
                )}
              />
              <span className={cn(
                "text-xs font-medium transition-colors",
                colorTheme === ct.id ? "text-foreground" : "text-muted-foreground"
              )}>
                {ct.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

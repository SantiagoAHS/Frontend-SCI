import { type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatCardProps {
  label: string
  value: string
  icon: LucideIcon
  change?: string
  trend?: "up" | "down" | "neutral"
}

export function StatCard({ label, value, icon: Icon, change, trend = "neutral" }: StatCardProps) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <div className="flex flex-col">
        <span className="text-xs font-medium text-muted-foreground">
          {label}
        </span>
        <span className="text-xl font-bold text-card-foreground">
          {value}
        </span>
        {change && (
          <span
            className={cn(
              "text-xs font-medium",
              trend === "up" && "text-emerald-600 dark:text-emerald-400",
              trend === "down" && "text-red-600 dark:text-red-400",
              trend === "neutral" && "text-muted-foreground"
            )}
          >
            {change}
          </span>
        )}
      </div>
    </div>
  )
}

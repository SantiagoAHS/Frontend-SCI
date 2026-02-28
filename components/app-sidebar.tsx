"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Package,
  ArrowRightLeft,
  Wrench,
  ClipboardCheck,
  FileBarChart,
  Settings,
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const mainNav = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/activos", label: "Activos", icon: Package },
  { href: "/asignaciones", label: "Asignaciones", icon: ArrowRightLeft },
  { href: "/mantenimientos", label: "Mantenimientos", icon: Wrench },
  { href: "/auditorias", label: "Auditorias", icon: ClipboardCheck },
  { href: "/reportes", label: "Reportes", icon: FileBarChart },
]

const adminNav = [
  { href: "/ajustes", label: "Ajustes", icon: Settings },
]

function NavGroup({ items }: { items: typeof mainNav }) {
  const pathname = usePathname()

  return (
    <>
      {items.map((item) => {
        const isActive = pathname === item.href
        const Icon = item.icon

        return (
          <Tooltip key={item.href}>
            <TooltipTrigger asChild>
              <Link
                href={item.href}
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-lg transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="sr-only">{item.label}</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right" className="flex items-center gap-2 font-medium">
              {item.label}
            </TooltipContent>
          </Tooltip>
        )
      })}
    </>
  )
}

export function AppSidebar() {
  return (
    <aside className="sticky top-0 flex h-screen w-16 flex-col items-center border-r border-border bg-card py-6">
      <div className="mb-8 flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
        <span className="text-lg font-bold text-primary-foreground">G</span>
      </div>

      <nav className="flex flex-1 flex-col items-center gap-2">
        <NavGroup items={mainNav} />
        <div className="my-2 h-px w-8 bg-border" />
        <NavGroup items={adminNav} />
      </nav>
    </aside>
  )
}

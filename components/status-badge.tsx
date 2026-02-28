"use client"

import { cn } from "@/lib/utils"

export type AssetStatus =
  | "Registrado"
  | "Asignado"
  | "En Uso"
  | "Mantenimiento"
  | "Reasignacion"
  | "Auditoria"
  | "Baja"

export type AssetType =
  | "Computadora"
  | "Vehiculo"
  | "Impresora"
  | "Mobiliario"
  | "Herramientas"
  | "Equipo de Red"

const statusStyles: Record<AssetStatus, string> = {
  Registrado: "bg-muted text-muted-foreground",
  Asignado: "bg-blue-500/15 text-blue-700 dark:text-blue-400",
  "En Uso": "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  Mantenimiento: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  Reasignacion: "bg-violet-500/15 text-violet-700 dark:text-violet-400",
  Auditoria: "bg-cyan-500/15 text-cyan-700 dark:text-cyan-400",
  Baja: "bg-red-500/15 text-red-700 dark:text-red-400",
}

const statusDots: Record<AssetStatus, string> = {
  Registrado: "bg-muted-foreground",
  Asignado: "bg-blue-500",
  "En Uso": "bg-emerald-500",
  Mantenimiento: "bg-amber-500",
  Reasignacion: "bg-violet-500",
  Auditoria: "bg-cyan-500",
  Baja: "bg-red-500",
}

const typeStyles: Record<AssetType, string> = {
  Computadora: "bg-blue-500/15 text-blue-700 dark:text-blue-400",
  Vehiculo: "bg-orange-500/15 text-orange-700 dark:text-orange-400",
  Impresora: "bg-violet-500/15 text-violet-700 dark:text-violet-400",
  Mobiliario: "bg-teal-500/15 text-teal-700 dark:text-teal-400",
  Herramientas: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  "Equipo de Red": "bg-cyan-500/15 text-cyan-700 dark:text-cyan-400",
}

export function StatusBadge({ status }: { status: AssetStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold",
        statusStyles[status]
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", statusDots[status])} />
      {status}
    </span>
  )
}

export function TypeBadge({ type }: { type: AssetType }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
        typeStyles[type]
      )}
    >
      {type}
    </span>
  )
}

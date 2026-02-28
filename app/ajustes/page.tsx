"use client"

import { useRouter } from "next/navigation"
import { Settings, LayoutGrid, Building2, Users, Bell, Database } from "lucide-react"

const settingsSections = [
  {
    icon: LayoutGrid,
    title: "Tipos de Activos",
    description:
      "Configura los tipos de activos disponibles y los campos dinamicos que cada tipo requiere (marca, modelo, placa, etc.).",
    route: "/ajustes/tipoactivos",
  },
  {
    icon: Building2,
    title: "Areas y Departamentos",
    description:
      "Administra la estructura organizacional: departamentos, sucursales y ubicaciones fisicas del inventario.",
    route: "/ajustes/areas",
  },
  {
    icon: Users,
    title: "Usuarios y Permisos",
    description:
      "Gestiona usuarios del sistema, roles (administrador, operador, auditor) y permisos de acceso por modulo.",
    route: "/ajustes/usuarios",
  },
  {
    icon: Bell,
    title: "Alertas y Notificaciones",
    description:
      "Configura alertas automaticas: mantenimiento proximo, asignaciones vencidas, activos sin verificar y vida util.",
    route: "/ajustes/alertas",
  },
  {
    icon: Database,
    title: "Respaldos",
    description:
      "Programa respaldos automaticos, exporta la base de datos completa o restaura desde un punto anterior.",
    route: "/ajustes/respaldos",
  },
]

export default function AjustesPage() {
  const router = useRouter()

  return (
    <div className="flex flex-col gap-6 p-6 lg:p-8">
      <header className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
          <Settings className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Ajustes del Sistema
          </h1>
          <p className="text-sm text-muted-foreground">
            Configuracion general del sistema de gestion de activos
          </p>
        </div>
      </header>

      {/* Settings Grid */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {settingsSections.map((section) => {
          const Icon = section.icon
          return (
            <button
              key={section.title}
              onClick={() => router.push(section.route)}
              className="flex items-start gap-4 rounded-xl border border-border bg-card p-5 text-left shadow-sm transition-all hover:bg-accent/50 hover:scale-[1.02]"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm font-semibold text-card-foreground">
                  {section.title}
                </span>
                <span className="text-xs text-muted-foreground leading-relaxed">
                  {section.description}
                </span>
              </div>
            </button>
          )
        })}
      </section>
    </div>
  )
}
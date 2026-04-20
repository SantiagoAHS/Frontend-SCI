"use client"

import { API_URL } from "@/config/api"
import { useEffect, useState } from "react"
import { StatCard } from "@/components/stat-card"
import {
  Package,
  ArrowRightLeft,
  Wrench,
  AlertTriangle,
} from "lucide-react"
import {
  Bar,
  BarChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  Legend,
  Cell,
} from "recharts"

const CHART_COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
  "hsl(var(--muted-foreground))",
]

export default function DashboardPage() {
  const [kpis, setKpis] = useState<any>(null)
  const [assetsByType, setAssetsByType] = useState<any[]>([])
  const [assetsByStatus, setAssetsByStatus] = useState<any[]>([])
  const [isAuth, setIsAuth] = useState<boolean | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem("token")

      // 🚫 NO TOKEN
      if (!token) {
        setIsAuth(false)
        return
      }

      try {
        const res = await fetch(`${API_URL}/dashboard/stats/`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        })

        // 🚫 TOKEN INVÁLIDO
        if (res.status === 401) {
          localStorage.removeItem("token")
          setIsAuth(false)
          return
        }

        if (!res.ok) throw new Error("Error cargando estadísticas")

        const data = await res.json()

        setKpis(data.kpis)

        const tipos = data.por_tipo.map((item: any) => ({
          name: item.tipo_activo__nombre,
          cantidad: item.total,
        }))
        setAssetsByType(tipos)

        const estados = data.por_estado.map((item: any) => ({
          name: item.estado,
          value: item.total,
        }))
        setAssetsByStatus(estados)

        setIsAuth(true)

      } catch (error) {
        console.error(error)
        setIsAuth(false)
      }
    }

    fetchStats()
  }, [])

  // ⏳ LOADING
  if (isAuth === null) {
    return <div className="p-6">Cargando...</div>
  }

  // 🚫 SIN ACCESO
  if (isAuth === false) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="text-center space-y-4 max-w-sm">

          <div className="text-4xl">🔐</div>

          <h2 className="text-xl font-bold">Acceso restringido</h2>

          <p className="text-muted-foreground text-sm">
            Debes iniciar sesión para acceder al dashboard del sistema
          </p>

          <button
            onClick={() => (window.location.href = "/login")}
            className="mt-2 bg-primary hover:opacity-90 text-white px-4 py-2 rounded-xl transition"
          >
            Ir al login
          </button>

        </div>
      </div>
    )
  }

  const stats = [
    { label: "Total Activos", value: kpis.total, icon: Package },
    { label: "Activos Asignados", value: kpis.asignados, icon: ArrowRightLeft },
    { label: "En Mantenimiento", value: kpis.mantenimiento, icon: Wrench },
    { label: "Activos de Baja", value: kpis.baja, icon: AlertTriangle },
  ]

  return (
    <div className="flex flex-col gap-8 p-6 lg:p-8">

      <header>
        <h1 className="text-2xl font-bold tracking-tight">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Sistema Integral de Gestión de Activos
        </p>
      </header>

      {/* KPI Cards */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            icon={stat.icon}
          />
        ))}
      </section>

      {/* Charts */}
      <section className="grid grid-cols-1 gap-4 lg:grid-cols-5">

        {/* Bar Chart */}
        <div className="flex flex-col gap-4 rounded-xl border bg-card p-6 shadow-sm lg:col-span-3">
          <h3 className="text-sm font-semibold">
            Activos por Tipo
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={assetsByType}>
                <XAxis dataKey="name" />
                <YAxis />
                <RechartsTooltip />
                <Bar dataKey="cantidad">
                  {assetsByType.map((_, index) => (
                    <Cell
                      key={index}
                      fill={CHART_COLORS[index % CHART_COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="flex flex-col gap-4 rounded-xl border bg-card p-6 shadow-sm lg:col-span-2">
          <h3 className="text-sm font-semibold">
            Distribución por Estado
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={assetsByStatus}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={55}
                  outerRadius={85}
                />
                <RechartsTooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </section>
    </div>
  )
}
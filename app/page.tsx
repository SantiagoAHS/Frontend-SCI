"use client"

import { ThemeSwitcher } from "@/components/theme-switcher"
import { StatCard } from "@/components/stat-card"
import { StatusBadge, type AssetStatus } from "@/components/status-badge"
import {
  Package,
  ArrowRightLeft,
  Wrench,
  AlertTriangle,
  Monitor,
  Car,
  Printer,
  Armchair,
  HardDrive,
  Hammer,
} from "lucide-react"
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  Legend,
} from "recharts"

const stats = [
  { label: "Total Activos", value: "248", icon: Package, change: "+18 este mes", trend: "up" as const },
  { label: "Activos Asignados", value: "186", icon: ArrowRightLeft, change: "75% del total", trend: "neutral" as const },
  { label: "En Mantenimiento", value: "12", icon: Wrench, change: "-3 vs mes pasado", trend: "down" as const },
  { label: "Alertas Activas", value: "7", icon: AlertTriangle, change: "+2 nuevas hoy", trend: "up" as const },
]

const assetsByType = [
  { name: "Computadoras", cantidad: 82, icon: Monitor },
  { name: "Vehiculos", cantidad: 24, icon: Car },
  { name: "Impresoras", cantidad: 35, icon: Printer },
  { name: "Mobiliario", cantidad: 48, icon: Armchair },
  { name: "Eq. de Red", cantidad: 31, icon: HardDrive },
  { name: "Herramientas", cantidad: 28, icon: Hammer },
]

const assetsByStatus = [
  { name: "Registrado", value: 22, fill: "hsl(var(--muted-foreground))" },
  { name: "Asignado", value: 64, fill: "hsl(220, 90%, 56%)" },
  { name: "En Uso", value: 122, fill: "hsl(160, 60%, 45%)" },
  { name: "Mantenimiento", value: 12, fill: "hsl(38, 92%, 50%)" },
  { name: "Baja", value: 28, fill: "hsl(0, 72%, 51%)" },
]

const movements: { asset: string; action: string; responsible: string; date: string; status: AssetStatus }[] = [
  { asset: "Laptop Dell XPS 15", action: "Asignacion a persona", responsible: "Juan Perez", date: "Hace 1 hora", status: "Asignado" },
  { asset: "Ford Ranger 2024", action: "Mantenimiento preventivo", responsible: "Taller Central", date: "Hace 3 horas", status: "Mantenimiento" },
  { asset: "Impresora HP LaserJet", action: "Baja definitiva", responsible: "Admin TI", date: "Hace 5 horas", status: "Baja" },
  { asset: "Switch Cisco 24P", action: "Registro inicial", responsible: "Maria Lopez", date: "Hace 8 horas", status: "Registrado" },
  { asset: 'Monitor LG 34"', action: "Reasignacion de area", responsible: "Depto. Diseno", date: "Hace 1 dia", status: "En Uso" },
  { asset: "Escritorio Ejecutivo", action: "Auditoria fisica", responsible: "Auditor: R. Gomez", date: "Hace 1 dia", status: "Auditoria" },
]

const CHART_COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
  "hsl(var(--muted-foreground))",
]

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8 p-6 lg:p-8">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-balance">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Sistema Integral de Gestion de Activos e Inventario
        </p>
      </header>

      {/* KPI Cards */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </section>

      {/* Charts Row */}
      <section className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        {/* Bar Chart - Assets by Type */}
        <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6 shadow-sm lg:col-span-3">
          <h3 className="text-sm font-semibold text-card-foreground">
            Activos por Tipo
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={assetsByType} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                  axisLine={false}
                  tickLine={false}
                />
                <RechartsTooltip
                  contentStyle={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: "12px",
                    color: "hsl(var(--card-foreground))",
                  }}
                />
                <Bar dataKey="cantidad" radius={[6, 6, 0, 0]}>
                  {assetsByType.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart - Assets by Status */}
        <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6 shadow-sm lg:col-span-2">
          <h3 className="text-sm font-semibold text-card-foreground">
            Distribucion por Estado
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={assetsByStatus}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                  stroke="none"
                />
                <RechartsTooltip
                  contentStyle={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: "12px",
                    color: "hsl(var(--card-foreground))",
                  }}
                />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: "11px" }}
                  formatter={(value) => (
                    <span style={{ color: "hsl(var(--card-foreground))" }}>{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* Recent Movements Table */}
      <section className="rounded-xl border border-border bg-card shadow-sm">
        <div className="border-b border-border p-6 pb-4">
          <h3 className="text-sm font-semibold text-card-foreground">
            Ultimos Movimientos
          </h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Historial reciente de movimientos de activos
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Activo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Movimiento</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Responsable</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Estado</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {movements.map((m, i) => (
                <tr key={i} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-3 font-medium text-card-foreground">{m.asset}</td>
                  <td className="px-6 py-3 text-muted-foreground">{m.action}</td>
                  <td className="px-6 py-3 text-muted-foreground">{m.responsible}</td>
                  <td className="px-6 py-3"><StatusBadge status={m.status} /></td>
                  <td className="px-6 py-3 text-right text-xs text-muted-foreground">{m.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

    </div>
  )
}

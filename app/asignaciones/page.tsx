"use client"

import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { ArrowRightLeft, Search, Plus, Bell } from "lucide-react"
import { cn } from "@/lib/utils"

interface Prestamo {
  id: number
  activo: number
  activo_nombre: string
  responsable_nombre: string
  tipo_prestamo: string
  estado: string
  estado_calculado: string
  fecha_inicio: string
  fecha_fin: string
}

const statusStyles: Record<string, string> = {
  activo: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  finalizado: "bg-gray-500/15 text-gray-700 dark:text-gray-400",
  vencido: "bg-red-500/15 text-red-700 dark:text-red-400",
  cancelado: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
}

const statusFilters = ["Todos", "activo", "finalizado", "vencido", "cancelado"]

export default function AsignacionesPage() {
  const router = useRouter()

  const [prestamos, setPrestamos] = useState<Prestamo[]>([])
  const [notificaciones, setNotificaciones] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [activeFilter, setActiveFilter] = useState<string>("Todos")
  const [search, setSearch] = useState("")

  useEffect(() => {

    const fetchPrestamos = async () => {

      const token = localStorage.getItem("token")

      if (!token) {
        setError("No autenticado")
        setLoading(false)
        return
      }

      try {

        const res = await fetch("http://127.0.0.1:8000/api/prestamos/list/", {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        })

        if (!res.ok) {
          const text = await res.text()
          throw new Error("Error cargando préstamos: " + text)
        }

        const data = await res.json()

        const lista = data.results || data

        setPrestamos(lista)

      } catch (err: any) {

        setError(err.message)

      } finally {

        setLoading(false)

      }
    }

    fetchPrestamos()

  }, [])

  useEffect(() => {

    const fetchNotificaciones = async () => {

      const token = localStorage.getItem("token")

      if (!token) return

      try {

        const res = await fetch("http://127.0.0.1:8000/api/prestamos/notificaciones/", {
          headers: {
            Authorization: `Token ${token}`,
          },
        })

        if (!res.ok) return

        const data = await res.json()

        const total =
          (data.prestamos_por_vencer?.length || 0) +
          (data.prestamos_vencidos?.length || 0)

        setNotificaciones(total)

      } catch (err) {
        console.error("Error cargando notificaciones", err)
      }

    }

    fetchNotificaciones()

  }, [])

  const finalizarPrestamo = async (id: number) => {

    const token = localStorage.getItem("token")

    if (!token) {
      alert("No autenticado")
      return
    }

    const confirmar = confirm("¿Deseas finalizar este préstamo?")

    if (!confirmar) return

    try {

      const res = await fetch(`http://127.0.0.1:8000/api/prestamos/${id}/finalizar/`, {
        method: "PATCH",
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (!res.ok) {
        const text = await res.text()
        throw new Error(text)
      }

      // actualizar estado en la tabla sin recargar
      setPrestamos((prev) =>
        prev.map((p) =>
          p.id === id
            ? { ...p, estado: "finalizado", estado_calculado: "finalizado" }
            : p
        )
      )

    } catch (err: any) {
      alert("Error: " + err.message)
    }
  }

  const filtered = prestamos.filter((a) => {

    const matchStatus =
      activeFilter === "Todos" || a.estado_calculado === activeFilter

    const matchSearch =
      search === "" ||
      a.activo_nombre?.toLowerCase().includes(search.toLowerCase()) ||
      a.responsable_nombre?.toLowerCase().includes(search.toLowerCase())

    return matchStatus && matchSearch

  })

  if (loading) {
    return <div className="p-10 text-center">Cargando préstamos...</div>
  }

  if (error) {
    return <div className="p-10 text-center text-red-500">{error}</div>
  }

  return (

    <div className="flex flex-col gap-6 p-6 lg:p-8">

      <header className="flex items-center justify-between">

        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
          <ArrowRightLeft className="h-5 w-5 text-primary" />
        </div>

        <div>
          <h1 className="text-2xl font-bold">Préstamos</h1>
          <p className="text-sm text-muted-foreground">
            {filtered.length} registros
          </p>
        </div>

        <div className="flex items-center gap-3">

          <button
            onClick={() => router.push("/asignaciones/notificaciones")}
            className="relative border px-3 py-2 rounded-lg hover:bg-accent"
          >
            <Bell className="h-4 w-4" />

            {notificaciones > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs px-1.5 py-0.5 rounded-full">
                {notificaciones}
              </span>
            )}

          </button>

          <button
            onClick={() => router.push("/asignaciones/create")}
            className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm hover:opacity-90"
          >
            <Plus className="h-4 w-4" />
            Nuevo préstamo
          </button>

        </div>

      </header>

      {/* Buscador */}

      <div className="relative">

        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

        <input
          type="text"
          placeholder="Buscar por activo o responsable..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-10 w-full rounded-lg border pl-10 pr-4 text-sm"
        />

      </div>

      {/* Filtros */}

      <div className="flex gap-2 flex-wrap">

        {statusFilters.map((f) => (

          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={
              activeFilter === f
                ? "bg-primary text-white px-3 py-1 rounded-full text-xs"
                : "border px-3 py-1 rounded-full text-xs"
            }
          >
            {f}
          </button>

        ))}

      </div>

      {/* Tabla */}

      <div className="overflow-hidden rounded-xl border bg-card">

        <div className="overflow-x-auto">

          <table className="w-full text-sm">

            <thead>

              <tr className="border-b bg-muted/50">

                <th className="px-6 py-3 text-left text-xs">ID</th>
                <th className="px-6 py-3 text-left text-xs">Activo</th>
                <th className="px-6 py-3 text-left text-xs">Responsable</th>
                <th className="px-6 py-3 text-left text-xs">Tipo préstamo</th>
                <th className="px-6 py-3 text-left text-xs">Estado</th>
                <th className="px-6 py-3 text-left text-xs">Fecha inicio</th>
                <th className="px-6 py-3 text-left text-xs">Fecha fin</th>
                <th className="px-6 py-3 text-left text-xs">Acciones</th>

              </tr>

            </thead>

            <tbody>

              {filtered.map((p) => (

                <tr key={p.id} className="border-b hover:bg-muted/50">

                  <td className="px-6 py-3">{p.id}</td>

                  <td className="px-6 py-3">
                    {p.activo_nombre} 
                  </td>

                  <td className="px-6 py-3">{p.responsable_nombre}</td>

                  <td className="px-6 py-3">{p.tipo_prestamo}</td>

                  <td className="px-6 py-3">

                    <span
                      className={cn(
                        "rounded-full px-2 py-1 text-xs font-semibold",
                        statusStyles[p.estado_calculado] || "bg-gray-500/15"
                      )}
                    >
                      {p.estado_calculado}
                    </span>

                  </td>

                  <td className="px-6 py-3">
                    {new Date(p.fecha_inicio).toLocaleDateString()}
                  </td>

                  <td className="px-6 py-3">
                    {new Date(p.fecha_fin).toLocaleDateString()}
                  </td>

                  <td className="px-6 py-3">
                    {p.estado_calculado === "activo" || p.estado_calculado === "vencido" ? (

                      <button
                        onClick={() => finalizarPrestamo(p.id)}
                        className="bg-blue-600 text-white px-3 py-1 rounded-md text-xs hover:opacity-90"
                      >
                        Finalizar
                      </button>

                    ) : (

                      <span className="text-xs text-gray-400">
                        —
                      </span>

                    )}
                  </td>

                </tr>

              ))}

              {filtered.length === 0 && (

                <tr>

                  <td colSpan={7} className="text-center py-10 text-muted-foreground">
                    No se encontraron resultados
                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>

  )
}
"use client"

import { API_URL } from "@/config/api"
import { useEffect, useState } from "react"
import { Bell, AlertTriangle } from "lucide-react"

interface PrestamoNotificacion {
  id: number
  activo: string
  responsable: string
  fecha_fin: string
  dias_restantes?: number
}

export default function NotificacionesPrestamos() {

  const [porVencer, setPorVencer] = useState<PrestamoNotificacion[]>([])
  const [vencidos, setVencidos] = useState<PrestamoNotificacion[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {

    const fetchNotificaciones = async () => {

      const token = localStorage.getItem("token")

      try {

        const res = await fetch(`${API_URL}/prestamos/notificaciones/`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        })

        const data = await res.json()

        setPorVencer(data.prestamos_por_vencer || [])
        setVencidos(data.prestamos_vencidos || [])

      } catch (err) {

        console.error("Error cargando notificaciones", err)

      } finally {

        setLoading(false)

      }

    }

    fetchNotificaciones()

  }, [])

  if (loading) {
    return <div className="p-8">Cargando notificaciones...</div>
  }

  return (

    <div className="p-8 space-y-8">

      <div className="flex items-center gap-3">
        <Bell className="h-6 w-6 text-primary"/>
        <h1 className="text-2xl font-bold">Notificaciones de préstamos</h1>
      </div>

      {/* PRÉSTAMOS POR VENCER */}

      <div className="space-y-4">

        <h2 className="text-lg font-semibold text-amber-600 flex items-center gap-2">
          <AlertTriangle className="h-5 w-5"/>
          Préstamos por vencer
        </h2>

        {porVencer.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No hay préstamos próximos a vencer
          </p>
        ) : (

          <div className="border rounded-lg overflow-hidden">

            {porVencer.map((p) => (

              <div
                key={p.id}
                className="flex justify-between items-center border-b px-4 py-3"
              >

                <div>

                  <p className="font-medium">{p.activo}</p>

                  <p className="text-sm text-muted-foreground">
                    Responsable: {p.responsable}
                  </p>

                </div>

                <div className="text-right">

                  <p className="text-sm">
                    vence el {new Date(p.fecha_fin).toLocaleDateString()}
                  </p>

                  <p className="text-xs text-amber-600">
                    {p.dias_restantes} días restantes
                  </p>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

      {/* PRÉSTAMOS VENCIDOS */}

      <div className="space-y-4">

        <h2 className="text-lg font-semibold text-red-600 flex items-center gap-2">
          <AlertTriangle className="h-5 w-5"/>
          Préstamos vencidos
        </h2>

        {vencidos.length === 0 ? (

          <p className="text-sm text-muted-foreground">
            No hay préstamos vencidos
          </p>

        ) : (

          <div className="border rounded-lg overflow-hidden">

            {vencidos.map((p) => (

              <div
                key={p.id}
                className="flex justify-between items-center border-b px-4 py-3"
              >

                <div>

                  <p className="font-medium">{p.activo}</p>

                  <p className="text-sm text-muted-foreground">
                    Responsable: {p.responsable}
                  </p>

                </div>

                <div className="text-right text-red-600 text-sm">

                  venció el {new Date(p.fecha_fin).toLocaleDateString()}

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>

  )
}
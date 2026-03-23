"use client"

import { useEffect, useState } from "react"
import { ClipboardCheck, Plus } from "lucide-react"

export default function AuditoriasPage() {

  const [loading, setLoading] = useState(false)
  const [auditorias, setAuditorias] = useState([])

  // 🔹 Obtener auditorías
  const fetchAuditorias = async () => {
    const token = localStorage.getItem("token")

    try {
      const res = await fetch("http://localhost:8000/api/auditorias/list/", {
        headers: {
          Authorization: `Token ${token}`,
        },
      })

      if (!res.ok) {
        console.log("Error al obtener auditorías:", res.status)
        return
      }

      const data = await res.json()
      setAuditorias(data)

    } catch (error) {
      console.error("Error fetch auditorías:", error)
    }
  }

  useEffect(() => {
    fetchAuditorias()
  }, [])

  // 🔹 Crear auditoría
  const handleCrearAuditoria = async () => {
    const token = localStorage.getItem("token")

    setLoading(true)

    try {
      const res = await fetch("http://localhost:8000/api/auditoria/iniciar/", {
        method: "POST",
        headers: {
          Authorization: `Token ${token}`,
        },
      })

      if (!res.ok) {
        console.log("Error al crear auditoría:", res.status)
        setLoading(false)
        return
      }

      const data = await res.json()

      // 🔥 refrescar lista
      fetchAuditorias()

      // 🔥 redirigir
      window.location.href = `/auditorias/${data.auditoria_id}`

    } catch (error) {
      console.error("Error crear auditoría:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-6 p-6 lg:p-8">

      {/* Header */}
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <ClipboardCheck className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">
              Auditorías
            </h1>
            <p className="text-sm text-muted-foreground">
              Historial de auditorías
            </p>
          </div>
        </div>

        <button
          onClick={handleCrearAuditoria}
          disabled={loading}
          className="inline-flex h-9 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          <Plus className="h-4 w-4" />
          {loading ? "Creando..." : "Nueva Auditoría"}
        </button>
      </header>

      {/* 🔹 LISTA */}
      <div className="flex flex-col gap-3">
        {auditorias.length === 0 ? (
          <p className="text-gray-500">No hay auditorías aún</p>
        ) : (
          auditorias.map((auditoria) => (
            <div
              key={auditoria.id}
              onClick={() => window.location.href = `/auditorias/${auditoria.id}`}
              className="cursor-pointer rounded-lg border p-4 hover:bg-gray-50 transition"
            >
              <h3 className="font-semibold">{auditoria.nombre}</h3>
              <p className="text-sm text-gray-500">
                Estado: {auditoria.estado}
              </p>
              <p className="text-xs text-gray-400">
                {new Date(auditoria.fecha_inicio).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>

    </div>
  )
}
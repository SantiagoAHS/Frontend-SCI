"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

interface Activo {
  id: number
  nombre: string
}

export default function CrearMantenimientoPreventivo() {
  const [activos, setActivos] = useState<Activo[]>([])
  const [activoId, setActivoId] = useState<number | "">("")
  const [fechaIngreso, setFechaIngreso] = useState(new Date().toISOString().slice(0, 10))
  const [responsable, setResponsable] = useState("")
  const [descripcion, setDescripcion] = useState("")
  const [costo, setCosto] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const router = useRouter()

  useEffect(() => {
    const fetchActivos = async () => {
      const token = localStorage.getItem("token")
      if (!token) {
        setError("No autenticado")
        setLoading(false)
        return
      }

      try {
        const res = await fetch("http://localhost:8000/api/activos/list/", {
          headers: {
            Authorization: `Token ${token}`,
          },
        })
        if (!res.ok) throw new Error("Error cargando activos")
        const data = await res.json()
        setActivos(data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchActivos()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    const token = localStorage.getItem("token")
    if (!token) {
      setError("No autenticado")
      return
    }

    if (!activoId || !responsable) {
      setError("Debes seleccionar un activo y poner el responsable")
      return
    }

    const payload = {
      activo: activoId,
      fecha_ingreso: fechaIngreso,
      responsable,
      descripcion_problema: descripcion,
      costo: costo || null,
    }

    try {
      const res = await fetch("http://localhost:8000/api/preventivo/", {
        method: "POST",
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const text = await res.text()
        throw new Error("Error al crear mantenimiento: " + text)
      }

      setSuccess("Mantenimiento preventivo programado correctamente")
      // Limpiar formulario
      setActivoId("")
      setResponsable("")
      setDescripcion("")
      setCosto("")
      setFechaIngreso(new Date().toISOString().slice(0, 10))

      // Opcional: redirigir a la lista
      router.push("/mantenimientos")
    } catch (err: any) {
      setError(err.message)
    }
  }

  if (loading) return <div className="p-8 text-muted-foreground">Cargando activos...</div>
  if (error) return <div className="p-8 text-red-500">{error}</div>

  return (
    <div className="p-6 lg:p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Programar Mantenimiento Preventivo</h1>

      {success && <div className="mb-4 text-green-600">{success}</div>}
      {error && <div className="mb-4 text-red-600">{error}</div>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block mb-1 text-sm font-medium">Activo</label>
          <select
            value={activoId}
            onChange={(e) => setActivoId(Number(e.target.value))}
            className="w-full rounded border p-2"
          >
            <option value="">Selecciona un activo</option>
            {activos.map((a) => (
              <option key={a.id} value={a.id}>
                {a.nombre}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">Fecha de ingreso</label>
          <input
            type="date"
            value={fechaIngreso}
            onChange={(e) => setFechaIngreso(e.target.value)}
            className="w-full rounded border p-2"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">Responsable</label>
          <input
            type="text"
            value={responsable}
            onChange={(e) => setResponsable(e.target.value)}
            className="w-full rounded border p-2"
            placeholder="Nombre del técnico o empresa"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">Descripción del problema</label>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="w-full rounded border p-2"
            rows={3}
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">Costo</label>
          <input
            type="number"
            value={costo}
            onChange={(e) => setCosto(e.target.value)}
            className="w-full rounded border p-2"
            placeholder="Opcional"
          />
        </div>

        <button
          type="submit"
          className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90"
        >
          Guardar Mantenimiento
        </button>
      </form>
    </div>
  )
}
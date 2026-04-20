"use client"

import { API_URL } from "@/config/api"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Wrench, Calendar, User, FileText, DollarSign, ArrowLeft, Loader2 } from "lucide-react"
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
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const router = useRouter()

  useEffect(() => {
    const fetchActivos = async () => {
      const token = localStorage.getItem("token")
      if (!token) { setError("No autenticado"); setLoading(false); return }

      try {
        const res = await fetch(`${API_URL}/activos/disponibles/`, {
          headers: { Authorization: `Token ${token}` },
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
    if (!token) { setError("No autenticado"); return }
    if (!activoId || !responsable) {
      setError("Debes seleccionar un activo y asignar un responsable")
      return
    }

    setIsSubmitting(true)
    const payload = {
      activo: activoId,
      fecha_ingreso: fechaIngreso,
      responsable,
      descripcion_problema: descripcion,
      costo: costo || null,
    }

    try {
      const res = await fetch(`${API_URL}/preventivo/`, {
        method: "POST",
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (!res.ok) throw new Error("Error al crear el registro en el servidor")

      setSuccess("Mantenimiento programado con éxito")
      setTimeout(() => router.push("/mantenimientos"), 1500)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
      <Loader2 className="h-8 w-8 text-primary animate-spin" />
      <p className="text-xs uppercase tracking-widest font-bold text-muted-foreground">Cargando activos disponibles...</p>
    </div>
  )

  return (
    <div className="flex flex-col gap-6 p-6 lg:p-8 max-w-2xl mx-auto">
      {/* HEADER */}
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => router.back()}
            className="p-2 hover:bg-muted rounded-full transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Programar mantenimiento</h1>
            <p className="text-sm text-muted-foreground">Nuevo registro de mantenimiento</p>
          </div>
        </div>
        <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Wrench className="h-5 w-5" />
        </div>
      </header>

      {/* ALERTAS */}
      {error && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 text-xs font-bold uppercase tracking-wide">
          {error}
        </div>
      )}
      {success && (
        <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-xs font-bold uppercase tracking-wide">
          {success}
        </div>
      )}

      {/* FORMULARIO */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-card p-6 rounded-xl border border-border shadow-sm">
        
        {/* ACTIVO */}
        <div className="space-y-2 md:col-span-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
            <Wrench className="h-3 w-3" /> Activo a Intervenir
          </label>
          <select
            value={activoId}
            onChange={(e) => setActivoId(Number(e.target.value))}
            className="w-full h-11 rounded-lg border border-input bg-background px-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
          >
            <option value="">Selecciona un activo de la lista...</option>
            {activos.map((a) => (
              <option key={a.id} value={a.id}>{a.nombre} (ID: {a.id})</option>
            ))}
          </select>
        </div>

        {/* FECHA */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
            <Calendar className="h-3 w-3" /> Fecha de Ingreso
          </label>
          <input
            type="date"
            value={fechaIngreso}
            onChange={(e) => setFechaIngreso(e.target.value)}
            className="w-full h-11 rounded-lg border border-input bg-background px-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
          />
        </div>

        {/* COSTO */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
            <DollarSign className="h-3 w-3" /> Costo Estimado
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
            <input
              type="number"
              value={costo}
              onChange={(e) => setCosto(e.target.value)}
              className="w-full h-11 rounded-lg border border-input bg-background pl-7 pr-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              placeholder="0.00"
            />
          </div>
        </div>

        {/* RESPONSABLE */}
        <div className="space-y-2 md:col-span-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
            <User className="h-3 w-3" /> Responsable / Técnico
          </label>
          <input
            type="text"
            value={responsable}
            onChange={(e) => setResponsable(e.target.value)}
            className="w-full h-11 rounded-lg border border-input bg-background px-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            placeholder="Nombre del encargado o empresa externa"
          />
        </div>

        {/* DESCRIPCIÓN */}
        <div className="space-y-2 md:col-span-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
            <FileText className="h-3 w-3" /> Descripción de la Tarea
          </label>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="w-full min-h-[100px] rounded-lg border border-input bg-background p-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
            placeholder="Detalla el mantenimiento a realizar..."
          />
        </div>

        {/* BOTONES */}
        <div className="md:col-span-2 flex items-center gap-3 pt-4 border-t border-border">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 h-11 rounded-lg border border-border text-[11px] font-bold uppercase tracking-wider hover:bg-muted transition-all"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-[2] h-11 rounded-lg bg-primary text-white text-[11px] font-bold uppercase tracking-wider hover:opacity-90 shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Guardando...
              </>
            ) : (
              "Guardar Mantenimiento"
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
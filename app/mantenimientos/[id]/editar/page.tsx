"use client"

import { API_URL } from "@/config/api"
import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { 
  Edit3, 
  ArrowLeft, 
  User, 
  FileText, 
  DollarSign, 
  FileUp, 
  Loader2, 
  Save 
} from "lucide-react"
import { cn } from "@/lib/utils"

export default function EditarMantenimientoPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id

  const [responsable, setResponsable] = useState("")
  const [descripcion, setDescripcion] = useState("")
  const [costo, setCosto] = useState("")
  const [comprobante, setComprobante] = useState<File | null>(null)
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const fetchMantenimiento = async () => {
      try {
        const token = localStorage.getItem("token")
        const res = await fetch(`${API_URL}/mantenimientos/list/`, {
          headers: { Authorization: `Token ${token}` },
        })
        const data = await res.json()
        const mantenimiento = data.find((m: any) => m.id == id)

        if (mantenimiento) {
          setResponsable(mantenimiento.responsable || "")
          setDescripcion(mantenimiento.descripcion_problema || "")
          setCosto(mantenimiento.costo || "")
        }
      } catch (error) {
        console.error("Error al cargar datos:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchMantenimiento()
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const token = localStorage.getItem("token")
    const formData = new FormData()
    formData.append("responsable", responsable)
    formData.append("descripcion_problema", descripcion)

    if (costo) formData.append("costo", costo)
    if (comprobante) formData.append("comprobante", comprobante)

    try {
      const res = await fetch(`${API_URL}/mantenimientos/${id}/editar/`, {
        method: "PATCH",
        headers: { Authorization: `Token ${token}` },
        body: formData,
      })

      if (res.ok) {
        router.push("/mantenimientos")
      } else {
        alert("Error actualizando mantenimiento")
      }
    } catch (error) {
      alert("Error de conexión")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
      <Loader2 className="h-8 w-8 text-primary animate-spin" />
      <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Obteniendo datos del registro...</p>
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
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Editar Mantenimiento</h1>
            <p className="text-sm text-muted-foreground">ID del Registro: #{id}</p>
          </div>
        </div>
        <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-amber-500/10 text-amber-600">
          <Edit3 className="h-5 w-5" />
        </div>
      </header>

      {/* FORMULARIO */}
      <form onSubmit={handleSubmit} className="bg-card p-6 rounded-xl border border-border shadow-sm space-y-6">
        
        {/* RESPONSABLE */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
            <User className="h-3 w-3" /> Responsable Técnico
          </label>
          <input
            type="text"
            value={responsable}
            onChange={(e) => setResponsable(e.target.value)}
            className="w-full h-11 rounded-lg border border-input bg-background px-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            placeholder="Nombre del encargado"
          />
        </div>

        {/* COSTO */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
            <DollarSign className="h-3 w-3" /> Costo del Servicio
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

        {/* DESCRIPCIÓN */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
            <FileText className="h-3 w-3" /> Descripción / Hallazgos
          </label>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="w-full min-h-[120px] rounded-lg border border-input bg-background p-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
            placeholder="Describe el estado actual del equipo..."
          />
        </div>

        {/* COMPROBANTE PDF */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
            <FileUp className="h-3 w-3" /> Comprobante (Opcional)
          </label>
          <div className="relative flex items-center">
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setComprobante(e.target.files?.[0] || null)}
              className="w-full text-xs text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-[10px] file:font-bold file:uppercase file:bg-primary/10 file:text-primary hover:file:bg-primary/20 transition-all cursor-pointer border border-dashed border-border p-2 rounded-lg"
            />
          </div>
          <p className="text-[9px] text-muted-foreground italic tracking-wide">Solo archivos PDF permitidos.</p>
        </div>

        {/* ACCIONES */}
        <div className="flex items-center gap-3 pt-4 border-t border-border">
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
            className="flex-[2] h-11 rounded-lg bg-primary text-white text-[11px] font-bold uppercase tracking-wider hover:opacity-90 shadow-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Actualizando...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Guardar cambios
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
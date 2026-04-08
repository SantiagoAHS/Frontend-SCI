"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { 
  ClipboardCheck, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Save, 
  ArrowLeft,
  ChevronRight,
  Database,
  Eye,
  MapPin
} from "lucide-react"
import { cn } from "@/lib/utils"
import { API_URL } from "@/config/api"

export default function AuditoriaPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id

  const [auditoria, setAuditoria] = useState(null)
  const [areas, setAreas] = useState([])
  const [loadingFinalizar, setLoadingFinalizar] = useState(false)
  const [loading, setLoading] = useState(true)

  const fetchAuditoria = async () => {
    const token = localStorage.getItem("token")
    try {
      const res = await fetch(`${API_URL}/auditoria/${id}/`, {
        headers: { Authorization: `Token ${token}` },
      })
      const data = await res.json()
      setAuditoria(data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const fetchAreas = async () => {
    const token = localStorage.getItem("token")
    try {
      const res = await fetch(`${API_URL}/areas/list/?activas=true`, {
        headers: { Authorization: `Token ${token}` },
      })
      const data = await res.json()
      setAreas(data)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchAuditoria()
    fetchAreas()
  }, [])

  const getAreaNombre = (id) => {
    const area = areas.find(a => a.id === id)
    return area ? area.nombre : "Sin asignar"
  }

  const actualizarDetalle = async (item) => {
    const token = localStorage.getItem("token")
    try {
      await fetch(`${API_URL}/auditoria/detalle/${item.id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({
          estado_real: item.estado_real,
          area_real: item.area_real,
          encontrado: item.encontrado,
        }),
      })
      fetchAuditoria()
    } catch (error) {
      alert("Error al guardar")
    }
  }

  const finalizarAuditoria = async () => {
    const token = localStorage.getItem("token")
    setLoadingFinalizar(true)
    try {
      await fetch(`${API_URL}/auditoria/finalizar/${id}/`, {
        method: "PATCH",
        headers: { Authorization: `Token ${token}` },
      })
      fetchAuditoria()
    } catch (error) {
      console.error(error)
    } finally {
      setLoadingFinalizar(false)
    }
  }

  const handleChange = (index, field, value) => {
    const copia = [...auditoria.detalles]
    copia[index] = {
      ...copia[index],
      [field]: value,
      resultado: "" 
    }
    setAuditoria({ ...auditoria, detalles: copia })
  }

  const getStatusBadge = (item) => {
    if (!item.estado_real) return <span className="flex items-center gap-1 text-amber-600 bg-amber-50 px-2 py-1 rounded text-xs font-bold uppercase"><Clock className="h-3 w-3" /> Pendiente</span>
    if (item.resultado === "correcto") return <span className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded text-xs font-bold uppercase"><CheckCircle2 className="h-3 w-3" /> Correcto</span>
    if (item.resultado === "incorrecto") return <span className="flex items-center gap-1 text-red-600 bg-red-50 px-2 py-1 rounded text-xs font-bold uppercase"><XCircle className="h-3 w-3" /> Diferencia</span>
    return null
  }

  const resumen = auditoria?.detalles.reduce(
    (acc, item) => {
      if (!item.estado_real || !item.resultado) acc.pendientes++
      else if (item.resultado === "correcto") acc.correctos++
      else if (item.resultado === "incorrecto") acc.incorrectos++
      return acc
    },
    { correctos: 0, incorrectos: 0, pendientes: 0 }
  )

  if (loading) return <div className="p-8 text-center text-muted-foreground animate-pulse">Cargando detalles de auditoría...</div>
  if (!auditoria) return <div className="p-8 text-center text-red-500">No se encontró la auditoría.</div>

  const bloqueado = auditoria.estado === "finalizada"
  const puedeFinalizar = resumen.pendientes === 0

  return (
    <div className="flex flex-col gap-6 p-6 lg:p-8 max-w-5xl mx-auto">
      
      {/* HEADER */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => router.push('/auditorias')}
            className="p-2 hover:bg-accent rounded-full transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-muted-foreground" />
          </button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{auditoria.nombre}</h1>
            <p className="text-sm text-muted-foreground">ID de auditoría: #{id}</p>
          </div>
        </div>

        <button
          onClick={finalizarAuditoria}
          disabled={bloqueado || loadingFinalizar || !puedeFinalizar}
          className={cn(
            "flex items-center gap-2 px-6 py-2.5 rounded-lg font-bold text-sm transition-all shadow-sm",
            bloqueado 
              ? "bg-emerald-600 text-white cursor-default" 
              : !puedeFinalizar
              ? "bg-muted text-muted-foreground cursor-not-allowed border"
              : "bg-primary text-white hover:opacity-90 active:scale-95"
          )}
        >
          {bloqueado ? (
            <><CheckCircle2 className="h-4 w-4" /> Auditoría finalizada</>
          ) : loadingFinalizar ? (
            "Procesando..."
          ) : (
            "Finalizar y cerrar"
          )}
        </button>
      </header>

      {/* RESUMEN DE PROGRESO */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card border rounded-xl p-4 flex items-center justify-between shadow-sm">
          <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Correctos</div>
          <div className="text-2xl font-bold text-emerald-600">{resumen.correctos}</div>
        </div>
        <div className="bg-card border rounded-xl p-4 flex items-center justify-between shadow-sm">
          <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Diferencias</div>
          <div className="text-2xl font-bold text-red-600">{resumen.incorrectos}</div>
        </div>
        <div className="bg-card border rounded-xl p-4 flex items-center justify-between shadow-sm">
          <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Pendientes</div>
          <div className="text-2xl font-bold text-amber-500">{resumen.pendientes}</div>
        </div>
      </div>

      {/* LISTA DE ACTIVOS */}
      <div className="space-y-4 mt-2">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Database className="h-5 w-5 text-primary" />
          Listado de activos a validar
        </h2>
        
        {auditoria.detalles.map((item, index) => {
          const yaGuardado = item.resultado !== ""

          return (
            <div 
              key={item.id}
              className={cn(
                "bg-card border rounded-xl overflow-hidden shadow-sm transition-all hover:border-primary/50",
                yaGuardado && "bg-muted/10 border-emerald-100"
              )}
            >
              <div className="p-5">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-bold text-lg text-foreground">{item.activo_nombre}</h3>
                  {getStatusBadge(item)}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Info de Sistema */}
                  <div className="space-y-2 bg-muted/30 p-3 rounded-lg border border-dashed">
                    <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest flex items-center gap-1">
                      <Eye className="h-3 w-3" /> Según sistema
                    </p>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-foreground uppercase">Estado: {item.estado_sistema || "No definido"}</span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> Área: {getAreaNombre(item.area_sistema)}
                      </span>
                    </div>
                  </div>

                  {/* Formulario de Validación */}
                  <div className="space-y-4">
                    {!bloqueado && !yaGuardado ? (
                      <div className="flex flex-col sm:flex-row gap-3">
                        <select
                          className="flex-1 bg-background border border-input rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
                          value={item.estado_real || ""}
                          onChange={(e) => handleChange(index, "estado_real", e.target.value)}
                        >
                          <option value="">Estado real...</option>
                          <option value="disponible">Disponible</option>
                          <option value="asignado">Asignado</option>
                          <option value="mantenimiento">Mantenimiento</option>
                          <option value="baja">Baja</option>
                        </select>

                        <select
                          className="flex-1 bg-background border border-input rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
                          value={item.area_real || ""}
                          onChange={(e) => handleChange(index, "area_real", Number(e.target.value))}
                        >
                          <option value="">Área real...</option>
                          {areas.map((a) => (
                            <option key={a.id} value={a.id}>{a.nombre}</option>
                          ))}
                        </select>

                        <label className="flex items-center gap-2 cursor-pointer bg-muted px-3 py-2 rounded-md hover:bg-muted/80 transition-colors">
                          <input
                            type="checkbox"
                            className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                            checked={item.encontrado}
                            onChange={(e) => handleChange(index, "encontrado", e.target.checked)}
                          />
                          <span className="text-xs font-medium">¿Encontrado?</span>
                        </label>

                        <button 
                          onClick={() => actualizarDetalle(item)}
                          className="bg-primary text-white p-2 rounded-md hover:opacity-90 shadow-sm flex items-center justify-center"
                          title="Guardar validación"
                        >
                          <Save className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2 p-3">
                         <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" /> Resultado real
                        </p>
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-foreground uppercase">{item.estado_real || "No capturado"}</span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1 uppercase">
                             {getAreaNombre(item.area_real)} {item.encontrado ? "• Encontrado físicamente" : "• No encontrado"}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
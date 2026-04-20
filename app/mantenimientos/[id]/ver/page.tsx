"use client"

import { API_URL } from "@/config/api"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { 
  Wrench, 
  Calendar, 
  User, 
  DollarSign, 
  FileText, 
  ExternalLink, 
  Download, 
  ArrowLeft,
  Loader2,
  FileCheck
} from "lucide-react"
import { cn } from "@/lib/utils"

export default function VerMantenimiento() {
  const { id } = useParams()
  const router = useRouter()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token")
        const res = await fetch(`${API_URL}/mantenimientos/list/`, {
          headers: { Authorization: `Token ${token}` },
        })
        const lista = await res.json()
        const mantenimiento = lista.find((m: any) => m.id == id)
        setData(mantenimiento)
      } catch (error) {
        console.error("Error:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id])

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
      <Loader2 className="h-8 w-8 text-primary animate-spin" />
      <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Generando reporte de inspección...</p>
    </div>
  )

  if (!data) return <div className="p-8 text-center uppercase text-xs font-bold">Registro no encontrado</div>

  return (
    <div className="flex flex-col gap-6 p-6 lg:p-8 max-w-3xl mx-auto">
      {/* HEADER DE ACCIÓN */}
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => router.back()}
            className="p-2 hover:bg-muted rounded-full transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Detalle de Servicio</h1>
            <p className="text-xs font-mono text-muted-foreground uppercase">Ticket Ref: #{id}</p>
          </div>
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20">
          <FileCheck className="h-6 w-6" />
        </div>
      </header>

      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
        {/* ENCABEZADO DE ESTADO */}
        <div className="bg-muted/50 px-6 py-4 border-b border-border flex items-center justify-between">
           <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Estatus Actual</span>
           <span className={cn(
             "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter shadow-sm",
             data.estado === "completado" ? "bg-emerald-500 text-white" :
             data.estado === "en_proceso" ? "bg-amber-500 text-white" :
             data.estado === "cancelado" ? "bg-red-500 text-white" : "bg-blue-500 text-white"
           )}>
             {data.estado.replace('_', ' ')}
           </span>
        </div>

        {/* CONTENIDO PRINCIPAL */}
        <div className="p-6 space-y-8">
          
          {/* GRID DE INFORMACIÓN TÉCNICA */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InfoBlock label="Activo" value={data.activo} icon={<Wrench className="h-3.5 w-3.5" />} />
            <InfoBlock label="Tipo de Servicio" value={data.tipo} icon={<FileText className="h-3.5 w-3.5" />} isCapitalize />
            <InfoBlock label="Fecha de Ingreso" value={data.fecha_ingreso} icon={<Calendar className="h-3.5 w-3.5" />} />
            <InfoBlock label="Finalización" value={data.fecha_finalizacion || "Pendiente"} icon={<Calendar className="h-3.5 w-3.5" />} />
            <InfoBlock label="Responsable" value={data.responsable} icon={<User className="h-3.5 w-3.5" />} className="md:col-span-1" />
            <InfoBlock 
              label="Costo del Servicio" 
              value={data.costo ? `$${data.costo}` : "No registrado"} 
              icon={<DollarSign className="h-3.5 w-3.5" />} 
              isMono
            />
          </div>

          {/* BLOQUE DE DESCRIPCIÓN */}
          <div className="space-y-2">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <FileText className="h-3.5 w-3.5" /> Hallazgos y Observaciones
            </h3>
            <div className="bg-muted/30 border border-border rounded-xl p-4 text-sm leading-relaxed text-foreground/80 min-h-[80px]">
              {data.descripcion_problema || "No se ingresaron observaciones adicionales para este servicio."}
            </div>
          </div>

          {/* SECCIÓN DE DOCUMENTO */}
          <div className="pt-4 border-t border-border">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3">Documentación Adjunta</h3>
            
            {data.comprobante ? (
              <div className="flex items-center justify-between p-4 bg-primary/5 border border-primary/10 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 flex items-center justify-center bg-white rounded-lg shadow-sm border border-border">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground uppercase tracking-tight">Comprobante_Servicio.pdf</p>
                    <p className="text-[10px] text-muted-foreground tracking-wide">Documento oficial de mantenimiento</p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <a
                    href={data.comprobante}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-white border border-border hover:bg-accent text-foreground px-3 py-2 rounded-lg text-[10px] font-bold uppercase transition-all shadow-sm"
                  >
                    <ExternalLink className="h-3.5 w-3.5" /> Ver
                  </a>
                  <a
                    href={data.comprobante}
                    download
                    className="flex items-center gap-2 bg-primary text-white hover:opacity-90 px-3 py-2 rounded-lg text-[10px] font-bold uppercase transition-all shadow-sm"
                  >
                    <Download className="h-3.5 w-3.5" /> Descargar
                  </a>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-8 bg-muted/20 border border-dashed border-border rounded-xl">
                <FileText className="h-8 w-8 text-muted-foreground/30 mb-2" />
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest text-center">
                  Sin comprobante digital disponible
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Componente auxiliar para bloques de información
function InfoBlock({ label, value, icon, isCapitalize, isMono, className }: any) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
        {icon} {label}
      </p>
      <p className={cn(
        "text-sm font-medium border-b border-border/50 pb-1",
        isCapitalize && "capitalize",
        isMono && "font-mono text-foreground"
      )}>
        {value}
      </p>
    </div>
  )
}
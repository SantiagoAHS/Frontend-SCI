"use client"

import { API_URL } from "@/config/api"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { 
  ArrowRightLeft, 
  ChevronLeft, 
  User, 
  Phone, 
  MapPin, 
  Calendar, 
  FileText, 
  Loader2, 
  CheckCircle2, 
  XCircle,
  Package,
  Info
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Activo {
  id: number
  nombre: string
}

interface Area {
  id: number
  nombre: string
}

export default function CrearPrestamoPage() {
  const router = useRouter()

  const [activos, setActivos] = useState<Activo[]>([])
  const [areas, setAreas] = useState<Area[]>([])
  const [loading, setLoading] = useState(false)
  
  // Estados para el Modal
  const [modalOpen, setModalOpen] = useState(false)
  const [modalStatus, setModalStatus] = useState<"success" | "error">("success")
  const [modalMessage, setModalMessage] = useState("")

  const [form, setForm] = useState({
    activo: "",
    responsable_nombre: "",
    responsable_telefono: "",
    area: "",
    tipo_prestamo: "interno",
    fecha_inicio: "",
    fecha_fin: "",
    observaciones: ""
  })

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token")
      if (!token) {
        router.push("/login")
        return
      }

      try {
        const [activosRes, areasRes] = await Promise.all([
          fetch(`${API_URL}/activos/disponibles/`, {
            headers: { Authorization: `Token ${token}`, "Content-Type": "application/json" }
          }),
          fetch(`${API_URL}/areas/list/`, {
            headers: { Authorization: `Token ${token}`, "Content-Type": "application/json" }
          })
        ])

        const activosData = await activosRes.json()
        const areasData = await areasRes.json()

        setActivos(activosData.results || activosData)
        setAreas(areasData.results || areasData)
      } catch (error) {
        console.error("Error cargando datos", error)
      }
    }
    fetchData()
  }, [router])

  const handleChange = (e: any) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    const token = localStorage.getItem("token")
    if (!token) return

    setLoading(true)
    try {
      const payload = {
        activo: Number(form.activo),
        responsable_nombre: form.responsable_nombre,
        responsable_telefono: form.responsable_telefono,
        area: form.area ? Number(form.area) : null,
        tipo_prestamo: form.tipo_prestamo,
        fecha_inicio: form.fecha_inicio || null,
        fecha_fin: form.fecha_fin || null,
        observaciones: form.observaciones
      }

      const res = await fetch(`${API_URL}/prestamo/`, {
        method: "POST",
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      })

      if (!res.ok) {
        const data = await res.json()
        setModalStatus("error")
        setModalMessage(typeof data === 'object' ? "Verifica los datos del préstamo e intenta de nuevo." : data)
        setModalOpen(true)
        return
      }

      setModalStatus("success")
      setModalMessage("El préstamo se ha registrado correctamente en el sistema.")
      setModalOpen(true)
    } catch (error) {
      setModalStatus("error")
      setModalMessage("No se pudo conectar con el servidor.")
      setModalOpen(true)
    } finally {
      setLoading(false)
    }
  }

  const handleCloseModal = () => {
    setModalOpen(false)
    if (modalStatus === "success") {
      router.push("/asignaciones")
    }
  }

  return (
    <div className="flex flex-col gap-6 p-6 lg:p-10 max-w-4xl mx-auto bg-background text-foreground transition-all">
      
      {/* Header */}
      <div className="flex flex-col gap-4">
        <button 
          onClick={() => router.push("/asignaciones")}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors w-fit"
        >
          <ChevronLeft size={16} /> Volver a asignaciones
        </button>
        <header className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
            <ArrowRightLeft className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Nuevo Préstamo</h1>
            <p className="text-muted-foreground text-sm">Registra la salida temporal de un activo.</p>
          </div>
        </header>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Columna 1: Información del Préstamo */}
        <div className="space-y-6">
          <section className="rounded-xl border bg-card p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 mb-2 text-primary">
              <Package size={18} />
              <span className="text-[10px] font-bold uppercase tracking-widest">Activo y Ubicación</span>
            </div>

            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground">ACTIVO A PRESTAR *</label>
                <select
                  name="activo"
                  value={form.activo}
                  onChange={handleChange}
                  required
                  className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                >
                  <option value="">Seleccionar activo</option>
                  {activos.map((a) => <option key={a.id} value={a.id}>{a.nombre}</option>)}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground">ÁREA DESTINO</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <select
                    name="area"
                    value={form.area}
                    onChange={handleChange}
                    className="w-full h-10 pl-9 rounded-lg border border-input bg-background px-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                  >
                    <option value="">Seleccionar área</option>
                    {areas.map((a) => <option key={a.id} value={a.id}>{a.nombre}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground">TIPO DE PRÉSTAMO</label>
                <select
                  name="tipo_prestamo"
                  value={form.tipo_prestamo}
                  onChange={handleChange}
                  className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                >
                  <option value="interno">Interno</option>
                  <option value="externo">Externo</option>
                  <option value="temporal">Temporal</option>
                </select>
              </div>
            </div>
          </section>

          <section className="rounded-xl border bg-card p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 mb-2 text-primary">
              <User size={18} />
              <span className="text-[10px] font-bold uppercase tracking-widest">Responsable</span>
            </div>
            <div className="space-y-3">
              <input
                type="text"
                name="responsable_nombre"
                placeholder="Nombre completo"
                value={form.responsable_nombre}
                onChange={handleChange}
                required
                className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
              />
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  name="responsable_telefono"
                  placeholder="Teléfono de contacto"
                  value={form.responsable_telefono}
                  onChange={handleChange}
                  className="w-full h-10 pl-9 rounded-lg border border-input bg-background px-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>
            </div>
          </section>
        </div>

        {/* Columna 2: Tiempos y Notas */}
        <div className="space-y-6">
          <section className="rounded-xl border bg-card p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 mb-2 text-primary">
              <Calendar size={18} />
              <span className="text-[10px] font-bold uppercase tracking-widest">Cronograma</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground">FECHA INICIO</label>
                <input
                  type="date"
                  name="fecha_inicio"
                  value={form.fecha_inicio}
                  onChange={handleChange}
                  className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground">FECHA FIN</label>
                <input
                  type="date"
                  name="fecha_fin"
                  value={form.fecha_fin}
                  onChange={handleChange}
                  className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>
            </div>
          </section>

          <section className="rounded-xl border bg-card p-6 shadow-sm space-y-4 flex-1">
            <div className="flex items-center gap-2 mb-2 text-primary">
              <FileText size={18} />
              <span className="text-[10px] font-bold uppercase tracking-widest">Notas adicionales</span>
            </div>
            <textarea
              name="observaciones"
              placeholder="Detalles sobre el estado del activo, accesorios incluidos, etc."
              value={form.observaciones}
              onChange={handleChange}
              rows={4}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none resize-none"
            />
          </section>

          <div className="flex flex-col gap-3">
            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-primary text-primary-foreground font-bold rounded-xl shadow-lg shadow-primary/20 hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <ArrowRightLeft className="h-5 w-5" />}
              {loading ? "Registrando..." : "Crear Préstamo"}
            </button>
            <button
              type="button"
              onClick={() => router.push("/asignaciones")}
              className="w-full h-11 rounded-xl border border-input hover:bg-accent transition-colors text-sm font-medium"
            >
              Cancelar
            </button>
          </div>
        </div>
      </form>

      {/* --- MODAL DE RESULTADO --- */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm animate-in fade-in" />
          
          <div className="relative w-full max-w-sm rounded-2xl border bg-card p-8 shadow-2xl animate-in zoom-in-95 duration-200 text-center">
            <div className={cn(
              "mx-auto flex h-16 w-16 items-center justify-center rounded-full mb-4",
              modalStatus === "success" ? "bg-emerald-500/10 text-emerald-500" : "bg-destructive/10 text-destructive"
            )}>
              {modalStatus === "success" ? <CheckCircle2 size={40} /> : <XCircle size={40} />}
            </div>

            <h2 className="text-xl font-bold mb-2">
              {modalStatus === "success" ? "Préstamo Exitoso" : "Error en Registro"}
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              {modalMessage}
            </p>

            <button
              onClick={handleCloseModal}
              className={cn(
                "w-full h-11 rounded-xl font-bold transition-all shadow-md active:scale-95",
                modalStatus === "success" 
                  ? "bg-primary text-primary-foreground hover:opacity-90" 
                  : "bg-destructive text-destructive-foreground hover:opacity-90"
              )}
            >
              {modalStatus === "success" ? "Continuar" : "Corregir datos"}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
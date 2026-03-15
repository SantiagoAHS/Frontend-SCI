"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  PackagePlus, 
  Image as ImageIcon, 
  ChevronLeft, 
  AlertCircle, 
  UploadCloud,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";


export default function CrearActivoPage() {
  const router = useRouter();

  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [tipoActivo, setTipoActivo] = useState<number | "">("");
  const [area, setArea] = useState<number | "">("");
  const [estado, setEstado] = useState("disponible");
  const [imagen, setImagen] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const [tipos, setTipos] = useState<TipoActivo[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [valores, setValores] = useState<{ [key: number]: any }>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const fetchData = async () => {
      try {
        const [tiposRes, areasRes] = await Promise.all([
          fetch("http://127.0.0.1:8000/api/tipos-activo/", { headers: { Authorization: `Token ${token}` } }),
          fetch("http://127.0.0.1:8000/api/areas/list/?activas=true", { headers: { Authorization: `Token ${token}` } })
        ]);
        setTipos(await tiposRes.json());
        setAreas(await areasRes.json());
      } catch (e) { setError("Error al cargar datos iniciales."); }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!tipoActivo) { setValores({}); return; }
    const selected = tipos.find((t) => t.id === tipoActivo);
    if (!selected) return;
    const initial: any = {};
    selected.caracteristicas.forEach((c) => { initial[c.id] = ""; });
    setValores(initial);
  }, [tipoActivo, tipos]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImagen(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const handleValorChange = (id: number, value: any) => {
    setValores({ ...valores, [id]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) { setError("No autenticado"); return; }

    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("nombre", nombre);
    formData.append("descripcion", descripcion);
    formData.append("tipo_activo", String(tipoActivo));
    formData.append("area", String(area));
    formData.append("estado", estado);
    if (imagen) formData.append("imagen", imagen);

    const selectedTipo = tipos.find((t) => t.id === tipoActivo);
    const valoresArray = Object.entries(valores)
      .map(([id, valor]) => {
        const caracteristica = selectedTipo?.caracteristicas.find((c) => c.id === Number(id));
        if (!caracteristica || valor === "" || valor === null) return null;

        if (caracteristica.tipo_dato === "select") {
          return { caracteristica: Number(id), opcion: Number(valor) };
        }
        if (caracteristica.tipo_dato === "boolean") {
          return { caracteristica: Number(id), valor_texto: valor ? "true" : "false" };
        }
        return { caracteristica: Number(id), valor_texto: String(valor) };
      })
      .filter(Boolean);

    formData.set("valores", JSON.stringify(valoresArray));

    try {
      const res = await fetch("http://127.0.0.1:8000/api/activos/", {
        method: "POST",
        headers: { Authorization: `Token ${token}` },
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Error al crear activo");
      }
      router.push("/activos");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const selectedTipo = tipos.find((t) => t.id === tipoActivo);

  return (
    <div className="flex flex-col gap-6 p-6 lg:p-10 max-w-6xl mx-auto bg-background text-foreground transition-all">
      
      {/* Header */}
      <div className="flex flex-col gap-4">
        <button 
          onClick={() => router.push("/activos")}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors w-fit"
        >
          <ChevronLeft size={16} /> Volver a inventario
        </button>
        <header className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
            <PackagePlus className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Registrar Nuevo Activo</h1>
            <p className="text-muted-foreground text-sm">Ingresa los datos generales y especificaciones técnicas.</p>
          </div>
        </header>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 text-sm font-medium bg-destructive/10 border border-destructive/20 text-destructive rounded-xl animate-in fade-in zoom-in-95">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Columna Izquierda: Imagen y Estado */}
        <div className="space-y-6">
          <div className="rounded-2xl border bg-card p-6 shadow-sm">
            <label className="text-sm font-bold mb-4 block text-primary uppercase tracking-wider">Imagen del Activo</label>
            <div 
              className={cn(
                "relative group flex flex-col items-center justify-center w-full h-64 rounded-xl border-2 border-dashed transition-all overflow-hidden",
                preview ? "border-primary/50" : "border-muted-foreground/20 hover:border-primary/40 bg-muted/20"
              )}
            >
              {preview ? (
                <>
                  <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <p className="text-white text-xs font-medium">Cambiar imagen</p>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <UploadCloud size={40} strokeWidth={1.5} />
                  <p className="text-xs">Formatos: JPG, PNG o WEBP</p>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                required
                onChange={handleImageChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>
          </div>

          <div className="rounded-2xl border bg-card p-6 shadow-sm">
            <label className="text-sm font-bold mb-4 block text-primary uppercase tracking-wider">Estado Inicial</label>
            <select
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
              className="w-full h-10 rounded-lg border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
            >
              <option value="disponible">Disponible</option>
              <option value="asignado">Asignado</option>
              <option value="mantenimiento">Mantenimiento</option>
              <option value="baja">Baja</option>
            </select>
          </div>
        </div>

        {/* Columna Central/Derecha: Datos y Dinámicos */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border bg-card p-8 shadow-sm space-y-5">
            <label className="text-sm font-bold block text-primary uppercase tracking-wider">Información Básica</label>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <span className="text-xs font-semibold text-muted-foreground">Nombre del Activo *</span>
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                  placeholder="Ej: Laptop Dell Latitude"
                  className="w-full h-10 rounded-lg border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                />
              </div>

              <div className="space-y-2">
                <span className="text-xs font-semibold text-muted-foreground">Área / Ubicación *</span>
                <select
                  value={area}
                  required
                  onChange={(e) => setArea(e.target.value ? Number(e.target.value) : "")}
                  className="w-full h-10 rounded-lg border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                >
                  <option value="">Seleccionar área</option>
                  {areas.map((a) => (
                    <option key={a.id} value={a.id}>{a.nombre}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-semibold text-muted-foreground">Descripción</span>
              <textarea
                rows={2}
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                placeholder="Detalles adicionales, número de serie, etc."
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              />
            </div>

            <div className="pt-4 border-t space-y-4">
              <div className="space-y-2">
                <span className="text-xs font-bold text-primary uppercase tracking-tighter">Categoría de Activo *</span>
                <select
                  value={tipoActivo}
                  required
                  onChange={(e) => setTipoActivo(e.target.value ? Number(e.target.value) : "")}
                  className="w-full h-12 rounded-xl border-2 border-primary/20 bg-background px-4 text-base font-medium focus:border-primary outline-none transition-all"
                >
                  <option value="">Selecciona un tipo para cargar atributos</option>
                  {tipos.map((t) => (
                    <option key={t.id} value={t.id}>{t.nombre}</option>
                  ))}
                </select>
              </div>

              {/* Atributos Dinámicos */}
              {selectedTipo && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 pt-4 bg-muted/20 p-4 rounded-xl border animate-in slide-in-from-bottom-2">
                  {selectedTipo.caracteristicas.map((c) => (
                    <div key={c.id} className="space-y-1.5">
                      <label className="text-xs font-semibold flex items-center gap-1">
                        {c.nombre} {c.obligatorio && <span className="text-destructive">*</span>}
                      </label>

                      {c.tipo_dato === "boolean" ? (
                        <div className="flex items-center h-10">
                          <input
                            type="checkbox"
                            checked={valores[c.id] || false}
                            onChange={(e) => handleValorChange(c.id, e.target.checked)}
                            className="h-5 w-5 rounded border-input text-primary focus:ring-primary/20"
                          />
                        </div>
                      ) : c.tipo_dato === "select" ? (
                        <select
                          value={valores[c.id] || ""}
                          required={c.obligatorio}
                          onChange={(e) => handleValorChange(c.id, e.target.value)}
                          className="w-full h-9 rounded-lg border border-input bg-background px-3 text-sm outline-none"
                        >
                          <option value="">Elegir...</option>
                          {c.opciones?.map((o) => (
                            <option key={o.id} value={o.id}>{o.nombre}</option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type={c.tipo_dato === "numero" ? "number" : c.tipo_dato === "fecha" ? "date" : "text"}
                          required={c.obligatorio}
                          value={valores[c.id] || ""}
                          onChange={(e) => handleValorChange(c.id, e.target.value)}
                          className="w-full h-9 rounded-lg border border-input bg-background px-3 text-sm outline-none focus:border-primary/50 transition-all"
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Footer de Acciones */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => router.push("/activos")}
              className="px-6 py-2.5 text-sm font-medium hover:bg-muted rounded-xl transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-8 py-2.5 bg-primary text-primary-foreground font-bold rounded-xl shadow-lg shadow-primary/20 hover:opacity-90 disabled:opacity-50 transition-all"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? "Registrando..." : "Guardar Activo"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
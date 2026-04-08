"use client";

import { API_URL } from "@/config/api"
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Package, Plus, Search, Trash2 } from "lucide-react";
import { ItemCard } from "@/components/item-card";
import type { AssetStatus, AssetType } from "@/components/status-badge";
import { cn } from "@/lib/utils";

interface Asset {
  id: number;
  nombre: string;
  descripcion: string;
  tipo_activo: string;
  area: string;
  estado: string;
  responsables?: string;
  imagen?: string;
  valores?: {
    id: number;
    caracteristica: {
      id: number;
      nombre: string;
      tipo_dato: "text" | "int" | "float" | "boolean" | "select" | "date";
    };
    valor_texto?: string | null;
    opcion?: {
      id: number;
      nombre: string;
    } | null;
  }[];
}

export default function ActivosPage() {
  const router = useRouter();

  // Estados
  const [activos, setActivos] = useState<Asset[]>([]);
  const [filteredActivos, setFilteredActivos] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [activeType, setActiveType] = useState<string>("Todos");

  // Filtros dinámicos basados en la data
  const typeFilters = useMemo(() => {
    const tiposEnData = activos.map((a) => a.tipo_activo);
    const tiposUnicos = Array.from(new Set(tiposEnData)).sort();
    return ["Todos", ...tiposUnicos];
  }, [activos]);

  // Fetch inicial de datos
  useEffect(() => {
    const fetchActivos = async () => {
      const token = localStorage.getItem("token");
      if (!token) { 
        setError("No autenticado"); 
        setLoading(false); 
        return; 
      }

      try {
        const res = await fetch(`${API_URL}/activos/list/`, {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) throw new Error("Error al cargar activos del servidor");

        const data = await res.json();
        
        // Formatear data e incluir imagen por defecto
        const activosProcesados = data.map((a: any) => ({
          ...a,
          imagen: a.imagen || "/images/default-asset.png",
        }));

        setActivos(activosProcesados);
        setFilteredActivos(activosProcesados);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchActivos();
  }, []);

  // Lógica de filtrado (Búsqueda + Tipo)
  useEffect(() => {
    const filtered = activos.filter((a) => {
      const matchType = activeType === "Todos" || a.tipo_activo === activeType;
      const matchSearch =
        search === "" ||
        a.nombre.toLowerCase().includes(search.toLowerCase()) ||
        a.descripcion.toLowerCase().includes(search.toLowerCase());
      return matchType && matchSearch;
    });
    setFilteredActivos(filtered);
  }, [search, activeType, activos]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
      <div className="h-10 w-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      <p className="text-muted-foreground font-medium animate-pulse uppercase text-xs tracking-widest">Cargando catálogo...</p>
    </div>
  );

  if (error) return (
    <div className="p-10 text-center">
      <p className="text-red-500 font-bold bg-red-50 inline-block px-4 py-2 rounded-lg border border-red-100">
        Error: {error}
      </p>
    </div>
  );

  return (
    <div className="flex flex-col gap-6 p-6 lg:p-8">
      
      {/* HEADER */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Package className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Catálogo de Activos</h1>
            <p className="text-sm text-muted-foreground">
              {filteredActivos.length} activos
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 sm:gap-3">
          {/* Botón Eliminar  */}
          <button
            onClick={() => router.push("/activos/delete")}
            className="group flex items-center gap-2 h-10 px-4 text-[11px] font-bold uppercase tracking-wider text-red-500 hover:bg-red-50 rounded-lg transition-all"
          >
            <Trash2 className="h-4 w-4 transition-transform group-hover:scale-110" />
            <span className="hidden md:inline">Eliminar Activo</span>
          </button>

          {/* Botón Registrar */}
          <button
            onClick={() => router.push("/activos/create")}
            className="flex items-center gap-2 bg-primary text-white h-10 px-5 rounded-lg text-[11px] font-bold uppercase tracking-wider hover:opacity-90 shadow-sm transition-all active:scale-95"
          >
            <Plus className="h-4 w-4" />
            Registrar Activo
          </button>
        </div>
      </header>

      {/* CONTROLES: BUSCADOR Y FILTROS */}
      <div className="flex flex-col gap-4">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar por nombre, ID o descripción..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 w-full rounded-lg border border-input bg-background pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all shadow-sm"
          />
        </div>

        {/* Tabs de Tipo */}
        <div className="flex flex-wrap gap-2">
          {typeFilters.map((type) => (
            <button
              key={type}
              onClick={() => setActiveType(type)}
              className={cn(
                "px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider border transition-all",
                activeType === type
                  ? "bg-primary border-primary text-white shadow-sm"
                  : "bg-card border-border text-muted-foreground hover:border-primary/50"
              )}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* GRID DE RESULTADOS */}
      <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {filteredActivos.map((activo) => (
          <ItemCard
            key={activo.id}
            title={activo.nombre}
            code={activo.id.toString()}
            description={
              <div className="flex flex-col gap-2">
                <span className="line-clamp-2 text-muted-foreground text-xs italic">
                  {activo.descripcion || "Sin descripción disponible"}
                </span>
                
                {/* Atributos adicionales */}
                {activo.valores && activo.valores.length > 0 && (
                  <div className="mt-1 space-y-1 border-t border-dashed border-border/60 pt-2">
                    {activo.valores.slice(0, 3).map((v) => (
                      <div key={v.id} className="text-[10px] flex justify-between uppercase tracking-tight">
                        <span className="text-muted-foreground font-medium">{v.caracteristica.nombre}:</span>
                        <span className="font-bold text-foreground/70">{v.valor_texto || v.opcion?.nombre || "—"}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            }
            type={activo.tipo_activo as AssetType}
            status={activo.estado as AssetStatus}
            area={activo.area}
            image={activo.imagen}
          />
        ))}

        {/* Estado Vacío */}
        {filteredActivos.length === 0 && (
          <div className="col-span-full flex flex-col items-center gap-3 py-24 text-center border-2 border-dashed rounded-3xl bg-muted/10 opacity-60">
            <Package className="h-12 w-12 text-muted-foreground/40" />
            <div className="space-y-1">
              <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">No hay resultados</p>
              <p className="text-xs text-muted-foreground/70">Intenta ajustar los filtros o el término de búsqueda.</p>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
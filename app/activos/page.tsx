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

  const [activos, setActivos] = useState<Asset[]>([]);
  const [filteredActivos, setFilteredActivos] = useState<Asset[]>([]);
  const [search, setSearch] = useState("");
  const [activeType, setActiveType] = useState<string>("Todos");

  // 🔐 AUTH CONTROL (igual que dashboard)
  const [isAuth, setIsAuth] = useState<boolean | null>(null);

  const typeFilters = useMemo(() => {
    const tiposEnData = activos.map((a) => a.tipo_activo);
    const tiposUnicos = Array.from(new Set(tiposEnData)).sort();
    return ["Todos", ...tiposUnicos];
  }, [activos]);

  useEffect(() => {
    const fetchActivos = async () => {
      const token = localStorage.getItem("token");

      // 🚫 SIN TOKEN
      if (!token) {
        setIsAuth(false);
        return;
      }

      try {
        const res = await fetch(`${API_URL}/activos/list/`, {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        });

        // 🚫 TOKEN INVÁLIDO
        if (res.status === 401) {
          localStorage.removeItem("token");
          setIsAuth(false);
          return;
        }

        if (!res.ok) throw new Error("Error al cargar activos");

        const data = await res.json();

        const activosProcesados = data.map((a: any) => ({
          ...a,
          imagen: a.imagen || "/images/default-asset.png",
        }));

        setActivos(activosProcesados);
        setFilteredActivos(activosProcesados);

        setIsAuth(true);

      } catch (error) {
        console.error(error);
        setIsAuth(false);
      }
    };

    fetchActivos();
  }, []);

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

  // ⏳ LOADING
  if (isAuth === null) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <div className="h-10 w-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
        <p className="text-muted-foreground font-medium animate-pulse uppercase text-xs tracking-widest">
          Cargando catálogo...
        </p>
      </div>
    );
  }

  // 🔐 BLOQUEO (igual que dashboard)
  if (isAuth === false) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="text-center space-y-4 max-w-sm">

          <div className="text-4xl">🔐</div>

          <h2 className="text-xl font-bold">Acceso restringido</h2>

          <p className="text-muted-foreground text-sm">
            Debes iniciar sesión para acceder al sistema
          </p>

          <button
            onClick={() => (window.location.href = "/login")}
            className="mt-2 bg-primary hover:opacity-90 text-white px-4 py-2 rounded-xl transition"
          >
            Ir al login
          </button>

        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 p-6 lg:p-8">

      {/* HEADER */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Package className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Catálogo de Activos
            </h1>
            <p className="text-sm text-muted-foreground">
              {filteredActivos.length} activos
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 sm:gap-3">
          <button
            onClick={() => router.push("/activos/delete")}
            className="group flex items-center gap-2 h-10 px-4 text-[11px] font-bold uppercase tracking-wider text-red-500 hover:bg-red-50 rounded-lg transition-all"
          >
            <Trash2 className="h-4 w-4 transition-transform group-hover:scale-110" />
            <span className="hidden md:inline">Eliminar Activo</span>
          </button>

          <button
            onClick={() => router.push("/activos/create")}
            className="flex items-center gap-2 bg-primary text-white h-10 px-5 rounded-lg text-[11px] font-bold uppercase tracking-wider hover:opacity-90 shadow-sm transition-all active:scale-95"
          >
            <Plus className="h-4 w-4" />
            Registrar Activo
          </button>
        </div>
      </header>

      {/* BUSCADOR */}
      <div className="flex flex-col gap-4">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 w-full rounded-lg border border-input bg-background pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {typeFilters.map((type) => (
            <button
              key={type}
              onClick={() => setActiveType(type)}
              className={cn(
                "px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                activeType === type
                  ? "bg-primary text-white"
                  : "bg-card text-muted-foreground"
              )}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* GRID */}
      <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {filteredActivos.map((activo) => (
          <ItemCard
            key={activo.id}
            title={activo.nombre}
            code={activo.id.toString()}
            description={activo.descripcion}
            type={activo.tipo_activo as AssetType}
            status={activo.estado as AssetStatus}
            area={activo.area}
            image={activo.imagen}
          />
        ))}
      </section>
    </div>
  );
}
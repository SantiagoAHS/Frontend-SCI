"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Package, Plus, Search } from "lucide-react";
import { ItemCard } from "@/components/item-card";
import type { AssetStatus, AssetType } from "@/components/status-badge";

interface Asset {
  id: number;
  nombre: string;
  descripcion: string;
  tipo_activo: string;
  area: string;
  estado: string;
  responsables?: string;
  valores?: Record<string, string>;
  image?: string; // <-- ahora opcional para evitar error
}

export default function ActivosPage() {
  const router = useRouter();

  const [activos, setActivos] = useState<Asset[]>([]);
  const [filteredActivos, setFilteredActivos] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [activeType, setActiveType] = useState<AssetType | "Todos">("Todos");

  const typeFilters: (AssetType | "Todos")[] = [
    "Todos",
    "Computadora",
    "Vehiculo",
    "Impresora",
    "Mobiliario",
    "Herramientas",
    "Equipo de Red",
  ];

  // 📥 Cargar activos desde API
  useEffect(() => {
    const fetchActivos = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No autenticado");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("http://127.0.0.1:8000/api/activos/list/", {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          const text = await res.text();
          throw new Error("Error al cargar activos: " + text);
        }

        const data = await res.json();
        // asignamos una imagen genérica si no viene
        const activosConImagen = data.map((a: Asset) => ({
          ...a,
          image: "/images/default-asset.png",
        }));
        setActivos(activosConImagen);
        setFilteredActivos(activosConImagen);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchActivos();
  }, []);

  // 🔍 Filtrado por tipo y búsqueda
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500 text-lg">Cargando activos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6 lg:p-8">
      {/* Header */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Package className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-balance">
              Catálogo de Activos
            </h1>
            <p className="text-sm text-muted-foreground">
              {filteredActivos.length} de {activos.length} activos
            </p>
          </div>
        </div>

        {/* Botón siempre visible */}
        <button
          className="inline-flex h-9 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          onClick={() => router.push("/activos/create")}
        >
          <Plus className="h-4 w-4" />
          Registrar Activo
        </button>
      </header>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Buscar por nombre o descripción..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-10 w-full rounded-lg border border-input bg-background pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
        />
      </div>

      {/* Type Tabs */}
      <div className="flex flex-wrap gap-2">
        {typeFilters.map((type) => (
          <button
            key={type}
            onClick={() => setActiveType(type)}
            className={
              activeType === type
                ? "inline-flex items-center rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition-colors"
                : "inline-flex items-center rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            }
          >
            {type}
          </button>
        ))}
      </div>

      {/* Cards Grid */}
      <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {filteredActivos.map((activo) => (
          <ItemCard
            key={activo.id}
            title={activo.nombre}
            code={activo.id.toString()}
            description={activo.descripcion}
            type={activo.tipo_activo as AssetType}
            status={activo.estado as AssetStatus}
            responsible={activo.responsables || ""}
            area={activo.area}
            image={activo.image || "/images/default-asset.png"} // ✔ obligatorio
          />
        ))}

        {filteredActivos.length === 0 && (
          <div className="col-span-full flex flex-col items-center gap-2 py-16 text-center">
            <Package className="h-10 w-10 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">
              No se encontraron activos con esos criterios.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
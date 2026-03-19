"use client";

import { API_URL } from "@/config/api"
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Settings2, Plus, Search, Trash2, ListTree, ShieldAlert } from "lucide-react";

interface OpcionCaracteristica {
  id: number;
  nombre: string;
}

interface Caracteristica {
  id: number;
  nombre: string;
  tipo_dato: string;
  obligatorio: boolean;
  opciones?: OpcionCaracteristica[];
}

interface TipoActivo {
  id: number;
  nombre: string;
  caracteristicas: Caracteristica[];
}

interface User {
  rol: string;
}

export default function TiposActivoPage() {
  const router = useRouter();

  const [tipos, setTipos] = useState<TipoActivo[]>([]);
  const [filteredTipos, setFilteredTipos] = useState<TipoActivo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [authorized, setAuthorized] = useState<boolean | null>(null);

  // Verificar rol admin
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      setAuthorized(false);
      return;
    }
    const parsed: User = JSON.parse(user);
    setAuthorized(parsed.rol === "admin");
  }, []);

  // Cargar tipos de activos
  const fetchTipos = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/tipos-activo/`, {
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Error al cargar tipos de activo");

      const data = await response.json();
      setTipos(data);
      setFilteredTipos(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authorized) fetchTipos();
  }, [authorized]);

  // Lógica de búsqueda
  useEffect(() => {
    const filtered = tipos.filter((t) =>
      t.nombre.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredTipos(filtered);
  }, [search, tipos]);

  const handleDelete = async (id: number) => {
    if (!confirm("¿Seguro que deseas desactivar este tipo de activo?")) return;
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch(`${API_URL}/tipos-activo/${id}/`, {
        method: "DELETE",
        headers: { Authorization: `Token ${token}` },
      });

      if (!response.ok) throw new Error("Error al desactivar");
      setTipos((prev) => prev.filter((t) => t.id !== id));
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (authorized === null) {
    return (
      <div className="flex h-screen items-center justify-center bg-background text-muted-foreground">
        <div className="animate-pulse">Verificando credenciales...</div>
      </div>
    );
  }

  if (!authorized) {
    return (
      <div className="flex h-[80vh] flex-col items-center justify-center p-6 text-center">
        <div className="rounded-full bg-destructive/10 p-4 mb-4">
          <ShieldAlert className="h-12 w-12 text-destructive" />
        </div>
        <h1 className="text-3xl font-bold text-foreground">Acceso Restringido</h1>
        <p className="mt-2 text-muted-foreground max-w-xs">
          Esta sección es exclusiva para administradores del sistema.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6 lg:p-8 bg-background min-h-screen text-foreground">
      
      {/* Header */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
            <Settings2 className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Tipos de activos</h1>
            <p className="text-sm text-muted-foreground">
              Define los atributos personalizados para tus activos.
            </p>
          </div>
        </div>

        <button
          onClick={() => router.push("/ajustes/tipoactivos/create")}
          className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Plus className="h-4 w-4" />
          Nuevo tipo de activo
        </button>
      </header>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Filtrar por nombre..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-10 w-full rounded-lg border border-input bg-background pl-10 pr-4 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        />
      </div>

      {error && (
        <div className="rounded-lg bg-destructive/10 p-4 text-sm text-destructive border border-destructive/20">
          {error}
        </div>
      )}

      {/* Content Table */}
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="text-sm text-muted-foreground">Cargando definiciones...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="px-6 py-4 text-left font-medium text-muted-foreground">ID</th>
                  <th className="px-6 py-4 text-left font-medium text-muted-foreground">Tipo de activo</th>
                  <th className="px-6 py-4 text-left font-medium text-muted-foreground">N° Características</th>
                  <th className="px-6 py-4 text-right font-medium text-muted-foreground">Desactivar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredTipos.map((tipo) => (
                  <tr key={tipo.id} className="hover:bg-muted/30 transition-colors group">
                    <td className="px-6 py-4 font-mono text-xs text-muted-foreground">
                      #{tipo.id}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-foreground">{tipo.nombre}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <ListTree className="h-4 w-4" />
                        <span>{tipo.caracteristicas?.length || 0} campos</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(tipo.id)}
                        className="inline-flex h-8 items-center gap-1.5 rounded-md px-3 text-xs font-medium text-destructive transition-colors hover:bg-destructive/10"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Desactivar
                      </button>
                    </td>
                  </tr>
                ))}

                {filteredTipos.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground italic">
                      No se encontraron tipos de activos registrados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
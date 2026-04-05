"use client";

import { API_URL } from "@/config/api"
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Settings2, 
  Plus, 
  Search, 
  Trash2, 
  ListTree, 
  ShieldAlert, 
  ArrowLeft, 
  Loader2, 
  X,
  AlertCircle 
} from "lucide-react";

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [authorized, setAuthorized] = useState<boolean | null>(null);

  // Estados para el Modal de Confirmación
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<TipoActivo | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      setAuthorized(false);
      return;
    }
    const parsed: User = JSON.parse(user);
    setAuthorized(parsed.rol === "admin");
  }, []);

  const fetchTipos = async () => {
    const token = localStorage.getItem("token");
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
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authorized) fetchTipos();
  }, [authorized]);

  const filteredTipos = tipos.filter((t) =>
    t.nombre.toLowerCase().includes(search.toLowerCase())
  );

  // Abrir Modal
  const openDeleteModal = (tipo: TipoActivo) => {
    setItemToDelete(tipo);
    setIsModalOpen(true);
  };

  // Confirmar Eliminación
  const confirmDelete = async () => {
    if (!itemToDelete) return;
    const token = localStorage.getItem("token");
    setIsDeleting(true);

    try {
      const response = await fetch(`${API_URL}/tipos-activo/${itemToDelete.id}/`, {
        method: "DELETE",
        headers: { Authorization: `Token ${token}` },
      });

      if (!response.ok) throw new Error("Error al desactivar");
      setTipos((prev) => prev.filter((t) => t.id !== itemToDelete.id));
      setIsModalOpen(false);
      setItemToDelete(null);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  if (authorized === null) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!authorized) {
    return (
      <div className="flex h-[80vh] flex-col items-center justify-center p-6 text-center font-sans">
        <div className="rounded-full bg-destructive/10 p-4 mb-4 text-destructive shadow-inner">
          <ShieldAlert className="h-12 w-12" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Acceso Denegado</h1>
        <p className="mt-2 text-muted-foreground max-w-xs italic">
          Esta sección es exclusiva para administradores del sistema.
        </p>
        <button 
          onClick={() => router.push("/ajustes")} 
          className="mt-6 text-sm font-medium hover:text-primary transition-colors flex items-center gap-2 text-muted-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Volver a Ajustes
        </button>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col gap-8 p-6 lg:p-8 max-w-6xl mx-auto bg-background min-h-screen text-foreground font-sans">
      
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2">
          <button 
            onClick={() => router.push("/ajustes")}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
          >
            <ArrowLeft className="h-4 w-4" /> Volver a Ajustes
          </button>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20 shadow-sm">
              <Settings2 className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Tipos de Activos</h1>
              <p className="text-sm text-muted-foreground">Configura categorías y atributos personalizados.</p>
            </div>
          </div>
        </div>

        <button
          onClick={() => router.push("/ajustes/tipoactivos/create")}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-all shadow-sm shadow-primary/20 w-full sm:w-auto"
        >
          <Plus className="h-4 w-4" />
          Nuevo Tipo
        </button>
      </div>

      {/* Buscador */}
      <div className="relative group max-w-md w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
        <input
          type="text"
          placeholder="Buscar tipo de activo..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-input bg-card pl-10 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
        />
        {search && (
          <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}

      {/* Tabla */}
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center py-20 gap-3 text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin text-primary/50" />
            <p className="text-sm font-medium">Cargando definiciones...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="px-6 py-4 font-semibold text-muted-foreground w-24">ID</th>
                  <th className="px-6 py-4 font-semibold text-muted-foreground">Tipo de activo</th>
                  <th className="px-6 py-4 font-semibold text-muted-foreground text-center">Características</th>
                  <th className="px-6 py-4 font-semibold text-muted-foreground text-right font-sans">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredTipos.length > 0 ? (
                  filteredTipos.map((tipo) => (
                    <tr key={tipo.id} className="hover:bg-muted/30 transition-colors group">
                      <td className="px-6 py-4 font-mono text-xs text-muted-foreground">#{tipo.id}</td>
                      <td className="px-6 py-4 font-semibold text-foreground tracking-tight">
                        {tipo.nombre}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2 text-muted-foreground">
                          <ListTree className="h-3.5 w-3.5" />
                          <span className="font-medium bg-muted px-2 py-0.5 rounded text-xs">
                            {tipo.caracteristicas?.length || 0} campos
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => openDeleteModal(tipo)}
                          className="inline-flex h-9 items-center gap-2 rounded-lg px-4 text-xs font-semibold text-destructive border border-transparent hover:bg-destructive/10 hover:border-destructive/20 transition-all shadow-sm group-hover:shadow-none"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Desactivar
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
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

      {/* --- MODAL DE CONFIRMACIÓN ESTILIZADO --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div 
            className="absolute inset-0 bg-background/80 backdrop-blur-sm" 
            onClick={() => !isDeleting && setIsModalOpen(false)} 
          />
          
          <div className="relative w-full max-w-md rounded-2xl border bg-card p-6 shadow-xl animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute right-4 top-4 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X size={20} />
            </button>

            <div className="flex flex-col items-center text-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10 text-destructive shadow-inner">
                <AlertCircle size={30} />
              </div>
              
              <div className="space-y-2">
                <h2 className="text-xl font-bold tracking-tight">¿Confirmar acción?</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Estás a punto de desactivar el tipo <span className="font-bold text-foreground">"{itemToDelete?.nombre}"</span>. 
                  Esto afectará a la creación de nuevos activos bajo esta categoría.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 w-full mt-4">
                <button
                  onClick={() => setIsModalOpen(false)}
                  disabled={isDeleting}
                  className="h-11 rounded-xl border border-input bg-background font-medium hover:bg-accent transition-colors disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={isDeleting}
                  className="h-11 rounded-xl bg-destructive text-white font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-sm shadow-destructive/20"
                >
                  {isDeleting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 size={18} />
                  )}
                  {isDeleting ? "Procesando..." : "Desactivar"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
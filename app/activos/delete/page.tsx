"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Package, 
  Trash2, 
  ChevronLeft, 
  AlertTriangle, 
  Loader2, 
  Search,
  X,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Asset {
  id: number;
  nombre: string;
  tipo_activo: string;
  area: string;
  estado: string;
}

export default function DeleteActivosPage() {
  const router = useRouter();
  const [activos, setActivos] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  
  // Estados para el Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [assetToDelete, setAssetToDelete] = useState<Asset | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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
          headers: { Authorization: `Token ${token}` },
        });
        if (!res.ok) throw new Error("Error al cargar activos");
        const data = await res.json();
        setActivos(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchActivos();
  }, []);

  // Función que abre el modal
  const openConfirmModal = (activo: Asset) => {
    setAssetToDelete(activo);
    setIsModalOpen(true);
  };

  // Función que ejecuta la eliminación real
  const confirmDelete = async () => {
    if (!assetToDelete) return;
    
    const token = localStorage.getItem("token");
    setIsDeleting(true);

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/activos/${assetToDelete.id}/delete/`, {
        method: "DELETE",
        headers: { Authorization: `Token ${token}` },
      });

      if (!res.ok) throw new Error("No se pudo eliminar el activo");
      
      setActivos(prev => prev.filter(a => a.id !== assetToDelete.id));
      setIsModalOpen(false);
      setAssetToDelete(null);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredActivos = activos.filter(a => 
    a.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.tipo_activo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative min-h-screen">
      <div className="flex flex-col gap-6 p-6 lg:p-10 max-w-5xl mx-auto bg-background text-foreground transition-all">
        
        {/* Header */}
        <div className="flex flex-col gap-4">
          <button 
            onClick={() => router.push("/activos")}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors w-fit"
          >
            <ChevronLeft size={16} /> Volver
          </button>
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
                <Trash2 className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Gestionar Bajas</h1>
                <p className="text-muted-foreground text-sm">Elimina registros del sistema.</p>
              </div>
            </div>

            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input 
                type="text"
                placeholder="Buscar por nombre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-9 pl-9 pr-4 rounded-lg border border-input bg-background text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              />
            </div>
          </header>
        </div>

        {/* Lista de Activos */}
        <div className="grid gap-3">
          {loading ? (
            <div className="flex h-40 items-center justify-center"><Loader2 className="animate-spin text-primary" /></div>
          ) : filteredActivos.map((activo) => (
            <div
              key={activo.id}
              className="group flex items-center justify-between p-4 rounded-xl border bg-card hover:border-destructive/30 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-muted text-muted-foreground group-hover:bg-destructive/10 group-hover:text-destructive transition-colors">
                  <Package size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-bold">{activo.nombre}</h3>
                  <p className="text-xs text-muted-foreground">{activo.tipo_activo} • {activo.area}</p>
                </div>
              </div>

              <button
                onClick={() => openConfirmModal(activo)}
                className="h-9 w-9 flex items-center justify-center rounded-lg text-muted-foreground hover:bg-destructive hover:text-white transition-all"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* --- MODAL DE CONFIRMACIÓN --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          {/* Backdrop (Fondo oscuro) */}
          <div 
            className="absolute inset-0 bg-background/80 backdrop-blur-sm" 
            onClick={() => !isDeleting && setIsModalOpen(false)} 
          />
          
          {/* Contenido del Modal */}
          <div className="relative w-full max-w-md rounded-2xl border bg-card p-6 shadow-lg animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"
            >
              <X size={20} />
            </button>

            <div className="flex flex-col items-center text-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                <AlertCircle size={30} />
              </div>
              
              <div>
                <h2 className="text-xl font-bold">¿Confirmar eliminación?</h2>
                <p className="text-sm text-muted-foreground mt-2">
                  Estás a punto de eliminar <span className="font-bold text-foreground">"{assetToDelete?.nombre}"</span>. 
                  Esta acción es permanente y no se puede deshacer.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 w-full mt-4">
                <button
                  onClick={() => setIsModalOpen(false)}
                  disabled={isDeleting}
                  className="h-11 rounded-xl border font-medium hover:bg-accent transition-colors disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={isDeleting}
                  className="h-11 rounded-xl bg-destructive text-white font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 size={18} />}
                  {isDeleting ? "Eliminando..." : "Eliminar"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
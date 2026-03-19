"use client";

import { API_URL } from "@/config/api"
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Plus, 
  Trash2, 
  X, 
  ShieldAlert, 
  Settings2, 
  HelpCircle, 
  ChevronLeft 
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";


interface User {
  rol: string;
}

interface Opcion {
  nombre: string;
}

interface Caracteristica {
  nombre: string;
  tipo_dato: string;
  obligatorio: boolean;
  tamano?: number;
  opciones?: Opcion[];
}

const EJEMPLOS_TIPOS: Record<string, string> = {
  text: "Texto libre (ej: Marca, Procesador, Color)",
  int: "Número entero (ej: Memoria RAM, Almacenamiento)",
  float: "Número con decimales (ej: Peso, Precio, Voltaje)",
  date: "Fecha (ej: Fecha de Compra, Expiración de Garantía)",
  boolean: "Opción Sí/No (ej: ¿Es Original?, ¿Tiene Seguro?)",
  select: "Menú desplegable (ej: Sistema Operativo: Windows, Linux, Mac)",
};

export default function CreateTipoActivoPage() {
  const router = useRouter();

  const [nombre, setNombre] = useState("");
  const [caracteristicas, setCaracteristicas] = useState<Caracteristica[]>([
    {
      nombre: "",
      tipo_dato: "text",
      obligatorio: false,
      tamano: undefined,
      opciones: [],
    },
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [authorized, setAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      setAuthorized(false);
      return;
    }
    const parsed = JSON.parse(user) as User;
    setAuthorized(parsed.rol === "admin");
  }, []);

  // --- Handlers de Lógica ---
  const handleCaracteristicaChange = (index: number, field: keyof Caracteristica, value: any) => {
    const updated = [...caracteristicas];
    updated[index] = { ...updated[index], [field]: value };
    setCaracteristicas(updated);
  };

  const addCaracteristica = () => {
    setCaracteristicas([...caracteristicas, { nombre: "", tipo_dato: "text", obligatorio: false, opciones: [] }]);
  };

  const removeCaracteristica = (index: number) => {
    const updated = [...caracteristicas];
    updated.splice(index, 1);
    setCaracteristicas(updated);
  };

  const addOpcion = (index: number) => {
    const updated = [...caracteristicas];
    updated[index].opciones = [...(updated[index].opciones || []), { nombre: "" }];
    setCaracteristicas(updated);
  };

  const removeOpcion = (index: number, opcionIndex: number) => {
    const updated = [...caracteristicas];
    updated[index].opciones?.splice(opcionIndex, 1);
    setCaracteristicas(updated);
  };

  const handleOpcionChange = (index: number, opcionIndex: number, value: string) => {
    const updated = [...caracteristicas];
    if (updated[index].opciones) {
      updated[index].opciones![opcionIndex].nombre = value;
      setCaracteristicas(updated);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_URL}/tipos-activo/`, {
        method: "POST",
        headers: { Authorization: `Token ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre,
          caracteristicas: caracteristicas.filter(c => c.nombre.trim() !== "")
            .map(c => ({ ...c, opciones: c.tipo_dato === "select" ? c.opciones?.filter(o => o.nombre.trim() !== "") : [] }))
        }),
      });
      if (res.ok) router.push("/ajustes/tipoactivos");
      else setError("Error al guardar la estructura");
    } catch (e) { setError("Error de conexión con el servidor"); }
    finally { setLoading(false); }
  };

  if (authorized === null) return <div className="flex h-screen items-center justify-center bg-background text-muted-foreground animate-pulse">Verificando...</div>;
  
  if (!authorized) return (
    <div className="flex flex-col items-center justify-center h-[80vh] p-6 text-center">
      <ShieldAlert className="h-16 w-16 text-destructive mb-4 opacity-50" />
      <h1 className="text-2xl font-bold">Acceso Denegado</h1>
      <p className="text-muted-foreground mt-2">Solo administradores pueden crear estructuras de activos.</p>
    </div>
  );

  return (
    <TooltipProvider>
      <div className="flex flex-col gap-8 p-6 lg:p-10 max-w-5xl mx-auto bg-background text-foreground transition-colors duration-300">
        
        {/* Breadcrumb & Header */}
        <div className="space-y-4">
          <button 
            onClick={() => router.push("/ajustes/tipoactivos")}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <ChevronLeft size={16} /> Volver a la lista
          </button>
          <header className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <Settings2 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Crear tipo de activo</h1>
              <p className="text-muted-foreground text-sm">Define las características de tus nuevos activos.</p>
            </div>
          </header>
        </div>

        {error && (
          <div className="p-4 text-sm font-medium bg-destructive/10 border border-destructive/20 text-destructive rounded-xl animate-in fade-in slide-in-from-top-1">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Card Principal */}
          <section className="rounded-2xl border bg-card p-6 shadow-sm ring-1 ring-border/50">
            <label className="text-sm font-bold mb-3 block text-primary uppercase tracking-wider">Nombre</label>
            <div className="space-y-2">
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
                placeholder="Nombre del tipo (Ej: Computadoras, Desarmadores, Mobiliario)"
                className="flex h-12 w-full rounded-xl border border-input bg-background px-4 text-base transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              />
            </div>
          </section>

          {/* Sección de Características */}
          <section className="rounded-2xl border bg-card shadow-lg overflow-hidden border-border/60">
            <div className="px-6 py-4 border-b bg-muted/30 flex justify-between items-center">
              <h3 className="font-bold text-lg">Definición de características</h3>
              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-md font-mono uppercase">
                {caracteristicas.length} CARACTERÍSTICAS
              </span>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 text-muted-foreground font-semibold border-b text-left">
                  <tr>
                    <th className="px-6 py-4">Nombre del atributo</th>
                    <th className="px-6 py-4">Tipo de dato</th>
                    <th className="px-6 py-4">¿Es obligatorio?</th>
                    <th className="px-6 py-4 text-center">Eliminar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {caracteristicas.map((c, i) => (
                    <tr key={i} className="hover:bg-muted/10 transition-colors group">
                      <td className="px-6 py-5 align-top">
                        <input
                          type="text"
                          value={c.nombre}
                          onChange={(e) => handleCaracteristicaChange(i, "nombre", e.target.value)}
                          required
                          placeholder="Ej: Memoria RAM"
                          className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        />
                      </td>
                      <td className="px-6 py-5 align-top">
                        <div className="flex items-center gap-2">
                          <select
                            value={c.tipo_dato}
                            onChange={(e) => {
                              const val = e.target.value;
                              const updated = [...caracteristicas];
                              updated[i] = { ...updated[i], tipo_dato: val, opciones: val === "select" ? [{nombre: ""}] : [] };
                              setCaracteristicas(updated);
                            }}
                            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none appearance-none"
                          >
                            <option value="text">Texto</option>
                            <option value="int">Número Entero</option>
                            <option value="float">Decimal</option>
                            <option value="date">Fecha</option>
                            <option value="boolean">Booleano</option>
                            <option value="select">Lista de Opciones</option>
                          </select>
                          
                          <Tooltip>
                            <TooltipTrigger type="button">
                              <HelpCircle size={18} className="text-muted-foreground hover:text-primary transition-colors" />
                            </TooltipTrigger>
                            <TooltipContent className="bg-popover border-primary/20 shadow-xl p-3">
                              <p className="text-xs font-medium">{EJEMPLOS_TIPOS[c.tipo_dato]}</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </td>
                      <td className="px-6 py-5 align-top">
                        <div className="space-y-4">
                          <label className="flex items-center gap-3 cursor-pointer group/check">
                            <input
                              type="checkbox"
                              checked={c.obligatorio}
                              onChange={(e) => handleCaracteristicaChange(i, "obligatorio", e.target.checked)}
                              className="h-5 w-5 rounded-md border-input bg-background text-primary focus:ring-primary/20 transition-all"
                            />
                            <span className="text-xs font-medium text-muted-foreground group-hover/check:text-foreground">Requerido</span>
                          </label>

                          {c.tipo_dato === "select" && (
                            <div className="space-y-2 pt-2 border-t border-dashed">
                              <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-tighter">Opciones del menú:</p>
                              {c.opciones?.map((op, opIdx) => (
                                <div key={opIdx} className="flex gap-2 animate-in zoom-in-95 duration-200">
                                  <input
                                    type="text"
                                    value={op.nombre}
                                    onChange={(e) => handleOpcionChange(i, opIdx, e.target.value)}
                                    className="flex-1 text-[11px] rounded-md border border-input bg-background px-2 py-1 focus:border-primary outline-none"
                                    placeholder={`Opción ${opIdx + 1}`}
                                  />
                                  <button 
                                    type="button" 
                                    onClick={() => removeOpcion(i, opIdx)} 
                                    className="text-destructive hover:bg-destructive/10 p-1 rounded transition-colors"
                                  >
                                    <X size={14}/>
                                  </button>
                                </div>
                              ))}
                              <button
                                type="button"
                                onClick={() => addOpcion(i)}
                                className="w-full py-1.5 border-2 border-dashed border-muted hover:border-primary/40 hover:text-primary text-[10px] font-bold rounded-lg transition-all flex items-center justify-center gap-1"
                              >
                                <Plus size={12}/> Añadir opción
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-5 text-center align-top">
                        {caracteristicas.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeCaracteristica(i)}
                            className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl transition-all"
                          >
                            <Trash2 size={20} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-6 bg-muted/20 border-t">
              <button
                type="button"
                onClick={addCaracteristica}
                className="w-full py-3 flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-primary/30 text-primary font-bold hover:bg-primary/5 hover:border-primary transition-all text-sm"
              >
                <Plus size={18} /> Añadir característica
              </button>
            </div>
          </section>

          {/* Footer de Acciones */}
          <div className="flex flex-col sm:flex-row gap-3 justify-end items-center pt-6 border-t">
            <button
              type="button"
              onClick={() => router.push("/ajustes/tipoactivos")}
              className="w-full sm:w-auto h-12 px-6 text-sm font-semibold rounded-xl hover:bg-muted transition-colors"
            >
              Descartar cambios
            </button>
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto h-12 px-10 text-sm font-bold bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl shadow-lg shadow-primary/20 transition-all disabled:opacity-50 disabled:scale-95"
            >
              {loading ? "Sincronizando..." : "Guardar cambios"}
            </button>
          </div>
        </form>
      </div>
    </TooltipProvider>
  );
}
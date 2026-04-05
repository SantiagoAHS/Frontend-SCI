"use client";

import { API_URL } from "@/config/api";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Database, 
  Download, 
  Lock, 
  Unlock, 
  ShieldAlert, 
  Loader2, 
  ArrowLeft, 
  History, 
  ShieldCheck,
  AlertCircle,
  FileArchive
} from "lucide-react";

interface Backup {
  id: number;
  nombre: string;
  usuario: string;
  fecha: string;
  descargado: boolean;
}

export default function BackupsPage() {
  const router = useRouter();
  const [backups, setBackups] = useState<Backup[]>([]);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [error, setError] = useState("");

  // 🔹 Verificar rol
  const checkUser = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_URL}/perfil/`, {
        headers: { Authorization: `Token ${token}` },
      });

      if (!res.ok) {
        setIsAdmin(false);
        return;
      }

      const data = await res.json();
      setIsAdmin(data.rol === "admin");
    } catch (error) {
      console.error(error);
      setIsAdmin(false);
    }
  };

  // 🔹 Obtener historial
  const fetchBackups = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_URL}/backup/historial/`, {
        headers: { Authorization: `Token ${token}` },
      });

      if (!res.ok) throw new Error("No se pudo cargar el historial");
      const data = await res.json();
      setBackups(data);
    } catch (error: any) {
      setError(error.message);
    }
  };

  useEffect(() => {
    checkUser();
  }, []);

  useEffect(() => {
    if (isAdmin) fetchBackups();
  }, [isAdmin]);

  // 🔹 Generar backup
  const generarBackup = async () => {
    const token = localStorage.getItem("token");
    if (!password) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_URL}/backup/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Error al generar backup");
      }

      setPassword("");
      fetchBackups();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Descargar
  const descargarBackup = async (id: number, nombre: string) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_URL}/backup/descargar/${id}/`, {
        headers: { Authorization: `Token ${token}` },
      });

      if (!res.ok) throw new Error("No se pudo descargar el archivo");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = nombre;
      document.body.appendChild(a);
      a.click();
      a.remove();

      fetchBackups();
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (isAdmin === null) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isAdmin === false) {
    return (
      <div className="flex h-[80vh] flex-col items-center justify-center p-6 text-center font-sans">
        <div className="rounded-full bg-destructive/10 p-4 mb-4 text-destructive shadow-inner">
          <ShieldAlert className="h-12 w-12" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Acceso Restringido</h1>
        <p className="mt-2 text-muted-foreground max-w-xs italic">
          Solo los administradores autorizados pueden gestionar copias de seguridad.
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
    <div className="flex flex-col gap-8 p-6 lg:p-8 max-w-5xl mx-auto bg-background min-h-screen text-foreground font-sans">
      
      {/* Header */}
      <div className="flex flex-col gap-2">
        <button 
          onClick={() => router.push("/ajustes")}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
        >
          <ArrowLeft className="h-4 w-4" /> Volver a Ajustes
        </button>
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20 shadow-sm">
            <Database className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Base de Datos</h1>
            <p className="text-sm text-muted-foreground">Gestiona respaldos y seguridad de la información.</p>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        
        {/* Panel de Generación */}
        <div className="lg:col-span-1 space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4 text-primary">
              <ShieldCheck className="h-5 w-5" />
              <h2 className="font-bold">Nuevo Respaldo</h2>
            </div>
            
            <p className="text-xs text-muted-foreground mb-6 leading-relaxed">
              Al generar un backup, se creará un archivo comprimido con toda la base de datos actual. Por seguridad, confirma tu identidad.
            </p>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-1">
                  Contraseña de Administrador
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl border border-input bg-background pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>
              </div>

              <button
                onClick={generarBackup}
                disabled={loading || !password}
                className="w-full inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2 text-sm font-bold text-primary-foreground hover:bg-primary/90 transition-all shadow-sm shadow-primary/20 disabled:opacity-50 disabled:grayscale"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Database className="h-4 w-4" />
                )}
                {loading ? "Procesando..." : "Generar Backup"}
              </button>
            </div>

            {error && (
              <div className="mt-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium flex gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}
          </div>
        </div>

        {/* Historial */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-2 px-1">
            <History className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-lg font-bold">Historial de Respaldos</h2>
          </div>

          <div className="space-y-3">
            {backups.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground italic bg-card/50">
                No se han generado copias de seguridad todavía.
              </div>
            ) : (
              backups.map((b) => (
                <div 
                  key={b.id} 
                  className="group relative rounded-2xl border border-border bg-card p-5 hover:border-primary/30 transition-all hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex gap-4">
                      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border ${b.descargado ? 'bg-muted text-muted-foreground border-border' : 'bg-primary/5 text-primary border-primary/10'}`}>
                        <FileArchive className="h-6 w-6" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-bold text-sm leading-none group-hover:text-primary transition-colors">
                          {b.nombre}
                        </h3>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <History className="h-3 w-3" /> {b.fecha}
                          </span>
                          <span className="font-medium bg-muted px-2 py-0.5 rounded text-[10px] uppercase">
                            Admin: {b.usuario}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center">
                      {b.descargado ? (
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-destructive/5 text-destructive text-xs font-bold border border-destructive/10">
                          <Lock className="h-3.5 w-3.5" />
                          Bloqueado
                        </div>
                      ) : (
                        <button 
                          onClick={() => descargarBackup(b.id, b.nombre)}
                          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-background border border-input hover:border-primary hover:text-primary text-sm font-semibold transition-all shadow-sm active:scale-95"
                        >
                          <Download className="h-4 w-4" />
                          Descargar
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
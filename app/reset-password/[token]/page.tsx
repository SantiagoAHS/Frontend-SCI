"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { API_URL } from "@/config/api"
import { Lock, Loader2, CheckCircle2, AlertCircle, Key } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

export default function ResetPasswordPage() {
  const { token } = useParams()
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setMessage("")
    setIsLoading(true)

    try {
      const res = await fetch(`${API_URL}/reset-password/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          password,
        }),
      })

      const data = await res.json()

      if (res.ok) {
        setMessage(" Contraseña actualizada correctamente")
      } else {
        setError(data.error || "El token es inválido o ha expirado.")
      }
    } catch (err) {
      setError("Error de conexión con el servidor.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Elementos decorativos */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]" />

      <div className="w-full max-w-md">
        <div className="bg-card border border-border shadow-2xl rounded-[2.5rem] p-8 md:p-12 backdrop-blur-sm">
          <div className="mb-8">
            <div className="h-14 w-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6 border border-primary/20">
              <Key className="h-7 w-7" />
            </div>
            <h1 className="text-3xl font-black tracking-tight text-foreground mb-2">
              Nueva contraseña
            </h1>
            <p className="text-muted-foreground text-sm">
              Escribe tu nueva contraseña para recuperar el acceso a tu cuenta.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase text-muted-foreground ml-1 tracking-wider">
                Contraseña Nueva
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-muted/40 border border-transparent focus:border-primary/20 focus:bg-background rounded-2xl py-4 pl-12 pr-4 text-sm font-medium focus:ring-4 ring-primary/5 outline-none transition-all"
                  required
                />
              </div>
            </div>

            {message && (
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm font-bold animate-in fade-in zoom-in-95">
                <CheckCircle2 className="h-5 w-5 shrink-0" />
                {message}
              </div>
            )}

            {error && (
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-bold animate-in fade-in zoom-in-95">
                <AlertCircle className="h-5 w-5 shrink-0" />
                {error}
              </div>
            )}

            <button
              disabled={isLoading || !!message}
              className={cn(
                "w-full py-4 rounded-[1.4rem] font-black text-xs uppercase tracking-widest shadow-xl transition-all flex items-center justify-center gap-2",
                message 
                  ? "bg-muted text-muted-foreground cursor-not-allowed"
                  : "bg-primary text-primary-foreground shadow-primary/20 hover:scale-[1.02] active:scale-95 disabled:opacity-70"
              )}
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                "Cambiar Contraseña"
              )}
            </button>
          </form>

          {message && (
            <div className="mt-6 text-center">
              <Link href="/login" className="text-sm font-bold text-primary hover:underline">
                Ir al inicio de sesión
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
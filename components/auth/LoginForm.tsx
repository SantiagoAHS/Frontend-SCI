"use client";

import { API_URL } from "@/config/api"
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, User, Loader2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const LoginForm = () => {
  const router = useRouter();

  const [numeroEmpleado, setNumeroEmpleado] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔹 Función para validar que solo entren números
  const handleEmployeeNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Regex \D busca cualquier carácter que NO sea un dígito y lo elimina
    const onlyNums = value.replace(/\D/g, "");
    setNumeroEmpleado(onlyNums);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          numero_empleado: numeroEmpleado,
          password: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Credenciales incorrectas");
        setLoading(false);
        return;
      }

      // Guardar token y datos básicos del usuario
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // ✅ AGREGA ESTO 👇
      document.cookie = `token=${data.token}; path=/`;

      // Redirigir al dashboard
      router.push("/");
      router.refresh(); // Asegura que el sidebar detecte el nuevo token
    } catch (err) {
      setError("No se pudo conectar con el servidor");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Mensaje de Error */}
      {error && (
        <div className="flex items-center gap-3 p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm animate-in fade-in slide-in-from-top-1">
          <AlertCircle className="h-4 w-4" />
          <p className="font-medium">{error}</p>
        </div>
      )}

      {/* Input Numero de Empleado */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">
          Número de Empleado
        </label>
        <div className="relative group">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
            <User className="h-4 w-4" />
          </div>
          <input
            type="text" // Usamos text para controlar la validación con regex
            inputMode="numeric" // Muestra el teclado numérico en móviles
            value={numeroEmpleado}
            onChange={handleEmployeeNumberChange} // 👈 Usamos la nueva función
            className="w-full bg-background border border-input pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            placeholder="Ej. 102030"
            required
            disabled={loading}
          />
        </div>
      </div>

      {/* Input Contraseña */}
      <div className="space-y-2">
        <div className="flex justify-between items-center px-1">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Contraseña
          </label>
          <a href="/forgot-password"  className="text-xs text-primary hover:underline font-medium">
            ¿Olvidaste tu contraseña?
          </a>
        </div>
        <div className="relative group">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
            <Lock className="h-4 w-4" />
          </div>
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-background border border-input pl-10 pr-12 py-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            placeholder="••••••••"
            required
            disabled={loading}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className={cn(
          "w-full h-11 flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground font-bold text-sm transition-all shadow-lg shadow-primary/20 hover:opacity-90 active:scale-[0.98]",
          loading && "opacity-70 cursor-not-allowed"
        )}
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          "Acceder"
        )}
      </button>

      <p className="text-center text-xs text-muted-foreground pt-4">
        ¿Problemas para entrar? Contacta a Soporte Técnico.
      </p>
    </form>
  );
};

export default LoginForm;
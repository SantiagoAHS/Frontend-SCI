"use client";

import { API_URL } from "@/config/api"
import { useState } from "react";
import { useRouter } from "next/navigation";

const LoginForm = () => {
  const router = useRouter();

  const [numeroEmpleado, setNumeroEmpleado] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(`${API_URL}/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          numero_empleado: numeroEmpleado,
          password: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Error al iniciar sesión");
        return;
      }

      // Guardar token en localStorage
      localStorage.setItem("token", data.token);

      // Opcional: guardar usuario
      localStorage.setItem("user", JSON.stringify(data.user));

      // Redirigir al home
      router.push("/");
    } catch (err) {
      setError("Error de conexión con el servidor");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm">
      <h1 className="text-2xl font-bold mb-6 text-black">
        Iniciar sesión
      </h1>

      <div className="mb-4">
        <label className="block mb-1 text-sm text-black">
          Número de empleado
        </label>
        <input
          type="text"
          value={numeroEmpleado}
          onChange={(e) => setNumeroEmpleado(e.target.value)}
          className="w-full border rounded px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-black"
          placeholder="12345"
          required
        />
      </div>

      <div className="mb-6">
        <label className="block mb-1 text-sm text-black">
          Contraseña
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border rounded px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-black"
          placeholder="********"
          required
        />
      </div>

      {error && (
        <p className="text-red-600 text-sm mb-4">{error}</p>
      )}

      <button
        type="submit"
        className="w-full bg-black text-white py-2 rounded hover:bg-gray-900 transition"
      >
        Entrar
      </button>
    </form>
  );
};

export default LoginForm;
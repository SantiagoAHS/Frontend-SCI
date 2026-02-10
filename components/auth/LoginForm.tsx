"use client";

import { useRouter } from "next/navigation";


const LoginForm = () => {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // evita recargar la página
    router.push("/");   // home
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm">
      <h1 className="text-2xl font-bold mb-6 text-black">
        Iniciar sesión
      </h1>

      <div className="mb-4">
        <label className="block mb-1 text-sm text-black">
          Correo
        </label>
        <input
          type="email"
          className="w-full border rounded px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-black"
          placeholder="correo@ejemplo.com"
        />
      </div>

      <div className="mb-6">
        <label className="block mb-1 text-sm text-black">
          Contraseña
        </label>
        <input
          type="password"
          className="w-full border rounded px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-black"
          placeholder="********"
        />
      </div>

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

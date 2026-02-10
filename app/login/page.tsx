import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen grid grid-cols-2">
      
      {/* Lado izquierdo: formulario */}
      <div className="flex items-center justify-center bg-white">
        <LoginForm />
      </div>

      {/* Lado derecho: fondo negro (imagen futura) */}
      <div className="bg-black" />

    </div>
  );
}

import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-background">
      
      {/* Lado izquierdo: Formulario */}
      <div className="flex flex-col items-center justify-center p-8 bg-card border-r border-border">
        <div className="w-full max-w-md space-y-8">
          <div className="flex flex-col space-y-2 text-center md:text-left">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Bienvenido de nuevo
            </h1>
            <p className="text-sm text-muted-foreground">
              Ingresa tus credenciales para acceder al sistema SCI
            </p>
          </div>
          <LoginForm />
        </div>
      </div>

      {/* Lado derecho: Visual */}
      <div className="hidden md:flex relative bg-black items-center justify-center overflow-hidden">
        {/* Decoración de fondo (Círculos difuminados) */}
        <div className="absolute top-0 -left-4 w-72 h-72 bg-primary/20 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-0 -right-4 w-72 h-72 bg-primary/30 rounded-full blur-3xl opacity-50" />
        
        <div className="relative z-10 p-12 text-center">
          <div className="mb-8 inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl">
            <span className="text-4xl font-bold text-white">SCI</span>
          </div>
          <h2 className="text-4xl font-bold text-white mb-4 tracking-tight">
            Gestión Inteligente de Activos
          </h2>
          <p className="text-lg text-gray-400 max-w-md mx-auto leading-relaxed">
            Optimiza el control de inventario, mantenimientos y auditorías en una sola plataforma técnica.
          </p>
        </div>

        {/* Overlay sutil para profundidad */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-transparent via-black/20 to-black" />
      </div>

    </div>
  );
}
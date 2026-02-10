interface Activo {
  id: number;
  nombre: string;
  descripcion: string;
  estado: "Activo" | "Inactivo";
}

const activosMock: Activo[] = [
  {
    id: 1,
    nombre: "Servidor Principal",
    descripcion: "Servidor encargado de la base de datos",
    estado: "Activo",
  },
  {
    id: 2,
    nombre: "Sistema de Pagos",
    descripcion: "Módulo de pagos y facturación",
    estado: "Activo",
  },
  {
    id: 3,
    nombre: "Panel Administrativo",
    descripcion: "Gestión interna del sistema",
    estado: "Inactivo",
  },
];

const ActivosList = () => {
  return (
    <div className="space-y-3">
      {activosMock.map((activo) => (
        <div
          key={activo.id}
          className="border border-gray-300 rounded-lg p-4 flex items-center justify-between bg-white"
        >
          <div>
            <h3 className="font-semibold text-black">
              {activo.nombre}
            </h3>
            <p className="text-sm text-gray-600">
              {activo.descripcion}
            </p>
          </div>

          <span
            className={`text-sm font-medium px-3 py-1 rounded-full ${
              activo.estado === "Activo"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {activo.estado}
          </span>
        </div>
      ))}
    </div>
  );
};

export default ActivosList;

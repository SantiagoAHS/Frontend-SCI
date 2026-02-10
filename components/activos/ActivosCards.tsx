import Link from "next/link";

const ActivosCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

      {/* Card 1 */}
      <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
        <div className="h-32 bg-gray-200 flex items-center justify-center text-gray-500">
          Imagen
        </div>

        <div className="p-4">
          <h2 className="text-lg font-semibold mb-1">
            Activo 1
          </h2>
          <p className="text-sm text-gray-600">
            Descripción breve del activo.
          </p>

          <Link href="/activos/lista">
            <button
              className="mt-4 w-full bg-black text-white py-1.5 rounded hover:bg-gray-900 transition"
            >
              Ingresar
            </button>
          </Link>
        </div>
      </div>

      {/* Card 2 */}
      <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
        <div className="h-32 bg-gray-200 flex items-center justify-center text-gray-500">
          Imagen
        </div>

        <div className="p-4">
          <h2 className="text-lg font-semibold mb-1">
            Activo 2
          </h2>
          <p className="text-sm text-gray-600">
            Otra descripción breve del activo.
          </p>

          <button
            className="mt-4 w-full bg-black text-white py-1.5 rounded hover:bg-gray-900 transition"
          >
            Ingresar
          </button>
        </div>
      </div>

    </div>
  );
};

export default ActivosCards;


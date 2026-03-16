async function getActivo(id: string) {

  const res = await fetch(`http://127.0.0.1:8000/api/activos/${id}/`, {
    cache: "no-store"
  })

  if (!res.ok) {
    throw new Error(`Error ${res.status}`)
  }

  return res.json()
}

export default async function ActivoPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {

  const { id } = await params
  const activo = await getActivo(id)

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">

      {/* 🔹 Encabezado */}
      <div className="flex gap-6 items-start border rounded-lg p-6 bg-white shadow">

        <img
          src={activo.imagen}
          width={200}
          className="rounded-lg border"
        />

        <div className="space-y-2">

          <h1 className="text-2xl font-bold">{activo.nombre}</h1>

          <p className="text-gray-600">{activo.descripcion}</p>

          <div className="grid grid-cols-2 gap-3 pt-2">

            <p><b>Tipo:</b> {activo.tipo_activo}</p>

            <p><b>Área:</b> {activo.area}</p>

            <p>
              <b>Estado:</b>{" "}
              <span className="px-2 py-1 rounded bg-gray-200">
                {activo.estado}
              </span>
            </p>

          </div>

        </div>
      </div>

      {/* 🔹 Información de préstamo */}
      {activo.prestamo && (
        <div className="border rounded-lg p-6 bg-blue-50">

          <h3 className="text-lg font-semibold mb-3">
            Información de préstamo
          </h3>

          <div className="grid grid-cols-2 gap-3">

            <p><b>Responsable:</b> {activo.prestamo.responsable_nombre}</p>

            <p><b>Teléfono:</b> {activo.prestamo.responsable_telefono}</p>

            <p><b>Área:</b> {activo.prestamo.area}</p>

            <p><b>Tipo préstamo:</b> {activo.prestamo.tipo_prestamo}</p>

            <p><b>Inicio:</b> {activo.prestamo.fecha_inicio}</p>

            <p><b>Fin:</b> {activo.prestamo.fecha_fin}</p>

          </div>

        </div>
      )}

      {/* 🔹 Información de mantenimiento */}
      {activo.mantenimiento && (
        <div className="border rounded-lg p-6 bg-yellow-50">

          <h3 className="text-lg font-semibold mb-3">
            Información de mantenimiento
          </h3>

          <div className="grid grid-cols-2 gap-3">

            <p><b>Tipo:</b> {activo.mantenimiento.tipo}</p>

            <p><b>Estado:</b> {activo.mantenimiento.estado}</p>

            <p><b>Responsable:</b> {activo.mantenimiento.responsable}</p>

            <p><b>Fecha ingreso:</b> {activo.mantenimiento.fecha_ingreso}</p>

            <p className="col-span-2">
              <b>Problema:</b> {activo.mantenimiento.descripcion_problema}
            </p>

          </div>

        </div>
      )}

      {/* 🔹 Características */}
      <div className="border rounded-lg p-6 bg-white shadow">

        <h3 className="text-lg font-semibold mb-4">
          Características
        </h3>

        <div className="grid grid-cols-2 gap-3">

          {activo.valores.map((v: any) => (
            <div key={v.id} className="border rounded p-2">

              <b>{v.caracteristica.nombre}:</b>{" "}
              {v.valor_texto || v.opcion?.nombre}

            </div>
          ))}

        </div>

      </div>

    </div>
  )
}
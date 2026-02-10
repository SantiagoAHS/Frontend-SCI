import ActivosList from "@/components/activos/ActivosList";

export default function ListaActivosPage() {
  return (
    <section className="p-8">
      <h1 className="text-2xl font-bold mb-6">
        Lista de Activos
      </h1>

      <ActivosList />
    </section>
  );
}

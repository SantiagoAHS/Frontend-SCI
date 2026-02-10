import PrestamosCards from "@/components/prestamos/PrestamosCards";

export default function Prestamos() {
  return (
    <section className="p-8">
      <h1 className="text-2xl font-bold mb-6">
        Préstamos
      </h1>

      <PrestamosCards />
    </section>
  );
}
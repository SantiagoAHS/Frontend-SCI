"use client"

import { useState } from "react"
import { ItemCard } from "@/components/item-card"
import type { AssetStatus, AssetType } from "@/components/status-badge"
import { Package, Plus, Search } from "lucide-react"

interface Asset {
  title: string
  code: string
  description: string
  image: string
  status: AssetStatus
  type: AssetType
  responsible?: string
  area?: string
  extras?: Record<string, string>
}

const allAssets: Asset[] = [
  {
    title: "Laptop Dell XPS 15",
    code: "COMP-001",
    description: "Portatil de alto rendimiento con Intel i9, ideal para desarrollo de software y diseno.",
    image: "/images/laptop.jpg",
    status: "Asignado",
    type: "Computadora",
    responsible: "Juan Perez",
    area: "Depto. TI",
    extras: { RAM: "32GB", Disco: "1TB SSD", Marca: "Dell" },
  },
  {
    title: 'Monitor LG UltraWide 34"',
    code: "COMP-002",
    description: "Monitor ultrawide curvo QHD de 34 pulgadas para multitarea y diseno grafico.",
    image: "/images/monitor.jpg",
    status: "En Uso",
    type: "Computadora",
    responsible: "Ana Garcia",
    area: "Depto. Diseno",
    extras: { Resolucion: "3440x1440", Panel: "IPS" },
  },
  {
    title: "Impresora HP LaserJet Pro",
    code: "IMP-001",
    description: "Impresora laser multifuncional con escaneo y copia a doble cara. Alto volumen.",
    image: "/images/printer.jpg",
    status: "Baja",
    type: "Impresora",
    area: "Depto. Finanzas",
    extras: { Tipo: "Laser", Velocidad: "40 ppm" },
  },
  {
    title: "Ford Ranger 2024",
    code: "VEH-001",
    description: "Camioneta pickup para labores de campo y transporte de equipo pesado.",
    image: "/images/projector.jpg",
    status: "En Uso",
    type: "Vehiculo",
    responsible: "Carlos Martinez",
    area: "Operaciones",
    extras: { Placa: "ABC-1234", Modelo: "2024", KM: "15,200" },
  },
  {
    title: "Escritorio Ejecutivo",
    code: "MOB-001",
    description: "Escritorio de madera con superficie amplia, 3 cajones laterales y organizador de cables.",
    image: "/images/keyboard.jpg",
    status: "Asignado",
    type: "Mobiliario",
    area: "Depto. Direccion",
    responsible: "Director General",
  },
  {
    title: "iPad Pro 12.9\"",
    code: "COMP-003",
    description: "Tableta profesional con chip M2 para presentaciones moviles y diseno en campo.",
    image: "/images/tablet.jpg",
    status: "Mantenimiento",
    type: "Computadora",
    responsible: "Maria Lopez",
    area: "Depto. Ventas",
    extras: { Almacenamiento: "256GB", Chip: "M2" },
  },
  {
    title: "Switch Cisco Catalyst 24P",
    code: "RED-001",
    description: "Switch de red administrable de 24 puertos Gigabit para infraestructura de red principal.",
    image: "/images/monitor.jpg",
    status: "Registrado",
    type: "Equipo de Red",
    area: "Depto. TI",
    extras: { Puertos: "24", Velocidad: "1Gbps" },
  },
  {
    title: "Taladro Bosch Industrial",
    code: "HER-001",
    description: "Taladro percutor profesional de 800W para uso industrial y mantenimiento de instalaciones.",
    image: "/images/projector.jpg",
    status: "En Uso",
    type: "Herramientas",
    responsible: "Roberto Diaz",
    area: "Mantenimiento",
    extras: { Potencia: "800W", Tipo: "Percutor" },
  },
  {
    title: "Toyota Hilux 2023",
    code: "VEH-002",
    description: "Camioneta de carga ligera para reparto y logistica urbana de la empresa.",
    image: "/images/laptop.jpg",
    status: "Auditoria",
    type: "Vehiculo",
    responsible: "Pedro Sanchez",
    area: "Logistica",
    extras: { Placa: "DEF-5678", Modelo: "2023", KM: "32,100" },
  },
]

const typeFilters: (AssetType | "Todos")[] = [
  "Todos",
  "Computadora",
  "Vehiculo",
  "Impresora",
  "Mobiliario",
  "Herramientas",
  "Equipo de Red",
]

export default function ActivosPage() {
  const [activeType, setActiveType] = useState<AssetType | "Todos">("Todos")
  const [search, setSearch] = useState("")

  const filtered = allAssets.filter((a) => {
    const matchType = activeType === "Todos" || a.type === activeType
    const matchSearch =
      search === "" ||
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.code.toLowerCase().includes(search.toLowerCase())
    return matchType && matchSearch
  })

  return (
    <div className="flex flex-col gap-6 p-6 lg:p-8">
      {/* Header */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Package className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-balance">
              Catalogo de Activos
            </h1>
            <p className="text-sm text-muted-foreground">
              {filtered.length} de {allAssets.length} activos
            </p>
          </div>
        </div>
        <button className="inline-flex h-9 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
          <Plus className="h-4 w-4" />
          Registrar Activo
        </button>
      </header>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Buscar por nombre o codigo..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-10 w-full rounded-lg border border-input bg-background pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
        />
      </div>

      {/* Type Tabs */}
      <div className="flex flex-wrap gap-2">
        {typeFilters.map((type) => (
          <button
            key={type}
            onClick={() => setActiveType(type)}
            className={
              activeType === type
                ? "inline-flex items-center rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition-colors"
                : "inline-flex items-center rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            }
          >
            {type}
          </button>
        ))}
      </div>

      {/* Cards Grid */}
      <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((activo) => (
          <ItemCard key={activo.code} {...activo} />
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full flex flex-col items-center gap-2 py-16 text-center">
            <Package className="h-10 w-10 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">No se encontraron activos con esos criterios.</p>
          </div>
        )}
      </section>
    </div>
  )
}

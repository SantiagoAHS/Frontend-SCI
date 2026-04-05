"use client";

import { useState } from "react";
import Image from "next/image";
import { Package } from "lucide-react"; // Icono para el placeholder
import { StatusBadge, TypeBadge, type AssetStatus, type AssetType } from "@/components/status-badge";

interface ItemCardProps {
  title: string;
  code: string;
  description: React.ReactNode;
  image: string;
  status: AssetStatus;
  type: AssetType;
  responsible?: string;
  area?: string;
  extras?: Record<string, string>;
}

export function ItemCard({
  title,
  code,
  description,
  image,
  status,
  type,
  responsible,
  area,
  extras,
}: ItemCardProps) {
  // Estado para manejar errores de carga de imagen
  const [imgSrc, setImgSrc] = useState(image);
  const [error, setError] = useState(false);

  return (
    <div className="group overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all duration-300 hover:shadow-md hover:border-primary/20">
      
      {/* Contenedor de Imagen Optimizado */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted/30">
        {!error ? (
          <>
            {/* Capa 1: Fondo desenfocado para rellenar espacios si la foto es vertical o pequeña */}
            <Image
              src={imgSrc}
              alt=""
              fill
              className="object-cover opacity-20 blur-md scale-110"
              aria-hidden="true"
            />
            
            {/* Capa 2: Imagen principal contenida */}
            <Image
              src={imgSrc}
              alt={title}
              fill
              className="object-contain p-3 transition-transform duration-500 group-hover:scale-105"
              onError={() => setError(true)}
            />
          </>
        ) : (
          /* Placeholder cuando no hay imagen o hay error */
          <div className="flex h-full w-full flex-col items-center justify-center bg-muted/50 text-muted-foreground">
            <Package size={40} strokeWidth={1} className="mb-2 opacity-20" />
            <span className="text-[10px] font-medium uppercase tracking-tighter opacity-50">Sin Imagen</span>
          </div>
        )}

        {/* Badge de Estado flotante */}
        <div className="absolute right-3 top-3">
          <StatusBadge status={status} />
        </div>
      </div>

      {/* Cuerpo de la Tarjeta */}
      <div className="flex flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-col gap-0.5">
            <h3 className="text-sm font-bold text-card-foreground leading-tight group-hover:text-primary transition-colors">
              {title}
            </h3>
            <span className="text-[10px] font-mono font-medium text-muted-foreground/70">{code}</span>
          </div>
          <TypeBadge type={type} />
        </div>

        <div className="text-xs text-muted-foreground leading-relaxed line-clamp-2 min-h-[2.5rem]">
          {description}
        </div>

        {/* Responsable y Área */}
        {(responsible || area) && (
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-border pt-3 mt-1">
            {responsible && (
              <div className="flex items-center gap-1.5">
                <div className="h-1 w-1 rounded-full bg-primary/40" />
                <span className="text-[11px] text-muted-foreground">
                  <span className="font-semibold text-foreground/80">{responsible}</span>
                </span>
              </div>
            )}
            {area && (
              <span className="text-[11px] text-muted-foreground/60 italic">
                {area}
              </span>
            )}
          </div>
        )}

        {/* Campos Extras Dinámicos */}
        {extras && Object.keys(extras).length > 0 && (
          <div className="flex flex-wrap gap-x-3 gap-y-1.5 border-t border-border/50 pt-2 mt-1">
            {Object.entries(extras).map(([key, value]) => (
              <span key={key} className="text-[10px] text-muted-foreground bg-muted/30 px-1.5 py-0.5 rounded">
                <span className="font-bold text-foreground/70">{key}:</span>{" "}
                {value}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
"use client"

import Image from "next/image"
import { StatusBadge, TypeBadge, type AssetStatus, type AssetType } from "@/components/status-badge"

interface ItemCardProps {
  title: string
  code: string
  description: React.ReactNode;
  image: string
  status: AssetStatus
  type: AssetType
  responsible?: string
  area?: string
  extras?: Record<string, string>
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
  return (
    <div className="group overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md">
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute right-3 top-3">
          <StatusBadge status={status} />
        </div>
      </div>
      <div className="flex flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-col gap-0.5">
            <h3 className="text-sm font-semibold text-card-foreground leading-tight">
              {title}
            </h3>
            <span className="text-xs font-mono text-muted-foreground">{code}</span>
          </div>
          <TypeBadge type={type} />
        </div>
        <div className="text-xs text-muted-foreground leading-relaxed">
          {description}
        </div>
        {(responsible || area) && (
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-border pt-2">
            {responsible && (
              <span className="text-xs text-muted-foreground">
                <span className="font-medium text-card-foreground">{responsible}</span>
              </span>
            )}
            {area && (
              <span className="text-xs text-muted-foreground">
                {area}
              </span>
            )}
          </div>
        )}
        {extras && Object.keys(extras).length > 0 && (
          <div className="flex flex-wrap gap-x-3 gap-y-1 border-t border-border pt-2">
            {Object.entries(extras).map(([key, value]) => (
              <span key={key} className="text-xs text-muted-foreground">
                <span className="font-medium text-card-foreground">{key}:</span>{" "}
                {value}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

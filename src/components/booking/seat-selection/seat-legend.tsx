"use client"

import { cn } from "@/lib/utils"

const LEGEND_ITEMS = [
  { color: "bg-sky-400", label: "Window", border: "border-sky-400" },
  { color: "bg-gray-400", label: "Middle", border: "border-gray-400" },
  { color: "bg-violet-400", label: "Aisle", border: "border-violet-400" },
  { color: "bg-muted/50", label: "Booked", border: "border-muted" },
  { color: "bg-emerald-500", label: "Selected", border: "border-emerald-500" },
]

export function SeatLegend() {
  return (
    <div className="flex items-center gap-4">
      {LEGEND_ITEMS.map(item => (
        <div key={item.label} className="flex items-center gap-1.5">
          <span className={cn("h-3 w-3 rounded border", item.border, item.color === "bg-emerald-500" ? "bg-emerald-500" : "")} />
          <span className="text-[10px] text-muted-foreground">{item.label}</span>
        </div>
      ))}
    </div>
  )
}

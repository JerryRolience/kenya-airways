"use client"

import { SeatData } from "@/types/seat"
import { cn } from "@/lib/utils"
import { Armchair } from "lucide-react"

interface SeatCardProps {
  seat: SeatData
  passengerName: string
  passengerIndex: number
  onRemove?: () => void
}

const POSITION_LABELS: Record<string, string> = {
  WINDOW: "Window",
  MIDDLE: "Middle",
  AISLE: "Aisle",
}

const POSITION_COLORS: Record<string, string> = {
  WINDOW: "text-lime-700 dark:text-lime-300 bg-lime-50 dark:bg-lime-950/40 border-lime-200 dark:border-lime-800/50",
  MIDDLE: "text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800/50",
  AISLE: "text-violet-700 dark:text-violet-300 bg-violet-50 dark:bg-violet-950/40 border-violet-200 dark:border-violet-800/50",
}

export function SeatCard({ seat, passengerName, passengerIndex, onRemove }: SeatCardProps) {
  return (
    <div className={cn("flex items-center gap-3 rounded-xl border p-3 transition-all", POSITION_COLORS[seat.position] || "border-border/60 bg-card")}>
      {/* Seat icon */}
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-background border border-border/60 shrink-0">
        <Armchair className="h-5 w-5 text-foreground" />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground">
          Passenger {passengerIndex + 1}: {passengerName}
        </p>
        <p className="text-xs text-muted-foreground">
          Seat <span className="font-bold text-foreground">{seat.seatNumber}</span> · {POSITION_LABELS[seat.position] || seat.position} · Row {seat.row}
        </p>
      </div>

      {/* Remove button */}
      {onRemove && (
        <button onClick={onRemove} className="text-xs text-muted-foreground hover:text-destructive transition-colors shrink-0 hover:cursor-pointer" title="Change seat">
          Change
        </button>
      )}
    </div>
  )
}

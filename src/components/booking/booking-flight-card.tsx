"use client"

import { format } from "date-fns"
import { Plane, Clock, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { ClassType } from "../../../generated/prisma/enums"

interface BookingFlightCardProps {
  flightNumber: string
  departureTime: Date
  arrivalTime: Date
  from: string // airport code
  to: string
  fromCity: string
  toCity: string
  direction?: "outbound" | "return"
  classType: ClassType
}

const CLASS_LABELS: Record<ClassType, string> = {
  EXECUTIVE: "Executive (Class A)",
  MIDDLE: "Middle (Class B)",
  ECONOMY: "Economy (Class C)",
}

function formatDuration(dep: Date, arr: Date) {
  const mins = Math.round((arr.getTime() - dep.getTime()) / 60_000)
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return m > 0 ? `${h}h ${m}m` : `${h}h`
}

export function BookingFlightCard({ flightNumber, departureTime, arrivalTime, from, to, fromCity, toCity, direction, classType }: BookingFlightCardProps) {
  const isReturn = direction === "return"

  return (
    <div className={cn("rounded-2xl border bg-card p-4", isReturn ? "border-amber-200/60 dark:border-amber-900/40" : "border-border/60")}>
      {/* Direction label */}
      {direction && (
        <div className="flex items-center gap-2 mb-3">
          <span
            className={cn(
              "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full",
              isReturn ? "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300" : "bg-primary/10 text-primary",
            )}
          >
            {isReturn ? "Return flight" : "Outbound flight"}
          </span>
        </div>
      )}

      <div className="flex items-center gap-4">
        {/* Airline icon */}
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <Plane className="h-4 w-4 -rotate-45" strokeWidth={2.5} />
        </div>

        {/* Route + times */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3">
            {/* Departure */}
            <div className="text-center">
              <p className="text-lg font-bold text-foreground font-display leading-none tabular-nums">{format(departureTime, "HH:mm")}</p>
              <p className="text-xs font-semibold text-muted-foreground mt-0.5">{from}</p>
            </div>

            {/* Duration */}
            <div className="flex-1 flex flex-col items-center gap-1">
              <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                <Clock className="h-2.5 w-2.5" />
                {formatDuration(departureTime, arrivalTime)}
              </div>
              <div className="w-full flex items-center">
                <div className="h-px flex-1 bg-border" />
                <ArrowRight className="h-3 w-3 text-muted-foreground/40 mx-1" />
                <div className="h-px flex-1 bg-border" />
              </div>
              <p className="text-[10px] text-muted-foreground">Direct</p>
            </div>

            {/* Arrival */}
            <div className="text-center">
              <p className="text-lg font-bold text-foreground font-display leading-none tabular-nums">{format(arrivalTime, "HH:mm")}</p>
              <p className="text-xs font-semibold text-muted-foreground mt-0.5">{to}</p>
            </div>
          </div>

          {/* Cities */}
          <div className="flex items-center justify-between mt-1 px-0.5">
            <p className="text-[10px] text-muted-foreground/60">{fromCity}</p>
            <p className="text-[10px] text-muted-foreground/60">{toCity}</p>
          </div>
        </div>
      </div>

      {/* Meta row */}
      <div className="flex items-center gap-3 mt-3 pt-3 border-t border-border/50">
        <span className="text-xs font-semibold text-foreground">{flightNumber}</span>
        <span className="h-3 w-px bg-border" />
        <span className="text-xs text-muted-foreground">{format(departureTime, "EEE, d MMM yyyy")}</span>
        <span className="h-3 w-px bg-border" />
        <span className="text-xs text-muted-foreground">{CLASS_LABELS[classType]}</span>
      </div>
    </div>
  )
}

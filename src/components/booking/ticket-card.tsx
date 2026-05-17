"use client"

import { format } from "date-fns"
import { Plane, Ticket, Copy, Check } from "lucide-react"
import { ClassType, TicketStatus, Title } from "../../../generated/prisma/enums"
import { cn } from "@/lib/utils"
import { useState } from "react"

interface TicketCardProps {
  ticketNumber: string
  status: TicketStatus
  issuedAt: Date
  // Passenger
  title: Title | null
  firstName: string
  lastName: string
  passportNumber: string
  nationality: string
  seatNumber?: string | null
  // Flight
  flightNumber: string
  departureTime: Date
  arrivalTime: Date
  from: string
  to: string
  fromCity: string
  toCity: string
  classType: ClassType
  direction?: "outbound" | "return"
}

const STATUS_STYLES: Record<TicketStatus, { label: string; className: string }> = {
  ACTIVE: { label: "Active", className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300" },
  USED: { label: "Used", className: "bg-muted text-muted-foreground" },
  CANCELLED: { label: "Cancelled", className: "bg-destructive/10 text-destructive" },
}

const CLASS_SHORT: Record<ClassType, string> = {
  EXECUTIVE: "Class A",
  MIDDLE: "Class B",
  ECONOMY: "Class C",
}

export function TicketCard({
  ticketNumber,
  status,
  issuedAt,
  title,
  firstName,
  lastName,
  passportNumber,
  nationality,
  seatNumber,
  flightNumber,
  departureTime,
  arrivalTime,
  from,
  to,
  fromCity,
  toCity,
  classType,
  direction,
}: TicketCardProps) {
  const [copied, setCopied] = useState(false)

  const copyTicketNumber = async () => {
    await navigator.clipboard.writeText(ticketNumber)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const durationMins = Math.round((arrivalTime.getTime() - departureTime.getTime()) / 60_000)
  const h = Math.floor(durationMins / 60)
  const m = durationMins % 60
  const duration = m > 0 ? `${h}h ${m}m` : `${h}h`

  const statusStyle = STATUS_STYLES[status]

  return (
    <div className={cn("rounded-2xl border bg-card overflow-hidden", status === "CANCELLED" ? "border-border/40 opacity-70" : "border-border/60")}>
      {/* Top strip — ticket header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-border/50 bg-muted/30">
        <div className="flex items-center gap-2">
          <Ticket className="h-3.5 w-3.5 text-muted-foreground" />
          <button onClick={copyTicketNumber} className="flex items-center gap-1.5 group" title="Copy ticket number">
            <span className="text-xs font-mono font-semibold text-foreground tracking-wider">{ticketNumber}</span>
            {copied ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3 text-muted-foreground/50 group-hover:text-muted-foreground transition-colors" />}
          </button>
        </div>
        <div className="flex items-center gap-2">
          {direction && (
            <span
              className={cn(
                "text-[10px] font-semibold px-2 py-0.5 rounded-full",
                direction === "return" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300" : "bg-primary/10 text-primary",
              )}
            >
              {direction === "return" ? "Return" : "Outbound"}
            </span>
          )}
          <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full", statusStyle.className)}>{statusStyle.label}</span>
        </div>
      </div>

      <div className="px-5 py-4">
        {/* Passenger info */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-base font-bold text-foreground">
              {title} {firstName} {lastName}
            </p>
            <div className="flex items-center gap-2 mt-0.5">
              <p className="text-xs text-muted-foreground font-mono">{passportNumber}</p>
              <span className="h-3 w-px bg-border" />
              <p className="text-xs text-muted-foreground">{nationality}</p>
            </div>
          </div>
          {seatNumber && (
            <div className="text-right">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Seat</p>
              <p className="text-lg font-bold text-foreground font-display">{seatNumber}</p>
            </div>
          )}
        </div>

        {/* Dashed separator — mimics tear-off ticket */}
        <div className="relative my-4">
          <div className="border-t border-dashed border-border" />
          <div className="absolute -left-5 -top-2 h-4 w-4 rounded-full bg-background border border-border" />
          <div className="absolute -right-5 -top-2 h-4 w-4 rounded-full bg-background border border-border" />
        </div>

        {/* Flight details */}
        <div className="flex items-center gap-3">
          {/* Departure */}
          <div className="text-center min-w-13">
            <p className="text-xl font-bold text-foreground font-display tabular-nums leading-none">{format(departureTime, "HH:mm")}</p>
            <p className="text-xs font-bold text-foreground mt-0.5">{from}</p>
            <p className="text-[10px] text-muted-foreground/60">{fromCity}</p>
          </div>

          {/* Route line */}
          <div className="flex-1 flex flex-col items-center gap-1">
            <p className="text-[10px] text-muted-foreground">{duration}</p>
            <div className="w-full flex items-center gap-0.5">
              <div className="h-px flex-1 bg-border" />
              <Plane className="h-3 w-3 text-muted-foreground/50 -rotate-45" />
              <div className="h-px flex-1 bg-border" />
            </div>
            <p className="text-[10px] text-muted-foreground">{flightNumber}</p>
          </div>

          {/* Arrival */}
          <div className="text-center min-w-13">
            <p className="text-xl font-bold text-foreground font-display tabular-nums leading-none">{format(arrivalTime, "HH:mm")}</p>
            <p className="text-xs font-bold text-foreground mt-0.5">{to}</p>
            <p className="text-[10px] text-muted-foreground/60">{toCity}</p>
          </div>
        </div>

        {/* Bottom meta */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/50">
          <p className="text-[10px] text-muted-foreground">{format(departureTime, "EEE, d MMM yyyy")}</p>
          <p className="text-[10px] text-muted-foreground">{CLASS_SHORT[classType]}</p>
          <p className="text-[10px] text-muted-foreground">Issued {format(issuedAt, "d MMM yyyy")}</p>
        </div>
      </div>
    </div>
  )
}

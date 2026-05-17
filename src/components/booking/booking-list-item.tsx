"use client"

import { BookingListItem } from "@/types/booking"
import { format } from "date-fns"
import { Plane, ArrowRight, ChevronRight, Users } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { BookingStatus, ClassType, PaymentStatus } from "../../../generated/prisma/enums"

interface BookingListItemProps {
  booking: BookingListItem
}

const STATUS_STYLES: Record<BookingStatus, { label: string; className: string }> = {
  PENDING: { label: "Pending", className: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300" },
  CONFIRMED: { label: "Confirmed", className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300" },
  CANCELLED: { label: "Cancelled", className: "bg-muted text-muted-foreground" },
  COMPLETED: { label: "Completed", className: "bg-primary/10 text-primary" },
}

const CLASS_LABELS: Record<ClassType, string> = {
  EXECUTIVE: "Executive",
  MIDDLE: "Middle",
  ECONOMY: "Economy",
}

export function BookingListItemCard({ booking }: BookingListItemProps) {
  const statusStyle = STATUS_STYLES[booking.status]
  const isCancelled = booking.status === BookingStatus.CANCELLED

  return (
    <Link
      href={`/bookings/${booking.reference}`}
      className={cn(
        "group flex items-center gap-4 rounded-2xl border bg-card px-5 py-4 transition-all duration-200",
        "hover:border-border hover:shadow-sm",
        isCancelled ? "border-border/40 opacity-70" : "border-border/60",
      )}
    >
      {/* Left accent */}
      <div className={cn("hidden sm:flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", isCancelled ? "bg-muted" : "bg-primary/10")}>
        <Plane className={cn("h-4 w-4 -rotate-45", isCancelled ? "text-muted-foreground" : "text-primary")} strokeWidth={2.5} />
      </div>

      {/* Main content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3">
          {/* Route */}
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-sm font-bold text-foreground">{booking.outboundFlight.fromCity}</span>
              <ArrowRight className="h-3 w-3 text-muted-foreground/50 shrink-0" />
              <span className="text-sm font-bold text-foreground">{booking.outboundFlight.toCity}</span>
              {booking.isReturnTrip && <span className="text-[10px] font-medium text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/40 px-1.5 py-0.5 rounded-full">Return</span>}
            </div>

            {/* Flight meta */}
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className="text-xs text-muted-foreground">{booking.outboundFlight.flightNumber}</span>
              <span className="h-3 w-px bg-border" />
              <span className="text-xs text-muted-foreground">{format(booking.outboundFlight.departureTime, "EEE d MMM yyyy")}</span>
              <span className="h-3 w-px bg-border" />
              <span className="text-xs text-muted-foreground">{format(booking.outboundFlight.departureTime, "HH:mm")}</span>
              {booking.returnFlight && (
                <>
                  <span className="h-3 w-px bg-border" />
                  <span className="text-xs text-muted-foreground">Return {format(booking.returnFlight.departureTime, "d MMM")}</span>
                </>
              )}
            </div>

            {/* Passengers + class */}
            <div className="flex items-center gap-2 mt-1">
              <Users className="h-3 w-3 text-muted-foreground/50" />
              <span className="text-xs text-muted-foreground">
                {booking.passengerCount} pax · {CLASS_LABELS[booking.classType]}
              </span>
            </div>
          </div>

          {/* Right: status + price */}
          <div className="shrink-0 text-right">
            <span className={cn("inline-block text-[10px] font-semibold px-2.5 py-1 rounded-full", statusStyle.className)}>{statusStyle.label}</span>
            <p className="text-sm font-bold text-foreground font-display mt-1.5">KES {booking.totalAmount.toLocaleString()}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              {booking.paymentStatus === PaymentStatus.PAID ? "Paid" : booking.paymentStatus === PaymentStatus.REFUNDED ? "Refunded" : "Unpaid"}
            </p>
          </div>
        </div>

        {/* Reference */}
        <div className="flex items-center gap-1 mt-2">
          <span className="text-[10px] font-mono text-muted-foreground/60">{booking.reference}</span>
          <span className="text-[10px] text-muted-foreground/40">· {format(booking.createdAt, "d MMM yyyy")}</span>
        </div>
      </div>

      {/* Chevron */}
      <ChevronRight className="h-4 w-4 text-muted-foreground/40 shrink-0 group-hover:text-muted-foreground transition-colors" />
    </Link>
  )
}

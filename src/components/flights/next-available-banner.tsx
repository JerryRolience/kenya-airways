"use client"

import { NextAvailableFlight, FlightSearchParams } from "@/types/flights"
import { Calendar, ArrowRight, AlertCircle } from "lucide-react"
import { format, addDays } from "date-fns"
import { cn } from "@/lib/utils"

interface NextAvailableBannerProps {
  nextAvailable: NextAvailableFlight
  searchParams: FlightSearchParams
}

export function NextAvailableBanner({ nextAvailable, searchParams }: NextAvailableBannerProps) {
  const isReturnTrip = searchParams.tripType === "return"

  // Calculate if return date needs to be advanced
  const newOutboundDate = new Date(nextAvailable.date)
  const currentReturnDate = searchParams.returnDate ? new Date(searchParams.returnDate) : null

  // If return date exists but is now BEFORE or SAME as new outbound date,
  // advance it to the day after the new outbound
  const needsReturnAdjustment = isReturnTrip && currentReturnDate && currentReturnDate <= newOutboundDate
  const adjustedReturnDate = needsReturnAdjustment ? addDays(newOutboundDate, 1) : currentReturnDate

  // Build URL params with corrected dates
  const params = new URLSearchParams({
    from: searchParams.from,
    to: searchParams.to,
    date: format(newOutboundDate, "yyyy-MM-dd"),
    class: searchParams.class,
    passengers: String(searchParams.passengers),
    tripType: searchParams.tripType,
    highlight: nextAvailable.flightId,
    // Use adjusted return date if needed, otherwise keep original
    ...(isReturnTrip && adjustedReturnDate ? { returnDate: format(adjustedReturnDate, "yyyy-MM-dd") } : {}),
  })

  return (
    <div className="border-b border-amber-200/60 bg-amber-50/50 dark:bg-amber-950/20 dark:border-amber-900/40">
      <div className="mx-auto max-w-7xl px-4 py-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          {/* Left: Message */}
          <div className="flex items-start gap-3">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/50 mt-0.5">
              <Calendar className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="space-y-1.5">
              {/* Main message */}
              <div className="text-sm">
                <span className="font-semibold text-amber-900 dark:text-amber-200">All flights full on your selected date.</span>{" "}
                <span className="text-amber-700/80 dark:text-amber-300/70">
                  Next available: <span className="font-medium text-amber-800 dark:text-amber-200">{format(newOutboundDate, "EEEE, d MMMM")}</span> — {nextAvailable.flightNumber} · KES{" "}
                  {nextAvailable.priceKES.toLocaleString()} per person
                  {" · "}
                  {nextAvailable.availableSeats} seat
                  {nextAvailable.availableSeats !== 1 ? "s" : ""} available
                </span>
              </div>

              {/* Return date adjustment warning */}
              {needsReturnAdjustment && (
                <div className={cn("flex items-start gap-1.5 rounded-lg px-3 py-2", "bg-amber-100/60 dark:bg-amber-900/40", "border border-amber-200/60 dark:border-amber-800/50")}>
                  <AlertCircle className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
                  <p className="text-xs text-amber-700 dark:text-amber-300 leading-relaxed">
                    <span className="font-medium">Return date adjusted:</span> Your original return date ({format(currentReturnDate!, "d MMM")}) is now before the new departure. It has been moved to{" "}
                    <span className="font-semibold">{format(adjustedReturnDate!, "EEE, d MMM")}</span>. You can change this on the results page.
                  </p>
                </div>
              )}

              {/* Return date preserved message */}
              {isReturnTrip && !needsReturnAdjustment && currentReturnDate && (
                <p className="text-[11px] text-amber-600/70 dark:text-amber-400/50">Return date preserved: {format(currentReturnDate, "EEE, d MMM")}</p>
              )}
            </div>
          </div>

          {/* Right: CTA */}
          <a
            href={`/flights?${params.toString()}`}
            className={cn(
              "shrink-0 inline-flex items-center gap-1.5 text-xs font-semibold",
              "text-amber-700 dark:text-amber-300",
              "hover:text-amber-800 dark:hover:text-amber-200",
              "border border-amber-300/60 dark:border-amber-700/50",
              "rounded-xl px-4 py-2",
              "bg-amber-100/50 dark:bg-amber-900/30",
              "hover:bg-amber-100 dark:hover:bg-amber-900/50",
              "transition-all duration-200",
            )}
          >
            View available flights
            <ArrowRight className="h-3 w-3" />
          </a>
        </div>
      </div>
    </div>
  )
}

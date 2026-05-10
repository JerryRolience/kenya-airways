"use client"

import { FlightSearchParams, NextAvailableFlight, TripTypeOptions } from "@/types/flights"
import { Calendar, ArrowRight } from "lucide-react"
import { format } from "date-fns"

interface NextAvailableBannerProps {
  nextAvailable: NextAvailableFlight
  searchParams: FlightSearchParams
}

export function NextAvailableBanner({ nextAvailable, searchParams }: NextAvailableBannerProps) {
  // Build a proper search URL using the next available flight's date.
  // We keep from/to/class/passengers the same — only the date changes
  const params = new URLSearchParams({
    from: searchParams.from,
    to: searchParams.to,
    date: format(new Date(nextAvailable.date), "yyyy-MM-dd"),
    class: searchParams.class,
    passengers: String(searchParams.passengers),
    tripType: searchParams.tripType || TripTypeOptions[0],
    // Pass the specific flightId so the page can highlight or auto-select it
    highlight: nextAvailable.flightId,
  })

  return (
    <div className="border-b border-amber-200/60 bg-amber-50/50 dark:bg-amber-950/20 dark:border-amber-900/40">
      <div className="mx-auto max-w-7xl px-4 py-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="flex items-start sm:items-center gap-2.5">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/50 mt-0.5 sm:mt-0">
              <Calendar className="h-3 w-3 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="text-sm">
              <span className="font-semibold text-amber-900 dark:text-amber-200">Flights full on this date.</span>{" "}
              <span className="text-amber-700/80 dark:text-amber-300/70">
                Next available: <span className="font-medium text-amber-800 dark:text-amber-200">{format(new Date(nextAvailable.date), "EEEE, d MMMM")}</span> — {nextAvailable.flightNumber} · KES{" "}
                {nextAvailable.priceKES.toLocaleString()} per person
              </span>
            </div>
          </div>

          <a
            href={`/flights?${params.toString()}`}
            className="shrink-0 inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 dark:text-amber-300 hover:text-amber-800 dark:hover:text-amber-200 border border-amber-300/60 dark:border-amber-700/50 rounded-xl px-3 py-1.5 bg-amber-100/50 dark:bg-amber-900/30 hover:bg-amber-100 dark:hover:bg-amber-900/50 transition-all"
          >
            View flight
            <ArrowRight className="h-3 w-3" />
          </a>
        </div>
      </div>
    </div>
  )
}

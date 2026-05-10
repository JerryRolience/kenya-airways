"use client"

import { FlightSearchResult, FlightSearchParams } from "@/types/flights"
import { FlightCard } from "./flight-card"

interface FlightListProps {
  flights: FlightSearchResult[]
  searchParams: FlightSearchParams
  direction: "outbound" | "return"
  highlightFlightId: string | null
}

export function FlightList({ flights, searchParams, direction, highlightFlightId }: FlightListProps) {
  if (flights.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border/60 py-12 text-center">
        <p className="text-sm text-muted-foreground">No flights found for this criteria.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {flights.map(flight => (
        <FlightCard key={flight.id} flight={flight} searchParams={searchParams} direction={direction} isHighlighted={flight.id === highlightFlightId} />
      ))}
    </div>
  )
}

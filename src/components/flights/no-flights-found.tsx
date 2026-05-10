"use client"

import { Button } from "@/components/ui/button"
import { FlightSearchParams } from "@/types/flights"
import { RotateCcw, SearchX } from "lucide-react"

interface NoFlightsFoundProps {
  searchParams: FlightSearchParams
  onClearFilters: () => void
}

function formatClassLabel(cabinClass: string): string {
  const labels: Record<string, string> = {
    EXECUTIVE: "Executive",
    MIDDLE: "Middle",
    ECONOMY: "Economy",
  }
  return labels[cabinClass] || cabinClass
}

export function NoFlightsFound({ searchParams, onClearFilters }: NoFlightsFoundProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-card">
        <SearchX className="h-7 w-7 text-muted-foreground/50" />
      </div>
      <h2 className="mt-5 text-lg font-semibold text-foreground font-display">No flights match your filters</h2>

      {/* Show what the user searched for */}
      <p className="mt-2 text-sm text-muted-foreground max-w-xs leading-relaxed">
        We couldn&apos;t find any flights from <span className="font-medium text-foreground">{searchParams.from}</span> to <span className="font-medium text-foreground">{searchParams.to}</span> in{" "}
        <span className="font-medium text-foreground">{formatClassLabel(searchParams.class)}</span> class matching your current filters.
      </p>

      <p className="mt-1 text-xs text-muted-foreground/70">Try adjusting or clearing your filters to see all available flights on this route.</p>

      <Button onClick={onClearFilters} variant="outline" className="mt-5 rounded-xl h-9 px-4 text-xs gap-2">
        <RotateCcw className="h-3.5 w-3.5" />
        Clear filters
      </Button>
    </div>
  )
}

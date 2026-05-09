"use client"

import { FlightSearchParams } from "@/types/flights"
import { SearchX, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"

interface NoFlightsFoundProps {
  searchParams: FlightSearchParams
  onClearFilters: () => void
}

export function NoFlightsFound({ searchParams, onClearFilters }: NoFlightsFoundProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-card">
        <SearchX className="h-7 w-7 text-muted-foreground/50" />
      </div>
      <h2 className="mt-5 text-lg font-semibold text-foreground font-display">No flights match your filters</h2>
      <p className="mt-2 text-sm text-muted-foreground max-w-xs leading-relaxed">Try adjusting or clearing your filters to see all available flights on this route.</p>
      <Button onClick={onClearFilters} variant="outline" className="mt-5 rounded-xl h-9 px-4 text-xs gap-2">
        <RotateCcw className="h-3.5 w-3.5" />
        Clear filters
      </Button>
    </div>
  )
}

"use client"

import { cn } from "@/lib/utils"
import { FlightSearchParams, FlightSearchResponse } from "@/types/flights"
import Link from "next/link"
import { useCallback, useMemo, useState } from "react"
import { FlightFilters } from "./flight-filters"
import { FlightList } from "./flight-list"
import { FlightSearchError } from "./flight-search-error"
import { NextAvailableBanner } from "./next-available-banner"
import { NoFlightsFound } from "./no-flights-found"
import { SearchSummaryBar } from "./search-summary-bar"
import { SortDropdown } from "./sort-dropdown"

interface FlightsPageClientProps {
  searchResults: FlightSearchResponse | null
  searchParams: FlightSearchParams
  highlightFlightId?: string | null
  error?: string
}

export function FlightsPageClient({ searchResults, searchParams, highlightFlightId = null, error }: FlightsPageClientProps) {
  const [sortBy, setSortBy] = useState<"price" | "duration" | "departureTime">("departureTime")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [directOnly, setDirectOnly] = useState(false)
  const [selectedAirlines, setSelectedAirlines] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState<[number, number]>(() => {
    const min = searchResults?.filters.priceRange.min || 0
    const max = searchResults?.filters.priceRange.max || 0
    if (max <= 0) return [0, 500000]
    if (max === min) return [min, min * 2 || 100000]
    return [min, max]
  })

  const sortFlights = useCallback(
    <T extends { seatClasses: { priceKES: number }[]; duration: number; departureTime: Date; isDirect?: boolean; flightNumber?: string }>(flights: T[]): T[] => {
      return [...flights]
        .filter(f => {
          if (directOnly && !f.isDirect) return false
          if (selectedAirlines.length > 0 && !selectedAirlines.some(a => f.flightNumber?.startsWith(a))) return false
          const price = f.seatClasses[0]?.priceKES ?? 0
          return price >= priceRange[0] && price <= priceRange[1]
        })
        .sort((a, b) => {
          let diff = 0
          if (sortBy === "price") diff = (a.seatClasses[0]?.priceKES ?? 0) - (b.seatClasses[0]?.priceKES ?? 0)
          else if (sortBy === "duration") diff = a.duration - b.duration
          else diff = new Date(a.departureTime).getTime() - new Date(b.departureTime).getTime()
          return sortOrder === "asc" ? diff : -diff
        })
    },
    [directOnly, selectedAirlines, priceRange, sortBy, sortOrder],
  )

  const filteredOutbound = useMemo(() => (searchResults ? sortFlights(searchResults.outboundFlights) : []), [searchResults, sortFlights])
  const filteredReturn = useMemo(() => (searchResults ? sortFlights(searchResults.returnFlights) : []), [searchResults, sortFlights])

  const totalResults = filteredOutbound.length + filteredReturn.length
  const filtersActive = directOnly || selectedAirlines.length > 0
  const isRoundTrip = searchParams.tripType === "return"

  if (error || !searchResults) {
    return <FlightSearchError searchParams={searchParams} error={error} />
  }

  return (
    <div className="min-h-screen bg-background">
      <SearchSummaryBar searchParams={searchParams} totalResults={totalResults} />

      {searchResults.nextAvailable && <NextAvailableBanner nextAvailable={searchResults.nextAvailable} searchParams={searchParams} />}

      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Filters Sidebar */}
          <aside className="lg:col-span-3">
            <FlightFilters
              filters={searchResults.filters}
              directOnly={directOnly}
              onDirectOnlyChange={setDirectOnly}
              selectedAirlines={selectedAirlines}
              onAirlinesChange={setSelectedAirlines}
              priceRange={priceRange}
              onPriceRangeChange={setPriceRange}
            />
          </aside>

          {/* Results */}
          <main className="lg:col-span-9 space-y-8">
            {/* Results header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-foreground">
                  {totalResults > 0 ? `${totalResults} flight${totalResults !== 1 ? "s" : ""} found` : filtersActive ? "No flights match your filters" : "No flights found"}
                </h2>
                {searchResults.cheapestPrice && totalResults > 0 && (
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    From <span className="font-semibold text-accent">KES {searchResults.cheapestPrice.toLocaleString()}</span> per person
                  </p>
                )}
              </div>
              {totalResults > 0 && <SortDropdown sortBy={sortBy} sortOrder={sortOrder} onSortByChange={setSortBy} onSortOrderChange={setSortOrder} />}
            </div>

            {/* Filtered-out empty state */}
            {filtersActive && totalResults === 0 && searchResults.outboundFlights.length > 0 ? (
              <NoFlightsFound
                searchParams={searchParams}
                onClearFilters={() => {
                  setDirectOnly(false)
                  setSelectedAirlines([])
                  const min = searchResults.filters.priceRange.min || 0
                  const max = searchResults.filters.priceRange.max || 500000
                  setPriceRange([min, max])
                }}
              />
            ) : (
              <>
                {/* Outbound flights */}
                {filteredOutbound.length > 0 && (
                  <section>
                    {isRoundTrip && <SectionLabel label="Outbound flights" from={searchParams.from} to={searchParams.to} />}
                    <FlightList flights={filteredOutbound} searchParams={searchParams} direction="outbound" highlightFlightId={highlightFlightId} />
                  </section>
                )}

                {/* Return flights */}
                {filteredReturn.length > 0 && (
                  <section>
                    <SectionLabel label="Return flights" from={searchParams.to} to={searchParams.from} />
                    <FlightList flights={filteredReturn} searchParams={searchParams} direction="return" highlightFlightId={highlightFlightId} />
                  </section>
                )}

                {/* No results at all */}
                {totalResults === 0 && (
                  <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 py-20 text-center">
                    <p className="text-sm font-medium text-foreground">No flights on this date</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Try a different date or class
                      {searchResults.nextAvailable ? " — see the banner above for the next available flight" : "."}
                    </p>
                    <Link href="/" className="mt-5 text-xs font-medium text-accent hover:underline">
                      Search again
                    </Link>
                  </div>
                )}

                {/* All full warning */}
                {searchResults.isAllFull && totalResults > 0 && (
                  <div className={cn("rounded-2xl border border-amber-200/60 bg-amber-50/40 px-5 py-4", "dark:border-amber-900/40 dark:bg-amber-950/20")}>
                    <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                      All <span className="font-semibold capitalize">{searchResults.searchParams.class.toLowerCase()}</span> seats are fully booked on this date.
                    </p>
                    {searchResults.nextAvailable && (
                      <p className="mt-1 text-xs text-amber-700/70 dark:text-amber-300/60">
                        The next available flight is on{" "}
                        <span className="font-medium text-amber-800 dark:text-amber-200">
                          {new Date(searchResults.nextAvailable.date).toLocaleDateString("en-US", {
                            weekday: "long",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                        .
                      </p>
                    )}
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}

function SectionLabel({ label, from, to }: { label: string; from: string; to: string }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">{label}</span>
      <span className="text-[11px] text-muted-foreground/40">
        {from} → {to}
      </span>
      <div className="flex-1 h-px bg-border/60" />
    </div>
  )
}

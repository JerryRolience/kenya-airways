"use client"

import { cn } from "@/lib/utils"
import { FlightSearchParams, FlightSearchResponse, FlightSearchResult } from "@/types/flights"
import { format } from "date-fns"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useCallback, useMemo, useRef, useState } from "react"
import { FlightFilters } from "./flight-filters"
import { FlightList } from "./flight-list"
import { FlightSearchError } from "./flight-search-error"
import { NextAvailableBanner } from "./next-available-banner"
import { NoFlightsFound } from "./no-flights-found"
import { ReturnStepPrompt } from "./return-step-prompt"
import { SearchSummaryBar } from "./search-summary-bar"
import { SelectionSummaryBar } from "./selection-summary-bar"
import { SortDropdown } from "./sort-dropdown"

interface FlightsPageClientProps {
  searchResults: FlightSearchResponse | null
  searchParams: FlightSearchParams
  highlightFlightId?: string | null
  error?: string
}

export function FlightsPageClient({ searchResults, searchParams, error, highlightFlightId }: FlightsPageClientProps) {
  const router = useRouter()

  //  Filter / sort state
  const [sortBy, setSortBy] = useState<"price" | "duration" | "departureTime">("departureTime")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [directOnly, setDirectOnly] = useState(false)
  const [selectedAirlines, setSelectedAirlines] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500_000])

  //  Return trip selection state
  const [selectedOutbound, setSelectedOutbound] = useState<FlightSearchResult | null>(null)
  const [selectedReturn, setSelectedReturn] = useState<FlightSearchResult | null>(null)
  const returnSectionRef = useRef<HTMLElement>(null)

  const isReturnTrip = searchParams.tripType === "return"

  //  Sort + filter helper
  const sortFlights = useCallback(
    <
      T extends {
        seatClasses: { priceKES: number }[]
        duration: number
        departureTime: Date
        isDirect?: boolean
        flightNumber?: string
      },
    >(
      flights: T[],
    ): T[] =>
      [...flights]
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
        }),
    [directOnly, selectedAirlines, priceRange, sortBy, sortOrder],
  )

  //  Memos — all hooks before any return
  const filteredOutbound = useMemo(() => (searchResults ? sortFlights(searchResults.outboundFlights) : []), [searchResults, sortFlights])
  const filteredReturn = useMemo(() => (searchResults ? sortFlights(searchResults.returnFlights) : []), [searchResults, sortFlights])

  const totalResults = filteredOutbound.length + filteredReturn.length
  const filtersActive = directOnly || selectedAirlines.length > 0

  //  Return trip handlers
  const handleOutboundSelect = (flight: FlightSearchResult) => {
    setSelectedOutbound(flight)
    setSelectedReturn(null)
    setTimeout(() => returnSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 150)
  }

  const handleReturnSelect = (flight: FlightSearchResult) => {
    setSelectedReturn(flight)
  }

  //  Confirm both legs → navigate to booking
  const handleConfirm = () => {
    if (!selectedOutbound) return

    const outboundSC = selectedOutbound.seatClasses[0]
    const returnSC = selectedReturn?.seatClasses[0]

    const p = new URLSearchParams({
      outboundId: selectedOutbound.id,
      flightNumber: selectedOutbound.flightNumber,
      class: searchParams.class,
      passengers: String(searchParams.passengers),
      from: selectedOutbound.departure.code,
      to: selectedOutbound.arrival.code,
      departDate: format(selectedOutbound.departureTime, "yyyy-MM-dd"),
      outboundPrice: String(outboundSC?.priceKES ?? 0),
      tripType: searchParams.tripType,
      ...(isReturnTrip && selectedReturn
        ? {
            returnId: selectedReturn.id,
            returnDate: format(selectedReturn.departureTime, "yyyy-MM-dd"),
            returnPrice: String(returnSC?.priceKES ?? 0),
          }
        : {}),
    })

    router.push(`/booking?${p.toString()}`)
  }

  //  Error state — after all hooks
  if (error || !searchResults) {
    return <FlightSearchError searchParams={searchParams} error={error} />
  }

  const showSelectionBar = isReturnTrip && selectedOutbound !== null

  return (
    <div className={cn("min-h-screen bg-background", showSelectionBar && "pb-24")}>
      <SearchSummaryBar searchParams={searchParams} totalResults={totalResults} />

      {searchResults.nextAvailable && <NextAvailableBanner nextAvailable={searchResults.nextAvailable} searchParams={searchParams} />}

      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Sidebar */}
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

          {/* Main */}
          <main className="lg:col-span-9 space-y-8">
            {/* Header */}
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

            {filtersActive && totalResults === 0 && searchResults.outboundFlights.length > 0 ? (
              <NoFlightsFound
                searchParams={searchParams}
                onClearFilters={() => {
                  setDirectOnly(false)
                  setSelectedAirlines([])
                  setPriceRange([0, 500_000])
                }}
              />
            ) : (
              <>
                {/* Outbound */}
                {filteredOutbound.length > 0 && (
                  <section>
                    {isReturnTrip && <SectionLabel label="Outbound flights" from={searchParams.from} to={searchParams.to} />}
                    <FlightList
                      flights={filteredOutbound}
                      searchParams={searchParams}
                      direction="outbound"
                      highlightFlightId={highlightFlightId}
                      selectedFlightId={selectedOutbound?.id ?? null}
                      onSelect={isReturnTrip ? handleOutboundSelect : undefined}
                    />
                  </section>
                )}

                {/* Return */}
                {isReturnTrip && filteredReturn.length > 0 && (
                  <section ref={returnSectionRef} className="scroll-mt-24">
                    <SectionLabel label="Return flights" from={searchParams.to} to={searchParams.from} />
                    {selectedOutbound && (
                      <div className="mb-4">
                        <ReturnStepPrompt selectedOutbound={selectedOutbound} />
                      </div>
                    )}
                    <FlightList flights={filteredReturn} searchParams={searchParams} direction="return" selectedFlightId={selectedReturn?.id ?? null} onSelect={handleReturnSelect} />
                  </section>
                )}

                {/* Zero results */}
                {totalResults === 0 && (
                  <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 py-20 text-center">
                    <p className="text-sm font-medium text-foreground">No flights on this date</p>
                    <p className="mt-1 text-xs text-muted-foreground">Try a different date or class{searchResults.nextAvailable ? " — see the banner above for the next available flight" : "."}</p>
                    <Link href="/" className="mt-5 text-xs font-medium text-accent hover:underline">
                      Search again
                    </Link>
                  </div>
                )}

                {/* All full */}
                {searchResults.isAllFull && totalResults > 0 && (
                  <div className={cn("rounded-2xl border border-amber-200/60 bg-amber-50/40 px-5 py-4", "dark:border-amber-900/40 dark:bg-amber-950/20")}>
                    <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                      All <span className="font-semibold capitalize">{searchResults.searchParams.class.toLowerCase()}</span> seats are fully booked on this date.
                    </p>
                    {searchResults.nextAvailable && (
                      <p className="mt-1 text-xs text-amber-700/70 dark:text-amber-300/60">
                        The next available flight is on{" "}
                        <span className="font-medium text-amber-800 dark:text-amber-200">
                          {new Date(searchResults.nextAvailable.date).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
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

      {/* Sticky bottom bar — return trips only, once outbound is selected */}
      {showSelectionBar && (
        <SelectionSummaryBar
          searchParams={searchParams}
          selectedOutbound={selectedOutbound}
          selectedReturn={selectedReturn}
          onConfirm={handleConfirm}
          onClearOutbound={() => {
            setSelectedOutbound(null)
            setSelectedReturn(null)
          }}
          onClearReturn={() => setSelectedReturn(null)}
        />
      )}
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

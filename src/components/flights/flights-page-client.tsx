"use client"

import { searchFlights } from "@/actions/flights/search-flights"
import { cn } from "@/lib/utils"
import { FlightSearchParams, FlightSearchResponse, FlightSearchResult } from "@/types/flights"
import { format } from "date-fns"
import { AlertTriangle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useCallback, useMemo, useRef, useState, useTransition } from "react"
import { FlightFilters } from "./flight-filters"
import { FlightList } from "./flight-list"
import { NextAvailableBanner } from "./next-available-banner"
import { NoFlightsFound } from "./no-flights-found"
import { ReturnEmptyState } from "./return-empty-state"
import { ReturnStepPrompt } from "./return-step-prompt"
import { SearchSummaryBar } from "./search-summary-bar"
import { SelectionSummaryBar } from "./selection-summary-bar"
import { SortDropdown } from "./sort-dropdown"
import { OutboundEmptyState } from "./outbound-empty-state"

interface FlightsPageClientProps {
  searchResults: FlightSearchResponse | null
  searchParams: FlightSearchParams
  error?: string
  highlightFlightId?: string | null
}

export function FlightsPageClient({ searchResults: initialResults, searchParams, error, highlightFlightId }: FlightsPageClientProps) {
  const router = useRouter()

  //  Live results state (can be updated when user changes dates)
  const [searchResults, setSearchResults] = useState(initialResults)
  const [isPending, startTransition] = useTransition()

  //  Filter / sort state
  const [sortBy, setSortBy] = useState<"price" | "duration" | "departureTime">("departureTime")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [directOnly, setDirectOnly] = useState(false)
  const [selectedAirlines, setSelectedAirlines] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState<[number, number]>([initialResults?.filters.priceRange.min || 0, initialResults?.filters.priceRange.max || 500_000])

  //  Return trip selection state
  const [selectedOutbound, setSelectedOutbound] = useState<FlightSearchResult | null>(null)
  const [selectedReturn, setSelectedReturn] = useState<FlightSearchResult | null>(null)
  const returnSectionRef = useRef<HTMLElement>(null)

  const isReturnTrip = searchParams.tripType === "return"

  //  Scroll helper
  const scrollToReturnSection = () => {
    setTimeout(() => {
      returnSectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }, 150)
  }

  //  Sort + filter function
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

  const filteredOutbound = useMemo(() => (searchResults ? sortFlights(searchResults.outboundFlights) : []), [searchResults, sortFlights])
  const filteredReturn = useMemo(() => (searchResults ? sortFlights(searchResults.returnFlights) : []), [searchResults, sortFlights])

  const totalResults = filteredOutbound.length + filteredReturn.length
  const filtersActive = directOnly || selectedAirlines.length > 0

  //  Handle next available outbound (from banner click)
  // The NextAvailableBanner already handles return date adjustment in the URL
  // This function is for the in-page return date changer
  const handleReturnDateChange = (newReturnDate: Date) => {
    startTransition(async () => {
      const result = await searchFlights({
        ...searchParams,
        returnDate: newReturnDate,
      } as FlightSearchParams)

      if (result.success && result.data) {
        setSearchResults(result.data)
        setSelectedReturn(null)
        scrollToReturnSection()
      }
    })
  }

  //  Return trip handlers
  const handleOutboundSelect = (flight: FlightSearchResult) => {
    setSelectedOutbound(flight)
    setSelectedReturn(null)
    scrollToReturnSection()
  }

  const handleReturnSelect = (flight: FlightSearchResult) => {
    setSelectedReturn(flight)
  }

  //  Confirm → navigate to booking
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
            returnFlightNumber: selectedReturn.flightNumber,
            returnDate: format(selectedReturn.departureTime, "yyyy-MM-dd"),
            returnPrice: String(returnSC?.priceKES ?? 0),
          }
        : {}),
    })

    router.push(`/booking?${p.toString()}`)
  }

  //  Determine return empty state reason
  const returnEmptyReason = useMemo(() => {
    if (!searchResults) return null

    if (searchResults.isNoReturnRoute) return "no-route" as const

    const returns = searchResults.returnFlights
    if (returns.length === 0) return "no-flights" as const

    const allFull = returns.every(f => f.seatClasses[0]?.isFull)
    if (allFull) return "all-full" as const

    const noneEnough = returns.every(f => f.seatClasses[0] && f.seatClasses[0].availableSeats < searchParams.passengers)
    if (noneEnough) return "not-enough-seats" as const

    return null
  }, [searchResults, searchParams.passengers])

  //  Error state
  if (error || !searchResults) {
    return (
      <div className="min-h-screen bg-background">
        <SearchSummaryBar searchParams={searchParams} totalResults={0} />
        <div className="mx-auto max-w-md px-4 py-24 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-destructive/20 bg-destructive/5">
            <AlertTriangle className="h-6 w-6 text-destructive" />
          </div>
          <h1 className="mt-5 font-display text-xl font-semibold text-foreground">Search failed</h1>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{error ?? "We couldn't load flights for this route. Please try again."}</p>
          <Link href="/" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors">
            Back to search
          </Link>
        </div>
      </div>
    )
  }

  const showSelectionBar = isReturnTrip && selectedOutbound !== null

  return (
    <div className={cn("min-h-screen bg-background", showSelectionBar && "pb-24")}>
      {/*  Search Summary Bar  */}
      <SearchSummaryBar searchParams={searchResults.searchParams} totalResults={totalResults} />

      {/*  Next Available Banner (outbound)  */}
      {searchResults.nextAvailable && <NextAvailableBanner nextAvailable={searchResults.nextAvailable} searchParams={searchResults.searchParams} />}

      {/*  Main Content  */}
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
            {/* Results Header */}

            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-foreground">
                  {totalResults > 0
                    ? `${totalResults} flight${totalResults !== 1 ? "s" : ""} found`
                    : filtersActive
                      ? "No flights match your filters"
                      : !searchResults.isNoOutboundRoute || !searchResults.isNoReturnRoute
                        ? "No flights found"
                        : null}
                </h2>
                {searchResults.cheapestPrice && totalResults > 0 && (
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    From <span className="font-semibold text-accent">KES {searchResults.cheapestPrice.toLocaleString()}</span> per person
                  </p>
                )}
              </div>
              {totalResults > 0 && <SortDropdown sortBy={sortBy} sortOrder={sortOrder} onSortByChange={setSortBy} onSortOrderChange={setSortOrder} />}
            </div>

            {/* Filtered-out empty state (filters active but nothing matches) */}
            {filtersActive && totalResults === 0 && searchResults.outboundFlights.length > 0 ? (
              <NoFlightsFound
                searchParams={searchResults.searchParams}
                onClearFilters={() => {
                  setDirectOnly(false)
                  setSelectedAirlines([])
                  setPriceRange([searchResults.filters.priceRange.min || 0, searchResults.filters.priceRange.max || 500_000])
                }}
              />
            ) : (
              <>
                {/*  Outbound Flights  */}
                {filteredOutbound.length > 0 ? (
                  <section>
                    {isReturnTrip && <SectionLabel label="Outbound flights" from={searchResults.searchParams.from} to={searchResults.searchParams.to} />}
                    <FlightList
                      flights={filteredOutbound}
                      searchParams={searchResults.searchParams}
                      direction="outbound"
                      highlightFlightId={highlightFlightId}
                      selectedFlightId={selectedOutbound?.id ?? null}
                      onSelect={isReturnTrip ? handleOutboundSelect : undefined}
                    />
                  </section>
                ) : searchResults.isNoOutboundRoute ? (
                  /* No route exists at all */
                  <OutboundEmptyState reason="no-route" searchParams={searchResults.searchParams} />
                ) : filtersActive ? (
                  /* Flights exist but are filtered out */
                  <NoFlightsFound
                    searchParams={searchResults.searchParams}
                    onClearFilters={() => {
                      setDirectOnly(false)
                      setSelectedAirlines([])
                      setPriceRange([searchResults.filters.priceRange.min || 0, searchResults.filters.priceRange.max || 500_000])
                    }}
                  />
                ) : null}

                {/*  Return Flights Section  */}
                {isReturnTrip && (
                  <section ref={returnSectionRef} className="scroll-mt-24">
                    <SectionLabel label="Return flights" from={searchResults.searchParams.to} to={searchResults.searchParams.from} />

                    {/* Return step prompt (shows selected outbound) */}
                    {selectedOutbound && !returnEmptyReason && (
                      <div className="mb-4">
                        <ReturnStepPrompt selectedOutbound={selectedOutbound} />
                      </div>
                    )}

                    {/* Return empty state (handles all 3 problem scenarios) */}
                    {returnEmptyReason ? (
                      <ReturnEmptyState
                        reason={returnEmptyReason}
                        searchParams={searchResults.searchParams}
                        nextAvailableReturn={searchResults.nextAvailableReturn}
                        onDateChange={handleReturnDateChange}
                        isLoading={isPending}
                      />
                    ) : (
                      /* Normal return flight list */
                      <FlightList flights={filteredReturn} searchParams={searchResults.searchParams} direction="return" selectedFlightId={selectedReturn?.id ?? null} onSelect={handleReturnSelect} />
                    )}
                  </section>
                )}

                {/*  Zero outbound results  */}
                {totalResults === 0 && !filtersActive && !searchResults.isNoOutboundRoute && (
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

                {/*  All full warning  */}
                {searchResults.isAllFull && totalResults > 0 && (
                  <div className={cn("rounded-2xl border border-amber-200/60 bg-amber-50/40 px-5 py-4", "dark:border-amber-900/40 dark:bg-amber-950/20")}>
                    <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                      All <span className="font-semibold capitalize">{searchResults.searchParams.class.toLowerCase()}</span> seats are fully booked on this date.
                    </p>
                    {searchResults.nextAvailable && (
                      <p className="mt-1 text-xs text-amber-700/70 dark:text-amber-300/60">
                        Next available:{" "}
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

      {/*  Selection Summary Bar (sticky bottom for return trips)  */}
      {showSelectionBar && (
        <SelectionSummaryBar
          searchParams={searchResults.searchParams}
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

//  Section Label Component
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

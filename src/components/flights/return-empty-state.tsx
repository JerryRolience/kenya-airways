"use client"

import { NextAvailableFlight, FlightSearchParams } from "@/types/flights"
import { CalendarX, ArrowRight, Calendar, RefreshCw, Route, Plane } from "lucide-react"
import { format } from "date-fns"
import { useState } from "react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { DatePickerInput } from "../global/date-picker"

interface ReturnEmptyStateProps {
  reason: "no-flights" | "all-full" | "not-enough-seats" | "no-route"
  searchParams: FlightSearchParams
  nextAvailableReturn: NextAvailableFlight | null
  onDateChange: (newDate: Date) => void
  isLoading?: boolean
}

const REASON_COPY = {
  "no-flights": {
    title: "No return flights on this date",
    desc: "There are no flights operating on this route for your return date.",
    icon: CalendarX,
  },
  "all-full": {
    title: "All return flights are fully booked",
    desc: "Every flight on your return date is sold out in this class.",
    icon: CalendarX,
  },
  "not-enough-seats": {
    title: "Not enough seats on this date",
    desc: "No single flight has enough seats for your party on this date.",
    icon: CalendarX,
  },
  "no-route": {
    title: "No return flights on this route",
    desc: "Kenya Airways doesn't currently operate flights in this direction.",
    icon: Route,
  },
}

export function ReturnEmptyState({ reason, searchParams, nextAvailableReturn, onDateChange, isLoading = false }: ReturnEmptyStateProps) {
  const copy = REASON_COPY[reason]
  const Icon = copy.icon

  // Inline date picker state (only for non-no-route reasons)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [pickedDate, setPickedDate] = useState<string>(searchParams.returnDate ? format(new Date(searchParams.returnDate), "yyyy-MM-dd") : "")

  // Min date is the day after outbound departure
  const minDate = format(new Date(new Date(searchParams.date).getTime() + 86_400_000), "yyyy-MM-dd")

  const handleDateSubmit = () => {
    if (!pickedDate) return
    onDateChange(new Date(pickedDate))
    setShowDatePicker(false)
  }

  const handleUseNextAvailable = () => {
    if (!nextAvailableReturn) return
    onDateChange(new Date(nextAvailableReturn.date))
  }

  //  "no-route" specific: Convert to one-way URL
  const oneWayParams = new URLSearchParams({
    from: searchParams.from,
    to: searchParams.to,
    date: format(searchParams.date, "yyyy-MM-dd"),
    class: searchParams.class,
    passengers: String(searchParams.passengers),
    tripType: "one-way",
  })

  return (
    <div className="rounded-2xl border border-dashed border-border bg-muted/20 overflow-hidden">
      {/*  Main message  */}
      <div className="flex flex-col items-center text-center px-6 py-10">
        <div className={cn("flex h-12 w-12 items-center justify-center rounded-2xl border", reason === "no-route" ? "border-amber-200 bg-amber-50" : "border-border bg-background")}>
          <Icon className={cn("h-5 w-5", reason === "no-route" ? "text-amber-600" : "text-muted-foreground/50")} />
        </div>
        <h3 className="mt-4 text-sm font-semibold text-foreground">{copy.title}</h3>
        <p className="mt-1.5 text-xs text-muted-foreground max-w-xs leading-relaxed">
          {copy.desc}{" "}
          {searchParams.returnDate && reason !== "no-route" && (
            <span className="font-medium text-foreground/70">
              ({format(new Date(searchParams.returnDate), "EEE d MMM, yyyy")} · {searchParams.class.toLowerCase()} · {searchParams.passengers} pax)
            </span>
          )}
        </p>
      </div>

      {/*  Actions  */}
      {reason === "no-route" ? (
        /*  No Route: Special actions  */
        <div className="px-6 pb-6">
          <div className="rounded-xl border border-border bg-muted px-4 py-5">
            <div className="flex items-start gap-3 mb-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-100">
                <Route className="h-4 w-4 text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-amber-800">This route doesn&apos;t have return flights</p>
                <p className="mt-1 text-xs text-amber-700 leading-relaxed">
                  Kenya Airways doesn&apos;t currently operate flights from <span className="font-medium">{searchParams.to}</span> to <span className="font-medium">{searchParams.from}</span>.
                  Here&apos;s what you can do:
                </p>
              </div>
            </div>

            <ul className="space-y-2 mb-5">
              <li className="flex items-start gap-2 text-xs text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-accent shrink-0 mt-1.5" />
                <span>
                  Book as a <span className="font-medium text-foreground">one-way trip</span> and arrange your return separately
                </span>
              </li>
              <li className="flex items-start gap-2 text-xs text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-accent shrink-0 mt-1.5" />
                <span>
                  Check <span className="font-medium text-foreground">alternative nearby airports</span> that may have return flights
                </span>
              </li>
              <li className="flex items-start gap-2 text-xs text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-accent shrink-0 mt-1.5" />
                <span>
                  Contact <span className="font-medium text-foreground">customer support</span> for multi-city or open-jaw booking options
                </span>
              </li>
            </ul>

            <div className="flex gap-2">
              <Link
                href={`/flights?${oneWayParams.toString()}`}
                className="flex-1 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors text-center inline-flex items-center justify-center gap-1.5"
              >
                <Plane className="h-3.5 w-3.5" />
                Book as one-way
              </Link>
              <Link href="/#booking-card" className="flex-1 rounded-xl border border-border/60 px-4 py-2.5 text-xs font-semibold text-foreground hover:bg-muted/50 transition-colors text-center">
                Modify search
              </Link>
            </div>
          </div>
        </div>
      ) : (
        /*  Other reasons: Next available + Date picker  */
        <>
          <div className="h-px bg-border/50 mx-6" />

          <div className="px-6 py-5 space-y-3">
            {/* Next available suggestion */}
            {nextAvailableReturn && (
              <div className="rounded-xl border border-primary/20 bg-primary/5 px-4 py-3.5">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 mt-0.5">
                      <Calendar className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-primary leading-none mb-1">Next available return flight</p>
                      <p className="text-sm text-foreground">
                        <span className="font-semibold">{format(new Date(nextAvailableReturn.date), "EEEE, d MMMM")}</span>
                        {" · "}
                        <span className="text-muted-foreground">{nextAvailableReturn.flightNumber}</span>
                        {" · "}
                        <span className="font-semibold text-accent">KES {nextAvailableReturn.priceKES.toLocaleString()}</span>
                        <span className="text-muted-foreground text-xs"> / person</span>
                      </p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        {nextAvailableReturn.availableSeats} seat
                        {nextAvailableReturn.availableSeats !== 1 ? "s" : ""} available
                        {searchParams.passengers > 1 && ` · enough for ${searchParams.passengers} passengers`}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleUseNextAvailable}
                    disabled={isLoading}
                    className={cn(
                      "shrink-0 inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold transition-all",
                      "bg-primary text-primary-foreground hover:bg-primary/90",
                      "disabled:opacity-50 disabled:cursor-not-allowed hover:cursor-pointer",
                    )}
                  >
                    {isLoading ? (
                      <RefreshCw className="h-3 w-3 animate-spin" />
                    ) : (
                      <>
                        Use this date
                        <ArrowRight className="h-3 w-3" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Try a different date */}
            <div className="rounded-xl border border-border/60 bg-background px-4 py-3.5">
              <div className="flex items-center justify-between mb-0">
                <div className="flex items-center gap-2">
                  <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-xs font-semibold text-foreground">Try a different return date</span>
                </div>
                {!showDatePicker && (
                  <button onClick={() => setShowDatePicker(true)} className="text-xs font-medium text-accent hover:text-accent/80 transition-colors hover:cursor-pointer">
                    Choose date
                  </button>
                )}
              </div>

              {showDatePicker && (
                <div className="mt-3 flex items-center gap-2">
                  <DatePickerInput
                    defaultDate={pickedDate ? new Date(pickedDate) : undefined}
                    minDate={new Date(minDate)}
                    onChange={date => {
                      setPickedDate(format(date, "yyyy-MM-dd"))
                    }}
                    className="flex-1"
                  />

                  <button
                    onClick={handleDateSubmit}
                    disabled={!pickedDate || isLoading}
                    className={cn(
                      "h-9 px-4 rounded-xl text-xs font-semibold transition-all",
                      "bg-primary text-primary-foreground hover:bg-primary/90",
                      "disabled:opacity-40 disabled:cursor-not-allowed hover:cursor-pointer",
                    )}
                  >
                    {isLoading ? <RefreshCw className="h-3 w-3 animate-spin" /> : "Search"}
                  </button>
                  <button
                    onClick={() => setShowDatePicker(false)}
                    className="h-9 px-3 rounded-xl text-xs text-muted-foreground hover:text-foreground border border-border/60 hover:border-border transition-all hover:cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

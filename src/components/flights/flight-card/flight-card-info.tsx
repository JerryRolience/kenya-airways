"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { FlightSearchParams, FlightSearchResult } from "@/types/flights"
import { AlertCircle, Check, Coffee, Luggage, Plane, Users, Wifi } from "lucide-react"
import { ClassType } from "../../../../generated/prisma/enums"
import { FlightCardTimeAndRoute } from "./flight-card-time-and-route"
import { useRouter } from "next/navigation"
import { getAvailabilityState } from "./utils"
import { ErrorHandler } from "@/components/global/error-handler"
import { format } from "date-fns"

interface FlightCardInfoProps {
  flight: FlightSearchResult
  searchParams: FlightSearchParams
  direction: "outbound" | "return"
  isSelected?: boolean
  // Present on return trips — stores selection in parent instead of navigating
  onSelect?: (flight: FlightSearchResult) => void
}

export function FlightCardInfo({ flight, searchParams, direction, isSelected, onSelect }: FlightCardInfoProps) {
  const router = useRouter()
  const seatClass = flight.seatClasses[0]
  const availState = seatClass ? getAvailabilityState(seatClass.availableSeats, seatClass.isFull, seatClass.hasEnoughSeats) : null

  // Card is only interactive when there are enough seats for the full party
  const isBookable = seatClass && !seatClass.isFull && seatClass.hasEnoughSeats

  const handleSelect = () => {
    if (!isBookable) {
      if (seatClass?.isFull) {
        ErrorHandler({
          title: "Flight Unavailable",
          description: "You cannot select this flight as there are no seats available in the chosen class.",
          action: "error",
        })
      } else if (!seatClass?.hasEnoughSeats) {
        ErrorHandler({
          title: "Flight Unavailable",
          description: `Only ${seatClass?.availableSeats} seat${seatClass?.availableSeats !== 1 ? "s" : ""} available — you need ${searchParams.passengers}.`,
          action: "error",
        })
      }
      return
    }

    // Return trip — hand control back to parent to manage state
    if (onSelect) {
      onSelect(flight)
      return
    }

    // One-way — navigate straight to booking
    const p = new URLSearchParams({
      outboundId: flight.id,
      flightNumber: flight.flightNumber,
      class: searchParams.class,
      passengers: String(searchParams.passengers),
      from: flight.departure.code,
      to: flight.arrival.code,
      departDate: format(flight.departureTime, "yyyy-MM-dd"),
      outboundPrice: String(seatClass!.priceKES),
      direction,
      tripType: searchParams.tripType,
    })

    router.push(`/booking?${p.toString()}`)
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
      {/* Left: airline + flight number */}
      <div className="sm:w-32 shrink-0">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shrink-0">
            <Plane className="h-3.5 w-3.5 -rotate-45" strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-xs font-bold text-foreground tracking-wide">{flight.flightNumber}</p>
            <p className="text-[10px] text-muted-foreground">{flight.isDirect ? "Non-stop" : `${flight.stopsCount} ${flight.stopsCount === 1 ? "stop" : "stops"}`}</p>
          </div>
        </div>
      </div>

      {/* Centre: times + route */}
      <FlightCardTimeAndRoute flight={flight} />

      {/* Desktop Amenities */}
      <div className="hidden lg:flex items-center gap-3 sm:w-20 justify-center">
        {searchParams.class === ClassType.EXECUTIVE && (
          <>
            <div title="Lounge access" className="flex flex-col items-center gap-0.5">
              <Coffee className="h-3.5 w-3.5 text-muted-foreground/50" />
              <span className="text-[9px] text-muted-foreground/50">Lounge</span>
            </div>
            <div title="WiFi" className="flex flex-col items-center gap-0.5">
              <Wifi className="h-3.5 w-3.5 text-muted-foreground/50" />
              <span className="text-[9px] text-muted-foreground/50">WiFi</span>
            </div>
          </>
        )}
        <div title="Baggage included" className="flex flex-col items-center gap-0.5">
          <Luggage className="h-3.5 w-3.5 text-muted-foreground/50" />
          <span className="text-[9px] text-muted-foreground/50">Bag</span>
        </div>
      </div>

      {/* Right: price + CTA */}
      <div className="sm:w-36 shrink-0 flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 sm:gap-1.5 border-t sm:border-t-0 sm:border-l border-border/50 pt-4 sm:pt-0 sm:pl-5">
        {seatClass ? (
          <>
            <div className="sm:text-right">
              <p className="text-xl font-bold text-foreground font-display leading-none">
                {seatClass.priceKES.toLocaleString("en-KE", {
                  style: "currency",
                  currency: "KES",
                  minimumFractionDigits: 0,
                })}
              </p>
              <p className="text-[10px] text-muted-foreground mt-0.5">per person</p>
            </div>

            {/*  Availability indicator  */}
            <div className="hidden sm:block mt-1 text-right">
              {availState === "full" && (
                <div className="flex items-center justify-end gap-1 text-[10px] text-destructive/70">
                  <AlertCircle className="h-3 w-3" />
                  Sold out
                </div>
              )}

              {/* New: not enough seats for party */}
              {availState === "not-enough" && (
                <div className="flex flex-col items-end gap-0.5">
                  <div className="flex items-center gap-1 text-[10px] text-amber-600">
                    <Users className="h-3 w-3" />
                    Only {seatClass.availableSeats} seat{seatClass.availableSeats !== 1 ? "s" : ""}
                  </div>
                  <p className="text-[10px] text-muted-foreground">Need {searchParams.passengers}</p>
                </div>
              )}

              {availState === "critical" && (
                <div className="flex items-center gap-1.5 justify-end">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                  <span className="text-[10px] font-medium text-amber-600">
                    {seatClass.availableSeats} seat{seatClass.availableSeats !== 1 ? "s" : ""} left
                  </span>
                </div>
              )}

              {availState === "low" && (
                <div className="flex items-center gap-1.5 justify-end">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                  <span className="text-[10px] font-medium text-amber-500">{seatClass.availableSeats} seats left</span>
                </div>
              )}

              {availState === "available" && (
                <div className="flex items-center gap-1.5 justify-end">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <span className="text-[10px] font-medium text-emerald-600">Available</span>
                </div>
              )}
            </div>

            {/*  CTA button  */}
            {availState === "full" ? (
              <div className="flex items-center gap-1 text-xs text-destructive/70">
                <AlertCircle className="h-3 w-3" />
                Sold out
              </div>
            ) : availState === "not-enough" ? (
              //  Not-enough-seats disabled state — informational, not a ghost button
              <div className="rounded-xl border border-amber-200/60 bg-amber-50/40 dark:bg-amber-950/20 dark:border-amber-900/40 px-3 py-1.5 text-center">
                <p className="text-[10px] font-semibold text-amber-700 dark:text-amber-300">
                  {seatClass.availableSeats}/{searchParams.passengers} seats
                </p>
                <p className="text-[9px] text-amber-600/70 dark:text-amber-400/60">not enough</p>
              </div>
            ) : isSelected ? (
              <Button
                onClick={handleSelect}
                size="sm"
                className="rounded-xl text-xs font-semibold h-8 px-4 bg-primary/10 text-primary border border-primary/20 hover:bg-primary/15 shadow-none hover:cursor-pointer"
              >
                <Check className="h-3 w-3 mr-1" />
                Selected
              </Button>
            ) : (
              <Button
                onClick={handleSelect}
                size="sm"
                className={cn(
                  "rounded-xl text-xs font-semibold h-8 px-4 shadow-none transition-all duration-200 hover:cursor-pointer",
                  availState === "critical" ? "bg-amber-500 hover:bg-amber-600 text-white" : "bg-primary hover:bg-primary/90 text-primary-foreground hover:-translate-y-px",
                )}
              >
                {availState === "critical" ? "Book now" : "Select"}
              </Button>
            )}
          </>
        ) : (
          <p className="text-xs text-muted-foreground">Unavailable</p>
        )}
      </div>
    </div>
  )
}

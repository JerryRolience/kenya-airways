"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { FlightSearchParams, FlightSearchResult } from "@/types/flights"
import { AlertCircle, Coffee, Luggage, Plane, Wifi } from "lucide-react"
import { ClassType } from "../../../../generated/prisma/enums"
import { FlightCardTimeAndRoute } from "./flight-card-time-and-route"
import { useRouter } from "next/navigation"
import { getAvailabilityMeta } from "./utils"
import { ErrorHandler } from "@/components/global/error-handler"
import { format } from "date-fns"

interface FlightCardInfoProps {
  flight: FlightSearchResult
  searchParams: FlightSearchParams
  direction: "outbound" | "return"
}

export function FlightCardInfo({ flight, searchParams, direction }: FlightCardInfoProps) {
  const router = useRouter()
  const seatClass = flight.seatClasses[0]
  const avail = seatClass ? getAvailabilityMeta(seatClass.availableSeats, seatClass.isFull) : null

  const isSelectable = seatClass && !seatClass.isFull

  const handleSelect = () => {
    if (!isSelectable) {
      ErrorHandler({
        title: "Flight Unavailable",
        description: "You cannot select this flight as there are no seats available in the chosen class.",
        action: "error",
      })
      return
    }

    const p = new URLSearchParams({
      flightId: flight.id,
      flightNumber: flight.flightNumber,
      class: searchParams.class,
      passengers: String(searchParams.passengers),
      from: flight.departure.code,
      to: flight.arrival.code,
      departDate: format(flight.departureTime, "yyyy-MM-dd"),
      price: String(seatClass!.priceKES),
      direction,
      tripType: searchParams.tripType,
      ...(searchParams.tripType === "return" && searchParams.returnDate ? { returnDate: format(searchParams.returnDate, "yyyy-MM-dd") } : {}),
    })
    router.push(`/booking/${flight.id}?${p.toString()}`)
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
            {/* Price */}
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

            {/* Availability indicator */}
            {avail && (
              <div className="hidden sm:flex items-center gap-1.5 mt-1">
                <span className={cn("h-1.5 w-1.5 rounded-full", avail.dot)} />
                <span className={cn("text-[10px] font-medium", avail.color)}>{avail.label}</span>
              </div>
            )}

            {/* CTA */}
            {seatClass.isFull ? (
              <div className="flex items-center gap-1 text-xs text-destructive/70">
                <AlertCircle className="h-3 w-3" />
                Sold out
              </div>
            ) : (
              <Button
                onClick={handleSelect}
                size="sm"
                className={cn(
                  "rounded-xl text-xs font-semibold h-8 px-4 transition-all duration-200 hover:cursor-pointer",
                  seatClass.availableSeats <= 3 ? "bg-amber-500 hover:bg-amber-600 text-white shadow-none" : "bg-primary hover:bg-primary/90 text-primary-foreground shadow-none hover:-translate-y-px",
                )}
              >
                {seatClass.availableSeats <= 3 ? "Book now" : "Select"}
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

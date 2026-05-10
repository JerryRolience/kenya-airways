"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { FlightSearchParams, FlightSearchResult } from "@/types/flights"
import { Check, Coffee, Info, Luggage, Wifi } from "lucide-react"
import { ClassType } from "../../../../generated/prisma/enums"
import { FlightDetailsSheet } from "./flight-details-sheet"
import { FlightCardInfo } from "./flight-card-info"

interface FlightCardProps {
  flight: FlightSearchResult
  searchParams: FlightSearchParams
  direction: "outbound" | "return"
  isHighlighted?: boolean
  isSelected?: boolean
  // Present on return trips — stores selection in parent instead of navigating
  onSelect?: (flight: FlightSearchResult) => void
}

export function FlightCard({ flight, searchParams, direction, isHighlighted = false, isSelected = false, onSelect }: FlightCardProps) {
  const seatClass = flight.seatClasses[0]
  const isSelectable = seatClass && !seatClass.isFull

  return (
    <div
      // scroll into view on mount if highlighted
      ref={el => {
        if (el && isHighlighted) {
          setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "center" }), 100)
        }
      }}
      className={cn(
        "group relative rounded-2xl border bg-card transition-all duration-200",
        isSelectable ? "cursor-pointer" : "opacity-60",
        !isSelected && !isHighlighted && "border-border/60 hover:border-border hover:shadow-sm",
        isHighlighted && !isSelected && "border-amber-400/60 ring-2 ring-amber-400/20 shadow-sm",
        isSelected && "border-white ring-2 ring-white bg-primary/2",
      )}
    >
      {/* Next available badge */}
      {isHighlighted && !isSelected && (
        <div className="absolute -top-2.5 left-4 z-10">
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-500 px-2.5 py-0.5 text-[10px] font-bold text-white shadow-sm">Next available</span>
        </div>
      )}

      {/* Selected badge */}
      {isSelected && (
        <div className="absolute -top-2.5 left-4 z-10">
          <span className="inline-flex items-center gap-1 rounded-full bg-primary px-2.5 py-0.5 text-[10px] font-bold text-primary-foreground shadow-sm">
            <Check className="h-2.5 w-2.5" />
            Selected
          </span>
        </div>
      )}

      {/* Left accent line */}
      <div
        className={cn(
          "absolute left-0 top-4 bottom-4 w-0.75 rounded-full",
          isSelected ? "bg-primary" : seatClass?.isFull ? "bg-border" : seatClass?.availableSeats && seatClass.availableSeats <= 3 ? "bg-amber-400" : "bg-accent",
        )}
      />

      <div className="pl-5 pr-5 py-5">
        {/*  TOP ROW: Flight info, times, amenities, price  */}
        <FlightCardInfo flight={flight} searchParams={searchParams} direction={direction} isSelected={isSelected} onSelect={onSelect} />

        {/*  BOTTOM ROW: View Details  */}
        <div className="mt-4">
          <div className="flex items-center justify-between">
            {/* Mobile amenities preview */}
            <div className="flex lg:hidden items-center gap-3">
              {searchParams.class === ClassType.EXECUTIVE && (
                <>
                  <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                    <Coffee className="h-3 w-3" />
                    Lounge
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                    <Wifi className="h-3 w-3" />
                    WiFi
                  </div>
                </>
              )}
              <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                <Luggage className="h-3 w-3" />
                Bag
              </div>
            </div>

            {/* View Details Button (Sheet Trigger) */}
            <FlightDetailsSheet flight={flight} searchParams={searchParams}>
              <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-colors ml-auto hover:cursor-pointer">
                <Info className="h-3.5 w-3.5 mr-1.5" />
                View details
              </Button>
            </FlightDetailsSheet>
          </div>
        </div>
      </div>
    </div>
  )
}

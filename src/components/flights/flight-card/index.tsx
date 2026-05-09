"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { FlightSearchParams, FlightSearchResult } from "@/types/flights"
import { Coffee, Info, Luggage, Wifi } from "lucide-react"
import { ClassType } from "../../../../generated/prisma/enums"
import { FlightDetailsSheet } from "./flight-details-sheet"
import { FlightCardInfo } from "./flight-card-info"

interface FlightCardProps {
  flight: FlightSearchResult
  searchParams: FlightSearchParams
  direction: "outbound" | "return"
}

export function FlightCard({ flight, searchParams, direction }: FlightCardProps) {
  const seatClass = flight.seatClasses[0]
  const isSelectable = seatClass && !seatClass.isFull

  return (
    <div
      className={cn("group relative rounded-2xl border bg-card transition-all duration-200", "hover:border-border hover:shadow-sm", isSelectable ? "border-border/60" : "border-border/40 opacity-70")}
    >
      {/* Left accent line */}
      <div
        className={cn(
          "absolute left-0 top-4 bottom-4 w-0.75 rounded-full",
          seatClass?.isFull ? "bg-border" : seatClass?.availableSeats && seatClass.availableSeats <= 3 ? "bg-amber-400" : "bg-accent",
        )}
      />

      <div className="pl-5 pr-5 py-5">
        {/*  TOP ROW: Flight info, times, amenities, price  */}
        <FlightCardInfo flight={flight} searchParams={searchParams} direction={direction} />

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

"use client"

import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ClassType } from "../../../../../generated/prisma/enums"
import { FlightDetailsBaggageAllowance } from "./flight-details-baggage-allowance"
import { FlightDetailsClassAmenities } from "./flight-details-class-amenities"
import { FlightDetailsFareRules } from "./flight-details-fare-rules"
import { FlightDetailsHeader } from "./flight-details-header"
import { FlightDetailsSheetProps } from "./types"
import { BAGGAGE_ALLOWANCES, CLASS_AMENITIES, FARE_RULES } from "./utils"

export function FlightDetailsSheet({ flight, searchParams, children }: FlightDetailsSheetProps) {
  const seatClass = flight.seatClasses[0]
  const cabinClass = searchParams.class as ClassType
  const amenities = CLASS_AMENITIES[cabinClass] || CLASS_AMENITIES.ECONOMY
  const baggage = BAGGAGE_ALLOWANCES[cabinClass] || BAGGAGE_ALLOWANCES.ECONOMY
  const fareRules = FARE_RULES[cabinClass] || FARE_RULES.ECONOMY

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-lg lg:max-w-xl overflow-y-auto p-0">
        {/* Header with gradient */}
        <FlightDetailsHeader flight={flight} searchParams={searchParams} />

        {/* Details body */}
        <div className="p-6 space-y-6">
          {/* Price summary */}
          {seatClass && (
            <div className="rounded-2xl bg-muted/50 border border-border/60 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">{cabinClass.charAt(0) + cabinClass.slice(1).toLowerCase()} Class</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Per passenger • Includes taxes & fees</p>
                </div>
                <p className="text-lg font-bold text-foreground font-display">KES {seatClass.priceKES.toLocaleString()}</p>
              </div>
            </div>
          )}

          {/* Amenities */}
          <FlightDetailsClassAmenities amenities={amenities} />

          <Separator />

          {/* Baggage allowance */}
          <FlightDetailsBaggageAllowance baggage={baggage} />

          <Separator />

          {/* Fare rules */}
          <FlightDetailsFareRules rules={fareRules} />
        </div>
      </SheetContent>
    </Sheet>
  )
}

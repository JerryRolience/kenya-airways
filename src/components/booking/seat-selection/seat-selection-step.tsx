"use client"

import { ErrorHandler } from "@/components/global/error-handler"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useFetchFlightSeats } from "@/hooks/booking/use-fetch-flight-seats"
import { SeatData } from "@/types/seat"
import { AlertCircle, ArrowLeft, ArrowRight } from "lucide-react"
import { useState } from "react"
import { ClassType } from "../../../../generated/prisma/enums"
import { SeatMap } from "./seat-map"

interface SeatSelectionStepProps {
  outboundFlightId: string
  outboundNumber: string
  passengerCount: number
  classType: ClassType
  onComplete: (outboundSeats: Record<number, SeatData>) => void
  onBack: () => void
  tripType: "outbound" | "return" | "return-final"
}

export function SeatSelectionStep({ outboundFlightId, passengerCount, classType, onComplete, onBack, tripType }: SeatSelectionStepProps) {
  const [selectedSeats, setSelectedSeats] = useState<Record<number, SeatData | null>>({})

  const { data: response, isLoading, isError, error, refetch } = useFetchFlightSeats(outboundFlightId)

  const seatMap = response?.data

  const handleSeatSelect = (passengerIndex: number, seat: SeatData) => {
    setSelectedSeats(prev => ({ ...prev, [passengerIndex]: seat }))
  }

  const handleSeatDeselect = (passengerIndex: number) => {
    setSelectedSeats(prev => ({ ...prev, [passengerIndex]: null }))
  }

  const handleContinue = () => {
    const allSelected = Object.keys(selectedSeats).length === passengerCount && Object.values(selectedSeats).every(s => s !== null && s !== undefined)

    if (!allSelected) {
      ErrorHandler({ title: "Please select a seat for each passenger.", action: "error" })
      return
    }

    onComplete(selectedSeats as Record<number, SeatData>)
  }

  // Loading State
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-48" />
        <div className="flex items-center gap-2 p-2 rounded-2xl bg-muted/50 border border-border/60">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-20" />
        </div>
        <Skeleton className="h-96 w-full rounded-2xl" />
      </div>
    )
  }

  // Error State
  if (isError || !seatMap) {
    return (
      <div className="text-center py-12">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10 mx-auto">
          <AlertCircle className="h-8 w-8 text-destructive" />
        </div>
        <h3 className="mt-5 text-lg font-semibold text-foreground font-display">Failed to load seat map</h3>
        <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">{error?.message || "We couldn't load the seat map for this flight."}</p>
        <div className="flex items-center justify-center gap-3 mt-5">
          <Button onClick={() => refetch()} variant="outline" size="sm" className="rounded-xl hover:cursor-pointer">
            Try again
          </Button>
          <Button onClick={onBack} variant="ghost" size="sm" className="rounded-xl hover:cursor-pointer">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Go back
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <SeatMap
        flightNumber={seatMap.flightNumber}
        aircraftType={seatMap.aircraftType}
        classes={seatMap.classes}
        selectedSeats={selectedSeats}
        onSeatSelect={handleSeatSelect}
        onSeatDeselect={handleSeatDeselect}
        activeClass={classType}
        passengerCount={passengerCount}
      />

      {/* Navigation */}
      <div className="flex items-center justify-between pt-2">
        <Button type="button" variant="ghost" onClick={onBack} className="rounded-xl text-sm text-muted-foreground hover:text-foreground hover:cursor-pointer">
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back
        </Button>

        <Button type="button" onClick={handleContinue} className="rounded-xl h-11 px-6 text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 hover:cursor-pointer">
          <span className="hidden md:inline">{tripType === "outbound" || tripType === "return-final" ? "Continue to review " : "Continue to return flight "}</span>
          <span className="inline md:hidden">{tripType === "outbound" || tripType === "return-final" ? "Continue to review " : "Continue"}</span>
          <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

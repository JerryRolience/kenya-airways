import { Badge } from "@/components/ui/badge"
import { SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { FlightSearchParams, FlightSearchResult } from "@/types/flights"
import { format } from "date-fns"
import { Clock, Plane } from "lucide-react"
import { ClassType } from "../../../../../generated/prisma/enums"

export function FlightDetailsHeader({ flight, searchParams }: { flight: FlightSearchResult; searchParams: FlightSearchParams }) {
  const formatDate = (date: Date) => format(date, "EEE, MMM d, yyyy")
  const formatTime = (date: Date) => format(date, "HH:mm")

  const cabinClass = searchParams.class as ClassType

  return (
    <div className="bg-linear-to-br from-primary via-primary/95 to-primary/90 text-primary-foreground p-6">
      <SheetHeader>
        <SheetTitle className="text-white font-display text-xl">Flight Details</SheetTitle>
      </SheetHeader>

      {/* Flight route overview */}
      <div className="mt-4 flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Plane className="h-5 w-5 -rotate-45 text-accent" />
          <div>
            <p className="font-bold text-lg">{flight.flightNumber}</p>
            <p className="text-xs text-primary-foreground/70">{flight.isDirect ? "Non-stop" : `${flight.stopsCount} stop(s)`}</p>
          </div>
        </div>
        <div className="flex-1" />
        <Badge variant="outline" className="border-accent/50 text-accent bg-accent/10 capitalize">
          {cabinClass.toLowerCase()}
        </Badge>
      </div>

      {/* Route timeline */}
      <div className="mt-6 flex items-center gap-3">
        <div className="text-center">
          <p className="text-3xl font-bold font-display tabular-nums">{formatTime(flight.departureTime)}</p>
          <p className="text-sm font-semibold mt-0.5">{flight.departure.code}</p>
          <p className="text-xs text-primary-foreground/60">{flight.departure.city}</p>
          <p className="text-xs text-primary-foreground/60 mt-0.5">{formatDate(flight.departureTime)}</p>
        </div>

        <div className="flex-1 flex flex-col items-center gap-1">
          <div className="flex items-center gap-1 text-xs font-medium text-primary-foreground/70">
            <Clock className="h-3 w-3" />
            {Math.floor(flight.duration / 60)}h {flight.duration % 60}m
          </div>
          <div className="w-full flex items-center">
            <div className="h-0.5 flex-1 bg-primary-foreground/30" />
            <Plane className="h-4 w-4 text-accent -rotate-45 mx-1" />
            <div className="h-0.5 flex-1 bg-primary-foreground/30" />
          </div>
          <p className="text-xs text-primary-foreground/60">Direct flight</p>
        </div>

        <div className="text-center">
          <p className="text-3xl font-bold font-display tabular-nums">{formatTime(flight.arrivalTime)}</p>
          <p className="text-sm font-semibold mt-0.5">{flight.arrival.code}</p>
          <p className="text-xs text-primary-foreground/60">{flight.arrival.city}</p>
          <p className="text-xs text-primary-foreground/60 mt-0.5">{formatDate(flight.arrivalTime)}</p>
        </div>
      </div>
    </div>
  )
}

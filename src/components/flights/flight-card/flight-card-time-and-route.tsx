import { FlightSearchResult } from "@/types/flights"
import { format } from "date-fns"
import { Clock } from "lucide-react"
import { formatDuration } from "./utils"

export function FlightCardTimeAndRoute({ flight }: { flight: FlightSearchResult }) {
  return (
    <div className="flex-1">
      <div className="flex items-center gap-3">
        {/* Departure */}
        <div className="text-center min-w-13">
          <p className="text-[22px] font-bold text-foreground font-display leading-none tabular-nums">{format(flight.departureTime, "HH:mm")}</p>
          <p className="text-xs font-semibold text-muted-foreground mt-1">{flight.departure.code}</p>
        </div>

        {/* Duration line */}
        <div className="flex-1 flex flex-col items-center gap-1.5 px-1">
          <div className="flex items-center gap-1 text-[10px] font-medium text-muted-foreground">
            <Clock className="h-2.5 w-2.5" />
            {formatDuration(flight.duration)}
          </div>
          <div className="w-full relative flex items-center">
            <div className="h-px flex-1 bg-border" />
            <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground/30 mx-0.5" />
            <div className="h-px flex-1 bg-border" />
          </div>
          <p className="text-[10px] text-muted-foreground">{flight.isDirect ? "Direct" : `via ${flight.stopsCount} ${flight.stopsCount === 1 ? "stop" : "stops"}`}</p>
        </div>

        {/* Arrival */}
        <div className="text-center min-w-13">
          <p className="text-[22px] font-bold text-foreground font-display leading-none tabular-nums">{format(flight.arrivalTime, "HH:mm")}</p>
          <p className="text-xs font-semibold text-muted-foreground mt-1">{flight.arrival.code}</p>
        </div>
      </div>

      {/* City names */}
      <div className="flex items-center justify-between mt-1.5 px-0.5">
        <p className="text-[10px] text-muted-foreground/60">{flight.departure.city}</p>
        <p className="text-[10px] text-muted-foreground/60">{flight.arrival.city}</p>
      </div>
    </div>
  )
}

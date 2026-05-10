"use client"

import { FlightSearchResult } from "@/types/flights"
import { Check, ArrowRight } from "lucide-react"
import { format } from "date-fns"

interface ReturnStepPromptProps {
  selectedOutbound: FlightSearchResult
}

/**
 * Shown between the outbound and return flight lists on a return trip,
 * once the user has selected their outbound flight.
 * Scrolls into view automatically.
 */
export function ReturnStepPrompt({ selectedOutbound }: ReturnStepPromptProps) {
  return (
    <div
      ref={el => {
        if (el) {
          // Small delay so the DOM has settled after state update
          setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "center" }), 100)
        }
      }}
      className="rounded-2xl border border-primary/20 bg-primary/5 px-5 py-4"
    >
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        {/* Confirmation of outbound */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
            <Check className="h-4 w-4 text-primary" strokeWidth={2.5} />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-primary leading-none mb-1">Outbound selected</p>
            <div className="flex items-center gap-1.5 text-sm text-foreground flex-wrap">
              <span className="font-semibold">{selectedOutbound.departure.code}</span>
              <ArrowRight className="h-3 w-3 text-muted-foreground/50 shrink-0" />
              <span className="font-semibold">{selectedOutbound.arrival.code}</span>
              <span className="text-muted-foreground">·</span>
              <span className="text-muted-foreground">{selectedOutbound.flightNumber}</span>
              <span className="text-muted-foreground">·</span>
              <span className="text-muted-foreground">{format(selectedOutbound.departureTime, "EEE d MMM, HH:mm")}</span>
            </div>
          </div>
        </div>

        {/* Instruction */}
        <div className="shrink-0 flex items-center gap-2 rounded-xl border border-primary/15 bg-primary/8 px-3 py-2">
          <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
          <p className="text-xs font-semibold text-primary">Now select your return flight below</p>
        </div>
      </div>
    </div>
  )
}

"use client"

import { FlightSearchResult, FlightSearchParams } from "@/types/flights"
import { format } from "date-fns"
import { Plane, ArrowRight, X, Check, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface SelectionSummaryBarProps {
  searchParams: FlightSearchParams
  selectedOutbound: FlightSearchResult | null
  selectedReturn: FlightSearchResult | null
  onConfirm: () => void
  onClearOutbound: () => void
  onClearReturn: () => void
}

function LegPill({ flight, label, onClear }: { flight: FlightSearchResult; label: string; onClear: () => void }) {
  const sc = flight.seatClasses[0]
  return (
    <div className="flex items-center gap-2 rounded-xl border border-border/60 bg-muted/40 px-3 py-2 min-w-0">
      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10">
        <Check className="h-3 w-3 text-primary" strokeWidth={2.5} />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground leading-none mb-0.5">{label}</p>
        <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
          <span>{flight.departure.code}</span>
          <ChevronRight className="h-2.5 w-2.5 text-muted-foreground/50" />
          <span>{flight.arrival.code}</span>
          <span className="text-muted-foreground font-normal">·</span>
          <span className="text-muted-foreground font-normal">{flight.flightNumber}</span>
          <span className="text-muted-foreground font-normal">·</span>
          <span>{format(flight.departureTime, "HH:mm")}</span>
          {sc && (
            <>
              <span className="text-muted-foreground font-normal">·</span>
              <span className="text-accent font-bold">KES {sc.priceKES.toLocaleString()}</span>
            </>
          )}
        </div>
      </div>
      <button
        onClick={onClear}
        className="shrink-0 ml-1 flex h-5 w-5 items-center justify-center rounded-full hover:cursor-pointer hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
        aria-label={`Remove ${label} flight`}
      >
        <X className="h-3 w-3" />
      </button>
    </div>
  )
}

function EmptyLeg({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-dashed border-border/50 px-3 py-2 min-w-0">
      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-border/60">
        <Plane className="h-2.5 w-2.5 text-muted-foreground/40 -rotate-45" />
      </div>
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/50 leading-none mb-0.5">{label}</p>
        <p className="text-xs text-muted-foreground/50">Select a flight above</p>
      </div>
    </div>
  )
}

export function SelectionSummaryBar({ searchParams, selectedOutbound, selectedReturn, onConfirm, onClearOutbound, onClearReturn }: SelectionSummaryBarProps) {
  const isReturn = searchParams.tripType === "return"
  const outboundPrice = selectedOutbound?.seatClasses[0]?.priceKES ?? 0
  const returnPrice = selectedReturn?.seatClasses[0]?.priceKES ?? 0
  const totalPerPax = outboundPrice + (isReturn ? returnPrice : 0)
  const totalAll = totalPerPax * searchParams.passengers

  const canConfirm = selectedOutbound !== null && (!isReturn || selectedReturn !== null)

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 border-t border-border/60 bg-background/95 backdrop-blur-xl shadow-[0_-4px_24px_-6px_rgba(0,0,0,0.08)]">
      <div className="mx-auto max-w-7xl px-4 py-3">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          {/*  Selected legs  */}
          <div className="flex flex-1 flex-wrap items-center gap-2 min-w-0">
            {selectedOutbound ? <LegPill flight={selectedOutbound} label={isReturn ? "Outbound" : "Flight"} onClear={onClearOutbound} /> : <EmptyLeg label={isReturn ? "Outbound" : "Flight"} />}

            {isReturn && (
              <>
                <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/30 shrink-0 hidden sm:block" />
                {selectedReturn ? <LegPill flight={selectedReturn} label="Return" onClear={onClearReturn} /> : <EmptyLeg label="Return" />}
              </>
            )}
          </div>

          {/*  Total + CTA  */}
          <div className="flex items-center gap-4 shrink-0">
            {totalPerPax > 0 && (
              <div className="text-right">
                <p className="text-[10px] text-muted-foreground leading-none mb-0.5">{searchParams.passengers > 1 ? `${searchParams.passengers} passengers` : "Total"}</p>
                <p className="text-base font-bold text-foreground font-display leading-none">KES {totalAll.toLocaleString()}</p>
                {searchParams.passengers > 1 && (
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    KES {totalPerPax.toLocaleString()} × {searchParams.passengers}
                  </p>
                )}
              </div>
            )}

            <button
              onClick={onConfirm}
              disabled={!canConfirm}
              className={cn(
                "h-10 px-5 rounded-xl text-sm font-semibold transition-all duration-200 hover:cursor-pointer",
                canConfirm ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:-translate-y-px shadow-sm" : "bg-muted text-muted-foreground cursor-not-allowed",
              )}
            >
              {canConfirm ? "Confirm selection" : isReturn && selectedOutbound ? "Pick return flight" : "Select a flight"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

"use client"

import { ClassType } from "../../../generated/prisma/enums"
import { cn } from "@/lib/utils"
import { Loader2, ShieldCheck, RefreshCw, Clock } from "lucide-react"

interface PriceSummaryProps {
  outboundPrice: number // per person
  returnPrice: number // per person, 0 for one-way
  passengers: number
  classType: ClassType
  isReturnTrip: boolean
  isSubmitting: boolean
  canConfirm: boolean
  onConfirm: () => void
  error?: string | null
}

const CLASS_LABELS: Record<ClassType, string> = {
  EXECUTIVE: "Executive",
  MIDDLE: "Middle",
  ECONOMY: "Economy",
}

export function PriceSummary({ outboundPrice, returnPrice, passengers, classType, isReturnTrip, isSubmitting, canConfirm, onConfirm, error }: PriceSummaryProps) {
  const outboundTotal = outboundPrice * passengers
  const returnTotal = returnPrice * passengers
  const grandTotal = outboundTotal + returnTotal

  return (
    <div className="rounded-2xl border border-border/60 bg-card overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-border/50">
        <h3 className="text-sm font-semibold text-foreground">Price summary</h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          {CLASS_LABELS[classType]} · {passengers} passenger{passengers !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Breakdown */}
      <div className="px-5 py-4 space-y-3">
        {/* Outbound */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-foreground font-medium">Outbound</p>
            <p className="text-[11px] text-muted-foreground">
              KES {outboundPrice.toLocaleString()} × {passengers}
            </p>
          </div>
          <p className="text-sm font-semibold text-foreground tabular-nums">KES {outboundTotal.toLocaleString()}</p>
        </div>

        {/* Return */}
        {isReturnTrip && returnPrice > 0 && (
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground font-medium">Return</p>
              <p className="text-[11px] text-muted-foreground">
                KES {returnPrice.toLocaleString()} × {passengers}
              </p>
            </div>
            <p className="text-sm font-semibold text-foreground tabular-nums">KES {returnTotal.toLocaleString()}</p>
          </div>
        )}

        {/* Divider */}
        <div className="h-px bg-border/60" />

        {/* Total */}
        <div className="flex items-center justify-between">
          <p className="text-sm font-bold text-foreground">Total</p>
          <p className="text-lg font-bold text-foreground font-display tabular-nums">KES {grandTotal.toLocaleString()}</p>
        </div>

        <p className="text-[10px] text-muted-foreground">All taxes and fees included</p>
      </div>

      {/* Error */}
      {error && (
        <div className="mx-5 mb-4 rounded-xl border border-destructive/30 bg-destructive/5 px-3 py-2.5">
          <p className="text-xs text-destructive leading-relaxed">{error}</p>
        </div>
      )}

      {/* CTA */}
      <div className="px-5 pb-5">
        <button
          onClick={onConfirm}
          disabled={!canConfirm || isSubmitting}
          className={cn(
            "w-full h-12 rounded-xl text-sm font-semibold transition-all duration-200",
            canConfirm && !isSubmitting ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:-translate-y-px shadow-sm" : "bg-muted text-muted-foreground cursor-not-allowed",
          )}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Processing booking…
            </span>
          ) : (
            `Confirm & Pay · KES ${grandTotal.toLocaleString()}`
          )}
        </button>
      </div>

      {/* Trust badges */}
      <div className="border-t border-border/50 px-5 py-4 space-y-2">
        {[
          { icon: ShieldCheck, text: "Secure payment processing" },
          { icon: RefreshCw, text: "Free cancellation up to 2hrs before departure" },
          { icon: Clock, text: "Instant booking confirmation" },
        ].map(({ icon: Icon, text }) => (
          <div key={text} className="flex items-center gap-2">
            <Icon className="h-3.5 w-3.5 text-muted-foreground/50 shrink-0" />
            <p className="text-[11px] text-muted-foreground">{text}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

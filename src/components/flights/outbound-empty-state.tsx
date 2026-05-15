"use client"

import { FlightSearchParams } from "@/types/flights"
import { Route, Search, Plane } from "lucide-react"
import { format } from "date-fns"
import Link from "next/link"

interface OutboundEmptyStateProps {
  reason: "no-route" | "no-flights"
  searchParams: FlightSearchParams
}

export function OutboundEmptyState({ reason, searchParams }: OutboundEmptyStateProps) {
  if (reason === "no-route") {
    return (
      <div className="rounded-2xl border border-dashed border-border/60  overflow-hidden">
        <div className="flex flex-col items-center text-center px-6 py-12">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-background">
            <Route className="h-6 w-6 text-muted-foreground/50" />
          </div>
          <h2 className="mt-5 font-display text-lg font-semibold text-foreground">No flights on this route</h2>
          <p className="mt-2 text-sm text-muted-foreground max-w-md leading-relaxed">
            Kenya Airways doesn&apos;t currently operate flights from <span className="font-medium text-foreground">{searchParams.from}</span> to{" "}
            <span className="font-medium text-foreground">{searchParams.to}</span>.
          </p>

          <div className="mt-6 rounded-xl border border-border/60 bg-muted px-5 py-4 max-w-sm">
            <p className="text-xs font-medium text-foreground mb-3">What you can do:</p>
            <ul className="space-y-2 text-left">
              <li className="flex items-start gap-2 text-xs text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-accent shrink-0 mt-1.5" />
                <span>
                  Check <span className="font-medium text-foreground">alternative nearby airports</span> that may serve this destination
                </span>
              </li>
              <li className="flex items-start gap-2 text-xs text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-accent shrink-0 mt-1.5" />
                <span>
                  Try a <span className="font-medium text-foreground">different destination</span> or adjust your travel plans
                </span>
              </li>
              <li className="flex items-start gap-2 text-xs text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-accent shrink-0 mt-1.5" />
                <span>
                  Contact <span className="font-medium text-foreground">customer support</span> for assistance with multi-city routing
                </span>
              </li>
            </ul>
          </div>

          <div className="mt-6 flex gap-3">
            <Link href="/" className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors">
              <Search className="h-4 w-4" />
              Modify search
            </Link>
            <Link href="/help" className="inline-flex items-center gap-2 rounded-xl border border-border/60 px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-muted/50 transition-colors">
              Visit help center
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // "no-flights" — this is handled by NextAvailableBanner, but as a fallback:
  return (
    <div className="rounded-2xl border border-dashed border-border bg-muted/20 overflow-hidden">
      <div className="flex flex-col items-center text-center px-6 py-12">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-background">
          <Plane className="h-6 w-6 text-muted-foreground/50" />
        </div>
        <h2 className="mt-5 font-display text-lg font-semibold text-foreground">No outbound flights found</h2>
        <p className="mt-2 text-sm text-muted-foreground max-w-md leading-relaxed">
          There are no flights from <span className="font-medium text-foreground">{searchParams.from}</span> to <span className="font-medium text-foreground">{searchParams.to}</span> on{" "}
          <span className="font-medium text-foreground">{format(new Date(searchParams.date), "EEE, d MMM yyyy")}</span>.
        </p>
        <div className="mt-6">
          <Link href="/" className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors">
            <Search className="h-4 w-4" />
            Modify search
          </Link>
        </div>
      </div>
    </div>
  )
}

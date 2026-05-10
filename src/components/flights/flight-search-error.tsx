import { FlightSearchParams } from "@/types/flights"
import { AlertTriangle } from "lucide-react"
import Link from "next/link"
import { SearchSummaryBar } from "./search-summary-bar"

export function FlightSearchError({ searchParams, error }: { searchParams: FlightSearchParams; error?: string }) {
  return (
    <div className="min-h-screen bg-background">
      <SearchSummaryBar searchParams={searchParams} totalResults={0} />
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-destructive/20 bg-destructive/5">
          <AlertTriangle className="h-6 w-6 text-destructive" />
        </div>
        <h1 className="mt-5 font-display text-xl font-semibold text-foreground">Search failed</h1>
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{error ?? "We couldn't load flights for this route. Please try again."}</p>
        <Link href="/" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors">
          Back to search
        </Link>
      </div>
    </div>
  )
}

import { searchFlights } from "@/actions/flights/search-flights"
import { FlightSearchParams, TripTypeOptions } from "@/types/flights"
import { AlertTriangle, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { ClassType } from "../../../generated/prisma/enums"
import { FlightsPageClient } from "@/components/flights/flights-page-client"

interface FlightsPageProps {
  searchParams: Promise<{ [key: string]: string | undefined }>
}

export default async function FlightsPage({ searchParams }: FlightsPageProps) {
  const params = await searchParams

  // Validate required params
  if (!params.from || !params.to || !params.date) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 mx-auto">
            <AlertTriangle className="h-8 w-8 text-amber-600" />
          </div>
          <h1 className="mt-6 text-2xl font-bold text-accent font-display">Missing Search Parameters</h1>
          <p className="mt-2 text-muted-foreground">Please provide departure city, destination, and travel date to search for flights.</p>
          <Link href="/" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  const searchData: FlightSearchParams = {
    from: params.from,
    to: params.to,
    date: new Date(params.date),
    returnDate: params.returnDate ? new Date(params.returnDate) : undefined,
    tripType: (params.tripType as (typeof TripTypeOptions)[number]) || "one-way",
    class: (params.class as ClassType) || ClassType.ECONOMY,
    passengers: parseInt(params.passengers || "1"),
  }

  const highlightFlightId = params.highlight ?? null

  const result = await searchFlights(searchData)

  return <FlightsPageClient searchResults={result.success ? result.data! : null} searchParams={searchData} error={!result.success ? result.message : undefined} highlightFlightId={highlightFlightId} />
}

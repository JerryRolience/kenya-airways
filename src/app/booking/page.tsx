import { BookingWizard } from "@/components/booking/booking-wizard/booking-wizard"
import { ClassType } from "../../../generated/prisma/enums"
import { AlertTriangle, ArrowLeft } from "lucide-react"
import Link from "next/link"
import prisma from "@/lib/prisma"
import { BookingContext } from "@/components/booking/booking-wizard/types"

interface BookingPageProps {
  searchParams: Promise<{ [key: string]: string | undefined }>
}

export default async function BookingPage({ searchParams }: BookingPageProps) {
  const params = await searchParams

  const { outboundId, returnId, class: classParam, passengers, from, to, departDate, outboundPrice, returnPrice, tripType, returnDate } = params

  //  Validate required params
  if (!outboundId || !classParam || !passengers || !from || !to || !departDate || !outboundPrice) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="text-center max-w-md">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 dark:bg-amber-950/30 mx-auto">
            <AlertTriangle className="h-6 w-6 text-amber-600" />
          </div>
          <h1 className="mt-5 font-display text-xl font-semibold text-foreground">Missing booking details</h1>
          <p className="mt-2 text-sm text-muted-foreground">We couldn&apos;t load your booking details. Please go back and select your flight again.</p>
          <Link href="/flights" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to flights
          </Link>
        </div>
      </div>
    )
  }

  //  Fetch outbound flight details from DB
  const outboundFlight = await prisma.flight.findUnique({
    where: { id: outboundId },
    select: {
      id: true,
      flightNumber: true,
      departureTime: true,
      arrivalTime: true,
      departure: { select: { code: true, city: true } },
      arrival: { select: { code: true, city: true } },
    },
  })

  if (!outboundFlight) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="text-center max-w-md">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-destructive/20 bg-destructive/5 mx-auto">
            <AlertTriangle className="h-6 w-6 text-destructive" />
          </div>
          <h1 className="mt-5 font-display text-xl font-semibold text-foreground">Flight not found</h1>
          <p className="mt-2 text-sm text-muted-foreground">The selected flight could not be found. It may have been cancelled or removed.</p>
          <Link href="/flights" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Search again
          </Link>
        </div>
      </div>
    )
  }

  //  Fetch return flight (if round trip)
  let returnFlight = null
  const isReturnTrip = tripType === "return" && !!returnId

  if (isReturnTrip && returnId) {
    returnFlight = await prisma.flight.findUnique({
      where: { id: returnId },
      select: {
        id: true,
        flightNumber: true,
        departureTime: true,
        arrivalTime: true,
        departure: { select: { code: true, city: true } },
        arrival: { select: { code: true, city: true } },
      },
    })
  }

  //  Build booking context
  const context: BookingContext = {
    outboundFlightId: outboundFlight.id,
    outboundNumber: outboundFlight.flightNumber,
    outboundDep: outboundFlight.departureTime,
    outboundArr: outboundFlight.arrivalTime,
    outboundFrom: outboundFlight.departure.code,
    outboundTo: outboundFlight.arrival.code,
    outboundFromCity: outboundFlight.departure.city,
    outboundToCity: outboundFlight.arrival.city,
    outboundPrice: Number(outboundPrice),
    isReturnTrip,
    classType: classParam as ClassType,
    passengerCount: Math.min(Math.max(parseInt(passengers), 1), 9),

    ...(isReturnTrip && returnFlight
      ? {
          returnFlightId: returnFlight.id,
          returnNumber: returnFlight.flightNumber,
          returnDep: returnFlight.departureTime,
          returnArr: returnFlight.arrivalTime,
          returnFrom: returnFlight.departure.code,
          returnTo: returnFlight.arrival.code,
          returnFromCity: returnFlight.departure.city,
          returnToCity: returnFlight.arrival.city,
          returnPrice: Number(returnPrice ?? 0),
          returnDate: returnDate,
        }
      : {}),
  }

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <div className="mx-auto max-w-5xl px-4 py-10">
        {/* Page title */}
        <div className="mb-8">
          <h1 className="font-display text-2xl font-semibold text-foreground">Complete your booking</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {context.isReturnTrip ? "Round trip" : "One way"} · {context.outboundFrom} → {context.outboundTo} · {context.passengerCount} passenger{context.passengerCount !== 1 ? "s" : ""}
          </p>
        </div>

        <BookingWizard context={context} />
      </div>
    </div>
  )
}

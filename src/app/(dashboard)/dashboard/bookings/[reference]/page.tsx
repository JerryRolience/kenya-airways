import { fetchBooking } from "@/actions/bookings/fetch/fetch-booking"
import { BookingConfirmation } from "@/components/booking/booking-confirmation"
import { AlertTriangle, ArrowLeft } from "lucide-react"
import Link from "next/link"

interface BookingDetailPageProps {
  params: Promise<{ reference: string }>
  searchParams: Promise<{ new?: string }>
}

export default async function BookingDetailPage({ params, searchParams }: BookingDetailPageProps) {
  const { reference } = await params
  const { new: isNew } = await searchParams

  const result = await fetchBooking(reference)

  //  Error / not found
  if (!result.success || !result.data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="text-center max-w-md">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-destructive/20 bg-destructive/5 mx-auto">
            <AlertTriangle className="h-6 w-6 text-destructive" />
          </div>
          <h1 className="mt-5 font-display text-xl font-semibold text-foreground">Booking not found</h1>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{result.message ?? `No booking found with reference "${reference}". Please check the reference and try again.`}</p>
          <Link href="/bookings" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            My bookings
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-4 py-10">
        <BookingConfirmation booking={result.data} isNew={isNew === "1"} />
      </div>
    </div>
  )
}

"use client"

import { BookingDetail } from "@/types/booking"
import { TicketCard } from "./ticket-card"
import { BookingFlightCard } from "./booking-flight-card"
import { format } from "date-fns"
import { CheckCircle2, Copy, Check, Printer, CalendarPlus, ArrowRight, Settings } from "lucide-react"
import { useState } from "react"
import Link from "next/link"

interface BookingConfirmationProps {
  booking: BookingDetail
  isNew?: boolean // true when redirected straight from payment
}

export function BookingConfirmation({ booking, isNew = false }: BookingConfirmationProps) {
  const [copiedRef, setCopiedRef] = useState(false)

  const copyReference = async () => {
    await navigator.clipboard.writeText(booking.reference)
    setCopiedRef(true)
    setTimeout(() => setCopiedRef(false), 2000)
  }

  const handlePrint = () => window.print()

  const handleAddToCalendar = () => {
    const dep = booking.outboundFlight.departureTime
    const title = encodeURIComponent(`Kenya Airways ${booking.outboundFlight.flightNumber} – ${booking.reference}`)
    const start = format(dep, "yyyyMMdd'T'HHmmss")
    const end = format(booking.outboundFlight.arrivalTime, "yyyyMMdd'T'HHmmss")
    const detail = encodeURIComponent(`Booking reference: ${booking.reference}\n` + `${booking.outboundFlight.departure.code} → ${booking.outboundFlight.arrival.code}`)
    window.open(`https://calendar.google.com/calendar/r/eventedit?text=${title}&dates=${start}/${end}&details=${detail}`, "_blank")
  }

  return (
    <div className="space-y-8">
      {/*  Hero banner  */}
      <div className="rounded-2xl border border-emerald-200/60 dark:border-emerald-900/40 bg-emerald-50/50 dark:bg-emerald-950/20 px-6 py-8 text-center">
        <div className="flex justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/50">
            <CheckCircle2 className="h-7 w-7 text-emerald-600 dark:text-emerald-400" strokeWidth={1.8} />
          </div>
        </div>
        <h1 className="mt-4 font-display text-2xl font-semibold text-foreground">{isNew ? "Booking confirmed!" : "Booking details"}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{isNew ? "Your tickets have been issued. A confirmation email is on its way." : `Booked on ${format(booking.createdAt, "d MMM yyyy")}`}</p>

        {/* Reference */}
        <button
          onClick={copyReference}
          className="mt-4 inline-flex items-center gap-2 rounded-2xl border border-emerald-200 dark:border-emerald-800 bg-white dark:bg-emerald-950/40 px-5 py-2.5 transition-colors hover:bg-emerald-50 dark:hover:bg-emerald-900/30"
        >
          <span className="font-mono text-xl font-bold tracking-widest text-foreground">{booking.reference}</span>
          {copiedRef ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4 text-muted-foreground" />}
        </button>
        <p className="mt-1.5 text-[11px] text-muted-foreground">Click to copy reference</p>
      </div>

      {/*  Action buttons  */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={handlePrint}
          className="flex items-center gap-1.5 rounded-xl border border-border/60 bg-card px-4 py-2.5 text-xs font-medium text-foreground hover:bg-muted/50 transition-colors hover:cursor-pointer"
        >
          <Printer className="h-3.5 w-3.5" />
          Print tickets
        </button>
        <button
          onClick={handleAddToCalendar}
          className="flex items-center gap-1.5 rounded-xl border border-border/60 bg-card px-4 py-2.5 text-xs font-medium text-foreground hover:bg-muted/50 transition-colors hover:cursor-pointer"
        >
          <CalendarPlus className="h-3.5 w-3.5" />
          Add to calendar
        </button>
        <Link
          href={`/bookings/${booking.reference}/change`}
          className="flex items-center gap-1.5 rounded-xl border border-border/60 bg-card px-4 py-2.5 text-xs font-medium text-foreground hover:bg-muted/50 transition-colors hover:cursor-pointer no-print"
        >
          <Settings className="h-3.5 w-3.5" />
          Manage booking
        </Link>
        <Link
          href="/bookings"
          className="flex items-center gap-1.5 rounded-xl border border-border/60 bg-card px-4 py-2.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors hover:cursor-pointer no-print"
        >
          All bookings
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      {/* ── Flights ── */}
      <section>
        <h2 className="text-sm font-semibold text-foreground mb-3">Flight details</h2>
        <div className="space-y-3">
          <BookingFlightCard
            flightNumber={booking.outboundFlight.flightNumber}
            departureTime={booking.outboundFlight.departureTime}
            arrivalTime={booking.outboundFlight.arrivalTime}
            from={booking.outboundFlight.departure.code}
            to={booking.outboundFlight.arrival.code}
            fromCity={booking.outboundFlight.departure.city}
            toCity={booking.outboundFlight.arrival.city}
            direction={booking.isReturnTrip ? "outbound" : undefined}
            classType={booking.seatClass.class}
          />
          {booking.returnFlight && (
            <BookingFlightCard
              flightNumber={booking.returnFlight.flightNumber}
              departureTime={booking.returnFlight.departureTime}
              arrivalTime={booking.returnFlight.arrivalTime}
              from={booking.returnFlight.departure.code}
              to={booking.returnFlight.arrival.code}
              fromCity={booking.returnFlight.departure.city}
              toCity={booking.returnFlight.arrival.city}
              direction="return"
              classType={booking.seatClass.class}
            />
          )}
        </div>
      </section>

      {/* ── Tickets ── */}
      <section>
        <h2 className="text-sm font-semibold text-foreground mb-3">
          Tickets — {booking.passengers.length} passenger{booking.passengers.length !== 1 ? "s" : ""}
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {booking.passengers.map(bp => {
            if (!bp.ticket) return null
            return (
              <TicketCard
                key={bp.id}
                ticketNumber={bp.ticket.ticketNumber}
                status={bp.ticket.status}
                issuedAt={bp.ticket.issuedAt}
                title={bp.title}
                firstName={bp.firstName}
                lastName={bp.lastName}
                passportNumber={bp.passportNumber}
                nationality={bp.nationality}
                seatNumber={bp.seatNumber}
                flightNumber={booking.outboundFlight.flightNumber}
                departureTime={booking.outboundFlight.departureTime}
                arrivalTime={booking.outboundFlight.arrivalTime}
                from={booking.outboundFlight.departure.code}
                to={booking.outboundFlight.arrival.code}
                fromCity={booking.outboundFlight.departure.city}
                toCity={booking.outboundFlight.arrival.city}
                classType={booking.seatClass.class}
                direction={booking.isReturnTrip ? "outbound" : undefined}
              />
            )
          })}
        </div>
      </section>

      {/* ── Payment summary ── */}
      {booking.payment && (
        <section>
          <h2 className="text-sm font-semibold text-foreground mb-3">Payment</h2>
          <div className="rounded-2xl border border-border/60 bg-card px-5 py-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">{booking.payment.method.replace("_", " ")}</p>
                {booking.payment.transactionRef && <p className="text-xs text-muted-foreground font-mono mt-0.5">Ref: {booking.payment.transactionRef}</p>}
                <p className="text-xs text-muted-foreground mt-0.5">Paid {format(booking.payment.paidAt, "d MMM yyyy, HH:mm")}</p>
              </div>
              <p className="text-lg font-bold text-foreground font-display">KES {booking.payment.amount.toLocaleString()}</p>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

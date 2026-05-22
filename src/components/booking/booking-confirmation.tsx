"use client"

import { BookingDetail } from "@/types/booking"
import { TicketCard } from "./ticket-card"
import { BookingFlightCard } from "./booking-flight-card"
import { format } from "date-fns"
import { CheckCircle2, Copy, Check, Printer, CalendarPlus, ArrowRight, Settings, Ban, Clock, XCircle } from "lucide-react"
import { useState } from "react"
import Link from "next/link"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { ChangeBookingForm } from "../forms/booking-form/change-booking-form"
import { CancelBookingDialog } from "../global/dialogs/cancel-booking-dialog"
import { useCancelBooking } from "@/hooks/booking/use-cancel-booking"
import { cn } from "@/lib/utils"
import { BookingStatus } from "../../../generated/prisma/enums"

interface BookingConfirmationProps {
  booking: BookingDetail
  isNew?: boolean
}

// ─── Status Configuration ───
const STATUS_CONFIG: Record<
  BookingStatus,
  {
    label: string
    icon: React.ElementType
    className: string
    bannerClassName: string
    description: string
  }
> = {
  CONFIRMED: {
    label: "Confirmed",
    icon: CheckCircle2,
    className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
    bannerClassName: "border-emerald-200/60 dark:border-emerald-900/40 bg-emerald-50/50 dark:bg-emerald-950/20",
    description: "Your booking is confirmed and tickets have been issued.",
  },
  PENDING: {
    label: "Pending",
    icon: Clock,
    className: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
    bannerClassName: "border-amber-200/60 dark:border-amber-900/40 bg-amber-50/50 dark:bg-amber-950/20",
    description: "Your booking is being processed. Payment confirmation is awaited.",
  },
  CANCELLED: {
    label: "Cancelled",
    icon: XCircle,
    className: "bg-destructive/10 text-destructive",
    bannerClassName: "border-destructive/20 dark:border-destructive/40 bg-destructive/5 dark:bg-destructive/10",
    description: "This booking has been cancelled and is no longer active.",
  },
  COMPLETED: {
    label: "Completed",
    icon: CheckCircle2,
    className: "bg-muted text-muted-foreground",
    bannerClassName: "border-border/60 bg-muted/20",
    description: "This flight has been completed.",
  },
}

// ─── Actions that are available based on status ───
const AVAILABLE_ACTIONS: Record<BookingStatus, string[]> = {
  CONFIRMED: ["print", "calendar", "change", "cancel"],
  PENDING: ["print", "calendar", "cancel"],
  CANCELLED: ["print"],
  COMPLETED: ["print"],
}

export function BookingConfirmation({ booking, isNew = false }: BookingConfirmationProps) {
  const [copiedRef, setCopiedRef] = useState(false)
  const [changeDialogOpen, setChangeDialogOpen] = useState(false)
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false)

  const { isPending, onCancelBooking } = useCancelBooking({})

  const status = booking.status as BookingStatus
  const statusConfig = STATUS_CONFIG[status] || STATUS_CONFIG.CONFIRMED
  const StatusIcon = statusConfig.icon
  const availableActions = AVAILABLE_ACTIONS[status] || []
  const canChange = availableActions.includes("change")
  const canCancel = availableActions.includes("cancel")

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
      {/* ── Status Banner ── */}
      <div className={cn("rounded-2xl border px-6 py-8 text-center", statusConfig.bannerClassName)}>
        <div className="flex justify-center">
          <div
            className={cn(
              "flex h-14 w-14 items-center justify-center rounded-full",
              status === "CONFIRMED" || status === "COMPLETED" ? "bg-emerald-100 dark:bg-emerald-900/50" : status === "PENDING" ? "bg-amber-100 dark:bg-amber-900/50" : "bg-destructive/10",
            )}
          >
            <StatusIcon
              className={cn(
                "h-7 w-7",
                status === "CONFIRMED" || status === "COMPLETED" ? "text-emerald-600 dark:text-emerald-400" : status === "PENDING" ? "text-amber-600 dark:text-amber-400" : "text-destructive",
              )}
              strokeWidth={1.8}
            />
          </div>
        </div>

        <div className="flex items-center justify-center gap-3 mt-4">
          <h1 className="font-display text-2xl font-semibold text-foreground">{isNew ? "Booking confirmed!" : "Booking details"}</h1>
          <Badge variant="outline" className={cn("text-[10px]", statusConfig.className)}>
            {statusConfig.label}
          </Badge>
        </div>

        <p className="mt-1 text-sm text-muted-foreground">{isNew ? "Your tickets have been issued. A confirmation email is on its way." : statusConfig.description}</p>

        {/* Status-specific messages */}
        {status === "PENDING" && (
          <div className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-amber-100 dark:bg-amber-900/30 px-3 py-1.5 text-xs text-amber-700 dark:text-amber-300">
            <Clock className="h-3 w-3" />
            Payment is being processed. This usually takes a few minutes.
          </div>
        )}

        {status === "CANCELLED" && (
          <div className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-destructive/10 px-3 py-1.5 text-xs text-destructive">
            <XCircle className="h-3 w-3" />
            This booking was cancelled on {format(new Date(booking.updatedAt || booking.createdAt), "d MMM yyyy")}.
          </div>
        )}

        {status === "COMPLETED" && (
          <div className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-muted px-3 py-1.5 text-xs text-muted-foreground">
            <CheckCircle2 className="h-3 w-3" />
            Flight completed on {format(new Date(booking.outboundFlight.arrivalTime), "d MMM yyyy")}.
          </div>
        )}

        {/* Reference */}
        <button
          onClick={copyReference}
          className={cn(
            "mt-4 inline-flex items-center gap-2 rounded-2xl border bg-white dark:bg-emerald-950/40 px-5 py-2.5 transition-colors",
            status === "CANCELLED" ? "border-muted hover:bg-muted/30" : "border-emerald-200 dark:border-emerald-800 hover:bg-emerald-50 dark:hover:bg-emerald-900/30",
          )}
        >
          <span className={cn("font-mono text-xl font-bold tracking-widest", status === "CANCELLED" ? "text-muted-foreground line-through" : "text-foreground")}>{booking.reference}</span>
          {copiedRef ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4 text-muted-foreground" />}
        </button>
        <p className="mt-1.5 text-[11px] text-muted-foreground">Click to copy reference</p>
      </div>

      {/* ── Action Buttons (conditionally disabled) ── */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Print — always available */}
        <button
          onClick={handlePrint}
          className="flex items-center gap-1.5 rounded-xl border border-border/60 bg-card px-4 py-2.5 text-xs font-medium text-foreground hover:bg-muted/50 transition-colors hover:cursor-pointer"
        >
          <Printer className="h-3.5 w-3.5" />
          Print tickets
        </button>

        {/* Add to calendar — always available */}
        <button
          onClick={handleAddToCalendar}
          className="flex items-center gap-1.5 rounded-xl border border-border/60 bg-card px-4 py-2.5 text-xs font-medium text-foreground hover:bg-muted/50 transition-colors hover:cursor-pointer"
        >
          <CalendarPlus className="h-3.5 w-3.5" />
          Add to calendar
        </button>

        {/* Change booking — only for CONFIRMED */}
        {canChange ? (
          <Button
            onClick={() => setChangeDialogOpen(true)}
            className="flex items-center gap-1.5 rounded-xl border border-border/60 bg-card px-4 py-2.5 text-xs font-medium text-foreground hover:bg-muted/50 transition-colors hover:cursor-pointer no-print"
          >
            <Settings className="h-3.5 w-3.5" />
            Change booking
          </Button>
        ) : (
          <Button
            disabled
            className="flex items-center gap-1.5 rounded-xl border border-border/60 bg-card px-4 py-2.5 text-xs font-medium text-muted-foreground cursor-not-allowed no-print opacity-50"
            title={status === "CANCELLED" ? "Cannot change a cancelled booking" : status === "COMPLETED" ? "Cannot change a completed booking" : "Cannot change a pending booking"}
          >
            <Settings className="h-3.5 w-3.5" />
            Change booking
          </Button>
        )}

        {/* Cancel booking — only for CONFIRMED and PENDING */}
        {canCancel ? (
          <Button
            onClick={() => setCancelDialogOpen(true)}
            className="flex items-center gap-1.5 rounded-xl border border-destructive/60 bg-destructive/10 text-destructive px-4 py-2.5 text-xs font-medium hover:bg-destructive/20 transition-colors hover:cursor-pointer no-print"
          >
            <Ban className="h-3.5 w-3.5" />
            Cancel booking
          </Button>
        ) : (
          <Button
            disabled
            className="flex items-center gap-1.5 rounded-xl border border-border/60 bg-card px-4 py-2.5 text-xs font-medium text-muted-foreground cursor-not-allowed no-print opacity-50"
            title={status === "CANCELLED" ? "This booking is already cancelled" : "Cannot cancel a completed booking"}
          >
            <Ban className="h-3.5 w-3.5" />
            {status === "CANCELLED" ? "Booking cancelled" : "Cancel booking"}
          </Button>
        )}

        {/* All bookings link */}
        <Link
          href="/dashboard/bookings"
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
          Tickets — {booking.passengers.length} passenger
          {booking.passengers.length !== 1 ? "s" : ""}
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

      {/* ── Dialogs ── */}
      <ChangeBookingForm booking={booking} open={changeDialogOpen} setOpen={setChangeDialogOpen} />

      <CancelBookingDialog
        bookingReference={booking.reference}
        flightNumber={booking.outboundFlight.flightNumber}
        paymentStatus={booking?.paymentStatus}
        open={cancelDialogOpen}
        onOpenChange={setCancelDialogOpen}
        isReturnTrip={booking.isReturnTrip}
        isPending={isPending}
        onConfirm={reason => onCancelBooking({ bookingId: booking.id, reason })}
      />
    </div>
  )
}

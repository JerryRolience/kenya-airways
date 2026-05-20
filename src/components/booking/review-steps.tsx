"use client"

import { PassengerFormValues } from "@/validators/booking"
import { ClassType, PaymentMethod } from "../../../generated/prisma/enums"
import { SeatData } from "@/types/seat"
import { BookingFlightCard } from "./booking-flight-card"
import { PaymentSelector } from "./payment-selector"
import { PriceSummary } from "./price-summary"
import { SeatCard } from "./seat-selection/seat-card"
import { Button } from "@/components/ui/button"
import { User, Pencil } from "lucide-react"

interface ReviewStepProps {
  // Flight context
  outboundFlightId: string
  outboundNumber: string
  outboundDep: Date
  outboundArr: Date
  outboundFrom: string
  outboundTo: string
  outboundFromCity: string
  outboundToCity: string
  outboundPrice: number

  returnFlightId?: string
  returnNumber?: string
  returnDep?: Date
  returnArr?: Date
  returnFrom?: string
  returnTo?: string
  returnFromCity?: string
  returnToCity?: string
  returnPrice?: number

  isReturnTrip: boolean
  classType: ClassType

  // Passengers
  passengers: PassengerFormValues[]

  // Seat selection
  selectedOutboundSeats?: Record<number, SeatData>
  selectedReturnSeats?: Record<number, SeatData>
  onEditOutboundSeats?: () => void
  onEditReturnSeats?: () => void

  // Payment state (lifted to wizard)
  paymentMethod: PaymentMethod | null
  transactionRef: string
  onMethodChange: (m: PaymentMethod) => void
  onRefChange: (r: string) => void

  // Actions
  isSubmitting: boolean
  submitError: string | null
  onConfirm: () => void
  onBack: () => void
}

export function ReviewStep({
  outboundNumber,
  outboundDep,
  outboundArr,
  outboundFrom,
  outboundTo,
  outboundFromCity,
  outboundToCity,
  outboundPrice,
  returnNumber,
  returnDep,
  returnArr,
  returnFrom,
  returnTo,
  returnFromCity,
  returnToCity,
  returnPrice,
  isReturnTrip,
  classType,
  passengers,
  selectedOutboundSeats,
  selectedReturnSeats,
  onEditOutboundSeats,
  onEditReturnSeats,
  paymentMethod,
  transactionRef,
  onMethodChange,
  onRefChange,
  isSubmitting,
  submitError,
  onConfirm,
  onBack,
}: ReviewStepProps) {
  const totalAmount = (outboundPrice + (isReturnTrip && returnPrice ? returnPrice : 0)) * passengers.length

  // M-Pesa ref validation
  const mpesaError = paymentMethod === PaymentMethod.MPESA && transactionRef.length > 0 && transactionRef.length < 6 ? "M-Pesa code must be at least 6 characters." : undefined

  const canConfirm = paymentMethod !== null && (paymentMethod !== PaymentMethod.MPESA || transactionRef.length >= 6)

  const hasSelectedOutboundSeats = selectedOutboundSeats && Object.keys(selectedOutboundSeats).length > 0 && Object.values(selectedOutboundSeats).some(s => s !== null && s !== undefined)
  const hasSelectedReturnSeats = selectedReturnSeats && Object.keys(selectedReturnSeats).length > 0 && Object.values(selectedReturnSeats).some(s => s !== null && s !== undefined)

  return (
    <div className="grid gap-8 lg:grid-cols-12">
      {/* ── Left: review content ── */}
      <div className="lg:col-span-8 space-y-5">
        {/* Flights */}
        <section>
          <h3 className="text-sm font-semibold text-foreground mb-3">Your flights</h3>
          <div className="space-y-3">
            <BookingFlightCard
              flightNumber={outboundNumber}
              departureTime={outboundDep}
              arrivalTime={outboundArr}
              from={outboundFrom}
              to={outboundTo}
              fromCity={outboundFromCity}
              toCity={outboundToCity}
              direction="outbound"
              classType={classType}
            />
            {isReturnTrip && returnNumber && returnDep && returnArr && (
              <BookingFlightCard
                flightNumber={returnNumber}
                departureTime={returnDep}
                arrivalTime={returnArr}
                from={returnFrom!}
                to={returnTo!}
                fromCity={returnFromCity!}
                toCity={returnToCity!}
                direction="return"
                classType={classType}
              />
            )}
          </div>
        </section>

        {/* Passengers */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-foreground">Passengers</h3>
            <Button type="button" variant="ghost" size="sm" onClick={onBack} className="h-7 rounded-lg text-xs text-muted-foreground gap-1">
              <Pencil className="h-3 w-3" />
              Edit
            </Button>
          </div>

          <div className="space-y-2">
            {passengers.map((p, i) => (
              <div key={i} className="flex items-center gap-3 rounded-xl border border-border/60 bg-card px-4 py-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-muted shrink-0">
                  <User className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">
                    {p.title} {p.firstName} {p.lastName}
                  </p>
                  <p className="text-[11px] text-muted-foreground truncate">
                    {p.passportNumber} · {p.nationality} · {p.relationship.toLowerCase()}
                  </p>
                </div>
                <span className="text-[10px] font-medium text-muted-foreground shrink-0">Pax {i + 1}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Selected Outbound Seats */}
        {hasSelectedOutboundSeats && (
          <section>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-foreground">Selected seats</h3>
              {onEditOutboundSeats && (
                <Button type="button" variant="ghost" size="sm" onClick={onEditOutboundSeats} className="h-7 rounded-lg text-xs text-muted-foreground gap-1">
                  <Pencil className="h-3 w-3" />
                  Change
                </Button>
              )}
            </div>

            <div className="space-y-2">
              {Object.entries(selectedOutboundSeats!).map(([index, seat]) => {
                if (!seat) return null
                const passenger = passengers[Number(index)]
                if (!passenger) return null
                return <SeatCard key={index} seat={seat} passengerName={`${passenger.firstName} ${passenger.lastName}`} passengerIndex={Number(index)} />
              })}
            </div>
          </section>
        )}

        {/* Return Selected Seats */}
        {isReturnTrip && hasSelectedReturnSeats && (
          <section>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-foreground">Return flight seats</h3>
              {onEditReturnSeats && (
                <Button type="button" variant="ghost" size="sm" onClick={onEditReturnSeats} className="h-7 rounded-lg text-xs text-muted-foreground gap-1">
                  <Pencil className="h-3 w-3" />
                  Change
                </Button>
              )}
            </div>
            <div className="space-y-2">
              {Object.entries(selectedReturnSeats!).map(([index, seat]) => {
                if (!seat) return null
                const passenger = passengers[Number(index)]
                if (!passenger) return null
                return <SeatCard key={`return-${index}`} seat={seat} passengerName={`${passenger.firstName} ${passenger.lastName}`} passengerIndex={Number(index)} />
              })}
            </div>
          </section>
        )}

        {/* Payment */}
        <section>
          <h3 className="text-sm font-semibold text-foreground mb-3">Payment method</h3>
          <PaymentSelector selected={paymentMethod} transactionRef={transactionRef} totalAmount={totalAmount} onMethodChange={onMethodChange} onRefChange={onRefChange} error={mpesaError} />
        </section>

        {/* Back button (mobile) */}
        <div className="lg:hidden">
          <Button type="button" variant="ghost" onClick={onBack} className="rounded-xl text-sm text-muted-foreground">
            ← Back to passenger details
          </Button>
        </div>
      </div>

      {/* ── Right: price summary sticky ── */}
      <div className="lg:col-span-4">
        <div className="sticky top-24">
          <PriceSummary
            outboundPrice={outboundPrice}
            returnPrice={isReturnTrip && returnPrice ? returnPrice : 0}
            passengers={passengers.length}
            classType={classType}
            isReturnTrip={isReturnTrip}
            isSubmitting={isSubmitting}
            canConfirm={canConfirm}
            onConfirm={onConfirm}
            error={submitError}
          />

          {/* Back button (desktop) */}
          <Button type="button" variant="ghost" onClick={onBack} className="mt-3 w-full rounded-xl text-xs text-muted-foreground hover:text-foreground">
            ← Back to passenger details
          </Button>
        </div>
      </div>
    </div>
  )
}

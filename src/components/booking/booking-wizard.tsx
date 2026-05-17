"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { PassengerFormValues } from "@/validators/booking"
import { ClassType, PaymentMethod } from "../../../generated/prisma/enums"
import { SeatData } from "@/types/seat"
import { PassengerStep } from "./passenger-steps"
import { SeatSelectionStep } from "./seat-selection/seat-selection-step"
import { ReviewStep } from "./review-steps"
import { BookingFlightCard } from "./booking-flight-card"
import { cn } from "@/lib/utils"
import { Check } from "lucide-react"
import { createBooking } from "@/actions/bookings/create"

// ─── Booking context derived from URL params ───
export interface BookingContext {
  // Outbound
  outboundFlightId: string
  outboundNumber: string
  outboundDep: Date
  outboundArr: Date
  outboundFrom: string
  outboundTo: string
  outboundFromCity: string
  outboundToCity: string
  outboundPrice: number

  // Return (optional)
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
  passengerCount: number
}

interface BookingWizardProps {
  context: BookingContext
}

// ─── Step Indicator ───
type WizardStep = 1 | 2 | 3

function StepIndicator({ currentStep }: { currentStep: WizardStep }) {
  const steps = [
    { num: 1, label: "Passengers" },
    { num: 2, label: "Seats" },
    { num: 3, label: "Review & pay" },
  ]

  return (
    <div className="flex items-center gap-0 mb-8 overflow-x-auto">
      {steps.map((step, i) => {
        const isDone = currentStep > step.num
        const isActive = currentStep === step.num
        return (
          <div key={step.num} className="flex items-center">
            {/* Step circle */}
            <div className="flex items-center gap-2.5 shrink-0">
              <div
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-all",
                  isDone && "bg-primary text-primary-foreground",
                  isActive && "bg-primary text-primary-foreground ring-4 ring-primary/20",
                  !isDone && !isActive && "bg-muted text-muted-foreground",
                )}
              >
                {isDone ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : step.num}
              </div>
              <span className={cn("text-sm font-medium hidden sm:block", isActive ? "text-foreground" : "text-muted-foreground")}>{step.label}</span>
            </div>

            {/* Connector */}
            {i < steps.length - 1 && <div className={cn("h-px w-8 sm:w-16 mx-2 transition-all", currentStep > step.num ? "bg-primary" : "bg-border")} />}
          </div>
        )
      })}
    </div>
  )
}

// ─── Main Wizard ───
export function BookingWizard({ context }: BookingWizardProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  // Step state
  const [step, setStep] = useState<WizardStep>(1)
  const [passengers, setPassengers] = useState<PassengerFormValues[]>([])
  const [selectedSeats, setSelectedSeats] = useState<Record<number, SeatData>>({})
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null)
  const [transactionRef, setTransactionRef] = useState("")
  const [submitError, setSubmitError] = useState<string | null>(null)

  const totalAmount = (context.outboundPrice + (context.isReturnTrip && context.returnPrice ? context.returnPrice : 0)) * context.passengerCount

  // ─── Step 1 → 2: Passengers complete → go to seat selection ───
  const handlePassengersComplete = (filled: PassengerFormValues[]) => {
    setPassengers(filled)
    setStep(2)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // ─── Step 2 → 3: Seats selected → go to review ───
  const handleSeatsComplete = (seats: Record<number, SeatData>) => {
    setSelectedSeats(seats)
    setStep(3)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // ─── Step 3: Confirm & pay ───
  const handleConfirm = () => {
    if (!paymentMethod) return
    setSubmitError(null)

    startTransition(async () => {
      const result = await createBooking({
        outboundFlightId: context.outboundFlightId,
        returnFlightId: context.returnFlightId,
        isReturnTrip: context.isReturnTrip,
        classType: context.classType,
        passengers: passengers.map(p => ({
          ...p,
          dateOfBirth: new Date(p.dateOfBirth),
        })),
        paymentMethod,
        transactionRef: transactionRef || undefined,
        totalAmount,
      })

      if (!result.success) {
        setSubmitError(result.message ?? "Booking failed. Please try again.")
        return
      }

      // Navigate to confirmation page
      router.push(`/dashboard/bookings/${result.data!.reference}?new=1`)
    })
  }

  return (
    <div>
      {/* Step indicator */}
      <StepIndicator currentStep={step} />

      {/* Flight summary bar — always visible */}
      <div className="mb-6 space-y-2">
        <BookingFlightCard
          flightNumber={context.outboundNumber}
          departureTime={context.outboundDep}
          arrivalTime={context.outboundArr}
          from={context.outboundFrom}
          to={context.outboundTo}
          fromCity={context.outboundFromCity}
          toCity={context.outboundToCity}
          direction={context.isReturnTrip ? "outbound" : undefined}
          classType={context.classType}
        />
        {context.isReturnTrip && context.returnNumber && context.returnDep && context.returnArr && (
          <BookingFlightCard
            flightNumber={context.returnNumber}
            departureTime={context.returnDep}
            arrivalTime={context.returnArr}
            from={context.returnFrom!}
            to={context.returnTo!}
            fromCity={context.returnFromCity!}
            toCity={context.returnToCity!}
            direction="return"
            classType={context.classType}
          />
        )}
      </div>

      {/* ─── Step 1: Passenger Details ─── */}
      {step === 1 && (
        <PassengerStep passengerCount={context.passengerCount} onComplete={handlePassengersComplete} onBack={() => router.back()} initialPassengers={passengers.length > 0 ? passengers : undefined} />
      )}

      {/* ─── Step 2: Seat Selection ─── */}
      {step === 2 && (
        <SeatSelectionStep
          outboundFlightId={context.outboundFlightId}
          outboundNumber={context.outboundNumber}
          passengerCount={context.passengerCount}
          classType={context.classType}
          onComplete={handleSeatsComplete}
          onBack={() => {
            setStep(1)
            window.scrollTo({ top: 0, behavior: "smooth" })
          }}
        />
      )}

      {/* ─── Step 3: Review & Pay ─── */}
      {step === 3 && (
        <ReviewStep
          outboundFlightId={context.outboundFlightId}
          outboundNumber={context.outboundNumber}
          outboundDep={context.outboundDep}
          outboundArr={context.outboundArr}
          outboundFrom={context.outboundFrom}
          outboundTo={context.outboundTo}
          outboundFromCity={context.outboundFromCity}
          outboundToCity={context.outboundToCity}
          outboundPrice={context.outboundPrice}
          returnFlightId={context.returnFlightId}
          returnNumber={context.returnNumber}
          returnDep={context.returnDep}
          returnArr={context.returnArr}
          returnFrom={context.returnFrom}
          returnTo={context.returnTo}
          returnFromCity={context.returnFromCity}
          returnToCity={context.returnToCity}
          returnPrice={context.returnPrice}
          isReturnTrip={context.isReturnTrip}
          classType={context.classType}
          passengers={passengers}
          selectedSeats={selectedSeats}
          onEditSeats={() => {
            setStep(2)
            window.scrollTo({ top: 0, behavior: "smooth" })
          }}
          paymentMethod={paymentMethod}
          transactionRef={transactionRef}
          onMethodChange={setPaymentMethod}
          onRefChange={setTransactionRef}
          isSubmitting={isPending}
          submitError={submitError}
          onConfirm={handleConfirm}
          onBack={() => {
            setStep(1)
            window.scrollTo({ top: 0, behavior: "smooth" })
          }}
        />
      )}
    </div>
  )
}

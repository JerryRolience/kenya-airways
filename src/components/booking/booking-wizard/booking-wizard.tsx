"use client"

import { createBooking } from "@/actions/bookings/create"
import { SeatData } from "@/types/seat"
import { PassengerFormValues } from "@/validators/booking"
import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { PaymentMethod } from "../../../../generated/prisma/enums"
import { BookingFlightCard } from "../booking-flight-card"
import { PassengerStep } from "../passenger-steps"
import { ReviewStep } from "../review-steps"
import { SeatSelectionStep } from "../seat-selection/seat-selection-step"
import { BookingContext } from "./types"
import { WizardStep, StepIndicator } from "./step-indicator"
import { ErrorHandler } from "@/components/global/error-handler"

interface BookingWizardProps {
  context: BookingContext
}

//  Main Wizard
export function BookingWizard({ context }: BookingWizardProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  // Step state
  const [step, setStep] = useState<WizardStep>(1)
  const [passengers, setPassengers] = useState<PassengerFormValues[]>([])
  const [selectedOutboundSeats, setSelectedOutboundSeats] = useState<Record<number, SeatData>>({})
  const [selectedReturnSeats, setSelectedReturnSeats] = useState<Record<number, SeatData>>({})
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null)
  const [transactionRef, setTransactionRef] = useState("")
  const [submitError, setSubmitError] = useState<string | null>(null)

  const totalAmount = (context.outboundPrice + (context.isReturnTrip && context.returnPrice ? context.returnPrice : 0)) * context.passengerCount

  //  Step 1 → 2: Passengers complete → go to seat selection
  const handlePassengersComplete = (passengers: PassengerFormValues[]) => {
    setPassengers(passengers)
    setStep(2)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  //  Step 2 → 3: Seats selected → go to review
  // After outbound seats complete, go to return seats (if return trip)
  const handleOutboundSeatsComplete = (seats: Record<number, SeatData>) => {
    setSelectedOutboundSeats(seats)

    if (context.isReturnTrip && context.returnFlightId) {
      setStep(3) // Go to return seat selection
    } else {
      setStep(4) // Go to review (one-way)
    }
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // After return seats complete, go to review
  const handleReturnSeatsComplete = (seats: Record<number, SeatData>) => {
    setSelectedReturnSeats(seats)
    setStep(4) // Go to review
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  //  Step 3 or 4 depending on return trip: Confirm & pay
  const handleConfirm = () => {
    if (!paymentMethod) {
      ErrorHandler({ title: "Payment Method Required", description: "Please select a payment method to proceed.", action: "error" })
      return
    }
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
        ErrorHandler({ title: "Booking Failed", description: result.message ?? "Booking failed. Please try again.", action: "error" })
        return
      }

      ErrorHandler({ title: "Booking Successful", description: "Your booking was successful! Redirecting to your bookings...", action: "success" })
      // Navigate to confirmation page
      router.push(`/dashboard/bookings/${result.data!.reference}?new=1`)
    })
  }

  return (
    <div>
      {/* Step indicator */}
      <StepIndicator currentStep={step} isReturnTrip={context.isReturnTrip} />

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

      {/*  Step 1: Passenger Details  */}
      {step === 1 && (
        <PassengerStep passengerCount={context.passengerCount} onComplete={handlePassengersComplete} onBack={() => router.back()} initialPassengers={passengers.length > 0 ? passengers : undefined} />
      )}

      {/*  Step 2: Outbound Seat Selection  */}
      {step === 2 && (
        <SeatSelectionStep
          outboundFlightId={context.outboundFlightId}
          outboundNumber={context.outboundNumber}
          passengerCount={context.passengerCount}
          classType={context.classType}
          onComplete={handleOutboundSeatsComplete}
          onBack={() => {
            setStep(1)
            window.scrollTo({ top: 0, behavior: "smooth" })
          }}
          tripType={context.isReturnTrip ? "return" : "outbound"}
        />
      )}

      {/*  Step 3: Return Seat Selection (only for return trips)  */}
      {step === 3 && context.isReturnTrip && context.returnFlightId && (
        <SeatSelectionStep
          outboundFlightId={context.returnFlightId}
          outboundNumber={context.returnNumber || ""}
          passengerCount={context.passengerCount}
          classType={context.classType}
          onComplete={handleReturnSeatsComplete}
          onBack={() => {
            setStep(2)
            window.scrollTo({ top: 0, behavior: "smooth" })
          }}
          tripType="return-final"
        />
      )}

      {/*  Step 4: Review & Pay  */}
      {(step === 4 || (step === 3 && !context.isReturnTrip)) && (
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
          selectedOutboundSeats={selectedOutboundSeats}
          selectedReturnSeats={selectedReturnSeats}
          onEditOutboundSeats={() => {
            setStep(2)
            window.scrollTo({ top: 0, behavior: "smooth" })
          }}
          onEditReturnSeats={() => {
            setStep(3)
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

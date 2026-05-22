"use client"

import { changeBooking } from "@/actions/bookings/change"
import { fetchAvailableFlightsForChange } from "@/actions/flights/fetch/fetch-available-flights-for-change"
import { ErrorHandler } from "@/components/global/error-handler"
import { HttpError } from "@/lib"
import { BookingDetail, BookingListItem } from "@/types/booking"
import { ChangeBookingInput, ChangeBookingSchema } from "@/validators/booking"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useEffect, useMemo } from "react"
import { useForm } from "react-hook-form"
import z from "zod"
import { customZodResolver } from "../custom-zod-resolver"

interface UseChangeBookingParams {
  booking: BookingDetail | BookingListItem
  onSuccess?: () => void
}

export function useChangeBooking({ booking, onSuccess }: UseChangeBookingParams) {
  const queryClient = useQueryClient()

  const classType = "seatClass" in booking ? booking.seatClass?.class : booking.classType
  const passengerCount = "passengers" in booking ? booking.passengers.length : booking.passengerCount
  const currentPricePerPassenger = "seatClass" in booking ? booking.seatClass?.priceKES : booking.priceKES || 0

  const form = useForm<z.infer<typeof ChangeBookingSchema>>({
    resolver: customZodResolver(ChangeBookingSchema),
    defaultValues: {
      bookingId: booking.id,
      newFlightId: "",
      newSeatClassId: "",
      fareDifference: 0,
      paymentMethod: undefined,
      transactionRef: "",
    },
  })

  const selectedFlightId = form.watch("newFlightId")

  // Fetch available flights
  const { data: flightsData, isLoading: flightsLoading } = useQuery({
    queryKey: ["available-flights-for-change", booking.id],
    queryFn: async () => {
      const res = await fetchAvailableFlightsForChange({
        bookingId: booking.id,
        classType,
      })
      if (!res.success) throw new Error(res.message)
      return res
    },
    staleTime: 1000 * 60 * 2,
  })

  const availableFlights = useMemo(() => flightsData?.data ?? [], [flightsData])

  // Flight options
  const flightOptions = useMemo(
    () =>
      availableFlights.map(f => ({
        value: f.value,
        label: f.label,
        seatClassId: f.seatClassId,
        priceKES: f.priceKES,
      })),
    [availableFlights],
  )

  // Seat class options (only for selected flight)
  const seatClassOptions = useMemo(() => {
    if (!selectedFlightId) return []
    const flight = availableFlights.find(f => f.value === selectedFlightId)
    if (!flight) return []
    return [
      {
        value: flight.seatClassId,
        label: `${classType} — KES ${flight.priceKES.toLocaleString()} (${flight.availableSeats} seats)`,
      },
    ]
  }, [selectedFlightId, availableFlights, classType])

  // Update seat class and fare difference when flight changes
  useEffect(() => {
    if (selectedFlightId) {
      const flight = availableFlights.find(f => f.value === selectedFlightId)
      if (flight) {
        form.setValue("newSeatClassId", flight.seatClassId)
        const newPrice = flight.priceKES
        const diff = (newPrice - currentPricePerPassenger) * passengerCount
        form.setValue("fareDifference", diff)
      }
    }
  }, [selectedFlightId, availableFlights, form, currentPricePerPassenger, passengerCount])

  const { mutate, isPending } = useMutation({
    mutationFn: (data: ChangeBookingInput) => changeBooking(data),

    onSuccess: res => {
      if (res.success) {
        ErrorHandler({
          title: "Booking changed successfully",
          description: res.message,
          action: "success",
        })
        queryClient.invalidateQueries({ queryKey: ["user-bookings"] })
        queryClient.invalidateQueries({ queryKey: ["dashboard-overview"] })
        queryClient.invalidateQueries({ queryKey: ["booking-detail", booking.reference] })
        onSuccess?.()
        form.reset()
      } else {
        ErrorHandler({
          title: "Failed to change booking",
          description: res.message ?? "Something went wrong. Please try again.",
          action: "error",
        })
      }
    },

    onError: error => {
      const description = error instanceof HttpError ? error.message : error instanceof Error ? error.message : "Something went wrong. Please try again."

      ErrorHandler({
        title: "Failed to change booking",
        description,
        action: "error",
      })
    },
  })

  const onSubmit = form.handleSubmit(data => mutate(data as ChangeBookingInput))

  const currentBookingInfo = {
    flightNumber: booking.outboundFlight.flightNumber,
    fromCity: "departure" in booking.outboundFlight ? booking.outboundFlight.departure.city : booking.outboundFlight.fromCity,
    toCity: "arrival" in booking.outboundFlight ? booking.outboundFlight.arrival.city : booking.outboundFlight.toCity,
    totalAmount: booking.totalAmount,
  }

  return {
    register: form.register,
    control: form.control,
    errors: form.formState.errors,
    watch: form.watch,
    setValue: form.setValue,
    reset: form.reset,
    onSubmit,
    isPending,
    flightOptions,
    seatClassOptions,
    flightsLoading,
    classType,
    currentBookingInfo,
  }
}

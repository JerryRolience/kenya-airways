"use server"

import { STATUS_CODES } from "@/constants/status-codes"
import { errorResponse, HttpError, successResponse } from "@/lib"
import prisma from "@/lib/prisma"
import { ApiResponse } from "@/types/api-response"
import { ChangeBookingInput, ChangeBookingSchema } from "@/validators/booking"
import { currentUser } from "@clerk/nextjs/server"
import { BookingStatus, FlightStatus, Role } from "../../../../generated/prisma/enums"

interface ChangeBookingResult {
  reference: string
  newFlightNumber: string
  newDepartureTime: Date
  fareDifference: number // positive = user pays more, negative = refund
  newTotalAmount: number
}

export async function changeBooking(data: ChangeBookingInput): Promise<ApiResponse<ChangeBookingResult>> {
  try {
    //  1. Validate
    const parsed = ChangeBookingSchema.safeParse(data)
    if (!parsed.success) {
      const firstError = parsed.error.issues[0]
      throw new HttpError({
        statusCode: STATUS_CODES.BAD_REQUEST,
        message: firstError?.message ?? "Invalid change booking data.",
      })
    }

    const { bookingId, newFlightId, newSeatClassId, fareDifference, paymentMethod, transactionRef } = parsed.data

    //  2. Auth
    const clerkUser = await currentUser()
    if (!clerkUser) {
      throw new HttpError({ statusCode: STATUS_CODES.UNAUTHORIZED, message: "You must be signed in to change a booking." })
    }

    const dbUser = await prisma.user.findUnique({
      where: { clerkId: clerkUser.id },
      select: { id: true, role: true },
    })
    if (!dbUser) {
      throw new HttpError({ statusCode: STATUS_CODES.NOT_FOUND, message: "User account not found. Please contact support for assistance." })
    }

    //  3. Fetch current booking
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      select: {
        id: true,
        reference: true,
        status: true,
        userId: true,
        totalAmount: true,
        isReturnTrip: true,
        seatClass: { select: { id: true, class: true, priceKES: true } },
        flight: { select: { id: true, flightNumber: true, departureTime: true } },
        passengers: { select: { id: true, seat: { select: { id: true } } } },
      },
    })

    if (!booking) {
      throw new HttpError({
        statusCode: STATUS_CODES.NOT_FOUND,
        message: "Booking not found or may have been cancelled. Please verify your booking reference and try again.",
      })
    }

    //  4. Ownership check
    const isAdmin = dbUser.role === Role.ADMIN || dbUser.role === Role.SUPER_ADMIN
    if (!isAdmin && booking.userId !== dbUser.id) {
      throw new HttpError({
        statusCode: STATUS_CODES.FORBIDDEN,
        message: "You do not have permission to change this booking.",
      })
    }

    //  5. Status guard
    if (booking.status !== BookingStatus.CONFIRMED) {
      throw new HttpError({
        statusCode: STATUS_CODES.CONFLICT,
        message: `Only confirmed bookings can be changed. This booking is ${booking.status.toLowerCase()}.`,
      })
    }

    //  6. Time guard — cannot change within 24 hours of departure
    const twentyFourHoursFromNow = new Date(Date.now() + 24 * 60 * 60 * 1000)
    if (booking.flight.departureTime <= twentyFourHoursFromNow) {
      throw new HttpError({
        statusCode: STATUS_CODES.CONFLICT,
        message: `Changes close 24 hours before departure. Flight ${booking.flight.flightNumber} departs too soon.`,
      })
    }

    //  7. Guard: cannot change to the same flight
    if (newFlightId === booking.flight.id && newSeatClassId === booking.seatClass.id) {
      throw new HttpError({
        statusCode: STATUS_CODES.BAD_REQUEST,
        message: "The new flight and class are the same as the current booking. No changes made.",
      })
    }

    const passengerCount = booking.passengers.length

    //  8. $transaction - all-or-nothing for the complex change process
    const result = await prisma.$transaction(async tx => {
      //  8a. Validate new flight
      const newFlight = await tx.flight.findUnique({
        where: { id: newFlightId },
        select: {
          id: true,
          flightNumber: true,
          status: true,
          departureTime: true,
          departure: { select: { code: true, city: true } },
          arrival: { select: { code: true, city: true } },
        },
      })

      if (!newFlight) {
        throw new HttpError({ statusCode: STATUS_CODES.NOT_FOUND, message: "The new flight was not found. Please check the flight details and try again." })
      }

      const nonBookable: FlightStatus[] = [FlightStatus.CANCELLED, FlightStatus.DEPARTED, FlightStatus.ARRIVED]
      if (nonBookable.includes(newFlight.status)) {
        throw new HttpError({
          statusCode: STATUS_CODES.CONFLICT,
          message: `Flight ${newFlight.flightNumber} is ${newFlight.status.toLowerCase()} and cannot be booked.`,
        })
      }

      // Cannot change to a flight departing within 2 hours
      const twoHoursFromNow = new Date(Date.now() + 2 * 60 * 60 * 1000)
      if (newFlight.departureTime <= twoHoursFromNow) {
        throw new HttpError({
          statusCode: STATUS_CODES.CONFLICT,
          message: `Flight ${newFlight.flightNumber} departs too soon. Choose a flight at least 2 hours away.`,
        })
      }

      //  8b. Validate new seat class + availability
      const newSeatClass = await tx.seatClass.findUnique({
        where: { id: newSeatClassId },
        select: {
          id: true,
          class: true,
          totalSeats: true,
          bookedSeats: true,
          priceKES: true,
          flightId: true,
        },
      })

      if (!newSeatClass) {
        throw new HttpError({
          statusCode: STATUS_CODES.NOT_FOUND,
          message: "The selected seat class was not found. Please check the seat class details and try again.",
        })
      }

      // Ensure the seat class belongs to the new flight
      if (newSeatClass.flightId !== newFlightId) {
        throw new HttpError({
          statusCode: STATUS_CODES.BAD_REQUEST,
          message: "Seat class does not belong to the selected flight.",
        })
      }

      const available = newSeatClass.totalSeats - newSeatClass.bookedSeats
      if (available < passengerCount) {
        throw new HttpError({
          statusCode: STATUS_CODES.CONFLICT,
          message:
            available === 0
              ? `${newSeatClass.class.toLowerCase()} class on flight ${newFlight.flightNumber} is fully booked.`
              : `Only ${available} seat${available !== 1 ? "s" : ""} available on flight ${newFlight.flightNumber}. You need ${passengerCount}.`,
        })
      }

      //  8c. Validate fare difference
      const expectedFareDiff = (newSeatClass.priceKES - booking.seatClass.priceKES) * passengerCount

      // Allow ±1 KES rounding tolerance
      if (Math.abs(expectedFareDiff - fareDifference) > 1) {
        throw new HttpError({
          statusCode: STATUS_CODES.BAD_REQUEST,
          message: `Fare difference mismatch. Expected KES ${expectedFareDiff.toLocaleString()}. Please refresh and try again.`,
        })
      }

      const newTotalAmount = booking.totalAmount + fareDifference

      //  8d. Free old seats (if seat map exists)
      const oldSeatIds = booking.passengers.map(bp => bp.seat?.id).filter((id): id is string => !!id)

      if (oldSeatIds.length > 0) {
        await tx.seat.updateMany({
          where: { id: { in: oldSeatIds } },
          data: { isBooked: false },
        })
      }

      //  8e. Decrement old SeatClass.bookedSeats
      await tx.seatClass.update({
        where: { id: booking.seatClass.id },
        data: { bookedSeats: { decrement: passengerCount } },
      })

      //  8f. Increment new SeatClass.bookedSeats
      await tx.seatClass.update({
        where: { id: newSeatClassId },
        data: { bookedSeats: { increment: passengerCount } },
      })

      //  8g. Detach old BookingPassenger seat links
      await tx.bookingPassenger.updateMany({
        where: { bookingId },
        data: { seatId: null, seatNumber: null },
      })

      //  8h. Update the Booking record
      await tx.booking.update({
        where: { id: bookingId },
        data: {
          flightId: newFlightId,
          seatClassId: newSeatClassId,
          totalAmount: newTotalAmount,
        },
      })

      //  8i. Record the fare difference payment (if user pays more)
      if (fareDifference > 0 && paymentMethod) {
        await tx.payment.create({
          data: {
            bookingId: bookingId,
            amount: fareDifference,
            method: paymentMethod,
            transactionRef: transactionRef ?? null,
          },
        })
      }

      return { newFlight, newTotalAmount, expectedFareDiff }
    })

    return successResponse<ChangeBookingResult>({
      statusCode: STATUS_CODES.OK,
      message: `Booking ${booking.reference} has been changed to flight ${result.newFlight.flightNumber} on ${result.newFlight.departureTime.toLocaleDateString("en-US", { weekday: "long", day: "numeric", month: "long" })}.`,
      data: {
        reference: booking.reference,
        newFlightNumber: result.newFlight.flightNumber,
        newDepartureTime: result.newFlight.departureTime,
        fareDifference,
        newTotalAmount: result.newTotalAmount,
      },
    })
  } catch (error: unknown) {
    if (error instanceof HttpError) {
      return errorResponse({
        statusCode: error.statusCode,
        error: error.name,
        message: error.message,
      })
    }
    console.error("[changeBooking] unexpected error:", error)
    return errorResponse({
      statusCode: STATUS_CODES.INTERNAL_SERVER_ERROR,
      error: "Internal Server Error",
      message: "Failed to change booking. Please try again or contact support.",
    })
  }
}

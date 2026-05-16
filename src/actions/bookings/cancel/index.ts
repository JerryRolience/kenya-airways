"use server"

import { STATUS_CODES } from "@/constants/status-codes"
import { errorResponse, HttpError, successResponse } from "@/lib"
import prisma from "@/lib/prisma"
import { ApiResponse } from "@/types/api-response"
import { CancelBookingSchema, CancelBookingInput } from "@/validators/booking"
import { currentUser } from "@clerk/nextjs/server"
import { BookingStatus, PaymentStatus, TicketStatus } from "../../../../generated/prisma/enums"

export async function cancelBooking(data: CancelBookingInput): Promise<ApiResponse<{ reference: string }>> {
  try {
    //  Validate
    const parsed = CancelBookingSchema.safeParse(data)
    if (!parsed.success) {
      throw new HttpError({
        statusCode: STATUS_CODES.BAD_REQUEST,
        message: parsed.error.issues[0]?.message ?? "Invalid cancellation data.",
      })
    }
    const { bookingId } = parsed.data

    //  Auth
    const clerkUser = await currentUser()
    if (!clerkUser) {
      throw new HttpError({
        statusCode: STATUS_CODES.UNAUTHORIZED,
        message: "You must be signed in to cancel a booking.",
      })
    }

    const dbUser = await prisma.user.findUnique({
      where: { clerkId: clerkUser.id },
      select: { id: true, role: true },
    })
    if (!dbUser) {
      throw new HttpError({
        statusCode: STATUS_CODES.NOT_FOUND,
        message: "User account not found.",
      })
    }

    //  Fetch booking with everything we need
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      select: {
        id: true,
        reference: true,
        status: true,
        paymentStatus: true,
        userId: true,
        isReturnTrip: true,
        flight: {
          select: {
            departureTime: true,
            flightNumber: true,
          },
        },
        seatClass: {
          select: { id: true },
        },
        returnFlight: {
          select: { departureTime: true },
        },
        passengers: {
          select: {
            id: true,
            ticket: { select: { id: true } },
            seat: { select: { id: true } },
          },
        },
      },
    })

    if (!booking) {
      throw new HttpError({
        statusCode: STATUS_CODES.NOT_FOUND,
        message: "Booking not found.",
      })
    }

    //  Ownership check
    const isAdmin = dbUser.role === "ADMIN" || dbUser.role === "SUPER_ADMIN"
    if (!isAdmin && booking.userId !== dbUser.id) {
      throw new HttpError({
        statusCode: STATUS_CODES.FORBIDDEN,
        message: "You do not have permission to cancel this booking.",
      })
    }

    //  Status guard: only CONFIRMED bookings can be cancelled
    if (booking.status === BookingStatus.CANCELLED) {
      throw new HttpError({
        statusCode: STATUS_CODES.CONFLICT,
        message: "This booking has already been cancelled.",
      })
    }
    if (booking.status === BookingStatus.COMPLETED) {
      throw new HttpError({
        statusCode: STATUS_CODES.CONFLICT,
        message: "Completed bookings cannot be cancelled.",
      })
    }

    //  Time guard: cannot cancel within 2 hours of departure
    const twoHoursFromNow = new Date(Date.now() + 2 * 60 * 60 * 1000)
    if (booking.flight.departureTime <= twoHoursFromNow) {
      throw new HttpError({
        statusCode: STATUS_CODES.CONFLICT,
        message: `Cancellations close 2 hours before departure. Flight ${booking.flight.flightNumber} departs too soon.`,
      })
    }

    const passengerCount = booking.passengers.length

    //  $transaction: cancel everything atomically
    await prisma.$transaction(async tx => {
      // 1. Cancel the booking
      await tx.booking.update({
        where: { id: bookingId },
        data: {
          status: BookingStatus.CANCELLED,
          paymentStatus: PaymentStatus.REFUNDED,
        },
      })

      // 2. Cancel all tickets
      const ticketIds = booking.passengers.map(bp => bp.ticket?.id).filter((id): id is string => !!id)

      if (ticketIds.length > 0) {
        await tx.ticket.updateMany({
          where: { id: { in: ticketIds } },
          data: { status: TicketStatus.CANCELLED },
        })
      }

      // 3. Free booked seats (if seat map exists)
      const seatIds = booking.passengers.map(bp => bp.seat?.id).filter((id): id is string => !!id)

      if (seatIds.length > 0) {
        await tx.seat.updateMany({
          where: { id: { in: seatIds } },
          data: { isBooked: false },
        })
      }

      // 4. Decrement outbound SeatClass.bookedSeats
      await tx.seatClass.update({
        where: { id: booking.seatClass.id },
        data: { bookedSeats: { decrement: passengerCount } },
      })

      // 5. Decrement return SeatClass.bookedSeats (if round trip)
      if (booking.isReturnTrip) {
        // Find the return flight's seat class for the same class type
        const outboundSeatClass = await tx.seatClass.findUnique({
          where: { id: booking.seatClass.id },
          select: { class: true, flightId: true },
        })

        if (outboundSeatClass && booking.returnFlight) {
          // Get the booking's return flight ID from the booking record
          const fullBooking = await tx.booking.findUnique({
            where: { id: bookingId },
            select: { returnFlightId: true },
          })

          if (fullBooking?.returnFlightId) {
            const returnSeatClass = await tx.seatClass.findUnique({
              where: {
                flightId_class: {
                  flightId: fullBooking.returnFlightId,
                  class: outboundSeatClass.class,
                },
              },
              select: { id: true },
            })

            if (returnSeatClass) {
              await tx.seatClass.update({
                where: { id: returnSeatClass.id },
                data: { bookedSeats: { decrement: passengerCount } },
              })
            }
          }
        }
      }
    })

    return successResponse({
      statusCode: STATUS_CODES.OK,
      message: `Booking ${booking.reference} has been cancelled successfully. A refund will be processed within 5–7 business days.`,
      data: { reference: booking.reference },
    })
  } catch (error: unknown) {
    if (error instanceof HttpError) {
      return errorResponse({
        statusCode: error.statusCode,
        error: error.name,
        message: error.message,
      })
    }
    console.error("[cancelBooking] unexpected error:", error)
    return errorResponse({
      statusCode: STATUS_CODES.INTERNAL_SERVER_ERROR,
      error: "Internal Server Error",
      message: "Failed to cancel booking. Please try again or contact support.",
    })
  }
}

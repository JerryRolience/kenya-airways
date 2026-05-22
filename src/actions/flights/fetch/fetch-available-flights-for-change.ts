"use server"

import { isUserAuthenticated } from "@/actions/auth/is-user-authenticated"
import { STATUS_CODES } from "@/constants/status-codes"
import { errorResponse, HttpError, successResponse } from "@/lib"
import prisma from "@/lib/prisma"
import { ApiResponse } from "@/types/api-response"
import { AvailableFlightOption } from "@/types/flights"
import { ClassType, FlightStatus } from "../../../../generated/prisma/enums"

interface FetchAvailableFlightsInput {
  bookingId: string
  classType: ClassType
}

export async function fetchAvailableFlightsForChange(input: FetchAvailableFlightsInput): Promise<ApiResponse<AvailableFlightOption[]>> {
  try {
    const res = await isUserAuthenticated()

    if (!res.success || !res.data?.user) {
      throw new HttpError({
        statusCode: STATUS_CODES.UNAUTHORIZED,
        message: "You must be signed in.",
      })
    }

    // Find the current booking
    const booking = await prisma.booking.findUnique({
      where: { id: input.bookingId },
      select: {
        id: true,
        userId: true,
        flight: {
          select: {
            id: true,
            departureId: true,
            arrivalId: true,
            departureTime: true,
            flightNumber: true,
          },
        },
        seatClass: { select: { priceKES: true } },
        status: true,
      },
    })

    if (!booking) {
      throw new HttpError({
        statusCode: STATUS_CODES.NOT_FOUND,
        message: "Booking not found.",
      })
    }

    // Check ownership
    const isAdmin = res.data.isAdmin
    if (!isAdmin && booking.userId !== res.data.user.id) {
      throw new HttpError({
        statusCode: STATUS_CODES.FORBIDDEN,
        message: "You do not have permission to change this booking.",
      })
    }

    // Find alternative flights on the same route
    const availableFlights = await prisma.flight.findMany({
      where: {
        departureId: booking.flight.departureId,
        arrivalId: booking.flight.arrivalId,
        id: { not: booking.flight.id }, // Exclude current flight
        status: FlightStatus.SCHEDULED,
        departureTime: { gte: new Date() },
      },
      include: {
        seatClasses: {
          where: { class: input.classType },
          select: {
            id: true,
            priceKES: true,
            totalSeats: true,
            bookedSeats: true,
          },
        },
      },
      orderBy: { departureTime: "asc" },
    })

    // Map to options
    const options: AvailableFlightOption[] = availableFlights
      .filter(f => {
        const sc = f.seatClasses[0]
        return sc && sc.totalSeats - sc.bookedSeats > 0
      })
      .map(f => {
        const sc = f.seatClasses[0]!
        return {
          value: f.id,
          label: `${f.flightNumber} — ${f.departureTime.toLocaleDateString("en-US", { weekday: "short", day: "numeric", month: "short" })} at ${f.departureTime.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}`,
          seatClassId: sc.id,
          priceKES: sc.priceKES,
          availableSeats: sc.totalSeats - sc.bookedSeats,
          departureTime: f.departureTime,
        }
      })

    return successResponse({
      statusCode: STATUS_CODES.OK,
      message: `${options.length} alternative flight${options.length !== 1 ? "s" : ""} available.`,
      data: options,
    })
  } catch (error: any) {
    const resolved = error?.cause instanceof HttpError ? error.cause : error

    return errorResponse({
      statusCode: resolved.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR,
      error: resolved.name || "Unknown Error",
      message: resolved.message || "Failed to fetch available flights.",
    })
  }
}

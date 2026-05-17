"use server"

import { STATUS_CODES } from "@/constants/status-codes"
import { errorResponse, HttpError, successResponse } from "@/lib"
import prisma from "@/lib/prisma"
import { ApiResponse } from "@/types/api-response"
import { FlightSeatMap } from "@/types/seat"

export async function fetchFlightSeats(flightId: string): Promise<ApiResponse<FlightSeatMap>> {
  try {
    const flight = await prisma.flight.findUnique({
      where: { id: flightId },
      select: {
        id: true,
        flightNumber: true,
        aircraftLayout: { select: { aircraftType: true } },
        seats: {
          orderBy: [{ row: "asc" }, { column: "asc" }],
          select: {
            id: true,
            seatNumber: true,
            row: true,
            column: true,
            position: true,
            isBooked: true,
            isBlocked: true,
            seatClass: { select: { class: true } },
          },
        },
      },
    })

    if (!flight) {
      throw new HttpError({
        statusCode: STATUS_CODES.NOT_FOUND,
        message: "Flight not found.",
      })
    }

    // Group seats by class
    const classOrder = ["EXECUTIVE", "MIDDLE", "ECONOMY"]
    const classes = classOrder
      .filter(cls => flight.seats.some(s => s.seatClass?.class === cls))
      .map(cls => ({
        class: cls,
        rows: [...new Set(flight.seats.filter(s => s.seatClass?.class === cls).map(s => s.row))],
        seats: flight.seats.filter(s => s.seatClass?.class === cls),
      }))

    return successResponse({
      statusCode: STATUS_CODES.OK,
      data: {
        flightId: flight.id,
        flightNumber: flight.flightNumber,
        aircraftType: flight.aircraftLayout?.aircraftType || "Unknown",
        classes,
      },
    })
  } catch (error: any) {
    const resolved = error?.cause instanceof HttpError ? error.cause : error

    return errorResponse({
      statusCode: resolved.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR,
      error: resolved.name || "Unknown Error",
      message: resolved.message || "Failed to fetch seat map.",
    })
  }
}

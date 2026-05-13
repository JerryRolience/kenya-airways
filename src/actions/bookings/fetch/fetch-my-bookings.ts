"use server"

import { STATUS_CODES } from "@/constants/status-codes"
import { errorResponse, HttpError, successResponse } from "@/lib"
import prisma from "@/lib/prisma"
import { ApiResponse } from "@/types/api-response"
import { BookingListItem } from "@/types/booking"
import { currentUser } from "@clerk/nextjs/server"

export async function fetchMyBookings(): Promise<ApiResponse<BookingListItem[]>> {
  try {
    // ── Auth ──────────────────────────────────────────────────────────────────
    const clerkUser = await currentUser()
    if (!clerkUser) {
      throw new HttpError({
        statusCode: STATUS_CODES.UNAUTHORIZED,
        message: "You must be signed in to view your bookings.",
      })
    }

    const dbUser = await prisma.user.findUnique({
      where: { clerkId: clerkUser.id },
      select: { id: true },
    })
    if (!dbUser) {
      throw new HttpError({
        statusCode: STATUS_CODES.NOT_FOUND,
        message: "User account not found.",
      })
    }

    // ── Fetch bookings ────────────────────────────────────────────────────────
    const bookings = await prisma.booking.findMany({
      where: { userId: dbUser.id },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        reference: true,
        status: true,
        paymentStatus: true,
        totalAmount: true,
        isReturnTrip: true,
        createdAt: true,
        seatClass: {
          select: { class: true },
        },
        flight: {
          select: {
            flightNumber: true,
            departureTime: true,
            departure: { select: { code: true, city: true } },
            arrival: { select: { code: true, city: true } },
          },
        },
        returnFlight: {
          select: {
            flightNumber: true,
            departureTime: true,
          },
        },
        // Count passengers without fetching all details
        passengers: {
          select: { id: true },
        },
      },
    })

    // ── Shape response ────────────────────────────────────────────────────────
    const data: BookingListItem[] = bookings.map(b => ({
      id: b.id,
      reference: b.reference,
      status: b.status,
      paymentStatus: b.paymentStatus,
      totalAmount: b.totalAmount,
      isReturnTrip: b.isReturnTrip,
      createdAt: b.createdAt,
      classType: b.seatClass.class,
      passengerCount: b.passengers.length,
      outboundFlight: {
        flightNumber: b.flight.flightNumber,
        departureTime: b.flight.departureTime,
        from: b.flight.departure.code,
        to: b.flight.arrival.code,
        fromCity: b.flight.departure.city,
        toCity: b.flight.arrival.city,
      },
      returnFlight: b.returnFlight
        ? {
            flightNumber: b.returnFlight.flightNumber,
            departureTime: b.returnFlight.departureTime,
          }
        : undefined,
    }))

    return successResponse<BookingListItem[]>({
      statusCode: STATUS_CODES.OK,
      message: `${data.length} booking${data.length !== 1 ? "s" : ""} found.`,
      data,
    })
  } catch (error: unknown) {
    if (error instanceof HttpError) {
      return errorResponse({
        statusCode: error.statusCode,
        error: error.name,
        message: error.message,
      })
    }
    console.error("[getMyBookings] unexpected error:", error)
    return errorResponse({
      statusCode: STATUS_CODES.INTERNAL_SERVER_ERROR,
      error: "Internal Server Error",
      message: "Failed to fetch your bookings. Please try again.",
    })
  }
}

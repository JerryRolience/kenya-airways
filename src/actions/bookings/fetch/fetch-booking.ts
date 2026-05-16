"use server"

import { isUserAuthenticated } from "@/actions/auth/is-user-authenticated"
import { STATUS_CODES } from "@/constants/status-codes"
import { errorResponse, HttpError, successResponse } from "@/lib"
import prisma from "@/lib/prisma"
import { ApiResponse } from "@/types/api-response"
import { BookingDetail } from "@/types/booking"
import { Role } from "../../../../generated/prisma/enums"

export async function fetchBooking(reference: string): Promise<ApiResponse<BookingDetail>> {
  try {
    if (!reference?.trim()) {
      throw new HttpError({ statusCode: STATUS_CODES.BAD_REQUEST, message: "Booking reference is required." })
    }

    // 1. Authentication
    const res = await isUserAuthenticated()

    if (!res.success || !res.data) {
      throw new HttpError({
        message: res.message || "Authentication failed. Please log in again.",
        statusCode: res.statusCode || STATUS_CODES.UNAUTHORIZED,
      })
    }

    const { user } = res.data

    //  Fetch booking
    const booking = await prisma.booking.findUnique({
      where: { reference: reference.toUpperCase() },
      select: {
        id: true,
        reference: true,
        status: true,
        paymentStatus: true,
        totalAmount: true,
        isReturnTrip: true,
        createdAt: true,
        userId: true,
        flight: {
          select: {
            id: true,
            flightNumber: true,
            departureTime: true,
            arrivalTime: true,
            departure: { select: { code: true, city: true, name: true } },
            arrival: { select: { code: true, city: true, name: true } },
          },
        },
        returnFlight: {
          select: {
            id: true,
            flightNumber: true,
            departureTime: true,
            arrivalTime: true,
            departure: { select: { code: true, city: true, name: true } },
            arrival: { select: { code: true, city: true, name: true } },
          },
        },
        seatClass: { select: { class: true, priceKES: true } },
        passengers: {
          select: {
            id: true,
            seatNumber: true,
            passenger: {
              select: {
                id: true,
                title: true,
                firstName: true,
                lastName: true,
                email: true,
                passportNumber: true,
                nationality: true,
                dateOfBirth: true,
                relationship: true,
              },
            },
            ticket: { select: { id: true, ticketNumber: true, status: true, issuedAt: true } },
          },
        },
        payment: {
          select: { method: true, transactionRef: true, amount: true, paidAt: true },
        },
      },
    })

    if (!booking) {
      throw new HttpError({
        statusCode: STATUS_CODES.NOT_FOUND,
        message: `No booking found with reference "${reference.toUpperCase()}". Please check the reference and try again.`,
      })
    }

    //  Ownership check
    // Admins can view any booking; passengers can only view their own
    const isAdmin = user.role === Role.ADMIN || user.role === Role.SUPER_ADMIN
    if (!isAdmin && booking.userId !== user.id) {
      throw new HttpError({
        statusCode: STATUS_CODES.FORBIDDEN,
        message: "You do not have permission to view this booking.",
      })
    }

    //  Shape response
    const data: BookingDetail = {
      id: booking.id,
      reference: booking.reference,
      status: booking.status,
      paymentStatus: booking.paymentStatus,
      totalAmount: booking.totalAmount,
      isReturnTrip: booking.isReturnTrip,
      createdAt: booking.createdAt,
      outboundFlight: booking.flight,
      returnFlight: booking.returnFlight ?? undefined,
      seatClass: booking.seatClass,
      passengers: booking.passengers.map(bp => ({
        id: bp.id,
        title: bp.passenger.title,
        firstName: bp.passenger.firstName,
        lastName: bp.passenger.lastName,
        email: bp.passenger.email,
        passportNumber: bp.passenger.passportNumber,
        nationality: bp.passenger.nationality,
        dateOfBirth: bp.passenger.dateOfBirth,
        relationship: bp.passenger.relationship,
        seatNumber: bp.seatNumber,
        ticket: bp.ticket,
      })),
      payment: booking.payment ?? undefined,
    }

    return successResponse<BookingDetail>({
      statusCode: STATUS_CODES.OK,
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
    return errorResponse({
      statusCode: STATUS_CODES.INTERNAL_SERVER_ERROR,
      error: "Internal Server Error",
      message: "Failed to fetch booking details. Please try again.",
    })
  }
}

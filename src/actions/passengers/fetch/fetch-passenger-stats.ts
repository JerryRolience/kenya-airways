"use server"

import { isUserAuthenticated } from "@/actions/auth/is-user-authenticated"
import { STATUS_CODES } from "@/constants/status-codes"
import { errorResponse, HttpError, successResponse } from "@/lib"
import prisma from "@/lib/prisma"
import { PassengerStatsResponse } from "@/types/passenger"

export async function fetchPassengerStats(): Promise<PassengerStatsResponse> {
  try {
    // 1. Authenticate
    const res = await isUserAuthenticated()

    if (!res.success || !res.data?.user) {
      throw new HttpError({
        statusCode: STATUS_CODES.UNAUTHORIZED,
        message: "Access denied. You must be authenticated to view passenger statistics.",
      })
    }

    if (!res.data.isAdmin) {
      throw new HttpError({
        statusCode: STATUS_CODES.FORBIDDEN,
        message: "Access denied. Only administrators can view passenger statistics.",
      })
    }

    // 2. Date boundaries
    const now = new Date()
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59)

    // 3. Run all counts in parallel
    const [totalPassengers, registeredUsers, guestPassengers, newThisMonth, newLastMonth, totalBookings, kenyanPassengers, totalNationalities] = await Promise.all([
      // Total passengers
      prisma.passenger.count(),

      // Registered users (linked to user account)
      prisma.passenger.count({ where: { userId: { not: null } } }),

      // Guest passengers (no user account)
      prisma.passenger.count({ where: { userId: null } }),

      // New passengers this month
      prisma.passenger.count({ where: { createdAt: { gte: thisMonthStart } } }),

      // New passengers last month
      prisma.passenger.count({ where: { createdAt: { gte: lastMonthStart, lte: lastMonthEnd } } }),

      // Total bookings across all passengers
      prisma.bookingPassenger.count(),

      // kenyan passengers
      prisma.passenger.count({ where: { nationality: "Kenyan" } }),

      // Nationality breakdown
      prisma.passenger.groupBy({ by: ["nationality"], _count: { nationality: true } }),
    ])

    const otherPassengers = totalPassengers - kenyanPassengers
    const newPassengerChange = newThisMonth - newLastMonth

    return successResponse({
      statusCode: STATUS_CODES.OK,
      message: "Passenger stats fetched successfully.",
      data: {
        totalPassengers,
        registeredUsers,
        guestPassengers,
        newThisMonth,
        newLastMonth,
        newPassengerChange,
        totalBookings,
        byNationality: {
          totalNationalities: totalNationalities.length,
          kenyanPassengers,
          otherPassengers,
        },
      },
    })
  } catch (error: any) {
    const resolved = error?.cause instanceof HttpError ? error.cause : error

    return errorResponse({
      statusCode: resolved.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR,
      error: resolved.name || "Unknown Error",
      message: resolved.message || "An error occurred while fetching passenger statistics.",
    })
  }
}

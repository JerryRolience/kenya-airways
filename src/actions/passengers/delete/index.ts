"use server"

import { isUserAuthenticated } from "@/actions/auth/is-user-authenticated"
import { STATUS_CODES } from "@/constants/status-codes"
import { errorResponse, HttpError, successResponse } from "@/lib"
import prisma from "@/lib/prisma"
import { ApiResponse } from "@/types/api-response"
import { IdSchema } from "@/validators/id"

export async function deletePassenger(passengerId: string): Promise<ApiResponse> {
  try {
    return await prisma.$transaction(async tx => {
      const validatedId = IdSchema.parse(passengerId)

      // 1. Authenticate
      const res = await isUserAuthenticated()

      if (!res.success || !res.data?.user) {
        throw new HttpError({
          statusCode: STATUS_CODES.UNAUTHORIZED,
          message: "Access denied. You must be authenticated to delete a passenger.",
        })
      }

      // 2. Find the passenger
      const passenger = await tx.passenger.findUnique({
        where: { id: validatedId },
        include: { _count: { select: { bookingPassengers: true } } },
      })

      if (!passenger) {
        throw new HttpError({
          statusCode: STATUS_CODES.NOT_FOUND,
          message: "Passenger not found. They may have already been removed.",
        })
      }

      // 3. Authorization: Admin can delete any, user can delete their own
      const isOwner = passenger.userId === res.data.user.id
      const isAdmin = res.data.isAdmin

      if (!isOwner && !isAdmin) {
        throw new HttpError({
          statusCode: STATUS_CODES.UNAUTHORIZED,
          message: "Access denied. You can only delete your own passenger profile.",
        })
      }

      // 4. Prevent deletion of the SELF relationship passenger if they have bookings
      if (passenger.relationship === "SELF" && passenger._count.bookingPassengers > 0 && !isAdmin) {
        throw new HttpError({
          statusCode: STATUS_CODES.BAD_REQUEST,
          message: "Cannot delete your primary passenger profile while you have active bookings. Please contact support for assistance.",
        })
      }

      // 5. Check for active bookings
      if (passenger._count.bookingPassengers > 0 && !isAdmin) {
        throw new HttpError({
          statusCode: STATUS_CODES.BAD_REQUEST,
          message: `This passenger has ${passenger._count.bookingPassengers} booking${passenger._count.bookingPassengers === 1 ? "" : "s"}. Please cancel the bookings first before deleting this passenger profile.`,
        })
      }

      const passengerName = `${passenger.firstName} ${passenger.lastName}`

      // 6. Delete the passenger (cascades to BookingPassenger if no bookings or admin override)
      await tx.passenger.delete({
        where: { id: validatedId },
      })

      return successResponse({
        statusCode: STATUS_CODES.OK,
        message: `Passenger ${passengerName} has been successfully removed.`,
      })
    })
  } catch (error: any) {
    const resolved = error?.cause instanceof HttpError ? error.cause : error

    return errorResponse({
      statusCode: resolved.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR,
      error: resolved.name || "Unknown Error",
      message: resolved.message || "An error occurred while deleting the passenger.",
    })
  }
}

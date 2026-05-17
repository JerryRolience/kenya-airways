"use server"

import { STATUS_CODES } from "@/constants/status-codes"
import { errorResponse, HttpError, successResponse } from "@/lib"
import prisma from "@/lib/prisma"
import { PassengerProfileResponse } from "@/types/passenger"
import { PassengerFormValues } from "@/validators/booking"
import { auth } from "@clerk/nextjs/server"
import { PassengerRelation } from "../../../../generated/prisma/enums"

export async function fetchPassengerProfile(): Promise<PassengerProfileResponse> {
  try {
    const { userId } = await auth()

    if (!userId) {
      throw new HttpError({
        statusCode: STATUS_CODES.UNAUTHORIZED,
        message: "You must be signed in. Please sign in and try again.",
      })
    }

    // Find the user
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        // Get their SELF passenger profile
        passengers: {
          where: { relationship: PassengerRelation.SELF },
          select: {
            title: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            passportNumber: true,
            nationality: true,
            dateOfBirth: true,
          },
          take: 1,
        },
      },
    })

    if (!user) {
      throw new HttpError({
        statusCode: STATUS_CODES.NOT_FOUND,
        message: "User account not found. Please contact support.",
      })
    }

    // Build pre-fill data from database
    const profile: Partial<PassengerFormValues> = {
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email || "",
      phone: user.phone || "",
      // If passenger profile exists, use those details
      ...(user.passengers[0]
        ? {
            title: user.passengers[0].title || undefined,
            firstName: user.passengers[0].firstName || user.firstName,
            lastName: user.passengers[0].lastName || user.lastName,
            email: user.passengers[0].email || user.email,
            phone: user.passengers[0].phone || user.phone || "",
            passportNumber: user.passengers[0].passportNumber || "",
            nationality: user.passengers[0].nationality || "",
            dateOfBirth: user.passengers[0].dateOfBirth || undefined,
          }
        : {}),
    }

    return successResponse({ statusCode: STATUS_CODES.OK, message: "Passenger profile fetched.", data: profile })
  } catch (error: any) {
    const resolved = error?.cause instanceof HttpError ? error.cause : error

    return errorResponse({
      statusCode: resolved.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR,
      error: resolved.name || "Unknown Error",
      message: resolved.message || "Failed to fetch profile.",
    })
  }
}

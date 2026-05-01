"use server"

import { STATUS_CODES } from "@/constants/status-codes"
import { errorResponse, HttpError, successResponse } from "@/lib"
import prisma from "@/lib/prisma"
import { ApiResponse } from "@/types/api-response"
import { SignUpPassengerData } from "@/types/auth"
import { SignUpPassengerSchema } from "@/validators/auth"
import { currentUser } from "@clerk/nextjs/server"
import { PassengerRelation, Role } from "../../../generated/prisma/enums"

export async function onSignUpPassenger(data: SignUpPassengerData): Promise<ApiResponse<null>> {
  try {
    return await prisma.$transaction(async tx => {
      // 1. Validate incoming data
      const { dateOfBirth, phone, firstName, lastName, title, email, passportNumber, nationality } = SignUpPassengerSchema.parse(data)

      // 2. Get authenticated Clerk user
      const currentClerkUser = await currentUser()
      if (!currentClerkUser) {
        throw new HttpError({
          statusCode: STATUS_CODES.UNAUTHORIZED,
          message: "An error occurred while authenticating your session. Please try again.",
        })
      }

      // 3. Check if a user with the same email already exists to prevent duplicate accounts
      const existingUser = await tx.user.findUnique({
        where: { clerkId: currentClerkUser.id },
        select: { id: true },
      })

      if (existingUser) {
        throw new HttpError({
          statusCode: STATUS_CODES.CONFLICT,
          message: "An account with this email already exists. Please sign in to your account or use a different email to create a new account.",
        })
      }

      // 4. Create new user account
      const user = await tx.user.create({
        data: {
          clerkId: currentClerkUser.id,
          email,
          firstName,
          lastName,
          phone,
          role: Role.PASSENGER,
        },
        select: { id: true, firstName: true, lastName: true, phone: true, email: true },
      })

      if (!user) {
        throw new HttpError({
          statusCode: STATUS_CODES.INTERNAL_SERVER_ERROR,
          message: "An error occurred while creating your account. Please try again later or contact support if the issue persists.",
        })
      }

      // Create the passenger profile
      await tx.passenger.create({
        data: {
          userId: user.id,
          passportNumber,
          nationality,
          dateOfBirth,
          firstName: user.firstName,
          lastName: user.lastName,
          title,
          phone: user.phone || phone,
          email: user.email,
          relationship: PassengerRelation.SELF,
        },
      })

      return successResponse({
        statusCode: STATUS_CODES.CREATED,
        message: `Welcome aboard, ${user.firstName} ${user.lastName}!`,
      })
    })
  } catch (error: any) {
    const resolved = error instanceof HttpError ? error : error

    return errorResponse({
      statusCode: resolved.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR,
      error: resolved.name || "Unknown Error",
      message: resolved.message || "An error occurred while creating your account. Please try again later or contact support if the issue persists.",
    })
  }
}

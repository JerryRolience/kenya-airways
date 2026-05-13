"use server"

import { isUserAuthenticated } from "@/actions/auth/is-user-authenticated"
import { STATUS_CODES } from "@/constants/status-codes"
import { errorResponse, HttpError, successResponse } from "@/lib"
import prisma from "@/lib/prisma"
import { ApiResponse } from "@/types/api-response"
import { UpdatePassengerInputData } from "@/types/passenger"
import { UpdatePassengerSchema } from "@/validators/passenger"

export async function updatePassenger(data: UpdatePassengerInputData): Promise<ApiResponse> {
  try {
    return await prisma.$transaction(async tx => {
      const validatedData = UpdatePassengerSchema.parse(data)

      // 1. Authenticate
      const res = await isUserAuthenticated()

      if (!res.success || !res.data?.user) {
        throw new HttpError({
          statusCode: STATUS_CODES.UNAUTHORIZED,
          message: "Access denied. You must be authenticated to update passenger details.",
        })
      }

      // 2. Find the existing passenger
      const existingPassenger = await tx.passenger.findUnique({
        where: { id: validatedData.id },
        select: {
          id: true,
          userId: true,
          firstName: true,
          lastName: true,
          email: true,
          passportNumber: true,
        },
      })

      if (!existingPassenger) {
        throw new HttpError({
          statusCode: STATUS_CODES.NOT_FOUND,
          message: "Passenger not found. Please check the passenger details and try again.",
        })
      }

      // 3. Authorization: Admin can update any passenger, user can update their own
      const isOwner = existingPassenger.userId === res.data.user.id
      const isAdmin = res.data.isAdmin

      if (!isOwner && !isAdmin) {
        throw new HttpError({
          statusCode: STATUS_CODES.UNAUTHORIZED,
          message: "Access denied. You can only update your own passenger profile.",
        })
      }

      // 4. If changing passport number, check for duplicates under the same user
      if (validatedData.passportNumber && validatedData.passportNumber !== existingPassenger.passportNumber) {
        const duplicate = await tx.passenger.findFirst({
          where: {
            userId: existingPassenger.userId,
            passportNumber: validatedData.passportNumber,
            id: { not: validatedData.id },
          },
          select: { id: true },
        })

        if (duplicate) {
          throw new HttpError({
            statusCode: STATUS_CODES.CONFLICT,
            message: "A passenger with this passport number already exists under your account.",
          })
        }
      }

      // 5. Build update data (only provided fields)
      const updateData: any = {}

      if (validatedData.title !== undefined) updateData.title = validatedData.title
      if (validatedData.firstName !== undefined) updateData.firstName = validatedData.firstName
      if (validatedData.lastName !== undefined) updateData.lastName = validatedData.lastName
      if (validatedData.email !== undefined) updateData.email = validatedData.email
      if (validatedData.phone !== undefined) updateData.phone = validatedData.phone
      if (validatedData.passportNumber !== undefined) updateData.passportNumber = validatedData.passportNumber
      if (validatedData.nationality !== undefined) updateData.nationality = validatedData.nationality
      if (validatedData.dateOfBirth !== undefined) updateData.dateOfBirth = validatedData.dateOfBirth
      if (validatedData.relationship !== undefined) updateData.relationship = validatedData.relationship

      // 6. Update the passenger
      const updatedPassenger = await tx.passenger.update({
        where: { id: validatedData.id },
        data: updateData,
        select: {
          id: true,
          firstName: true,
          lastName: true,
          passportNumber: true,
        },
      })

      // 7. Build success message
      const changes: string[] = []
      if (validatedData.firstName || validatedData.lastName) changes.push("name")
      if (validatedData.email) changes.push("email")
      if (validatedData.phone) changes.push("phone")
      if (validatedData.passportNumber) changes.push("passport")
      if (validatedData.nationality) changes.push("nationality")
      if (validatedData.dateOfBirth) changes.push("date of birth")
      if (validatedData.relationship) changes.push("relationship")

      const changeText = changes.length > 0 ? `Updated ${changes.join(", ")}` : "No changes were made"

      return successResponse({
        statusCode: STATUS_CODES.OK,
        message: `${changeText} for ${updatedPassenger.firstName} ${updatedPassenger.lastName}.`,
      })
    })
  } catch (error: any) {
    const resolved = error?.cause instanceof HttpError ? error.cause : error

    return errorResponse({
      statusCode: resolved.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR,
      error: resolved.name || "Unknown Error",
      message: resolved.message || "An error occurred while updating the passenger.",
    })
  }
}

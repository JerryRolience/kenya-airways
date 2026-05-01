"use server"

import prisma from "@/lib/prisma"
import { currentUser } from "@clerk/nextjs/server"
import { Role } from "../../../generated/prisma/enums"
import { AuthenticatedUserData } from "@/types/auth"
import { STATUS_CODES } from "@/constants/status-codes"
import { ApiResponse } from "@/types/api-response"
import { errorResponse, HttpError, successResponse } from "@/lib"

export async function isUserAuthenticated(): Promise<ApiResponse<AuthenticatedUserData>> {
  try {
    const clerkUser = await currentUser()

    if (!clerkUser) {
      throw new HttpError({
        message: "You are not authenticated! Kindly sign-in to proceed.",
        statusCode: STATUS_CODES.UNAUTHORIZED,
      })
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: clerkUser.id },
      select: { id: true, email: true, firstName: true, lastName: true, role: true },
    })

    if (!user) {
      throw new HttpError({
        message: `Sorry the user ${clerkUser.fullName} does not exist in our system.`,
        statusCode: STATUS_CODES.NOT_FOUND,
      })
    }

    const isAdmin = user.role === Role.SUPER_ADMIN || user.role === Role.ADMIN
    const data: AuthenticatedUserData = { user, isAdmin }

    return successResponse({ statusCode: STATUS_CODES.OK, data })
  } catch (error: any) {
    return errorResponse({
      statusCode: error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR,
      error: error.name || "Unknown Error has occurred",
      message: error.message || "Unable to verify authentication",
    })
  }
}

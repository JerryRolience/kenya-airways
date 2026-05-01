"use server"

import { STATUS_CODES } from "@/constants/status-codes"
import { errorResponse, successResponse } from "@/lib"
import { HttpError } from "@/lib/http-error"
import prisma from "@/lib/prisma"
import { ApiResponse } from "@/types/api-response"
import { currentUser } from "@clerk/nextjs/server"
import { Role } from "../../../generated/prisma/browser"

export async function onSignInUser(): Promise<ApiResponse<{ id: string; firstName: string; lastName: string; role: Role }>> {
  try {
    // 1. Get authenticated Clerk user
    const clerkUser = await currentUser()

    if (!clerkUser) {
      throw new HttpError({
        statusCode: STATUS_CODES.UNAUTHORIZED,
        message: "An Error occurred while authenticating your session. Please try again.",
      })
    }

    const existingUser = await prisma.user.findUnique({
      where: { clerkId: clerkUser.id },
      select: { id: true, firstName: true, lastName: true, role: true },
    })

    if (!existingUser) {
      throw new HttpError({
        statusCode: STATUS_CODES.NOT_FOUND,
        message: "No user account found. Please ensure you have signed up for an account and try again.",
      })
    }

    return successResponse({
      statusCode: STATUS_CODES.OK,
      message: `Welcome back, ${existingUser.firstName} ${existingUser.lastName}!`,
      data: existingUser,
    })
  } catch (error: any) {
    const resolved = error?.cause instanceof HttpError ? error.cause : error

    return errorResponse({
      statusCode: resolved.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR,
      error: resolved.name || "Unknown Error",
      message: resolved.message || "An unexpected error occurred during authentication. Please try again later.",
    })
  }
}

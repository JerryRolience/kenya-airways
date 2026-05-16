"use server"

import { auth } from "@clerk/nextjs/server"
import { STATUS_CODES } from "@/constants/status-codes"
import { errorResponse, HttpError, successResponse } from "@/lib"
import prisma from "@/lib/prisma"
import { ApiResponse } from "@/types/api-response"
import { JobApplicationInputData } from "@/types/job-application"
import { JobApplicationSchema } from "@/validators/job-application"
import { Role } from "../../../../../generated/prisma/enums"

export async function applyForJobOpening(data: JobApplicationInputData): Promise<ApiResponse> {
  try {
    // 1. Validate input
    const validatedData = JobApplicationSchema.parse(data)

    // 2. Get authenticated user from Clerk
    const { userId } = await auth()

    if (!userId) {
      throw new HttpError({
        statusCode: STATUS_CODES.UNAUTHORIZED,
        message: "You must be signed in to apply for a position. Please sign in or create an account.",
      })
    }

    // 3. Find the user in our database
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { id: true, email: true, firstName: true, lastName: true, role: true },
    })

    if (!user) {
      throw new HttpError({
        statusCode: STATUS_CODES.NOT_FOUND,
        message: "User account not found. Please complete your profile first.",
      })
    }

    if (user.role !== Role.PASSENGER) {
      throw new HttpError({
        statusCode: STATUS_CODES.FORBIDDEN,
        message: "You cannot apply for positions with your current account. Staff members should use the internal job matching system.",
      })
    }

    // 4. Check if the opening exists and is open
    const opening = await prisma.jobOpening.findUnique({
      where: { id: validatedData.openingId },
      select: { id: true, title: true, isOpen: true, department: true },
    })

    if (!opening) {
      throw new HttpError({
        statusCode: STATUS_CODES.NOT_FOUND,
        message: "This job opening no longer exists. Please check the available positions and try again.",
      })
    }

    if (!opening.isOpen) {
      throw new HttpError({
        statusCode: STATUS_CODES.BAD_REQUEST,
        message: `The position "${opening.title}" is no longer accepting applications. Please check the available positions and try again.`,
      })
    }

    // 5. Check for duplicate application
    const existing = await prisma.jobApplication.findUnique({
      where: { userId_openingId: { userId: user.id, openingId: validatedData.openingId } },
    })

    if (existing) {
      throw new HttpError({
        statusCode: STATUS_CODES.CONFLICT,
        message: `You have already applied for "${opening.title}". You can only submit one application per position.`,
      })
    }

    // 6. Create the application
    await prisma.jobApplication.create({
      data: {
        userId: user.id,
        openingId: validatedData.openingId,
        coverLetter: validatedData.coverLetter,
        cvUrl: validatedData.cvUrl || null,
      },
    })

    return successResponse({
      statusCode: STATUS_CODES.CREATED,
      message: `Your application for "${opening.title}" has been submitted successfully! We'll review it and get back to you.`,
    })
  } catch (error: any) {
    const resolved = error?.cause instanceof HttpError ? error.cause : error

    return errorResponse({
      statusCode: resolved.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR,
      error: resolved.name || "Unknown Error",
      message: resolved.message || "An error occurred while submitting your application. Please try again.",
    })
  }
}

"use server"

import { isUserAuthenticated } from "@/actions/auth/is-user-authenticated"
import { STATUS_CODES } from "@/constants/status-codes"
import { errorResponse, HttpError, successResponse } from "@/lib"
import prisma from "@/lib/prisma"
import { ApiResponse } from "@/types/api-response"
import { CreateJobOpeningInputData } from "@/types/job-opening"
import { CreateJobOpeningSchema } from "@/validators/job-opening"

export async function createJobOpening(data: CreateJobOpeningInputData): Promise<ApiResponse> {
  try {
    return await prisma.$transaction(async tx => {
      const validatedData = CreateJobOpeningSchema.parse(data)

      // 1. Authenticate and check admin permissions
      const res = await isUserAuthenticated()

      if (!res.data?.isAdmin) {
        throw new HttpError({
          statusCode: STATUS_CODES.UNAUTHORIZED,
          message: "Access denied. You are not authorized to create job openings. Please contact your administrator.",
        })
      }

      // 2. Check for duplicate opening (same title + department)
      const existing = await tx.jobOpening.findFirst({
        where: {
          title: validatedData.title,
          department: validatedData.department,
          isOpen: true,
        },
        select: { id: true },
      })

      if (existing) {
        throw new HttpError({
          statusCode: STATUS_CODES.CONFLICT,
          message: "An open job opening with this title already exists in this department. Please close the existing opening first or use a different title.",
        })
      }

      // 3. Create the job opening
      const jobOpening = await tx.jobOpening.create({
        data: {
          title: validatedData.title,
          department: validatedData.department,
          description: validatedData.description,
          isOpen: validatedData.isOpen ?? true,
        },
        select: { id: true, title: true, department: true },
      })

      if (!jobOpening) {
        throw new HttpError({
          statusCode: STATUS_CODES.INTERNAL_SERVER_ERROR,
          message: "An error occurred while creating the job opening. Please try again later.",
        })
      }

      return successResponse({
        statusCode: STATUS_CODES.CREATED,
        message: `Job opening "${jobOpening.title}" has been created successfully in the ${jobOpening.department} department.`,
      })
    })
  } catch (error: any) {
    const resolved = error?.cause instanceof HttpError ? error.cause : error

    return errorResponse({
      statusCode: resolved.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR,
      error: resolved.name || "Unknown Error",
      message: resolved.message || "An error occurred while creating the job opening.",
    })
  }
}

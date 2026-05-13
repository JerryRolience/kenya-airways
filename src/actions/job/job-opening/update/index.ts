"use server"

import { isUserAuthenticated } from "@/actions/auth/is-user-authenticated"
import { STATUS_CODES } from "@/constants/status-codes"
import { errorResponse, HttpError, successResponse } from "@/lib"
import prisma from "@/lib/prisma"
import { ApiResponse } from "@/types/api-response"
import { UpdateJobOpeningInputData } from "@/types/job-opening"
import { UpdateJobOpeningSchema } from "@/validators/job-opening"

export async function updateJobOpening(data: UpdateJobOpeningInputData): Promise<ApiResponse> {
  try {
    return await prisma.$transaction(async tx => {
      const validatedData = UpdateJobOpeningSchema.parse(data)

      // 1. Authenticate and check admin permissions
      const res = await isUserAuthenticated()

      if (!res.data?.isAdmin) {
        throw new HttpError({
          statusCode: STATUS_CODES.UNAUTHORIZED,
          message: "Access denied. You are not authorized to update job openings. Please contact your administrator.",
        })
      }

      // 2. Find the existing job opening
      const existingOpening = await tx.jobOpening.findUnique({
        where: { id: validatedData.id },
        select: {
          id: true,
          title: true,
          department: true,
          isOpen: true,
          _count: { select: { applications: true, assignments: true } },
        },
      })

      if (!existingOpening) {
        throw new HttpError({
          statusCode: STATUS_CODES.NOT_FOUND,
          message: "Job opening not found. It may have been deleted or closed.",
        })
      }

      // 3. If changing title, check for duplicates
      if (validatedData.title && validatedData.title !== existingOpening.title) {
        const duplicate = await tx.jobOpening.findFirst({
          where: {
            title: validatedData.title,
            department: validatedData.department || existingOpening.department,
            isOpen: true,
            id: { not: validatedData.id },
          },
          select: { id: true },
        })

        if (duplicate) {
          throw new HttpError({
            statusCode: STATUS_CODES.CONFLICT,
            message: "Another open job opening with this title already exists in this department.",
          })
        }
      }

      // 4. Build update data (only provided fields)
      const updateData: any = {}

      if (validatedData.title !== undefined) {
        updateData.title = validatedData.title
      }
      if (validatedData.department !== undefined) {
        updateData.department = validatedData.department
      }
      if (validatedData.description !== undefined) {
        updateData.description = validatedData.description
      }
      if (validatedData.isOpen !== undefined) {
        updateData.isOpen = validatedData.isOpen

        // If closing the opening, set closedAt
        if (!validatedData.isOpen && existingOpening.isOpen) {
          updateData.closedAt = new Date()
        }

        // If reopening, clear closedAt
        if (validatedData.isOpen && !existingOpening.isOpen) {
          updateData.closedAt = null
        }
      }

      // 5. Update the job opening
      const updatedOpening = await tx.jobOpening.update({
        where: { id: validatedData.id },
        data: updateData,
        select: { id: true, title: true, department: true, isOpen: true },
      })

      // 6. Build success message
      const changes: string[] = []
      if (validatedData.title) changes.push("title")
      if (validatedData.department) changes.push("department")
      if (validatedData.description) changes.push("description")
      if (validatedData.isOpen !== undefined) {
        changes.push(validatedData.isOpen ? "job opening to reopened" : "job opening to closed")
      }

      const changeText = changes.length > 0 ? `Updated ${changes.join(", ")}` : "No changes were made"

      return successResponse({
        statusCode: STATUS_CODES.OK,
        message: `${changeText} for "${updatedOpening.title}" in ${updatedOpening.department}.`,
      })
    })
  } catch (error: any) {
    const resolved = error?.cause instanceof HttpError ? error.cause : error

    return errorResponse({
      statusCode: resolved.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR,
      error: resolved.name || "Unknown Error",
      message: resolved.message || "An error occurred while updating the job opening.",
    })
  }
}

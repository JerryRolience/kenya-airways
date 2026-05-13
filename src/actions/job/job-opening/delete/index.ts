"use server"

import { isUserAuthenticated } from "@/actions/auth/is-user-authenticated"
import { STATUS_CODES } from "@/constants/status-codes"
import { errorResponse, HttpError, successResponse } from "@/lib"
import prisma from "@/lib/prisma"
import { ApiResponse } from "@/types/api-response"
import { IdSchema } from "@/validators/id"

export async function deleteJobOpening(openingId: string): Promise<ApiResponse> {
  try {
    return await prisma.$transaction(async tx => {
      const validatedId = IdSchema.parse(openingId)

      // 1. Authenticate and check admin permissions
      const res = await isUserAuthenticated()

      if (!res.data?.isAdmin) {
        throw new HttpError({
          statusCode: STATUS_CODES.UNAUTHORIZED,
          message: "Access denied. You are not authorized to delete job openings. Please contact your administrator.",
        })
      }

      // 2. Find the job opening
      const opening = await tx.jobOpening.findUnique({
        where: { id: validatedId },
        include: { _count: { select: { applications: true, assignments: true } } },
      })

      if (!opening) {
        throw new HttpError({
          statusCode: STATUS_CODES.NOT_FOUND,
          message: "Job opening not found. It may have already been deleted.",
        })
      }

      // 3. Check if there are active applications
      if (opening._count.applications > 0) {
        throw new HttpError({
          statusCode: STATUS_CODES.BAD_REQUEST,
          message: `Cannot delete this opening. It has ${opening._count.applications} application${opening._count.applications === 1 ? "" : "s"}. Please close the opening instead or process all applications first.`,
        })
      }

      // 4. Check if there are active assignments
      if (opening._count.assignments > 0) {
        throw new HttpError({
          statusCode: STATUS_CODES.BAD_REQUEST,
          message: `Cannot delete this opening. It has ${opening._count.assignments} employee assignment${opening._count.assignments === 1 ? "" : "s"}. Please remove the assignments first.`,
        })
      }

      // 5. Delete the opening
      await tx.jobOpening.delete({ where: { id: validatedId } })

      return successResponse({
        statusCode: STATUS_CODES.OK,
        message: `Job opening "${opening.title}" has been permanently deleted.`,
      })
    })
  } catch (error: any) {
    const resolved = error?.cause instanceof HttpError ? error.cause : error

    return errorResponse({
      statusCode: resolved.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR,
      error: resolved.name || "Unknown Error",
      message: resolved.message || "An error occurred while deleting the job opening.",
    })
  }
}

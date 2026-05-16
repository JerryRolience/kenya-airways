"use server"

import { isUserAuthenticated } from "@/actions/auth/is-user-authenticated"
import { STATUS_CODES } from "@/constants/status-codes"
import { errorResponse, HttpError, successResponse } from "@/lib"
import prisma from "@/lib/prisma"
import { ApiResponse } from "@/types/api-response"
import { IdSchema } from "@/validators/id"

export async function removeMatch(assignmentId: string): Promise<ApiResponse> {
  try {
    return await prisma.$transaction(async tx => {
      const validatedId = IdSchema.parse(assignmentId)

      // 1. Authenticate and check admin permissions
      const res = await isUserAuthenticated()

      if (!res.data?.isAdmin) {
        throw new HttpError({
          statusCode: STATUS_CODES.UNAUTHORIZED,
          message: "Access denied. You are not authorized to remove matches. Please contact your administrator.",
        })
      }

      // 2. Find the assignment
      const assignment = await tx.employeeAssignment.findUnique({
        where: { id: validatedId },
        include: {
          employee: { select: { firstName: true, lastName: true, employeeNo: true } },
          opening: { select: { title: true, department: true } },
        },
      })

      if (!assignment) {
        throw new HttpError({
          statusCode: STATUS_CODES.NOT_FOUND,
          message: "Match not found. It may have already been removed.",
        })
      }

      // 3. Delete the assignment
      await tx.employeeAssignment.delete({ where: { id: validatedId } })

      return successResponse({
        statusCode: STATUS_CODES.OK,
        message: `Match between ${assignment.employee.firstName} ${assignment.employee.lastName} and "${assignment.opening.title}" has been removed.`,
      })
    })
  } catch (error: any) {
    const resolved = error?.cause instanceof HttpError ? error.cause : error

    return errorResponse({
      statusCode: resolved.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR,
      error: resolved.name || "Unknown Error",
      message: resolved.message || "An error occurred while removing the match.",
    })
  }
}

"use server"

import { isUserAuthenticated } from "@/actions/auth/is-user-authenticated"
import { STATUS_CODES } from "@/constants/status-codes"
import { errorResponse, HttpError, successResponse } from "@/lib"
import prisma from "@/lib/prisma"
import { ApiResponse } from "@/types/api-response"
import { MatchEmployeeInputData } from "@/types/match"
import { MatchEmployeeSchema } from "@/validators/match"
import { ApplicationStatus } from "../../../../../generated/prisma/enums"

export async function matchEmployeeToOpening(data: MatchEmployeeInputData): Promise<ApiResponse> {
  try {
    return await prisma.$transaction(async tx => {
      const validatedData = MatchEmployeeSchema.parse(data)

      // 1. Authenticate and check admin permissions
      const res = await isUserAuthenticated()

      if (!res.data?.isAdmin) {
        throw new HttpError({
          statusCode: STATUS_CODES.UNAUTHORIZED,
          message: "Access denied. You are not authorized to match employees to openings. Please contact your administrator.",
        })
      }

      // 2. Find the employee
      const employee = await tx.employee.findUnique({
        where: { id: validatedData.employeeId },
        include: {
          user: { select: { id: true, firstName: true, lastName: true, email: true, role: true } },
        },
      })

      if (!employee) {
        throw new HttpError({
          statusCode: STATUS_CODES.NOT_FOUND,
          message: "Employee not found. Please check the employee details and try again.",
        })
      }

      // 3. Check if employee is active
      if (!employee.isActive) {
        throw new HttpError({
          statusCode: STATUS_CODES.BAD_REQUEST,
          message: "Cannot match an inactive employee. Please activate the employee first before matching them to an opening.",
        })
      }

      // 4. Find the job opening
      const opening = await tx.jobOpening.findUnique({
        where: { id: validatedData.openingId },
        select: { id: true, title: true, department: true, isOpen: true },
      })

      if (!opening) {
        throw new HttpError({
          statusCode: STATUS_CODES.NOT_FOUND,
          message: "Job opening not found. It may have been closed or deleted.",
        })
      }

      // 5. Check if opening is still open
      if (!opening.isOpen) {
        throw new HttpError({
          statusCode: STATUS_CODES.BAD_REQUEST,
          message: "This job opening is no longer accepting matches. Please reopen the opening first or select a different opening.",
        })
      }

      // 6. Check if employee is already matched to this opening
      const existingAssignment = await tx.employeeAssignment.findUnique({
        where: {
          employeeId_openingId: {
            employeeId: validatedData.employeeId,
            openingId: validatedData.openingId,
          },
        },
      })

      if (existingAssignment) {
        throw new HttpError({
          statusCode: STATUS_CODES.CONFLICT,
          message: `This employee is already matched to this opening. Each employee can only be matched once per opening.`,
        })
      }

      // 7. Check if employee already has an active assignment in the same department
      const existingDeptAssignment = await tx.employeeAssignment.findFirst({
        where: {
          employeeId: validatedData.employeeId,
          opening: { department: opening.department, isOpen: true },
        },
        include: { opening: { select: { title: true } } },
      })

      if (existingDeptAssignment) {
        throw new HttpError({
          statusCode: STATUS_CODES.CONFLICT,
          message: `This employee is already matched to "${existingDeptAssignment.opening.title}" in the ${opening.department} department. Consider closing that assignment first.`,
        })
      }

      // 8. Create the assignment
      const assignment = await tx.employeeAssignment.create({
        data: {
          employeeId: validatedData.employeeId,
          openingId: validatedData.openingId,
          notes: validatedData.notes || null,
        },
        select: {
          id: true,
          matchedAt: true,
          employee: { select: { firstName: true, lastName: true, employeeNo: true } },
          opening: { select: { title: true, department: true } },
        },
      })

      // 9. Update any pending job applications for this user + opening
      if (employee.user) {
        const application = await tx.jobApplication.findUnique({
          where: {
            userId_openingId: {
              userId: employee.user.id,
              openingId: validatedData.openingId,
            },
          },
          select: { id: true, status: true },
        })

        if (application && application.status === ApplicationStatus.PENDING) {
          await tx.jobApplication.update({
            where: { id: application.id },
            data: { status: ApplicationStatus.ACCEPTED },
          })
        }
      }

      return successResponse({
        statusCode: STATUS_CODES.CREATED,
        message: `${assignment.employee.firstName} ${assignment.employee.lastName} (${assignment.employee.employeeNo}) has been successfully matched to "${assignment.opening.title}" in ${assignment.opening.department}.`,
      })
    })
  } catch (error: any) {
    const resolved = error?.cause instanceof HttpError ? error.cause : error

    return errorResponse({
      statusCode: resolved.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR,
      error: resolved.name || "Unknown Error",
      message: resolved.message || "An error occurred while matching the employee to the opening.",
    })
  }
}

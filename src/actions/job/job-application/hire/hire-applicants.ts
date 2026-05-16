"use server"

import { isUserAuthenticated } from "@/actions/auth/is-user-authenticated"
import { generateCode } from "@/actions/lib/generate-codes"
import { STATUS_CODES } from "@/constants/status-codes"
import { errorResponse, HttpError, successResponse } from "@/lib"
import prisma from "@/lib/prisma"
import { ApiResponse } from "@/types/api-response"
import { ApplicationStatus, Role } from "../../../../../generated/prisma/enums"

export async function hireApplicant(applicationId: string): Promise<ApiResponse> {
  try {
    return await prisma.$transaction(async tx => {
      const res = await isUserAuthenticated()

      if (!res.data?.isAdmin) {
        throw new HttpError({
          statusCode: STATUS_CODES.UNAUTHORIZED,
          message: "Access denied. Admin privileges are required to perform this action.",
        })
      }

      // 1. Find the application
      const application = await tx.jobApplication.findUnique({
        where: { id: applicationId },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phone: true,
              role: true,
              employee: { select: { id: true } },
            },
          },
          opening: { select: { id: true, title: true, department: true, isOpen: true } },
        },
      })

      if (!application) {
        throw new HttpError({
          statusCode: STATUS_CODES.NOT_FOUND,
          message: "Application not found. Please check the application details and try again.",
        })
      }

      if (application.status === ApplicationStatus.ACCEPTED) {
        throw new HttpError({ statusCode: STATUS_CODES.BAD_REQUEST, message: "This applicant has already been hired." })
      }

      if (application.user.role === Role.ADMIN || application.user.role === Role.SUPER_ADMIN) {
        throw new HttpError({ statusCode: STATUS_CODES.FORBIDDEN, message: "You cannot hire an admin or super admin." })
      }

      if (application.user.employee) {
        throw new HttpError({
          statusCode: STATUS_CODES.BAD_REQUEST,
          message: "This user already has an employee profile. You could just match them to the opening instead of hiring again.",
        })
      }

      if (!application.opening.isOpen) {
        throw new HttpError({
          statusCode: STATUS_CODES.BAD_REQUEST,
          message: "This job opening is closed. Please open the position before hiring an applicant for it.",
        })
      }

      // 2. Generate employee number
      const employeeNo = await generateCode(tx, "EMP")

      // 3. Create employee record
      const employee = await tx.employee.create({
        data: {
          employeeNo,
          userId: application.user.id,
          firstName: application.user.firstName,
          lastName: application.user.lastName,
          email: application.user.email,
          phone: application.user.phone,
          department: application.opening.department,
          position: application.opening.title,
          isActive: true,
        },
        select: { id: true, firstName: true, lastName: true, employeeNo: true },
      })

      // 4. Upgrade user role
      await tx.user.update({ where: { id: application.user.id }, data: { role: Role.EMPLOYEE } })

      // 5. Create employee assignment (match)
      await tx.employeeAssignment.create({
        data: {
          employeeId: employee.id,
          openingId: application.opening.id,
          notes: `Hired via application. Previously ${application.status.toLowerCase()}.`,
        },
      })

      // 6. Update application status
      await tx.jobApplication.update({
        where: { id: applicationId },
        data: { status: ApplicationStatus.ACCEPTED },
      })

      return successResponse({
        statusCode: STATUS_CODES.OK,
        message: `${employee.firstName} ${employee.lastName} has been hired as ${application.opening.title} (${employee.employeeNo}).`,
      })
    })
  } catch (error: any) {
    const resolved = error?.cause instanceof HttpError ? error.cause : error

    return errorResponse({
      statusCode: resolved.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR,
      error: resolved.name || "Unknown Error",
      message: resolved.message || "An error occurred while hiring the applicant.",
    })
  }
}

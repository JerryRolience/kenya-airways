"use server"

import prisma from "@/lib/prisma"
import { isUserAuthenticated } from "@/actions/auth/is-user-authenticated"
import { errorResponse, successResponse, HttpError } from "@/lib"
import { STATUS_CODES } from "@/constants/status-codes"
import { IdSchema } from "@/validators/id"
import { ApiResponse } from "@/types/api-response"
import { Role } from "../../../../generated/prisma/enums"

export async function deleteEmployee(employeeId: string): Promise<ApiResponse> {
  try {
    return await prisma.$transaction(async tx => {
      const validatedEmployeeId = IdSchema.parse(employeeId)

      // 1. Authenticate user
      const res = await isUserAuthenticated()

      if (!res.success || !res.data?.user) {
        throw new HttpError({
          statusCode: STATUS_CODES.UNAUTHORIZED,
          message: "Access denied. You must be authenticated to delete an employee.",
        })
      }

      // 2. Only admins can delete employees
      if (!res.data?.isAdmin) {
        throw new HttpError({
          statusCode: STATUS_CODES.FORBIDDEN,
          message: "Access denied. Only administrators have permission to delete employee records from the system.",
        })
      }

      // 3. Find the employee
      const employee = await tx.employee.findUnique({
        where: { id: validatedEmployeeId },
        include: {
          user: { select: { id: true, role: true, firstName: true, lastName: true } },
          assignments: { select: { id: true } },
        },
      })

      if (!employee) {
        throw new HttpError({
          statusCode: STATUS_CODES.NOT_FOUND,
          message: "Employee not found. They may have already been removed from the system.",
        })
      }

      // 4. Prevent deletion of SUPER_ADMIN by non-super admins
      if (employee.user?.role === Role.SUPER_ADMIN && res.data?.user.role !== Role.SUPER_ADMIN) {
        throw new HttpError({
          statusCode: STATUS_CODES.FORBIDDEN,
          message: "You cannot delete a Super Admin's employee profile. Only another Super Admin can perform this action.",
        })
      }

      // 5. Prevent self-deletion
      if (employee.user?.id === res.data?.user.id) {
        throw new HttpError({
          statusCode: STATUS_CODES.BAD_REQUEST,
          message: "You cannot delete your own employee profile. Please ask another administrator to perform this action.",
        })
      }

      // 6. Check if employee has active assignments
      if (employee.assignments.length > 0) {
        throw new HttpError({
          statusCode: STATUS_CODES.BAD_REQUEST,
          message: "This employee has active job assignments. Please reassign or remove these assignments before deleting the employee profile.",
        })
      }

      const employeeName = `${employee.firstName} ${employee.lastName}`
      const userRole = employee.user?.role

      // 7. Delete the employee record
      await tx.employee.delete({ where: { id: employee.id } })

      // 8. Demote the user back to PASSENGER (if they had a user account)
      if (employee.user) {
        await tx.user.update({ where: { id: employee.user.id }, data: { role: Role.PASSENGER } })
      }

      return successResponse({
        statusCode: STATUS_CODES.OK,
        message: `${employeeName} has been successfully removed from the system${userRole ? ` and their role has been reset to Passenger` : ""}.`,
      })
    })
  } catch (error: any) {
    const resolved = error?.cause instanceof HttpError ? error.cause : error

    return errorResponse({
      statusCode: resolved.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR,
      error: resolved.name || "Unknown Error",
      message: resolved.message || "An error occurred while deleting the employee. Please try again.",
    })
  }
}

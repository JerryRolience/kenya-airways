"use server"

import { isUserAuthenticated } from "@/actions/auth/is-user-authenticated"
import { STATUS_CODES } from "@/constants/status-codes"
import { errorResponse, HttpError, successResponse } from "@/lib"
import prisma from "@/lib/prisma"
import { AvailableEmployeeOption, AvailableEmployeesResponse } from "@/types/match"

export async function fetchAvailableEmployees(openingId: string): Promise<AvailableEmployeesResponse> {
  try {
    // 1. Authenticate
    const res = await isUserAuthenticated()

    if (!res.data?.isAdmin) {
      throw new HttpError({
        statusCode: STATUS_CODES.FORBIDDEN,
        message: "Access denied. Only administrators can view available employees.",
      })
    }

    // 2. Find the opening to get its department
    const opening = await prisma.jobOpening.findUnique({
      where: { id: openingId },
      select: { id: true, department: true, title: true, isOpen: true },
    })

    if (!opening) {
      throw new HttpError({
        statusCode: STATUS_CODES.NOT_FOUND,
        message: "Job opening not found. Please select a valid opening.",
      })
    }

    if (!opening.isOpen) {
      return successResponse({
        statusCode: STATUS_CODES.OK,
        message: "This opening is closed. No employees can be matched.",
        data: [],
      })
    }

    // 3. Fetch employees in the SAME department who are:
    //    - Active
    //    - NOT already matched to THIS specific opening
    const employees = await prisma.employee.findMany({
      where: {
        isActive: true,
        department: opening.department, // ← Same department as the opening
        // Exclude employees already matched to THIS opening
        assignments: { none: { openingId: openingId } },
      },
      orderBy: [{ firstName: "asc" }, { lastName: "asc" }],
      select: {
        id: true,
        firstName: true,
        lastName: true,
        position: true,
        employeeNo: true,
      },
    })

    // 4. Map to simple options
    const options: AvailableEmployeeOption[] = employees.map(emp => ({
      value: emp.id,
      label: `${emp.firstName} ${emp.lastName} (${emp.position})`,
    }))

    return successResponse({
      statusCode: STATUS_CODES.OK,
      message: `${options.length} employee${options.length !== 1 ? "s" : ""} available in ${opening.department}.`,
      data: options,
    })
  } catch (error: any) {
    const resolved = error?.cause instanceof HttpError ? error.cause : error

    return errorResponse({
      statusCode: resolved.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR,
      error: resolved.name || "Unknown Error",
      message: resolved.message || "An error occurred while fetching available employees.",
    })
  }
}

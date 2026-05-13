"use server"

import { isUserAuthenticated } from "@/actions/auth/is-user-authenticated"
import { STATUS_CODES } from "@/constants/status-codes"
import { errorResponse, HttpError, successResponse } from "@/lib"
import prisma from "@/lib/prisma"
import { EmployeeStatsResponse } from "@/types/employee"

export async function fetchEmployeeStats(): Promise<EmployeeStatsResponse> {
  try {
    // 1. Authenticate
    const res = await isUserAuthenticated()

    if (!res.success || !res.data?.user) {
      throw new HttpError({
        statusCode: STATUS_CODES.UNAUTHORIZED,
        message: "Access denied. You must be authenticated to view employee statistics.",
      })
    }

    if (!res.data.isAdmin) {
      throw new HttpError({
        statusCode: STATUS_CODES.FORBIDDEN,
        message: "Access denied. Only administrators can view employee statistics.",
      })
    }

    // 2. Date boundaries
    const now = new Date()
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59)

    // 3. Run all counts in parallel
    const [
      totalEmployees,
      activeEmployees,
      inactiveEmployees,
      newThisMonth,
      newLastMonth,
      // Department counts
      flightOperations,
      cabinCrew,
      groundStaff,
      engineering,
      it,
      humanResources,
      finance,
      marketing,
      customerService,
    ] = await Promise.all([
      // Total employees
      prisma.employee.count(),

      // Active employees
      prisma.employee.count({
        where: { isActive: true },
      }),

      // Inactive employees
      prisma.employee.count({
        where: { isActive: false },
      }),

      // New employees this month
      prisma.employee.count({
        where: {
          createdAt: { gte: thisMonthStart },
        },
      }),

      // New employees last month
      prisma.employee.count({
        where: {
          createdAt: { gte: lastMonthStart, lte: lastMonthEnd },
        },
      }),

      // By department
      prisma.employee.count({
        where: { department: "Flight Operations" },
      }),
      prisma.employee.count({
        where: { department: "Cabin Crew" },
      }),
      prisma.employee.count({
        where: { department: "Ground Staff" },
      }),
      prisma.employee.count({
        where: { department: "Engineering" },
      }),
      prisma.employee.count({
        where: { department: "IT" },
      }),
      prisma.employee.count({
        where: { department: "Human Resources" },
      }),
      prisma.employee.count({
        where: { department: "Finance" },
      }),
      prisma.employee.count({
        where: { department: "Marketing" },
      }),
      prisma.employee.count({
        where: { department: "Customer Service" },
      }),
    ])

    const newEmployeeChange = newThisMonth - newLastMonth

    // Count departments that have at least one employee
    const departments = [flightOperations, cabinCrew, groundStaff, engineering, it, humanResources, finance, marketing, customerService]
    const totalDepartments = departments.filter(count => count > 0).length

    return successResponse({
      statusCode: STATUS_CODES.OK,
      message: "Employee stats fetched successfully.",
      data: {
        totalEmployees,
        activeEmployees,
        inactiveEmployees,
        newThisMonth,
        newLastMonth,
        newEmployeeChange,
        byDepartment: {
          flightOperations,
          cabinCrew,
          groundStaff,
          engineering,
          it,
          humanResources,
          finance,
          marketing,
          customerService,
        },
        totalDepartments,
      },
    })
  } catch (error: any) {
    const resolved = error?.cause instanceof HttpError ? error.cause : error

    return errorResponse({
      statusCode: resolved.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR,
      error: resolved.name || "Unknown Error",
      message: resolved.message || "An error occurred while fetching employee statistics.",
    })
  }
}

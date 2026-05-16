"use server"

import { isUserAuthenticated } from "@/actions/auth/is-user-authenticated"
import { STATUS_CODES } from "@/constants/status-codes"
import { errorResponse, HttpError, successResponse } from "@/lib"
import prisma from "@/lib/prisma"
import { MatchStatsResponse } from "@/types/match"

export async function fetchMatchStats(): Promise<MatchStatsResponse> {
  try {
    // 1. Authenticate
    const res = await isUserAuthenticated()

    if (!res.success || !res.data?.user) {
      throw new HttpError({
        statusCode: STATUS_CODES.UNAUTHORIZED,
        message: "Access denied. You must be authenticated to view match statistics.",
      })
    }

    if (!res.data.isAdmin) {
      throw new HttpError({
        statusCode: STATUS_CODES.FORBIDDEN,
        message: "Access denied. Only administrators can view match statistics.",
      })
    }

    // 2. Date boundaries
    const now = new Date()
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59)

    // 3. Run all counts in parallel
    const [
      totalMatches,
      newThisMonth,
      newLastMonth,
      activeMatches,
      closedMatches,
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
      // Total matches
      prisma.employeeAssignment.count(),

      // New matches this month
      prisma.employeeAssignment.count({ where: { matchedAt: { gte: thisMonthStart } } }),

      // New matches last month
      prisma.employeeAssignment.count({
        where: { matchedAt: { gte: lastMonthStart, lte: lastMonthEnd } },
      }),

      // Active matches (opening is still open)
      prisma.employeeAssignment.count({ where: { opening: { isOpen: true } } }),

      // Closed matches (opening is closed)
      prisma.employeeAssignment.count({ where: { opening: { isOpen: false } } }),

      // Department counts
      prisma.employeeAssignment.count({ where: { opening: { department: "Flight Operations" } } }),
      prisma.employeeAssignment.count({ where: { opening: { department: "Cabin Crew" } } }),
      prisma.employeeAssignment.count({ where: { opening: { department: "Ground Staff" } } }),
      prisma.employeeAssignment.count({ where: { opening: { department: "Engineering" } } }),
      prisma.employeeAssignment.count({ where: { opening: { department: "IT" } } }),
      prisma.employeeAssignment.count({ where: { opening: { department: "Human Resources" } } }),
      prisma.employeeAssignment.count({ where: { opening: { department: "Finance" } } }),
      prisma.employeeAssignment.count({ where: { opening: { department: "Marketing" } } }),
      prisma.employeeAssignment.count({ where: { opening: { department: "Customer Service" } } }),
    ])

    // Count departments that have at least one match
    const departments = [flightOperations, cabinCrew, groundStaff, engineering, it, humanResources, finance, marketing, customerService]
    const departmentsWithMatches = departments.filter(count => count > 0).length

    const newMatchChange = newThisMonth - newLastMonth

    return successResponse({
      statusCode: STATUS_CODES.OK,
      message: "Match stats fetched successfully.",
      data: {
        totalMatches,
        newThisMonth,
        newLastMonth,
        newMatchChange,
        activeMatches,
        closedMatches,
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
        departmentsWithMatches,
      },
    })
  } catch (error: any) {
    const resolved = error?.cause instanceof HttpError ? error.cause : error

    return errorResponse({
      statusCode: resolved.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR,
      error: resolved.name || "Unknown Error",
      message: resolved.message || "An error occurred while fetching match statistics.",
    })
  }
}

"use server"

import { isUserAuthenticated } from "@/actions/auth/is-user-authenticated"
import { STATUS_CODES } from "@/constants/status-codes"
import { errorResponse, HttpError, successResponse } from "@/lib"
import prisma from "@/lib/prisma"
import { DashboardDataResponse } from "@/types/dashboard"
import { TicketStatus } from "../../../generated/prisma/enums"

export async function fetchDashboardData(): Promise<DashboardDataResponse> {
  try {
    // 1. Authenticate
    const res = await isUserAuthenticated()

    if (!res.success || !res.data?.user) {
      throw new HttpError({
        statusCode: STATUS_CODES.UNAUTHORIZED,
        message: "Access denied. You must be authenticated to view the dashboard.",
      })
    }

    if (!res.data.isAdmin) {
      throw new HttpError({
        statusCode: STATUS_CODES.FORBIDDEN,
        message: "Access denied. Only administrators can view the dashboard.",
      })
    }

    // 2. Run all queries in parallel
    const [totalEmployees, activeEmployees, totalOpenings, openOpenings, totalMatches, totalTickets, recentMatches, recentEmployees] = await Promise.all([
      // Total employees
      prisma.employee.count(),

      // Active employees
      prisma.employee.count({ where: { isActive: true } }),

      // Total openings
      prisma.jobOpening.count(),

      // Open openings
      prisma.jobOpening.count({ where: { isOpen: true } }),

      // Total matches
      prisma.employeeAssignment.count(),

      // Total tickets
      prisma.ticket.count({ where: { status: TicketStatus.ACTIVE } }),

      // Recent matches (last 5)
      prisma.employeeAssignment.findMany({
        take: 5,
        orderBy: { matchedAt: "desc" },
        select: {
          id: true,
          matchedAt: true,
          employee: { select: { firstName: true, lastName: true, position: true } },
          opening: { select: { title: true, department: true } },
        },
      }),

      // Recent employees (last 5)
      prisma.employee.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          department: true,
          position: true,
          isActive: true,
          createdAt: true,
        },
      }),
    ])

    return successResponse({
      statusCode: STATUS_CODES.OK,
      message: "Dashboard data fetched successfully.",
      data: {
        totalEmployees,
        activeEmployees,
        totalOpenings,
        openOpenings,
        totalMatches,
        totalTickets,
        recentMatches,
        recentEmployees,
      },
    })
  } catch (error: any) {
    const resolved = error?.cause instanceof HttpError ? error.cause : error

    return errorResponse({
      statusCode: resolved.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR,
      error: resolved.name || "Unknown Error",
      message: resolved.message || "An error occurred while fetching dashboard data.",
    })
  }
}

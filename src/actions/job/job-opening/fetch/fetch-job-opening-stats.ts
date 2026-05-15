"use server"

import { isUserAuthenticated } from "@/actions/auth/is-user-authenticated"
import { STATUS_CODES } from "@/constants/status-codes"
import { errorResponse, HttpError, successResponse } from "@/lib"
import prisma from "@/lib/prisma"
import { JobOpeningStatsResponse } from "@/types/job-opening"

export async function fetchJobOpeningStats(): Promise<JobOpeningStatsResponse> {
  try {
    // 1. Authenticate
    const res = await isUserAuthenticated()

    if (!res.success || !res.data?.user) {
      throw new HttpError({
        statusCode: STATUS_CODES.UNAUTHORIZED,
        message: "Access denied. You must be authenticated to view job opening statistics.",
      })
    }

    if (!res.data.isAdmin) {
      throw new HttpError({
        statusCode: STATUS_CODES.FORBIDDEN,
        message: "Access denied. Only administrators can view job opening statistics.",
      })
    }

    // 2. Date boundaries
    const now = new Date()
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59)

    // 3. Run all counts in parallel
    const [totalOpenings, openCount, closedCount, totalApplications, newThisMonth, newLastMonth, departmentsHiring] = await Promise.all([
      // Total openings
      prisma.jobOpening.count(),

      // Open openings
      prisma.jobOpening.count({ where: { isOpen: true } }),

      // Closed openings
      prisma.jobOpening.count({ where: { isOpen: false } }),

      // Total applications across all openings
      prisma.jobApplication.count(),

      // New openings this month
      prisma.jobOpening.count({ where: { createdAt: { gte: thisMonthStart } } }),

      // New openings last month
      prisma.jobOpening.count({ where: { createdAt: { gte: lastMonthStart, lte: lastMonthEnd } } }),

      //   Departments currently hiring (with at least 1 open opening)
      prisma.jobOpening.groupBy({ by: ["department"], where: { isOpen: true } }),
    ])

    const newOpeningChange = newThisMonth - newLastMonth

    return successResponse({
      statusCode: STATUS_CODES.OK,
      message: "Job opening stats fetched successfully.",
      data: {
        totalOpenings,
        openCount,
        closedCount,
        totalApplications,
        newThisMonth,
        newLastMonth,
        newOpeningChange,
        departmentsHiring: departmentsHiring.length,
      },
    })
  } catch (error: any) {
    const resolved = error?.cause instanceof HttpError ? error.cause : error

    return errorResponse({
      statusCode: resolved.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR,
      error: resolved.name || "Unknown Error",
      message: resolved.message || "An error occurred while fetching job opening statistics.",
    })
  }
}

"use server"

import { isUserAuthenticated } from "@/actions/auth/is-user-authenticated"
import { STATUS_CODES } from "@/constants/status-codes"
import { errorResponse, HttpError, successResponse } from "@/lib"
import prisma from "@/lib/prisma"
import { MatchReportData, MatchReportItem, MatchReportResponse } from "@/types/match"

export async function fetchMatchesReport(): Promise<MatchReportResponse> {
  try {
    // 1. Authenticate
    const res = await isUserAuthenticated()

    if (!res.success || !res.data?.user) {
      throw new HttpError({
        statusCode: STATUS_CODES.UNAUTHORIZED,
        message: "Access denied. You must be authenticated to view matches report.",
      })
    }

    if (!res.data.isAdmin) {
      throw new HttpError({
        statusCode: STATUS_CODES.FORBIDDEN,
        message: "Access denied. Only administrators can view matches report.",
      })
    }

    // 2. Fetch all matches
    const matches = await prisma.employeeAssignment.findMany({
      orderBy: { matchedAt: "desc" },
      select: {
        id: true,
        matchedAt: true,
        notes: true,
        employee: {
          select: {
            firstName: true,
            lastName: true,
            employeeNo: true,
            department: true,
            position: true,
          },
        },
        opening: {
          select: {
            title: true,
            department: true,
            isOpen: true,
          },
        },
      },
    })

    // 3. Department distribution
    const departments = ["Flight Operations", "Cabin Crew", "Ground Staff", "Engineering", "IT", "Human Resources", "Finance", "Marketing", "Customer Service"]

    const byDepartment: Record<string, number> = {}
    for (const dept of departments) {
      byDepartment[dept] = matches.filter(m => m.opening.department === dept).length
    }

    // 4. Map to response
    const mappedMatches: MatchReportItem[] = matches.map(match => ({
      id: match.id,
      matchedAt: match.matchedAt,
      employeeName: `${match.employee.firstName} ${match.employee.lastName}`,
      employeeNo: match.employee.employeeNo,
      employeeDepartment: match.employee.department,
      employeePosition: match.employee.position,
      openingTitle: match.opening.title,
      openingDepartment: match.opening.department,
      openingStatus: match.opening.isOpen ? "Open" : "Closed",
      notes: match.notes,
    }))

    return successResponse({
      statusCode: STATUS_CODES.OK,
      message: `${matches.length} match${matches.length !== 1 ? "es" : ""} found.`,
      data: {
        matches: mappedMatches,
        totalMatches: matches.length,
        byDepartment: byDepartment as MatchReportData["byDepartment"],
      },
    })
  } catch (error: any) {
    const resolved = error?.cause instanceof HttpError ? error.cause : error

    return errorResponse({
      statusCode: resolved.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR,
      error: resolved.name || "Unknown Error",
      message: resolved.message || "An error occurred while fetching matches report.",
    })
  }
}

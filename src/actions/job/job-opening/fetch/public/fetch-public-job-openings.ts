"use server"

import { STATUS_CODES } from "@/constants/status-codes"
import { errorResponse, HttpError, successResponse } from "@/lib"
import prisma from "@/lib/prisma"
import { ApiResponse } from "@/types/api-response"
import { JobOpeningListItem } from "@/types/job-opening"

export async function fetchPublicJobOpenings(): Promise<ApiResponse<JobOpeningListItem[]>> {
  try {
    //  1. Fetch job openings from the database
    const jobOpenings = await prisma.jobOpening.findMany({
      where: { isOpen: true },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        department: true,
        description: true,
        isOpen: true,
        closedAt: true,
        createdAt: true,
        updatedAt: true,
        _count: { select: { applications: true } },
      },
    })

    return successResponse({
      statusCode: STATUS_CODES.OK,
      message: `${jobOpenings.length} job opening${jobOpenings.length !== 1 ? "s" : ""} found.`,
      data: jobOpenings.map(opening => ({
        ...opening,
        applicationsCount: opening._count.applications,
        _count: undefined, // remove _count from the response
      })),
    })
  } catch (error: any) {
    const resolved = error?.cause instanceof HttpError ? error.cause : error
    return errorResponse({
      statusCode: resolved.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR,
      error: resolved.name || "Unknown Error",
      message: resolved.message || "An error occurred while fetching job openings. Please try again.",
    })
  }
}

"use server"

import { STATUS_CODES } from "@/constants/status-codes"
import { errorResponse, HttpError, successResponse } from "@/lib"
import prisma from "@/lib/prisma"
import { ApiResponse } from "@/types/api-response"
import { JobOpeningListItem } from "@/types/job-opening"

export async function fetchPublicJobOpening(id: string): Promise<ApiResponse<JobOpeningListItem>> {
  try {
    //  1. Fetch job openings from the database
    const jobOpening = await prisma.jobOpening.findUnique({
      where: { id },
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

    if (!jobOpening) {
      throw new HttpError({
        statusCode: STATUS_CODES.NOT_FOUND,
        message: "Failed to fetch the Job opening with the provided details. Please ensure that you have provided the correct details or contact the support team for assistance",
      })
    }

    return successResponse({
      statusCode: STATUS_CODES.OK,
      data: {
        ...jobOpening,
        applicationsCount: jobOpening?._count.applications,
        _count: undefined, // remove _count from the response
      },
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

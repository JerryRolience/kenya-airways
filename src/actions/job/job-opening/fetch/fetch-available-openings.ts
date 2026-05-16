"use server"

import { isUserAuthenticated } from "@/actions/auth/is-user-authenticated"
import { STATUS_CODES } from "@/constants/status-codes"
import { errorResponse, HttpError, successResponse } from "@/lib"
import prisma from "@/lib/prisma"
import { AvailableOpeningOption, AvailableOpeningsResponse } from "@/types/job-opening"

export async function fetchAvailableOpenings(): Promise<AvailableOpeningsResponse> {
  try {
    // 1. Authenticate
    const res = await isUserAuthenticated()

    if (!res.data?.isAdmin) {
      throw new HttpError({
        statusCode: STATUS_CODES.FORBIDDEN,
        message: "Access denied. Only administrators can view available openings.",
      })
    }

    // 2. Fetch all open job openings
    const openings = await prisma.jobOpening.findMany({
      where: { isOpen: true },
      orderBy: [{ department: "asc" }, { title: "asc" }],
      select: { id: true, title: true, department: true },
    })

    // 3. Map to simple options
    const options: AvailableOpeningOption[] = openings.map(opening => ({
      value: opening.id,
      label: `${opening.title} (${opening.department})`,
    }))

    return successResponse({
      statusCode: STATUS_CODES.OK,
      message: `${options.length} opening${options.length !== 1 ? "s" : ""} available.`,
      data: options,
    })
  } catch (error: any) {
    const resolved = error?.cause instanceof HttpError ? error.cause : error

    return errorResponse({
      statusCode: resolved.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR,
      error: resolved.name || "Unknown Error",
      message: resolved.message || "An error occurred while fetching available openings.",
    })
  }
}
